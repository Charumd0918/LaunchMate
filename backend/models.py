from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserOut(BaseModel):
    id: str
    name: str
    email: str

class IdeaInput(BaseModel):
    idea: str
    summary: str

class PasswordReset(BaseModel):
    email: EmailStr
    new_password: str
