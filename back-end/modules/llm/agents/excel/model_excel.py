from pydantic import BaseModel

class Excel(BaseModel):
    sheet_name: str
    original_sheet_name: str
    url: str
    user_id: str = "none"