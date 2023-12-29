from modules.llm.recommendations.service_recommendations import createRecommendationsFromMemory
from modules.auth.service_jwt import get_current_user
from fastapi import Depends, FastAPI
from langchain.memory import ConversationBufferMemory
from database_clients.mongodb_client import mongodb_client

from modules.sessions.controller_session import get_messages_by_session

db = mongodb_client["chat_db"]
messages_collection = db["messages"]
sessions_collection = db["sessions"]
index_collection = db["indexes"]

recommendation_controller = FastAPI()
    
@recommendation_controller.get("/{session_id}")
async def stream_data(
        session_id: str,
        current_user: str = Depends(get_current_user)
    ):
    memory = ConversationBufferMemory(memory_key="chat_history", input_key="human_input", output_key="output_text")

    chat_temp = get_messages_by_session(session_id,current_user)[-6:]
    for i in range(0, len(chat_temp), 2):
        Human = chat_temp[i]
        Ai = chat_temp[i + 1]
        human_text = Human['text']
        ai_text = Ai['text']
        memory.save_context({"human_input": human_text}, {"output_text": ai_text})

    response = createRecommendationsFromMemory(memory)

    return response