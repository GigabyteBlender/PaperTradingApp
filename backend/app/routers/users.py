"""User management endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from supabase import Client
from app.database import get_supabase
from app.utils.dependencies import get_current_user
from app.schemas.user import UserResponse, BalanceResponse
from app.services.user_service import get_user_by_id, get_user_balance

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """
    Get current authenticated user's profile.
    Protected endpoint - requires valid JWT token.
    """
    user_data = get_user_by_id(supabase, current_user["id"])
    
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=str(user_data["id"]),
        email=user_data["email"],
        username=user_data["username"],
        balance=float(user_data["balance"]),
        created_at=user_data["created_at"]
    )


@router.get("/me/balance", response_model=BalanceResponse)
async def get_current_user_balance(
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """
    Get current authenticated user's balance.
    Protected endpoint - requires valid JWT token.
    """
    try:
        balance = get_user_balance(supabase, current_user["id"])
        return BalanceResponse(balance=float(balance))
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
