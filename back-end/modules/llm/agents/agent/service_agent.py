from fastapi import HTTPException
from langchain_experimental.agents.agent_toolkits import create_csv_agent
from langchain.agents.agent_toolkits import SQLDatabaseToolkit
from langchain.agents import ZeroShotAgent, AgentExecutor
from langchain_experimental.tools import PythonREPLTool
from langchain.agents.agent_types import AgentType
from langchain.agents import create_sql_agent
from langchain.utilities import SQLDatabase
from langchain.chains import LLMMathChain
from langchain.chains import LLMChain
from langchain.agents import Tool

from modules.llm.agents.databases.controller_databases import get_database_by_name
from modules.llm.agents.agent.service_tools import excecuteMatplotLibCode
from modules.llm.agents.agent.service_reporting_tools import dashboardingLLM
from modules.llm.agents.excel.controller_excel_data import read_sheet
from utils.link_scrapper import getUrl

agentTypeDict = {
    "ZERO_SHOT_REACT_DESCRIPTION" : AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    "OPENAI_FUNCTIONS" : AgentType.OPENAI_FUNCTIONS,
}

class AgentToolkitDict():
    GENERAL = "general"
    SQL_DATABASE = "sql_database"
    EXCEL_SHEET = "excel_sheet"

def get_tool(tool_name, llm):
    if(tool_name == "calculator"):
        llm_math_chain = LLMMathChain.from_llm(llm=llm, verbose=True)
        calculator = Tool(
            name="Calculator",
            func=llm_math_chain.run,
            description="useful for when you need to answer questions about math",
        )
        return calculator
    elif(tool_name == "python_repl"):
        py_repl = PythonREPLTool()
        return py_repl
    elif(tool_name == "get_link"):
        getUrlTool = getUrl()
        return getUrlTool
    elif(tool_name == "plot_graph"):
        plotGraph = excecuteMatplotLibCode()
        return plotGraph

def getAgentChain(llm, memory, agentToolkit, agentType, tools, current_user, callback=None):
    agentType = agentTypeDict[agentType]

    if(agentToolkit == AgentToolkitDict.GENERAL):
        agent_tools = [get_tool(i, llm) for i in tools]

        prefix = """Have a conversation with a human, answering the following questions as best you can. You have access to the following tools:"""
        suffix = """Begin!"

        {chat_history}
        Question: {input}
        {agent_scratchpad}"""

        agent_prompt = ZeroShotAgent.create_prompt(
            agent_tools,
            prefix=prefix,
            suffix=suffix,
            input_variables=["input", "chat_history", "agent_scratchpad"],
        )
        llm_chain = LLMChain(llm=llm, prompt=agent_prompt)
        agent = ZeroShotAgent(llm_chain=llm_chain, tools=tools, verbose=True)
        agent_chain = AgentExecutor.from_agent_and_tools(
            agent=agent, tools=agent_tools, verbose=True, memory=memory
        )
        return agent_chain
    elif(agentToolkit == AgentToolkitDict.SQL_DATABASE):
        toolkit = db = SQLDatabase.from_uri(get_database_by_name(tools[0],current_user)["connection_string"])
        toolkit = SQLDatabaseToolkit(db=db, llm=llm)
        agent_chain = create_sql_agent(
            llm=llm,
            toolkit=toolkit,
            verbose=True,
            agent_type=agentType,
            handle_parsing_errors=True,
            extra_tools = [excecuteMatplotLibCode(), dashboardingLLM(current_user=current_user)]
        )
        return agent_chain
    elif(agentToolkit == AgentToolkitDict.EXCEL_SHEET):
        agent_chain = create_csv_agent(
            llm,
            read_sheet(tools[0],current_user)["url"],
            verbose=True,
            agent_type=agentType,
            handle_parsing_errors=True,
            extra_tools = [excecuteMatplotLibCode(), dashboardingLLM(current_user=current_user)]
        )
        return agent_chain
        
    raise HTTPException(status_code=400, detail="Agent could not be created")
