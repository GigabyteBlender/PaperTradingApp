"""Pydantic schemas for transaction management."""

from pydantic import BaseModel, Field
from decimal import Decimal
from datetime import datetime
from typing import Literal


class TransactionCreate(BaseModel):
    """
    Schema for creating a new transaction.
    Validates transaction data before processing.
    """
    type: Literal["BUY", "SELL"]
    symbol: str = Field(max_length=10, pattern="^[A-Z]+$")
    shares: Decimal = Field(gt=0, decimal_places=4)
    price: Decimal = Field(gt=0, decimal_places=2)
    company_name: str = Field(max_length=255)


class TransactionResponse(BaseModel):
    """
    Schema for transaction response.
    Returns transaction details after creation or retrieval.
    """
    id: str
    type: str
    symbol: str
    shares: float
    price: float
    total_cost: float
    timestamp: datetime
    
    class Config:
        from_attributes = True
