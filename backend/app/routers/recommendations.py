"""Stock recommendation endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from app.utils.dependencies import get_current_user
from app.schemas.recommendation import Recommendation
from app.services.recommendation_service import get_recommendation

router = APIRouter()


@router.get("/{symbol}", response_model=Recommendation)
async def get_stock_recommendation(
    symbol: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get stock recommendation for a given symbol.
    Protected endpoint that analyses stock data and returns buy/hold/sell guidance
    with scoring, reasoning, and key factors. Data is cached for 15 minutes.
    """
    try:
        return await get_recommendation(symbol.upper())
    except ValueError as e:
        # Invalid stock symbol (404)
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        # Check if it's an Alpha Vantage error (502) or OpenAI error (503)
        error_msg = str(e)
        if "Alpha Vantage" in error_msg or "Stock data unavailable" in error_msg:
            raise HTTPException(status_code=502, detail=error_msg)
        elif "OpenAI" in error_msg or "Recommendation service unavailable" in error_msg:
            raise HTTPException(status_code=503, detail=error_msg)
        else:
            # Generic error
            raise HTTPException(status_code=500, detail=f"Failed to generate recommendation: {error_msg}")
