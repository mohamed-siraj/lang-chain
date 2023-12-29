from pydantic import BaseModel

class Databases_response_dto(BaseModel):
    database_name: str
    connection_string: str
    id: str

class Databases(BaseModel):
    database_name: str
    connection_string: str
    user_id: str = "none"