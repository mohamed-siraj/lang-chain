import json
from fastapi import HTTPException
from langchain.memory import ConversationBufferMemory
from langchain.chat_models import ChatOpenAI
from modules.llm.retrival.indexes.controller_indexes import search_object

def createPrompt(chat_history=""):
    jsonExample = '{recommodations:["give me more names", "make them funnier!", "give me cat names now"]}'

    templateRetrival = f"""

        You are also given the following conversation between a Human and an AI assistant
        Your job is to provide recommendations to what the human should ask next.
        You are to provide your answer in the following format:
        Example format:
        ```
        {jsonExample}
        ```

        Here is an example conversation and reply:
        ```
        Human: give me some dog names!
        Assistant: here are a few dog names: Fluffy, Lilly, Goofy, Pluto.

        Recommendations:{jsonExample}
        ```

        Actual Scenario:

        chat history:
        {chat_history}
        
        Recommendations:"""
    return templateRetrival

def createRecommendationsFromMemory(memory = ConversationBufferMemory(memory_key="chat_history", input_key="human_input", output_key="output_text"), model_name="gpt-3.5-turbo"):
    memoryStr = memory.load_memory_variables({})

    prompt = createPrompt(memoryStr)
    
    model = ChatOpenAI(temperature=0, model_name=model_name)

    response = model.predict(prompt)
    try:
        response = json.loads(response)
    except:
        raise HTTPException(status_code=400, detail="could not parse model output")

    return response