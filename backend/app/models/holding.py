"""
Holding model for portfolio position tracking.

Pydantic model for holding data validation and serialization.
"""

from pydantic import BaseModel, Field
from decimal import Decimal
from datetime import datetime
from uuid import UUID


class Holding(BaseModel):
    """
    User's position in a specific stock.
    
    Tracks shares owned and average cost per share.
    """
    id: UUID
    user_id: UUID
    symbol: str = Field(max_length=10)
    company_name: str = Field(max_length=255)
    shares: Decimal = Field(gt=0, decimal_places=4)
    average_cost: Decimal = Field(gt=0, decimal_places=2)
    purchased_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
        json_encoders = {
            Decimal: lambda v: float(v),
            UUID: lambda v: str(v)
        }
