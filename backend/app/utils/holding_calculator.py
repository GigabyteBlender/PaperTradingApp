"""Utility functions for holding calculations to eliminate duplicate logic."""

from decimal import Decimal
from typing import Dict
from app.schemas.portfolio import HoldingResponse


def calculate_holding_metrics(
    holding: dict,
    current_price: Decimal
) -> HoldingResponse:
    """
    Calculate holding metrics including current value and unrealized P/L.
    Centralizes calculation logic used across multiple portfolio endpoints.
    """
    shares = Decimal(str(holding["shares"]))
    average_cost = Decimal(str(holding["average_cost"]))
    
    current_value = shares * current_price
    unrealized_pl = (current_price - average_cost) * shares
    unrealized_pl_percent = (
        (unrealized_pl / (average_cost * shares) * 100) 
        if shares > 0 
        else Decimal("0")
    )
    
    return HoldingResponse(
        symbol=holding["symbol"],
        company_name=holding["company_name"],
        shares=shares,
        average_cost=average_cost,
        current_price=current_price,
        current_value=current_value,
        unrealized_pl=unrealized_pl,
        unrealized_pl_percent=unrealized_pl_percent,
        purchased_at=holding["purchased_at"]
    )


def get_current_prices_map(holdings: list) -> Dict[str, Decimal]:
    """
    Get current prices for holdings.
    TODO: Replace with real-time prices from stock service.
    For now, uses average_cost as current_price.
    """
    return {h["symbol"]: Decimal(str(h["average_cost"])) for h in holdings}
