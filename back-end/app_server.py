import os
from dotenv import load_dotenv

try:
    load_dotenv("env.py")
except FileNotFoundError:
    print("No env.py found. Proceeding with custom environment variables.")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from modules.llm.agents.agent.controller_agent import agent_controller
from modules.llm.agents.excel.controller_excel_data import excel_controller
from modules.llm.agents.databases.controller_databases import databases_controller
from modules.llm.agents.dashboards.controller_dashboards import dashboards_controller

from modules.llm.retrival.retrival.controller_retrival import retrival_controller
from modules.llm.retrival.indexes.controller_indexes import indexes_controller

from modules.llm.chat.controller_chat import chat_controller

from modules.llm.recommendations.controller_recommendations import recommendation_controller

from modules.models.controller_models import models_controller
from modules.usage.controller_usage import usage_controller
from modules.sessions.controller_session import session_controller
from modules.auth.controller_auth import auth_controller

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(SessionMiddleware, secret_key=os.environ.get('SECRET_KEY'))

app.include_router(session_controller.router, prefix="/api/v1/sessions")
app.include_router(models_controller.router, prefix="/api/v1/models")
app.include_router(usage_controller.router, prefix="/api/v1/usage")

app.include_router(retrival_controller.router, prefix="/api/v1/llm/retrival")
app.include_router(indexes_controller.router, prefix="/api/v1/indexes")

app.include_router(chat_controller.router, prefix="/api/v1/llm/chat")

app.include_router(recommendation_controller.router, prefix="/api/v1/llm/recommendation")

app.include_router(agent_controller.router, prefix="/api/v1/llm/agent")
app.include_router(excel_controller.router, prefix="/api/v1/sheets")
app.include_router(databases_controller.router, prefix="/api/v1/databases")
app.include_router(dashboards_controller.router, prefix="/api/v1/dashboards")
app.include_router(auth_controller.router, prefix="/api/v1/auth")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, proxy_headers=True, forwarded_allow_ips="*")