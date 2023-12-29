from langchain.memory import ConversationBufferMemory
from langchain.chat_models import ChatOpenAI
from modules.llm.retrival.indexes.controller_indexes import search_object

def createPrompt(context="",chat_history="", human_input=""):
    templateRetrival = f"""

        You are a markdown based bot who loves to help people! 
        You are also given context if needed to help you assist the human.
        Your job is to give responses in markdown to assist the human with their task.
        You should write code if asked to. always give your responses in markdown.

        context:
        {context}

        chat history:
        {chat_history}

        Human: {human_input}
        
        Chatbot:"""
    return templateRetrival

def createQAManual(indexName, memory = ConversationBufferMemory(memory_key="chat_history", input_key="human_input", output_key="output_text"), prompt="", model_name="gpt-3.5-turbo", callbacks=[], streaming=False, current_user={}):
    search_results = search_object(indexName, prompt, current_user)
    results = search_results["result"]["data"]["Get"]
    results = list(results.items())[0][1][0:4]
    contextStr = ""
    refs = []
    for item in results:
        contextStr += "\n"+item["content"]
        refs.append(item["ref"])
    memoryStr = memory.load_memory_variables({})

    print("memory_string: ", memoryStr,"\n")
    print("search_results: ", contextStr,"\n")
    prompt = createPrompt(contextStr, memoryStr, prompt)
    
    model = ChatOpenAI(streaming=streaming, callbacks=callbacks, temperature=0, model_name=model_name)

    return model, prompt, refs