from starlette.responses import StreamingResponse
from fastapi import BackgroundTasks, Body, Depends, FastAPI
from typing import Any, Dict, List
from pydantic import BaseModel

from langchain.callbacks.base import BaseCallbackHandler
from langchain.memory import ConversationBufferMemory
from langchain.schema import LLMResult

from database_clients.mongodb_client import mongodb_client
from modules.llm.chat.model_chat import RetrivalMessageDto
from modules.sessions.model_sessions import Message

from modules.sessions.controller_session import get_messages_by_session, create_message
from modules.models.controller_models import get_model_by_name
from modules.llm.chat.service_chat import createChatBot
from modules.auth.service_jwt import get_current_user

from queue import Queue
import threading
import tiktoken
import asyncio
import json
import re

db = mongodb_client["chat_db"]
messages_collection = db["messages"]
sessions_collection = db["sessions"]

chat_controller = FastAPI()

class CustomCallbackHandler(BaseCallbackHandler):
    def __init__(self):
        self.queue = Queue()
        self.memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
        self.streaming = True
        self.enc = None

        self.input_token = 0
        self.output_token = 0

        self.message = ""
        self.prompt = ""
        self.promptOriginal = ""
        self.session_id = ""
        self.model = ""
        self.current_user = None

    def on_llm_start(self, serialized: Dict[str, Any], prompts: List[str], **kwargs: Any) -> None:
        self.streaming = True
        
    def on_llm_new_token(self, token: str, **kwargs: Any) -> None:
        self.queue.put(token)

    def on_llm_end(self, response: LLMResult, **kwargs: Any) -> None:
        self.streaming = False

    def getResponse(self,prompt, session_id, model, current_user):
        if(model==None): model="gpt-3.5-turbo"

        self.prompt = prompt
        self.promptOriginal = prompt
        self.session_id = session_id
        self.model = model
        self.enc = tiktoken.encoding_for_model(model)
        self.current_user = current_user
        
        threading.Thread(target=self.startSteam, args=(prompt, model)).start()
        return StreamingResponse(self.generate(), media_type="text/plain")
    
    def startSteam(self, prompt, attributes=[], model="gpt-3.5-turbo"):
        try:
            print(self.model)
            memory = ConversationBufferMemory(memory_key="chat_history")

            chat_temp = get_messages_by_session(self.session_id, self.current_user)[-6:]
            for i in range(0, len(chat_temp), 2):
                Human = chat_temp[i]
                Ai = chat_temp[i + 1]
                human_text = Human['text']
                ai_text = Ai['text']
                self.input_token += len(self.enc.encode(human_text)) + len(self.enc.encode(ai_text))
                memory.save_context({"input": human_text}, {"output": ai_text})

            chain = createChatBot(memory, streaming=True, callbacks=[self], attributes=attributes, model_name=self.model)

            output = chain.run(prompt)
        except Exception as exc:
            self.queue.put(str(exc))

    
    async def generate(self):
        print("Steam start")
        try:
            # Yield tokens from the queue
            while self.streaming:
                while not self.queue.empty():
                    token = self.queue.get()
                    self.message += token
                    yield token
                await asyncio.sleep(0.05)
            
            # Process remaining tokens in the queue
            while not self.queue.empty():
                token = self.queue.get()
                self.message += token
                yield token
            await asyncio.sleep(0.05)
            
            yield "<ssi>"
            await asyncio.sleep(0.05)

            modelData = get_model_by_name(self.model)

            # Create Human Message
            total_cost_input = (modelData["input_token_price"] * self.input_token) / 1000
            create_message(Message(text=self.promptOriginal, role="Human", session_id=self.session_id, refs=None, model=self.model, token_usage=self.input_token, total_cost=total_cost_input), self.current_user)

            # Create AI Message
            self.output_token = len(self.enc.encode(self.message))
            total_cost_output = (modelData["output_token_price"] * self.output_token) / 1000
            res = create_message(Message(text=self.message, role="Ai", session_id=self.session_id, refs=[], numeric_hallucination_warning=[], model=self.model, token_usage=self.output_token, total_cost=total_cost_output), self.current_user)

            responseObject = {
                "text": self.message,
                "role": "Ai",
                "id": res["_id"],
                "session_id": self.session_id,
                "numeric_hallucination_warning": [],
                "model": self.model,
                "retrival_context": []
            }
            yield json.dumps(responseObject)
        except:
            yield "\n## an Error has Occured, try refreshing"
        print("Steam end")
    
@chat_controller.post("/{session_id}/streaming")
async def stream_data(
        session_id: str, 
        background_tasks: BackgroundTasks, 
        input_message: RetrivalMessageDto = Body(...), 
        current_user: str = Depends(get_current_user)
    ):
    callback = CustomCallbackHandler()
    return callback.getResponse(input_message.text, session_id, input_message.model, current_user)