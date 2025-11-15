"""Transaction service functions for trade execution and history."""

from supabase import Client
from decimal import Decimal
from typing import List, Optional
from datetime import datetime
from app.services.user_service import get_user_balance, update_user_balance
from app.services.portfolio_service import update_or_create_holding, get_holding_by_symbol


def validate_buy_transaction(supabase: Client, user_id: str, total_cost: Decimal) -> None:
    """
    Validate user has sufficient balance for buy transaction.
    Raises ValueError if insufficient funds.
    """
    balance = get_user_balance(supabase, user_id)
    
    if balance < total_cost:
        raise ValueError(f"Insufficient balance. Available: ${balance}, Required: ${total_cost}")


def validate_sell_transaction(supabase: Client, user_id: str, symbol: str, shares: Decimal) -> None:
    """
    Validate user has sufficient shares for sell transaction.
    Raises ValueError if insufficient shares or no holding exists.
    """
    holding = get_holding_by_symbol(supabase, user_id, symbol)
    
    if not holding:
        raise ValueError(f"No holding found for {symbol}")
    
    available_shares = Decimal(str(holding["shares"]))
    
    if available_shares < shares:
        raise ValueError(f"Insufficient shares. Available: {available_shares}, Requested: {shares}")


def process_buy_transaction(
    supabase: Client,
    user_id: str,
    symbol: str,
    company_name: str,
    shares: Decimal,
    price: Decimal,
    total_cost: Decimal
) -> dict:
    """
    Process buy transaction atomically by deducting balance and updating holdings.
    """
    balance = get_user_balance(supabase, user_id)
    new_balance = balance - total_cost
    
    update_user_balance(supabase, user_id, new_balance)
    
    holding = update_or_create_holding(
        supabase, user_id, symbol, company_name, shares, price, "BUY"
    )
    
    return holding


def process_sell_transaction(
    supabase: Client,
    user_id: str,
    symbol: str,
    company_name: str,
    shares: Decimal,
    price: Decimal,
    total_cost: Decimal
) -> Optional[dict]:
    """
    Process sell transaction atomically by reducing shares and adding proceeds to balance.
    Returns None if holding is deleted after selling all shares.
    """
    holding = update_or_create_holding(
        supabase, user_id, symbol, company_name, shares, price, "SELL"
    )
    
    balance = get_user_balance(supabase, user_id)
    new_balance = balance + total_cost
    
    update_user_balance(supabase, user_id, new_balance)
    
    return holding


def create_transaction(
    supabase: Client,
    user_id: str,
    transaction_type: str,
    symbol: str,
    company_name: str,
    shares: Decimal,
    price: Decimal
) -> dict:
    """
    Create and execute a transaction with full validation and atomic processing.
    Validates balance/shares, creates transaction record, and updates balance and holdings.
    All operations are atomic - if any step fails, no changes are persisted.
    """
    total_cost = shares * price
    
    # Validate before processing
    if transaction_type == "BUY":
        validate_buy_transaction(supabase, user_id, total_cost)
    elif transaction_type == "SELL":
        validate_sell_transaction(supabase, user_id, symbol, shares)
    else:
        raise ValueError(f"Invalid transaction type: {transaction_type}")
    
    # Create transaction record
    transaction_data = {
        "user_id": user_id,
        "type": transaction_type,
        "symbol": symbol,
        "shares": float(shares),
        "price": float(price),
        "total_cost": float(total_cost),
        "timestamp": datetime.utcnow().isoformat()
    }
    
    transaction_result = supabase.table("transactions").insert(transaction_data).execute()
    
    if not transaction_result.data:
        raise ValueError("Failed to create transaction record")
    
    transaction = transaction_result.data[0]
    
    # Process transaction (update balance and holdings)
    if transaction_type == "BUY":
        holding = process_buy_transaction(
            supabase, user_id, symbol, company_name, shares, price, total_cost
        )
    else:  # SELL
        holding = process_sell_transaction(
            supabase, user_id, symbol, company_name, shares, price, total_cost
        )
    
    # Get updated balance
    updated_balance = get_user_balance(supabase, user_id)
    
    return {
        "transaction": transaction,
        "updated_balance": updated_balance,
        "updated_holding": holding
    }


def get_user_transactions(
    supabase: Client,
    user_id: str,
    limit: int = 50,
    offset: int = 0
) -> List[dict]:
    """
    Fetch user's transaction history with pagination.
    Ordered by timestamp descending (most recent first).
    """
    result = supabase.table("transactions")\
        .select("*")\
        .eq("user_id", user_id)\
        .order("timestamp", desc=True)\
        .limit(limit)\
        .offset(offset)\
        .execute()
    
    return result.data if result.data else []


def get_transaction_by_id(supabase: Client, user_id: str, transaction_id: str) -> Optional[dict]:
    """
    Fetch specific transaction by ID.
    Validates transaction belongs to user.
    """
    result = supabase.table("transactions")\
        .select("*")\
        .eq("id", transaction_id)\
        .eq("user_id", user_id)\
        .single()\
        .execute()
    
    return result.data if result.data else None
