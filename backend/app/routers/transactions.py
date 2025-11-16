"""Transaction management endpoints."""

from fastapi import APIRouter, Depends, HTTPException, Query
from supabase import Client
from decimal import Decimal
from typing import List
from app.database import get_supabase
from app.utils.dependencies import get_current_user
from app.schemas.transaction import TransactionCreate, TransactionResponse
from app.services.transaction_service import (
    create_transaction,
    get_user_transactions
)

router = APIRouter()


@router.post("/", response_model=dict)
async def execute_transaction(
    transaction_data: TransactionCreate,
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """
    Execute a buy or sell transaction with atomic processing.
    Protected endpoint - requires valid JWT token.
    
    Process flow:
    1. Validate transaction data
    2. Check balance (BUY) or shares (SELL)
    3. Create transaction record
    4. Update user balance
    5. Update or create holding
    
    All operations are atomic - if any step fails, entire transaction is rolled back.
    
    Returns:
        Transaction details, updated balance, and updated holding
    """
    try:
        result = create_transaction(
            supabase=supabase,
            user_id=current_user["id"],
            transaction_type=transaction_data.type,
            symbol=transaction_data.symbol.upper(),
            company_name=transaction_data.company_name,
            shares=transaction_data.shares,
            price=transaction_data.price
        )
        
        return {
            "transaction": TransactionResponse(
                id=result["transaction"]["id"],
                type=result["transaction"]["type"],
                symbol=result["transaction"]["symbol"],
                shares=result["transaction"]["shares"],
                price=result["transaction"]["price"],
                total_cost=result["transaction"]["total_cost"],
                timestamp=result["transaction"]["timestamp"]
            ),
            "updated_balance": float(result["updated_balance"]),
            "updated_holding": result["updated_holding"]
        }
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transaction failed: {str(e)}")


@router.get("/", response_model=List[TransactionResponse])
async def get_transactions(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """
    Get user's transaction history with pagination.
    Protected endpoint - requires valid JWT token.
    
    Returns transactions ordered by timestamp (most recent first).
    
    Query parameters:
        limit: Number of transactions to return (1-100, default 50)
        offset: Number of transactions to skip (default 0)
    """
    transactions = get_user_transactions(supabase, current_user["id"], limit, offset)
    
    return [
        TransactionResponse(
            id=t["id"],
            type=t["type"],
            symbol=t["symbol"],
            shares=t["shares"],
            price=t["price"],
            total_cost=t["total_cost"],
            timestamp=t["timestamp"]
        )
        for t in transactions
    ]
