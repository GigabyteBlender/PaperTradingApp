"""Pydantic schemas for user management."""

from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserBase(BaseModel):
    """Base user schema with common fields."""
    email: EmailStr
    username: str


class UserResponse(BaseModel):
    """User response schema for API endpoints."""
    id: str
    email: str
    username: str
    balance: float
    created_at: datetime
    
    class Config:
        from_attributes = True


class BalanceResponse(BaseModel):
    """Balance response schema."""
    balance: float
