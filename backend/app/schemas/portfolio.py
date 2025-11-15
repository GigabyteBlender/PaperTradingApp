"""Pydantic schemas for portfolio management."""

from pydantic import BaseModel
from decimal import Decimal
from datetime import datetime
from typing import List


class HoldingResponse(BaseModel):
    """
    Portfolio holding with calculated metrics.
    
    Calculated fields:
    - current_value: shares * current_price
    - unrealized_pl: (current_price - average_cost) * shares
    - unrealized_pl_percent: (unrealized_pl / (average_cost * shares)) * 100
    """
    symbol: str
    company_name: str
    shares: Decimal
    average_cost: Decimal
    current_price: Decimal
    current_value: Decimal
    unrealized_pl: Decimal
    unrealized_pl_percent: Decimal
    purchased_at: datetime
    
    class Config:
        from_attributes = True


class PortfolioResponse(BaseModel):
    """
    Complete portfolio with aggregated metrics.
    
    Calculated fields:
    - total_value: sum of all holdings' current_value
    - total_invested: sum of all holdings' (average_cost * shares)
    - profit_loss: total_value - total_invested
    - profit_loss_percent: (profit_loss / total_invested) * 100
    """
    total_value: Decimal
    total_invested: Decimal
    profit_loss: Decimal
    profit_loss_percent: Decimal
    holdings: List[HoldingResponse]
    
    class Config:
        from_attributes = True
