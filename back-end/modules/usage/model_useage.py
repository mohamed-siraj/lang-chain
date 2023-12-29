from pydantic import BaseModel
from datetime import  datetime

class usage_response_dto(BaseModel):
    date: str
    token_usage: float
    total_cost: float

class usage_request_dto(BaseModel):
    date_start: datetime = datetime.now()
    date_end: datetime = datetime(1900,1,1)
    frequency: str = "1D"