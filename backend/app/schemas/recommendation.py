"""Pydantic schemas for stock recommendation data."""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Literal


class Factor(BaseModel):
    """
    Individual factor contributing to a stock recommendation.
    (e.g., price trend, volume pattern)
    Used to show what influenced the overall buy/hold/sell decision.
    """
    name: str = Field(..., description="Factor name (e.g., 'Price Trend')")
    description: str = Field(..., description="Explanation of this factor")
    impact: Literal["positive", "neutral", "negative"] = Field(..., description="Impact on recommendation")
    
    class Config:
        from_attributes = True


class Recommendation(BaseModel):
    """
    Full stock recommendation with a generated analysis.
    Provides buy/hold/sell guidance based on technical analysis and market data.
    """
    symbol: str = Field(..., description="Stock ticker symbol")
    recommendation: Literal["buy", "hold", "sell"] = Field(..., description="Recommendation type")
    score: int = Field(..., ge=0, le=100, description="Recommendation score (0-100)")
    reasoning: str = Field(..., description="Natural language explanation")
    factors: List[Factor] = Field(..., description="Key factors influencing recommendation")
    calculated_at: datetime = Field(..., description="When recommendation was generated")
    is_stale: bool = Field(default=False, description="Whether data is older than 15 minutes")
    
    class Config:
        from_attributes = True
