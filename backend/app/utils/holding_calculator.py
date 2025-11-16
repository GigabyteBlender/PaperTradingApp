"""Utility functions for holding calculations to eliminate duplicate logic."""

from decimal import Decimal
from typing import Dict
import asyncio
from app.schemas.portfolio import HoldingResponse
from app.services.stock_service import get_stock_quote


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


async def get_current_prices_map(holdings: list) -> Dict[str, Decimal]:
    """
    Get current prices for holdings from Alpha Vantage API.
    Falls back to average_cost if API call fails.
    """
    prices = {}
    
    # Fetch all prices concurrently for better performance
    async def fetch_price(holding: dict) -> tuple[str, Decimal]:
        symbol = holding["symbol"]
        try:
            quote = await get_stock_quote(symbol)
            return (symbol, quote.current_price)
        except Exception as e:
            # Fallback to average_cost if API call fails
            print(f"Failed to fetch price for {symbol}: {e}")
            return (symbol, Decimal(str(holding["average_cost"])))
    
    # Fetch all prices in parallel
    results = await asyncio.gather(*[fetch_price(h) for h in holdings])
    
    # Build the prices dictionary
    for symbol, price in results:
        prices[symbol] = price
    
    return prices
