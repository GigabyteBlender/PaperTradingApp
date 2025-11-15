"""Stock and market data endpoints."""

from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List
from app.utils.dependencies import get_current_user
from app.schemas.stock import StockQuote, StockDetails, StockSearchResult, HistoricalPrice, MarketStatus
from app.services.stock_service import (
    get_stock_quote,
    get_stock_details,
    search_stocks,
    get_historical_data,
    get_market_status
)

router = APIRouter()


@router.get("/{symbol}", response_model=StockDetails)
async def get_stock(
    symbol: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get detailed stock information including fundamentals.
    Protected endpoint - requires valid JWT token.
    
    Returns complete stock data with current price, change metrics,
    volume, market cap, PE ratio, and other fundamentals.
    
    Rate limiting: Cached for 5 minutes to reduce API calls.
    """
    try:
        return await get_stock_details(symbol.upper())
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch stock data: {str(e)}")


@router.get("/search", response_model=List[StockSearchResult])
async def search(
    q: str = Query(..., min_length=1, description="Search query (symbol or company name)"),
    limit: int = Query(10, ge=1, le=50, description="Maximum number of results"),
    current_user: dict = Depends(get_current_user)
):
    """
    Search for stocks by symbol or company name.
    Protected endpoint - requires valid JWT token.
    
    Returns list of matching stocks with basic information.
    Use this endpoint for autocomplete/search functionality.
    
    Rate limiting: Cached for 10 minutes to reduce API calls.
    """
    try:
        return await search_stocks(q, limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


@router.get("/quote/{symbol}", response_model=StockQuote)
async def get_quote(
    symbol: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get current stock quote (lightweight version).
    Protected endpoint - requires valid JWT token.
    
    Returns real-time price, change, and change percent.
    Use this for quick price checks and portfolio calculations.
    
    Rate limiting: Cached for 1 minute to reduce API calls.
    """
    try:
        return await get_stock_quote(symbol.upper())
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch quote: {str(e)}")


@router.get("/{symbol}/history", response_model=List[HistoricalPrice])
async def get_history(
    symbol: str,
    period: str = Query("1mo", regex="^(1d|5d|1mo|3mo|1y|5y)$", description="Time period for historical data"),
    current_user: dict = Depends(get_current_user)
):
    """
    Get historical price data for charting.
    Protected endpoint - requires valid JWT token.
    
    Supported periods:
    - 1d: 1 day
    - 5d: 5 days
    - 1mo: 1 month (default)
    - 3mo: 3 months
    - 1y: 1 year
    - 5y: 5 years
    
    Returns OHLCV data points for the requested period.
    
    Rate limiting: Cached for 1 hour to reduce API calls.
    """
    try:
        return await get_historical_data(symbol.upper(), period)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch historical data: {str(e)}")


@router.get("/market/status", response_model=MarketStatus)
async def get_status(
    current_user: dict = Depends(get_current_user)
):
    """
    Get current market status and trading hours.
    Protected endpoint - requires valid JWT token.
    
    Returns whether market is open, current status (open/closed/pre-market/after-hours),
    and next open/close times.
    
    US Market hours (Eastern Time):
    - Regular: 9:30 AM - 4:00 PM (Mon-Fri)
    - Pre-market: 4:00 AM - 9:30 AM
    - After-hours: 4:00 PM - 8:00 PM
    """
    return get_market_status()
