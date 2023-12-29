from modules.sessions.controller_session import get_messages_by_session
from langchain.memory import ConversationBufferMemory

def getMomoryBySession(sessionId, maxNumberOfMessages, enc=None):
    memory = ConversationBufferMemory(memory_key="chat_history", input_key="human_input", output_key="output_text")
    chat_temp = get_messages_by_session(sessionId)[maxNumberOfMessages:]
    tokensUsed = 0

    for i in range(0, len(chat_temp), 2):

        Human = chat_temp[i]
        Ai = chat_temp[i + 1]

        human_text = Human['text']
        ai_text = Ai['text']

        if(enc != None):tokensUsed += len(enc.encode(human_text)) + len(enc.encode(ai_text))

        memory.save_context({"human_input": human_text}, {"output_text": ai_text})

    return memory, tokensUsed