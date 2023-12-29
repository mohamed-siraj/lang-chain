from pydantic import BaseModel
from typing import Optional

class RetrivalMessageDto(BaseModel):
    text: str
    role: str = "Human"
    model: Optional[str] = None