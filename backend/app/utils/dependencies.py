"""FastAPI dependencies for Supabase Auth validation."""

from fastapi import Depends, HTTPException, Header
from supabase import Client
from app.database import get_supabase


async def get_current_user(
    authorization: str = Header(None),
    supabase: Client = Depends(get_supabase)
) -> dict:
    """
    Validate Supabase JWT token and return user data.
    Raises 401 if token is invalid or missing.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Missing or invalid authorization header")
    
    token = authorization.split(" ")[1]
    
    try:
        # Validate token with Supabase Auth
        user_response = supabase.auth.get_user(token)
        
        if not user_response or not user_response.user:
            raise HTTPException(401, "Invalid or expired token")
        
        auth_user = user_response.user
        
        # Fetch user data from users table not from supabase auth
        app_user = supabase.table("users").select("*").eq("id", auth_user.id).single().execute()
        
        if not app_user.data:
            raise HTTPException(404, "User not found")
        
        return app_user.data
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Auth error: {str(e)}")
        raise HTTPException(401, "Could not validate credentials")
