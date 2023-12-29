from pydantic import BaseModel
from typing import List, Optional

class AgentMessageDto(BaseModel):
    text: str
    role: str = "Human"
    tools: List[str] = []
    model: Optional[str] = "gpt-3.5-turbo"
    agent_toolkit: str = "general"
    agent_type: str = "OPENAI_FUNCTIONS"