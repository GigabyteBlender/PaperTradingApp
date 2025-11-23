"""Stock service for fetching real-time and historical market data."""

import httpx
import logging
from decimal import Decimal
from datetime import datetime, timedelta, time
from typing import List, Optional, Dict
from app.config import settings
from app.schemas.stock import StockQuote, StockDetails, StockSearchResult, HistoricalPrice, MarketStatus
import pytz

logger = logging.getLogger(__name__)


class StockCache:
    """
    In-memory cache for stock data to reduce API calls.
    
    Cache TTL by data type:
    - quote: 1 minute (real-time data needs frequent updates)
    - details: 5 minutes (fundamentals change less frequently)
    - historical: 1 hour (historical data is static)
    - search: 10 minutes (search results are relatively stable)
    """
    
    def __init__(self):
        self.cache: Dict[str, Dict] = {}
        self.ttl = {
            "quote": timedelta(minutes=1),
            "details": timedelta(minutes=5),
            "historical": timedelta(hours=1),
            "search": timedelta(minutes=10)
        }
    
    def get(self, key: str, data_type: str) -> Optional[dict]:
        """Retrieve cached data if not expired."""
        cache_key = f"{data_type}:{key}"
        if cache_key in self.cache:
            cached_data = self.cache[cache_key]
            if datetime.utcnow() < cached_data["expires_at"]:
                return cached_data["data"]
            else:
                del self.cache[cache_key]
        return None
    
    def set(self, key: str, data_type: str, data: dict):
        """Store data in cache with TTL."""
        cache_key = f"{data_type}:{key}"
        self.cache[cache_key] = {
            "data": data,
            "expires_at": datetime.utcnow() + self.ttl[data_type]
        }


# Global cache instance
_cache = StockCache()


async def get_stock_quote(symbol: str) -> StockQuote:
    """
    Fetch current stock quote using Alpha Vantage GLOBAL_QUOTE endpoint.
    Returns real-time price, change, and change percent.
    """
    cached = _cache.get(symbol, "quote")
    if cached:
        return StockQuote(**cached)
    
    url = "https://www.alphavantage.co/query"
    params = {
        "function": "GLOBAL_QUOTE",
        "symbol": symbol,
        "apikey": settings.ALPHA_VANTAGE_API_KEY
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params, timeout=10.0)
        response.raise_for_status()
        data = response.json()
    
    if "Global Quote" not in data or not data["Global Quote"]:
        logger.warning(f"No Global Quote data for '{symbol}': {data}")
        raise ValueError(f"Stock symbol '{symbol}' not found")
    
    quote_data = data["Global Quote"]
    
    current_price = Decimal(quote_data.get("05. price", "0"))
    change = Decimal(quote_data.get("09. change", "0"))
    change_percent_str = quote_data.get("10. change percent", "0%").rstrip("%")
    change_percent = Decimal(change_percent_str)
    
    quote = StockQuote(
        symbol=symbol.upper(),
        current_price=current_price,
        change=change,
        change_percent=change_percent,
        last_update=datetime.utcnow()
    )
    
    _cache.set(symbol, "quote", quote.model_dump())
    return quote


async def get_stock_details(symbol: str) -> StockDetails:
    """
    Fetch detailed stock information including fundamentals.
    Combines GLOBAL_QUOTE and OVERVIEW endpoints for complete data.
    """
    # Check cache first to avoid unnecessary API calls
    cached = _cache.get(symbol, "details")
    if cached:
        return StockDetails(**cached)
    
    url = "https://www.alphavantage.co/query"
    
    # Prepare parameters for GLOBAL_QUOTE endpoint (real-time price data)
    quote_params = {
        "function": "GLOBAL_QUOTE",
        "symbol": symbol,
        "apikey": settings.ALPHA_VANTAGE_API_KEY
    }
    
    # Prepare parameters for OVERVIEW endpoint (company fundamentals)
    overview_params = {
        "function": "OVERVIEW",
        "symbol": symbol,
        "apikey": settings.ALPHA_VANTAGE_API_KEY
    }
    
    # Make both API calls concurrently for better performance
    async with httpx.AsyncClient() as client:
        quote_response = await client.get(url, params=quote_params, timeout=10.0)
        overview_response = await client.get(url, params=overview_params, timeout=10.0)
        
        quote_response.raise_for_status()
        overview_response.raise_for_status()
        
        quote_data = quote_response.json()
        overview_data = overview_response.json()
    
    # Validate that we received quote data
    if "Global Quote" not in quote_data or not quote_data["Global Quote"]:
        logger.warning(f"No Global Quote data for '{symbol}': {quote_data}")
        raise ValueError(f"Stock symbol '{symbol}' not found")
    
    quote = quote_data["Global Quote"]
    
    # Extract price data from quote response
    # Alpha Vantage uses numbered keys like "05. price", "08. previous close"
    current_price = Decimal(quote.get("05. price", "0"))
    previous_close = Decimal(quote.get("08. previous close", "0"))
    change = Decimal(quote.get("09. change", "0"))
    # Remove the "%" suffix from change percent string
    change_percent_str = quote.get("10. change percent", "0%").rstrip("%")
    change_percent = Decimal(change_percent_str)
    
    # Get current market status (open/closed/pre-market/after-hours)
    market_status_info = get_market_status()
    
    # Build the complete StockDetails object
    # Combines real-time price data with company fundamentals
    details = StockDetails(
        symbol=symbol.upper(),
        name=overview_data.get("Name", symbol.upper()),
        current_price=current_price,
        previous_close=previous_close,
        change=change,
        change_percent=change_percent,
        last_update=datetime.utcnow(),
        market_status=market_status_info.status,
        volume=quote.get("06. volume"),
        day_high=quote.get("03. high"),
        day_low=quote.get("04. low"),
        market_cap=overview_data.get("MarketCapitalization"),
        pe_ratio=overview_data.get("PERatio"),
        dividend_yield=overview_data.get("DividendYield")
    )
    
    # Cache the result for 5 minutes to reduce API calls
    _cache.set(symbol, "details", details.model_dump())
    return details


async def search_stocks(query: str, limit: int = 10) -> List[StockSearchResult]:
    """
    Search for stocks by symbol or company name using Alpha Vantage SYMBOL_SEARCH.
    Returns list of matching stocks with basic information.
    """
    cached = _cache.get(query, "search")
    if cached:
        return [StockSearchResult(**item) for item in cached[:limit]]
    
    url = "https://www.alphavantage.co/query"
    params = {
        "function": "SYMBOL_SEARCH",
        "keywords": query,
        "apikey": settings.ALPHA_VANTAGE_API_KEY
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params, timeout=10.0)
        response.raise_for_status()
        data = response.json()
    
    if "bestMatches" not in data:
        logger.warning(f"No bestMatches in search response for '{query}': {data}")
        return []
    
    if not data["bestMatches"]:
        logger.warning(f"Empty bestMatches for '{query}'")
        return []
    
    results = []
    for match in data["bestMatches"][:limit]:
        result = StockSearchResult(
            symbol=match.get("1. symbol", ""),
            name=match.get("2. name", ""),
            type=match.get("3. type", ""),
            region=match.get("4. region", "")
        )
        results.append(result)
    
    _cache.set(query, "search", [r.model_dump() for r in results])
    return results


async def get_historical_data(symbol: str, period: str = "1mo") -> List[HistoricalPrice]:
    """
    Fetch historical price data for charting using Alpha Vantage.
    
    Supported periods:
    - 1d: 1 day (intraday data)
    - 5d: 5 days
    - 1mo: 1 month
    - 3mo: 3 months
    - 1y: 1 year
    - 5y: 5 years
    
    Returns OHLCV data points for the requested period.
    """
    cache_key = f"{symbol}:{period}"
    cached = _cache.get(cache_key, "historical")
    if cached:
        return [HistoricalPrice(**item) for item in cached]
    
    url = "https://www.alphavantage.co/query"
    
    # For 1 day, use intraday data
    if period == "1d":
        params = {
            "function": "TIME_SERIES_INTRADAY",
            "symbol": symbol,
            "interval": "5min",
            "outputsize": "full",
            "apikey": settings.ALPHA_VANTAGE_API_KEY
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()
        
        time_series_key = "Time Series (5min)"
        if time_series_key not in data:
            raise ValueError(f"No intraday data found for symbol '{symbol}'")
        
        time_series = data[time_series_key]
        
        # Get last trading day's data
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=1)
        
        historical_data = []
        for datetime_str, values in time_series.items():
            dt = datetime.strptime(datetime_str, "%Y-%m-%d %H:%M:%S")
            
            if dt < start_date:
                continue
            
            price_point = HistoricalPrice(
                date=dt,
                open=Decimal(values["1. open"]),
                high=Decimal(values["2. high"]),
                low=Decimal(values["3. low"]),
                close=Decimal(values["4. close"]),
                volume=int(values["5. volume"])
            )
            historical_data.append(price_point)
        
        historical_data.sort(key=lambda x: x.date)
        _cache.set(cache_key, "historical", [h.model_dump() for h in historical_data])
        return historical_data
    
    # For other periods, use daily data
    outputsize = "full" if period in ["1y", "5y"] else "compact"
    
    params = {
        "function": "TIME_SERIES_DAILY",
        "symbol": symbol,
        "outputsize": outputsize,
        "apikey": settings.ALPHA_VANTAGE_API_KEY
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params, timeout=10.0)
        response.raise_for_status()
        data = response.json()
    
    # Log the response to debug API issues
    if "Time Series (Daily)" not in data:
        logger.warning(f"Alpha Vantage response for {symbol}: {data}")
        raise ValueError(f"No historical data found for symbol '{symbol}'")
    
    time_series = data["Time Series (Daily)"]
    
    # Calculate date range based on period (add extra days to account for weekends)
    end_date = datetime.utcnow()
    if period == "5d":
        start_date = end_date - timedelta(days=10)  # ~2 weeks to ensure 5 trading days
    elif period == "1mo":
        start_date = end_date - timedelta(days=30)
    elif period == "3mo":
        start_date = end_date - timedelta(days=90)
    elif period == "1y":
        start_date = end_date - timedelta(days=365)
    elif period == "5y":
        start_date = end_date - timedelta(days=1825)
    else:
        start_date = end_date - timedelta(days=30)
    
    historical_data = []
    for date_str, values in time_series.items():
        date = datetime.strptime(date_str, "%Y-%m-%d")
        
        if date < start_date:
            continue
        
        price_point = HistoricalPrice(
            date=date,
            open=Decimal(values["1. open"]),
            high=Decimal(values["2. high"]),
            low=Decimal(values["3. low"]),
            close=Decimal(values["4. close"]),
            volume=int(values["5. volume"])
        )
        historical_data.append(price_point)
    
    # Sort by date ascending
    historical_data.sort(key=lambda x: x.date)
    
    #caching all the historical data
    _cache.set(cache_key, "historical", [h.model_dump() for h in historical_data])
    return historical_data


def get_market_status() -> MarketStatus:
    """
    Determine current market status based on US market hours.
    
    US Market hours (Eastern Time):
    - Regular: 9:30 AM - 4:00 PM (Mon-Fri)
    - Pre-market: 4:00 AM - 9:30 AM
    - After-hours: 4:00 PM - 8:00 PM
    
    Returns market status and next open/close times.
    """
    et_tz = pytz.timezone("America/New_York")
    now_et = datetime.now(et_tz)
    
    # Market hours
    market_open = time(9, 30)
    market_close = time(16, 0)
    pre_market_start = time(4, 0)
    after_hours_end = time(20, 0)
    
    current_time = now_et.time()
    is_weekday = now_et.weekday() < 5
    
    # Weekend (Saturday/Sunday) - Market is closed
    if not is_weekday:
        status = "closed"
        is_open = False
        # Calculate next Monday's opening time
        # weekday() returns 0=Monday, 5=Saturday, 6=Sunday
        days_until_monday = (7 - now_et.weekday()) % 7
        if days_until_monday == 0:  # If today is Monday, go to next Monday
            days_until_monday = 1
        next_open_date = now_et + timedelta(days=days_until_monday)
        next_open = et_tz.localize(datetime.combine(next_open_date.date(), market_open))
        next_close = None
    
    # Regular trading hours (9:30 AM - 4:00 PM ET)
    elif market_open <= current_time < market_close:
        status = "open"
        is_open = True
        next_open = None  # Already open, no next open time
        # Market will close today at 4:00 PM ET
        next_close = et_tz.localize(datetime.combine(now_et.date(), market_close))
    
    # Pre-market hours (4:00 AM - 9:30 AM ET)
    elif pre_market_start <= current_time < market_open:
        status = "pre-market"
        is_open = False  # Pre-market trading available but regular market closed
        # Market opens later today at 9:30 AM ET
        next_open = et_tz.localize(datetime.combine(now_et.date(), market_open))
        next_close = None
    
    # After-hours trading (4:00 PM - 8:00 PM ET)
    elif market_close <= current_time < after_hours_end:
        status = "after-hours"
        is_open = False  # After-hours trading available but regular market closed
        # Market opens next trading day at 9:30 AM ET
        next_open_date = now_et + timedelta(days=1)
        next_open = et_tz.localize(datetime.combine(next_open_date.date(), market_open))
        next_close = None
    
    # Overnight hours (8:00 PM - 4:00 AM ET)
    else:
        status = "closed"
        is_open = False
        # Market opens next trading day at 9:30 AM ET
        next_open_date = now_et + timedelta(days=1)
        next_open = et_tz.localize(datetime.combine(next_open_date.date(), market_open))
        next_close = None
    
    return MarketStatus(
        is_open=is_open,
        status=status,
        next_open=next_open.astimezone(pytz.utc).replace(tzinfo=None) if next_open else None,
        next_close=next_close.astimezone(pytz.utc).replace(tzinfo=None) if next_close else None
    )
