"""Pydantic schemas for stock and market data."""

from pydantic import BaseModel, Field
from decimal import Decimal
from datetime import datetime
from typing import Optional, List, Literal


class StockQuote(BaseModel):
    """
    Stock with current price and change metrics.
    Used for price checks and portfolio calculations.
    """
    symbol: str
    current_price: Decimal
    change: Decimal
    change_percent: Decimal
    last_update: datetime
    
    class Config:
        from_attributes = True
        json_encoders = {
            Decimal: float
        }


class StockDetails(BaseModel):
    """
    Detailed stock information including fundamentals.
    Includes all quote data plus market metrics and company fundamentals.
    """
    symbol: str
    name: str
    current_price: Decimal
    previous_close: Decimal
    change: Decimal
    change_percent: Decimal
    last_update: datetime
    market_status: str
    volume: Optional[int] = None
    day_high: Optional[Decimal] = None
    day_low: Optional[Decimal] = None
    market_cap: Optional[Decimal] = None
    pe_ratio: Optional[Decimal] = None
    dividend_yield: Optional[Decimal] = None
    
    class Config:
        from_attributes = True
        json_encoders = {
            Decimal: float
        }


class StockSearchResult(BaseModel):
    """
    Stock search result with basic information.
    Used for symbol/name search functionality.
    """
    symbol: str
    name: str
    type: Optional[str] = None
    region: Optional[str] = None
    
    class Config:
        from_attributes = True


class HistoricalPrice(BaseModel):
    """
    Historical OHLCV data point for charting.
    Represents a single time period (day, hour, etc.) of market data.
    """
    date: datetime
    open: Decimal
    high: Decimal
    low: Decimal
    close: Decimal
    volume: int
    
    class Config:
        from_attributes = True
        json_encoders = {
            Decimal: float
        }


class MarketStatus(BaseModel):
    """
    Current market status and trading hours information.
    US Market hours: 9:30 AM - 4:00 PM ET (Mon-Fri)
    """
    is_open: bool
    status: Literal["open", "closed", "pre-market", "after-hours"]
    next_open: Optional[datetime] = None
    next_close: Optional[datetime] = None
    
    class Config:
        from_attributes = True
