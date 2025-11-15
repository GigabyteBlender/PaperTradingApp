"""Pydantic schemas for authentication."""

from pydantic import BaseModel, EmailStr, Field
from app.schemas.user import UserResponse


class UserSignup(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    username: str = Field(min_length=3, max_length=100)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    user: UserResponse
