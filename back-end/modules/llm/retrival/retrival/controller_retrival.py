from modules.auth.service_jwt import get_current_user
from starlette.responses import StreamingResponse
from fastapi import BackgroundTasks, Body, Depends, FastAPI
from typing import Any, Dict, List

from langchain.callbacks.base import BaseCallbackHandler
from langchain.memory import ConversationBufferMemory
from langchain.schema import LLMResult

from modules.llm.retrival.retrival.model_retrival import RetrivalMessageDto
from modules.sessions.model_sessions import Message
from database_clients.mongodb_client import mongodb_client
from modules.llm.retrival.retrival.service_retrival import createQAManual

from modules.sessions.controller_session import get_messages_by_session, create_message
from modules.models.controller_models import get_model_by_name
from utils.link_scrapper import scrape_text_from_url
from modules.llm.retrival.retrival.service_num_verifier import compare_numbers

from queue import Queue
import threading
import tiktoken
import asyncio
import json
import re

db = mongodb_client["chat_db"]
messages_collection = db["messages"]
sessions_collection = db["sessions"]
index_collection = db["indexes"]

retrival_controller = FastAPI()

class CustomCallbackHandler(BaseCallbackHandler):
    def __init__(self):
        self.queue = Queue()
        self.memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
        self.streaming = True
        self.enc = None   
        
        self.input_documents = []
        self.refs = []
        self.urls = []

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

    def getResponse(self,prompt, index, property, session_id, attributes, model, current_user):
        if(model==None): model="gpt-3.5-turbo"

        self.prompt = prompt
        self.promptOriginal = prompt
        self.session_id = session_id
        self.model = model
        self.enc = tiktoken.encoding_for_model(model)
        self.urls = re.findall('https://[^\s/$.?#].[^\s]*', prompt)
        self.current_user = current_user

        threading.Thread(target=self.startSteam, args=(prompt,index, property, attributes, model)).start()
        return StreamingResponse(self.generate(), media_type="text/plain")
    
    def startSteam(self, prompt, index, property, attributes=[], model="gpt-3.5-turbo"):
        try:
            memory = ConversationBufferMemory(memory_key="chat_history", input_key="human_input", output_key="output_text")

            chat_temp = get_messages_by_session(self.session_id,self.current_user)[-6:]
            for i in range(0, len(chat_temp), 2):
                Human = chat_temp[i]
                Ai = chat_temp[i + 1]
                human_text = Human['text']
                ai_text = Ai['text']
                memory.save_context({"human_input": human_text}, {"output_text": ai_text})

            if(len(self.urls)>0):
                self.prompt += "\n\n<system> This content was automatically added via a search: \n"
                for url in self.urls:
                    try:
                        text, _, _= scrape_text_from_url(url)
                        self.prompt += url+": '"+ text[:5000] +"'\n\n"
                    except:
                        self.prompt += url+": 404 page not found \n\n"
                self.prompt +="\n<system>"


            llm, prompt, refsArr = createQAManual(index, memory, prompt=prompt, streaming=True, callbacks=[self], model_name=model, current_user=self.current_user)
            llm.predict(prompt)
            self.prompt = prompt

            refs = refsArr
            for i in self.urls:
                refs.append(i)
            self.refs = refs

            self.input_token += len(self.enc.encode(prompt))
        
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
                    print(token)
                    yield token
                await asyncio.sleep(0.05)
            
            # Process remaining tokens in the queue
            while not self.queue.empty():
                token = self.queue.get()
                self.message += token
                print(token)
                yield token
            await asyncio.sleep(0.05)
            
            yield "<ssi>"
            await asyncio.sleep(0.05)
            
            # Build input_context from input_documents
            uncertain_numbers = compare_numbers(self.prompt, self.message)

            modelData = get_model_by_name(self.model)

            # Create Human Message
            total_cost_input = (modelData["input_token_price"] * self.input_token) / 1000
            create_message(Message(text=self.promptOriginal, role="Human", session_id=self.session_id, refs=None, model=self.model, token_usage=self.input_token, total_cost=total_cost_input),self.current_user)

            # Create AI Message
            self.output_token = len(self.enc.encode(self.message))
            total_cost_output = (modelData["output_token_price"] * self.output_token) / 1000

            self.refs = [i for i in self.refs if i is not None]

            res = create_message(Message(text=self.message, role="Ai", session_id=self.session_id, refs=self.refs, numeric_hallucination_warning=uncertain_numbers, model=self.model, token_usage=self.output_token, total_cost=total_cost_output),self.current_user)

            responseObject = {
                "text": self.message,
                "role": "Ai",
                "id": res["_id"],
                "session_id": self.session_id,
                "numeric_hallucination_warning": uncertain_numbers,
                "model": self.model,
                "retrival_context": self.refs
            }
            yield json.dumps(responseObject)
        except Exception as exp:
            yield "\nError has Occured:"+str(exp)
        print("Steam end")
    
@retrival_controller.post("/{session_id}/streaming")
async def stream_data(
        session_id: str, 
        background_tasks: BackgroundTasks, 
        input_message: RetrivalMessageDto = Body(...), 
        current_user: str = Depends(get_current_user)
    ):
    callback = CustomCallbackHandler()

    indexes = index_collection.find({"user_id":str(current_user["_id"]), "index_name":input_message.vector_db_ref_settings.index})
    length = len(list(indexes))
    if(length==0):return {"message": f"Index Not Found"}

    return callback.getResponse(input_message.text, input_message.vector_db_ref_settings.index, input_message.vector_db_ref_settings.property, session_id, input_message.attributes, input_message.model, current_user)