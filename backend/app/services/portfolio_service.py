"""Portfolio service functions for portfolio management operations."""

from supabase import Client
from decimal import Decimal
from typing import List, Optional, Dict
from datetime import datetime


def get_user_holdings(supabase: Client, user_id: str) -> List[dict]:
    """
    Fetch all holdings for a user.
    """
    result = supabase.table("holdings").select("*").eq("user_id", user_id).execute()
    return result.data if result.data else []


def get_holding_by_symbol(supabase: Client, user_id: str, symbol: str) -> Optional[dict]:
    """
    Fetch specific holding by symbol for a user.
    """
    result = supabase.table("holdings").select("*").eq("user_id", user_id).eq("symbol", symbol).execute()
    return result.data[0] if result.data else None


def calculate_portfolio_metrics(holdings: List[dict], current_prices: Dict[str, Decimal]) -> dict:
    """
    Calculate portfolio-level metrics including total value, total invested, and profit/loss.
    """
    total_value = Decimal("0")
    total_invested = Decimal("0")
    
    for holding in holdings:
        shares = Decimal(str(holding["shares"]))
        average_cost = Decimal(str(holding["average_cost"]))
        symbol = holding["symbol"]
        
        current_price = current_prices.get(symbol, average_cost)
        
        holding_value = shares * current_price
        holding_cost = shares * average_cost
        
        total_value += holding_value
        total_invested += holding_cost
    
    profit_loss = total_value - total_invested
    profit_loss_percent = (profit_loss / total_invested * 100) if total_invested > 0 else Decimal("0")
    
    return {
        "total_value": total_value,
        "total_invested": total_invested,
        "profit_loss": profit_loss,
        "profit_loss_percent": profit_loss_percent
    }


def update_or_create_holding(
    supabase: Client,
    user_id: str,
    symbol: str,
    company_name: str,
    shares: Decimal,
    price: Decimal,
    transaction_type: str
) -> Optional[dict]:
    """
    Update existing holding or create new one based on transaction type.
    For BUY: adds shares and recalculates average cost.
    For SELL: reduces shares or deletes holding if zero.
    Returns None only when a holding is completely sold (deleted).
    Raises ValueError on any database operation failure.
    """
    existing = get_holding_by_symbol(supabase, user_id, symbol)
    
    if transaction_type == "BUY":
        if existing:
            # Update existing holding
            old_shares = Decimal(str(existing["shares"]))
            old_avg = Decimal(str(existing["average_cost"]))
            new_shares = old_shares + shares
            new_avg = ((old_shares * old_avg) + (shares * price)) / new_shares
            
            result = supabase.table("holdings").update({
                "shares": float(new_shares),
                "average_cost": float(new_avg),
                "updated_at": datetime.utcnow().isoformat()
            }).eq("id", existing["id"]).execute()
            
            if not result.data:
                raise ValueError(f"Failed to update holding for {symbol}")
            
            return result.data[0]
        else:
            # Create new holding
            result = supabase.table("holdings").insert({
                "user_id": user_id,
                "symbol": symbol,
                "company_name": company_name,
                "shares": float(shares),
                "average_cost": float(price)
            }).execute()
            
            if not result.data:
                raise ValueError(f"Failed to create holding for {symbol}")
            
            return result.data[0]
    
    elif transaction_type == "SELL":
        if not existing:
            raise ValueError(f"No holding found for {symbol}")
        
        old_shares = Decimal(str(existing["shares"]))
        new_shares = old_shares - shares
        
        if new_shares < 0:
            raise ValueError(f"Insufficient shares to sell. Have {old_shares}, trying to sell {shares}")
        
        if new_shares == 0:
            # Delete holding when all shares are sold
            result = supabase.table("holdings").delete().eq("id", existing["id"]).execute()
            # Delete operations don't return data, just verify no error occurred
            return None
        else:
            # Update holding with reduced shares
            result = supabase.table("holdings").update({
                "shares": float(new_shares),
                "updated_at": datetime.utcnow().isoformat()
            }).eq("id", existing["id"]).execute()
            
            if not result.data:
                raise ValueError(f"Failed to update holding for {symbol}")
            
            return result.data[0]
    
    else:
        raise ValueError(f"Invalid transaction type: {transaction_type}")
