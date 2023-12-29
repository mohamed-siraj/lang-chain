from pydantic import BaseModel

class BlacklisedTokens(BaseModel):
    token: str