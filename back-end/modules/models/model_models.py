from pydantic import BaseModel

class Model(BaseModel):
    name: str
    input_token_price: float
    output_token_price: float