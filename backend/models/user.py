# backend/models/user.py
from pydantic import BaseModel, EmailStr

class User(BaseModel):
    email: EmailStr
    password: str