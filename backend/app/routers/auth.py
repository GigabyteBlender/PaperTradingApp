"""Authentication API endpoints using Supabase Auth."""

from fastapi import APIRouter, Depends, HTTPException, status, Header
from supabase import Client
from app.database import get_supabase
from app.schemas.auth import UserSignup, UserLogin, AuthResponse
from app.schemas.user import UserResponse
from app.services.auth_service import signup_user, login_user, logout_user
from app.utils.dependencies import get_current_user

router = APIRouter()


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    user_data: UserSignup,
    supabase: Client = Depends(get_supabase)
):
    """Register new user via Supabase Auth and create app user record."""
    try:
        result = await signup_user(supabase, user_data)
        return AuthResponse(**result)
    except ValueError as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(e))
    except Exception as e:
        print(f"Signup error: {str(e)}")
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Signup failed")


@router.post("/login", response_model=AuthResponse)
async def login(
    credentials: UserLogin,
    supabase: Client = Depends(get_supabase)
):
    """Authenticate user via Supabase Auth."""
    try:
        result = await login_user(supabase, credentials.email, credentials.password)
        return AuthResponse(**result)
    except ValueError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")
    except Exception as e:
        print(f"Login error: {str(e)}")
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Login failed")


@router.post("/logout")
async def logout(
    authorization: str = Header(None),
    supabase: Client = Depends(get_supabase)
):
    """Sign out user from Supabase Auth."""
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        await logout_user(supabase, token)
    
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: dict = Depends(get_current_user)
):
    """
    Get current authenticated user info.
    Protected endpoint - requires valid JWT token.
    Used for session validation and user data refresh.
    """
    return UserResponse(
        id=str(current_user["id"]),
        email=current_user["email"],
        username=current_user["username"],
        balance=float(current_user["balance"]),
        created_at=current_user["created_at"]
    )