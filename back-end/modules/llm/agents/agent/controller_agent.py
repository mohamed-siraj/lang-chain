import json
import tiktoken
import asyncio
import threading

from fastapi import BackgroundTasks, Body, Depends, FastAPI
from typing import Any, Dict, List

from modules.sessions.controller_session import get_messages_by_session, create_message
from modules.models.controller_models import get_model_by_name

from langchain.callbacks.base import BaseCallbackHandler
from langchain.memory import ConversationBufferMemory
from langchain.chat_models import ChatOpenAI
from langchain.schema import LLMResult

from starlette.responses import StreamingResponse
from queue import Queue

from modules.llm.agents.agent.model_agent import AgentMessageDto
from modules.llm.agents.agent.service_agent import getAgentChain
from modules.auth.service_jwt import get_current_user
from modules.sessions.model_sessions import Message

agent_controller = FastAPI()

class CustomCallbackHandler(BaseCallbackHandler):
    def __init__(self):
        self.queue = Queue()
        self.memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
        self.streaming = True
        self.enc = None   
        
        self.refs = []

        self.input_token = 0
        self.output_token = 0

        self.message = ""
        self.prompt = ""
        self.session_id = ""
        self.model = ""
        self.current_user = None

    def on_llm_start(self, serialized: Dict[str, Any], prompts: List[str], **kwargs: Any) -> None:
        self.streaming = True
        
    def on_llm_new_token(self, token: str, **kwargs: Any) -> None:
        self.queue.put(token)

    def on_llm_end(self, response: LLMResult, **kwargs: Any) -> None:
        print("Steam End?")

    def getResponse(self,prompt, session_id, model, tools, agentToolkit, agentType, current_user):
        if(model==None): model="gpt-3.5-turbo"

        self.prompt = prompt
        self.session_id = session_id
        self.model = model
        self.enc = tiktoken.encoding_for_model(model)
        self.current_user = current_user
        
        threading.Thread(target=self.startSteam, args=(prompt, tools, model, agentToolkit, agentType)).start()
        return StreamingResponse(self.generate(), media_type="text/plain")
    
    def startSteam(self, prompt, tools=[], model="gpt-3.5-turbo-0613", agentToolkit="general",  agentType="OPENAI_FUNCTIONS"):
        try:
            memory = ConversationBufferMemory(memory_key="chat_history", input_key="human_input", output_key="output_text")

            chat_temp = get_messages_by_session(self.session_id, self.current_user)[-6:]
            for i in range(0, len(chat_temp), 2):
                Human = chat_temp[i]
                Ai = chat_temp[i + 1]
                human_text = Human['text']
                ai_text = Ai['text']
                self.input_token += len(self.enc.encode(human_text)) + len(self.enc.encode(ai_text))
                memory.save_context({"human_input": human_text}, {"output_text": ai_text})


            input_tokens = len(self.enc.encode(prompt)) #+ len(self.enc.encode(template)
            self.input_token += input_tokens

            llm = ChatOpenAI(temperature=0, model=model, streaming=True, callbacks=[self])

            agent_chain = getAgentChain(llm, memory, agentToolkit, agentType, tools, self.current_user)
            agent_chain.max_execution_time = 180
        except Exception as exc:
            self.queue.put(str(exc))

        try:
            for step in agent_chain.iter(self.prompt):
                if("intermediate_step" in step):
                        if(agentType == "OPENAI_FUNCTIONS"):
                            tool = step["intermediate_step"][0][0].tool
                            tool_input = step["intermediate_step"][0][0].tool_input
                            log = step["intermediate_step"][0][0].log
                            self.queue.put("\n**tool**: `"+str(tool)+"`\n")
                            # self.queue.put("\n**tool_input**:\n```\n"+str(tool_input)+"\n```\n")
                            self.queue.put("\n"+str(log).replace("`","\n```\n")+"\n")
                        self.queue.put(''' <br />\n### Step Completed \n <br /> ''')
                else:
                    self.streaming = False
                    self.queue.put(''' <br />\n### End ''')
        except Exception as exc:
            self.streaming = False
            self.queue.put(f'''{str(exc)}\n<br />\n### End ''')
    
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
            await asyncio.sleep(0.1)
            
            yield "<ssi>"
            await asyncio.sleep(0.1)
            
            modelData = get_model_by_name(self.model)

            # Create Human Message
            total_cost_input = (modelData["input_token_price"] * self.input_token) / 1000
            create_message(Message(text=self.prompt, role="Human", session_id=self.session_id, refs=None, model=self.model, token_usage=self.input_token, total_cost=total_cost_input),self.current_user)

            # Create AI Message
            self.output_token = len(self.enc.encode(self.message))
            total_cost_output = (modelData["output_token_price"] * self.output_token) / 1000
            res = create_message(Message(text=self.message, role="Ai", session_id=self.session_id, refs=self.refs, numeric_hallucination_warning=[], model=self.model, token_usage=self.output_token, total_cost=total_cost_output), self.current_user)

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
    
@agent_controller.post("/{session_id}/streaming")
async def stream_data(session_id: str, background_tasks: BackgroundTasks, input_message: AgentMessageDto = Body(...), current_user: str = Depends(get_current_user) ):
    callback = CustomCallbackHandler()
    return callback.getResponse(input_message.text, session_id, input_message.model, input_message.tools, input_message.agent_toolkit, input_message.agent_type, current_user)