"""
Transaction model for trade history tracking.

Pydantic model for transaction data validation and serialization.
"""

from pydantic import BaseModel, Field
from decimal import Decimal
from datetime import datetime
from uuid import UUID
from typing import Literal


class Transaction(BaseModel):
    """
    Immutable record of a completed buy or sell trade.
    
    Provides audit trail of all trading activity.
    """
    id: UUID
    user_id: UUID
    type: Literal["BUY", "SELL"]
    symbol: str = Field(max_length=10)
    shares: Decimal = Field(gt=0, decimal_places=4)
    price: Decimal = Field(gt=0, decimal_places=2)
    total_cost: Decimal = Field(gt=0, decimal_places=2)
    timestamp: datetime
    
    class Config:
        from_attributes = True
        json_encoders = {
            Decimal: lambda v: float(v),
            UUID: lambda v: str(v)
        }
