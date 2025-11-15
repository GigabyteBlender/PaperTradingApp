"""User service functions for user management operations."""

from supabase import Client
from decimal import Decimal
from typing import Optional


def get_user_by_id(supabase: Client, user_id: str) -> Optional[dict]:
    """
    Fetch user by ID from database.
    """
    result = supabase.table("users").select("*").eq("id", user_id).single().execute()
    return result.data if result.data else None


def get_user_balance(supabase: Client, user_id: str) -> Decimal:
    """
    Get user's current balance.
    Raises ValueError if user not found.
    """
    result = supabase.table("users").select("balance").eq("id", user_id).single().execute()
    
    if not result.data:
        raise ValueError("User not found")
    
    return Decimal(str(result.data["balance"]))


def update_user_balance(supabase: Client, user_id: str, new_balance: Decimal) -> dict:
    """
    Update user's balance with validation.
    Balance must be non-negative.
    """
    if new_balance < 0:
        raise ValueError("Balance cannot be negative")
    
    result = supabase.table("users").update({
        "balance": float(new_balance)
    }).eq("id", user_id).execute()
    
    if not result.data:
        raise ValueError("Failed to update balance")
    
    return result.data[0]
