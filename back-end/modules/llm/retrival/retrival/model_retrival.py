from pydantic import BaseModel
from typing import List, Optional

class VectorSettings(BaseModel):
    index:str
    property:Optional[str] = "content"

class RetrivalMessageDto(BaseModel):
    text: str
    role: str = "Human"
    vector_db_ref_settings: Optional[VectorSettings] = None
    model: Optional[str] = None
    attributes: Optional[List[str]] = None

