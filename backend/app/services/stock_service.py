"""Stock service for fetching real-time and historical market data."""

import httpx
from decimal import Decimal
from datetime import datetime, timedelta, time
from typing import List, Optional, Dict
from app.config import settings
from app.schemas.stock import StockQuote, StockDetails, StockSearchResult, HistoricalPrice, MarketStatus
import pytz


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
    cached = _cache.get(symbol, "details")
    if cached:
        return StockDetails(**cached)
    
    url = "https://www.alphavantage.co/query"
    
    # Fetch quote data
    quote_params = {
        "function": "GLOBAL_QUOTE",
        "symbol": symbol,
        "apikey": settings.ALPHA_VANTAGE_API_KEY
    }
    
    # Fetch overview data
    overview_params = {
        "function": "OVERVIEW",
        "symbol": symbol,
        "apikey": settings.ALPHA_VANTAGE_API_KEY
    }
    
    async with httpx.AsyncClient() as client:
        quote_response = await client.get(url, params=quote_params, timeout=10.0)
        overview_response = await client.get(url, params=overview_params, timeout=10.0)
        
        quote_response.raise_for_status()
        overview_response.raise_for_status()
        
        quote_data = quote_response.json()
        overview_data = overview_response.json()
    
    if "Global Quote" not in quote_data or not quote_data["Global Quote"]:
        raise ValueError(f"Stock symbol '{symbol}' not found")
    
    quote = quote_data["Global Quote"]
    
    current_price = Decimal(quote.get("05. price", "0"))
    previous_close = Decimal(quote.get("08. previous close", "0"))
    change = Decimal(quote.get("09. change", "0"))
    change_percent_str = quote.get("10. change percent", "0%").rstrip("%")
    change_percent = Decimal(change_percent_str)
    
    market_status_info = get_market_status()
    
    details = StockDetails(
        symbol=symbol.upper(),
        name=overview_data.get("Name", symbol.upper()),
        current_price=current_price,
        previous_close=previous_close,
        change=change,
        change_percent=change_percent,
        last_update=datetime.utcnow(),
        market_status=market_status_info.status,
        volume=int(quote.get("06. volume", 0)) if quote.get("06. volume") else None,
        day_high=Decimal(quote.get("03. high", "0")) if quote.get("03. high") else None,
        day_low=Decimal(quote.get("04. low", "0")) if quote.get("04. low") else None,
        market_cap=Decimal(overview_data.get("MarketCapitalization", "0")) if overview_data.get("MarketCapitalization") else None,
        pe_ratio=Decimal(overview_data.get("PERatio", "0")) if overview_data.get("PERatio") and overview_data.get("PERatio") != "None" else None,
        dividend_yield=Decimal(overview_data.get("DividendYield", "0")) if overview_data.get("DividendYield") else None
    )
    
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
        return []
    
    results = []
    for match in data["bestMatches"][:limit]:
        result = StockSearchResult(
            symbol=match.get("1. symbol", ""),
            name=match.get("2. name", ""),
            current_price=None,
            change=None,
            change_percent=None
        )
        results.append(result)
    
    _cache.set(query, "search", [r.model_dump() for r in results])
    return results


async def get_historical_data(symbol: str, period: str = "1mo") -> List[HistoricalPrice]:
    """
    Fetch historical price data for charting using Alpha Vantage TIME_SERIES_DAILY.
    
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
    
    # Determine output size based on period
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
    
    if "Time Series (Daily)" not in data:
        raise ValueError(f"No historical data found for symbol '{symbol}'")
    
    time_series = data["Time Series (Daily)"]
    
    # Calculate date range based on period
    end_date = datetime.utcnow()
    if period == "1d":
        start_date = end_date - timedelta(days=1)
    elif period == "5d":
        start_date = end_date - timedelta(days=5)
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
    
    if not is_weekday:
        status = "closed"
        is_open = False
        # Calculate next Monday
        days_until_monday = (7 - now_et.weekday()) % 7
        if days_until_monday == 0:
            days_until_monday = 1
        next_open_date = now_et + timedelta(days=days_until_monday)
        next_open = et_tz.localize(datetime.combine(next_open_date.date(), market_open))
        next_close = None
    elif market_open <= current_time < market_close:
        status = "open"
        is_open = True
        next_open = None
        next_close = et_tz.localize(datetime.combine(now_et.date(), market_close))
    elif pre_market_start <= current_time < market_open:
        status = "pre-market"
        is_open = False
        next_open = et_tz.localize(datetime.combine(now_et.date(), market_open))
        next_close = None
    elif market_close <= current_time < after_hours_end:
        status = "after-hours"
        is_open = False
        next_open_date = now_et + timedelta(days=1)
        next_open = et_tz.localize(datetime.combine(next_open_date.date(), market_open))
        next_close = None
    else:
        status = "closed"
        is_open = False
        next_open_date = now_et + timedelta(days=1)
        next_open = et_tz.localize(datetime.combine(next_open_date.date(), market_open))
        next_close = None
    
    return MarketStatus(
        is_open=is_open,
        status=status,
        next_open=next_open.astimezone(pytz.utc).replace(tzinfo=None) if next_open else None,
        next_close=next_close.astimezone(pytz.utc).replace(tzinfo=None) if next_close else None
    )
