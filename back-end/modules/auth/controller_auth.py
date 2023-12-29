from modules.auth.controller_user import create_user, get_user_by_email
from datetime import datetime

from fastapi.responses import JSONResponse, RedirectResponse
from authlib.integrations.starlette_client import OAuth
from starlette.requests import Request
from starlette.config import Config
from fastapi import FastAPI

from modules.auth.service_jwt import (CREDENTIALS_EXCEPTION, create_access_token, 
                        create_refresh_token, 
                        valid_email_from_db,
                        create_token, 
                        decode_token)
import os

auth_controller = FastAPI()

# OAuth settings
GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID') or None
GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET') or None
if GOOGLE_CLIENT_ID is None or GOOGLE_CLIENT_SECRET is None:
    raise BaseException('Missing env variables')

# Set up OAuth
config_data = {'GOOGLE_CLIENT_ID': GOOGLE_CLIENT_ID, 'GOOGLE_CLIENT_SECRET': GOOGLE_CLIENT_SECRET}
starlette_config = Config(environ=config_data)
oauth = OAuth(starlette_config)
oauth.register(
    name='google',
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'},
)

@auth_controller.get("/login/google")
async def login_via_google(request: Request):
    redirect_uri = request.url_for('auth_via_google')
    return await oauth.google.authorize_redirect(request, redirect_uri)

@auth_controller.get("/token")
async def auth_via_google(request: Request):
    token = await oauth.google.authorize_access_token(request)
    user = token['userinfo']
    if not get_user_by_email(user.email):
        user_data = {"email": user.email, "name": user.name, "role":"user"}
        user_id = create_user(user_data)

    access_token = create_token(user.email)
    refresh_token = create_refresh_token(user.email)

    return RedirectResponse(os.environ.get('AUTH_REDIRECT')+"?access="+str(access_token)+"&refresh="+str(refresh_token)+"&email="+str(user.email))

@auth_controller.post('/refresh')
async def refresh(request: Request):
    try:
        # Only accept post requests
        if request.method == 'POST':
            form = await request.json()
            if form.get('grant_type') == 'refresh_token':
                token = form.get('refresh_token')
                payload = decode_token(token)
                # Check if token is not expired
                if datetime.utcfromtimestamp(payload.get('exp')) > datetime.utcnow():
                    email = payload.get('sub')
                    # Validate email
                    if valid_email_from_db(email):
                        return JSONResponse({'result': True, 'access_token': create_token(email)})
    except Exception:
        raise CREDENTIALS_EXCEPTION
    raise CREDENTIALS_EXCEPTION