"""Portfolio management endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from supabase import Client
from decimal import Decimal
from typing import List
from app.database import get_supabase
from app.utils.dependencies import get_current_user
from app.schemas.portfolio import HoldingResponse, PortfolioResponse
from app.services.portfolio_service import (
    get_user_holdings,
    get_holding_by_symbol,
    calculate_portfolio_metrics
)
from app.utils.holding_calculator import calculate_holding_metrics, get_current_prices_map

router = APIRouter()


@router.get("/", response_model=PortfolioResponse)
async def get_portfolio(
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """
    Get complete portfolio with calculated metrics.
    Protected endpoint - requires valid JWT token.
    
    Returns aggregated portfolio data including:
    - All holdings with current values
    - Total portfolio value
    - Total invested amount
    - Profit/loss metrics
    """
    holdings = get_user_holdings(supabase, current_user["id"])
    
    if not holdings:
        return PortfolioResponse(
            total_value=Decimal("0"),
            total_invested=Decimal("0"),
            profit_loss=Decimal("0"),
            profit_loss_percent=Decimal("0"),
            holdings=[]
        )
    
    current_prices = get_current_prices_map(holdings)
    metrics = calculate_portfolio_metrics(holdings, current_prices)
    
    holding_responses = [
        calculate_holding_metrics(holding, current_prices[holding["symbol"]])
        for holding in holdings
    ]
    
    return PortfolioResponse(
        total_value=metrics["total_value"],
        total_invested=metrics["total_invested"],
        profit_loss=metrics["profit_loss"],
        profit_loss_percent=metrics["profit_loss_percent"],
        holdings=holding_responses
    )


@router.get("/holdings", response_model=List[HoldingResponse])
async def get_holdings(
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """
    Get user's holdings list.
    Protected endpoint - requires valid JWT token.
    
    Returns list of all holdings with calculated metrics.
    """
    holdings = get_user_holdings(supabase, current_user["id"])
    
    if not holdings:
        return []
    
    current_prices = get_current_prices_map(holdings)
    
    return [
        calculate_holding_metrics(holding, current_prices[holding["symbol"]])
        for holding in holdings
    ]


@router.get("/holdings/{symbol}", response_model=HoldingResponse)
async def get_holding(
    symbol: str,
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """
    Get specific holding by symbol.
    Protected endpoint - requires valid JWT token.
    
    Returns holding details with calculated metrics for the specified symbol.
    """
    holding = get_holding_by_symbol(supabase, current_user["id"], symbol.upper())
    
    if not holding:
        raise HTTPException(status_code=404, detail=f"Holding not found for symbol: {symbol}")
    
    current_price = Decimal(str(holding["average_cost"]))
    return calculate_holding_metrics(holding, current_price)
