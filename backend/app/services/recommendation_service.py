"""
Recommendation service for generating AI-powered stock recommendations.

This module provides functionality to analyze stocks and generate buy/hold/sell
recommendations using OpenAI's API. It includes caching to reduce API costs
and improve response times.
"""

import logging
from decimal import Decimal
from datetime import datetime, timedelta
from typing import Optional, Dict
from app.schemas.recommendation import Recommendation, Factor
from app.services.stock_service import get_stock_details
from app.services.openai_service import analyze_stock

logger = logging.getLogger(__name__)


class RecommendationCache:
    """
    In-memory cache for recommendation data to reduce OpenAI API calls.
    Follows the same pattern as StockCache in stock_service.py
    
    Cache TTL:
    - recommendation: 15 minutes (per requirements 4.5)
    
    The cache stores recommendation data with expiration timestamps to ensure
    users receive reasonably fresh analysis while minimizing expensive API calls.
    """
    
    def __init__(self):
        self.cache: Dict[str, Dict] = {}
        self.ttl = {
            "recommendation": timedelta(minutes=15)
        }
    
    def get(self, key: str, data_type: str = "recommendation") -> Optional[dict]:
        """
        Retrieve cached data if not expired.
        
        Args:
            key (str): Cache key (typically stock symbol)
            data_type (str): Type of cached data (default: "recommendation")
        
        Returns:
            Optional[dict]: Cached data if found and not expired, None otherwise
        """
        cache_key = f"{data_type}:{key}"
        if cache_key in self.cache:
            cached_data = self.cache[cache_key]
            if datetime.utcnow() < cached_data["expires_at"]:
                return cached_data["data"]
            else:
                # Cache expired, remove it
                del self.cache[cache_key]
        return None
    
    def set(self, key: str, data_type: str, data: dict):
        """
        Store data in cache with TTL.
        
        Args:
            key (str): Cache key (typically stock symbol)
            data_type (str): Type of data being cached
            data (dict): Data to cache
        """
        cache_key = f"{data_type}:{key}"
        self.cache[cache_key] = {
            "data": data,
            "expires_at": datetime.utcnow() + self.ttl[data_type]
        }


# Global cache instance
_recommendation_cache = RecommendationCache()



async def get_recommendation(symbol: str) -> Recommendation:
    """
    Generate or retrieve cached stock recommendation for a given symbol.
    
    This function orchestrates the recommendation generation process:
    1. Check cache for existing recommendation
    2. If cache miss, fetch stock details from Alpha Vantage
    3. Build analysis prompt with stock data
    4. Call OpenAI API for AI-powered analysis
    5. Parse response and create Recommendation object
    6. Cache result for 15 minutes
    
    Args:
        symbol (str): Stock ticker symbol (e.g., "AAPL", "TSLA")
    
    Returns:
        Recommendation: Complete recommendation with score, reasoning, and factors
    
    Raises:
        ValueError: If the stock symbol is invalid, not found, or API errors occur
        Exception: If Alpha Vantage or OpenAI API calls fail
    
    Requirements:
        - 1.1: Display recommendation status (buy/hold/sell)
        - 1.2: Display recommendation score (0-100)
        - 1.3: Analyze minimum three stock metrics
        - 4.1: Provide stock data to OpenAI API
        - 4.2: Receive score and justification from OpenAI
        - 4.4: Handle Alpha Vantage errors with cached data fallback
        - 4.5: Cache recommendations for 15 minutes
        - 4.6: Handle OpenAI errors appropriately
    """
    # Check cache first to avoid unnecessary API calls
    cached = _recommendation_cache.get(symbol, "recommendation")
    if cached:
        logger.info(f"Returning cached recommendation for {symbol}")
        # Check if cached data is stale (older than 15 minutes)
        calculated_at = datetime.fromisoformat(cached["calculated_at"])
        is_stale = (datetime.utcnow() - calculated_at) > timedelta(minutes=15)
        cached["is_stale"] = is_stale
        return Recommendation(**cached)
    
    # Cache miss - fetch fresh stock details from Alpha Vantage
    logger.info(f"Cache miss for {symbol}, fetching stock details")
    
    try:
        stock_details = await get_stock_details(symbol)
    except ValueError as e:
        # Handle invalid symbol (404 error) - per requirement 4.4
        logger.error(f"Invalid stock symbol {symbol}: {str(e)}")
        raise ValueError(f"Stock symbol '{symbol}' not found")
    except Exception as e:
        # Handle Alpha Vantage API errors - per requirement 4.4
        # Try to return cached data if available, even if expired
        logger.error(f"Alpha Vantage API error for {symbol}: {str(e)}")
        
        # Check if we have any cached data (even if expired)
        cache_key = f"recommendation:{symbol}"
        if cache_key in _recommendation_cache.cache:
            cached_data = _recommendation_cache.cache[cache_key]["data"]
            logger.warning(f"Returning stale cached data for {symbol} due to API error")
            cached_data["is_stale"] = True
            return Recommendation(**cached_data)
        
        # No cached data available - return 502 error
        logger.error(f"No cached data available for {symbol}, cannot recover from API error")
        raise Exception("Stock data unavailable - Alpha Vantage API error")
    
    # Build simple prompt with key stock metrics
    # Include: symbol, current price, change, volume, market cap, P/E ratio
    prompt = f"""Analyze the following stock data for {stock_details.symbol} ({stock_details.name}):

Current Price: ${stock_details.current_price}
Previous Close: ${stock_details.previous_close}
Change: ${stock_details.change} ({stock_details.change_percent}%)
Volume: {stock_details.volume if stock_details.volume else 'N/A'}
Market Cap: ${stock_details.market_cap if stock_details.market_cap else 'N/A'}
P/E Ratio: {stock_details.pe_ratio if stock_details.pe_ratio else 'N/A'}

Based on this data, provide a stock recommendation with a score between 0-100 where:
- 0-33 = Sell
- 34-66 = Hold  
- 67-100 = Buy

Consider the price movement, volume, and valuation metrics in your analysis."""

    # Call OpenAI service to analyze the stock
    logger.info(f"Calling OpenAI API to analyze {symbol}")
    
    try:
        ai_response = await analyze_stock(prompt)
    except ValueError as e:
        # Handle OpenAI response parsing errors - per requirement 4.6
        logger.error(f"OpenAI response parsing error for {symbol}: {str(e)}")
        raise Exception(f"Recommendation service unavailable - Invalid AI response: {str(e)}")
    except Exception as e:
        # Handle OpenAI API errors - per requirement 4.6
        logger.error(f"OpenAI API error for {symbol}: {str(e)}")
        raise Exception(f"Recommendation service unavailable - OpenAI API error: {str(e)}")
    
    # Parse the AI response
    # Expected format: {"score": int, "reasoning": str, "factors": [{"name": str, "description": str, "impact": str}]}
    score = ai_response["score"]
    reasoning = ai_response["reasoning"]
    
    # Determine recommendation type based on score
    # 0-33: Sell, 34-66: Hold, 67-100: Buy (per requirements 1.4, 1.5, 1.6)
    if score <= 33:
        recommendation_type = "sell"
    elif score <= 66:
        recommendation_type = "hold"
    else:
        recommendation_type = "buy"
    
    # Parse factors from AI response
    factors = [
        Factor(
            name=f["name"],
            description=f["description"],
            impact=f["impact"]
        )
        for f in ai_response["factors"]
    ]
    
    # Create Recommendation object
    calculated_at = datetime.utcnow()
    recommendation = Recommendation(
        symbol=symbol.upper(),
        recommendation=recommendation_type,
        score=score,
        reasoning=reasoning,
        factors=factors,
        calculated_at=calculated_at,
        is_stale=False  # Fresh recommendation
    )
    
    # Cache the result for 15 minutes
    _recommendation_cache.set(
        symbol,
        "recommendation",
        recommendation.model_dump(mode='json')
    )
    
    logger.info(f"Successfully generated recommendation for {symbol}: {recommendation_type} (score: {score})")
    return recommendation
