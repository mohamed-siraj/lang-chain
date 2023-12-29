from pydantic import BaseModel
from enum import Enum

class UserRole(str, Enum):
    user = "user"
    admin = "admin"
    super_admin = "super_admin"

class User(BaseModel):
    email: str
    name: str
    role: UserRole