from langchain.memory import ConversationBufferMemory
from langchain.chat_models import ChatOpenAI
from langchain.chains import LLMChain
from langchain import PromptTemplate

from typing import List, Optional

template = """
    You are a markdown based bot who loves to help people!
    Your job is to give responses in markdown to assist the human with their task.
    You should write code if asked to. always give your responses in markdown.

    chat history:
    {chat_history}

    Human: {human_input}

    Chatbot:"""

def createChatBot(memory = ConversationBufferMemory(memory_key="chat_history"), warning_message="", attributes: Optional[List[str]] = None, callbacks=[], model_name="gpt-3.5-turbo", streaming=False):

    prompt = PromptTemplate(
        input_variables=["chat_history", "human_input"], template=template
    )
    model = ChatOpenAI(streaming=streaming, callbacks=callbacks, temperature=0, model_name=model_name)

    llm_chain = LLMChain(
        llm=model,
        prompt=prompt,
        memory=memory,
    )
    return llm_chain