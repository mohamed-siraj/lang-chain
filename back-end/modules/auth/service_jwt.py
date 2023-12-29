from database_clients.mongodb_client import mongodb_client
from modules.auth.controller_user import get_user_by_email
from modules.auth.model_jwt import BlacklisedTokens
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
import os
import jwt


db = mongodb_client["chat_db"]
jwt_collection = db["blacklisted_jwt"]

# Helper to read numbers using var envs
def cast_to_number(id):
    temp = os.environ.get(id)
    if temp is not None:
        try:
            return float(temp)
        except ValueError:
            return None
    return None

# Configuration
API_SECRET_KEY = os.environ.get('API_SECRET_KEY') or None
API_ALGORITHM = os.environ.get('API_ALGORITHM') or 'HS256'
API_ACCESS_TOKEN_EXPIRE_MINUTES = cast_to_number('API_ACCESS_TOKEN_EXPIRE_MINUTES') or 15
REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 30

if API_SECRET_KEY is None: raise BaseException('Missing API_SECRET_KEY env var.')

# Token url (We should later create a token url that accepts just a user and a password to use swagger)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/auth/token')

def add_blacklist_token(token):
    jwt_collection.insert_one(dict(BlacklisedTokens(token)))
    return True


def is_token_blacklisted(token):
    token = jwt_collection.find({"token":token})
    if len(list(token))!=0:
        return True
    return False

# Error
CREDENTIALS_EXCEPTION = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail='Could not validate credentials',
    headers={'WWW-Authenticate': 'Bearer'},
)


# Create token internal function
def create_access_token(*, data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({'exp': expire})
    encoded_jwt = jwt.encode(to_encode, API_SECRET_KEY, algorithm=API_ALGORITHM)
    return encoded_jwt


def create_refresh_token(email):
    expires = timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
    return create_access_token(data={'sub': email}, expires_delta=expires)

# Create token for an email
def create_token(email):
    access_token_expires = timedelta(minutes=API_ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={'sub': email}, expires_delta=access_token_expires)
    return access_token


def valid_email_from_db(email):
    if not get_user_by_email(email): 
        return False
    else: 
        return True

def decode_token(token):
    return jwt.decode(token, API_SECRET_KEY, algorithms=[API_ALGORITHM])

async def get_current_user_email(token: str = Depends(oauth2_scheme)):
    if is_token_blacklisted(token):
        raise CREDENTIALS_EXCEPTION
    try:
        payload = decode_token(token)
        email: str = payload.get('sub')
        if email is None:
            raise CREDENTIALS_EXCEPTION
    except jwt.PyJWTError:
        raise CREDENTIALS_EXCEPTION

    if valid_email_from_db(email):
        return email

    raise CREDENTIALS_EXCEPTION

async def get_current_user_token(token: str = Depends(oauth2_scheme)):
    _ = await get_current_user_email(token)
    return token

async def get_current_user(token: str = Depends(oauth2_scheme)):
    if is_token_blacklisted(token):
        print("Blacklisted")
        raise CREDENTIALS_EXCEPTION
    try:
        payload = decode_token(token)
        email: str = payload.get('sub')
        if email is None:
            raise CREDENTIALS_EXCEPTION
    except jwt.PyJWTError:
        raise CREDENTIALS_EXCEPTION

    if valid_email_from_db(email):
        return get_user_by_email(email)

    raise CREDENTIALS_EXCEPTION

async def get_current_user_admin(token: str = Depends(oauth2_scheme)):
    if is_token_blacklisted(token):
        raise CREDENTIALS_EXCEPTION
    try:
        payload = decode_token(token)
        email: str = payload.get('sub')
        if email is None:
            raise CREDENTIALS_EXCEPTION
    except jwt.PyJWTError:
        raise CREDENTIALS_EXCEPTION

    if valid_email_from_db(email):
        user = get_user_by_email(email)
        if(user["role"] == "super_admin" or user["role"] == "admin"):
            return user

    raise CREDENTIALS_EXCEPTION

async def get_current_user_super_admin(token: str = Depends(oauth2_scheme)):
    if is_token_blacklisted(token):
        raise CREDENTIALS_EXCEPTION
    try:
        payload = decode_token(token)
        email: str = payload.get('sub')
        if email is None:
            raise CREDENTIALS_EXCEPTION
    except jwt.PyJWTError:
        raise CREDENTIALS_EXCEPTION

    if valid_email_from_db(email):
        user = get_user_by_email(email)
        if(user["role"] == "super_admin"):
            return user

    raise CREDENTIALS_EXCEPTION

async def get_user_email_unprotected(token: str = Depends(oauth2_scheme)):
    if is_token_blacklisted(token):
        return None
    try:
        payload = decode_token(token)
        email: str = payload.get('sub')
        if email is None:
            return None
    except jwt.PyJWTError:
        return None

    if valid_email_from_db(email):
        return email

    return None
