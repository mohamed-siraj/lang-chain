from pydantic import BaseModel
from typing import List, Optional
from pydantic import BaseModel, root_validator
from datetime import  datetime

class Session(BaseModel):
    name: str
    user_id: str = "none"
    is_public: bool = False
    shared_emails: List[str] = []
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()
    
class Message(BaseModel):
    text: str
    role: str
    session_id: str
    refs:Optional[List[str]] = None
    model:Optional[str] = None
    numeric_hallucination_warning:Optional[List[str]] = None
    token_usage:Optional[float] = None
    total_cost:Optional[float] = None
    is_active:bool = True
    user_id: str = "none"
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()


class ShareSessionDto(BaseModel):
    shared_emails: List[str] = []