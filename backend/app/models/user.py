"""
User model for authentication and account management.

Pydantic model for user data validation and serialization.
"""

from pydantic import BaseModel, EmailStr, Field
from decimal import Decimal
from datetime import datetime
from uuid import UUID
from typing import Optional


class User(BaseModel):
    """
    User account with authentication credentials and trading balance.
    """
    id: UUID
    email: EmailStr
    username: str = Field(min_length=3, max_length=100)
    hashed_password: str
    balance: Decimal = Field(default=Decimal("25000.00"), ge=0)
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
        json_encoders = {
            Decimal: lambda v: float(v),
            UUID: lambda v: str(v)
        }
