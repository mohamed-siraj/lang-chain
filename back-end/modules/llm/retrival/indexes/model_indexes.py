from pydantic import BaseModel

class Indexes(BaseModel):
    index_name: str
    name:str = "default"
    user_id: str = "none"

class IndexCreateRequest(BaseModel):
    schema_name: str

class CreateObjectFromUrlDto(BaseModel):
    url: str