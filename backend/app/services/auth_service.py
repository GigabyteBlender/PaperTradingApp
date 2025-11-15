"""Authentication service using Supabase Auth."""

from supabase import Client
from app.schemas.auth import UserSignup


async def signup_user(supabase: Client, user_data: UserSignup) -> dict:
    """
    Create user via Supabase Auth. The database trigger will auto-create the user record.
    Returns auth response with tokens and user data.
    """
    try:
        # Sign up with Supabase Auth, passing username in metadata
        auth_response = supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password,
            "options": {
                "data": {
                    "username": user_data.username
                }
            }
        })
        
        if not auth_response.user:
            raise ValueError("Failed to create auth user")
        
        # Create the app user record
        insert_result = supabase.table("users").insert({
            "id": str(auth_response.user.id),
            "email": auth_response.user.email,
            "username": user_data.username,
            "balance": 25000.00
        }).execute()
        
        if not insert_result.data or len(insert_result.data) == 0:
            raise ValueError("Failed to create user record")
        
        app_user = insert_result.data[0]
        
        return {
            "access_token": auth_response.session.access_token,
            "refresh_token": auth_response.session.refresh_token,
            "user": app_user
        }
        
    except Exception as e:
        raise ValueError(f"Signup failed: {str(e)}")


async def login_user(supabase: Client, email: str, password: str) -> dict:
    """
    Authenticate user via Supabase Auth.
    Returns auth response with tokens and user data.
    """
    try:
        # Sign in with Supabase Auth
        auth_response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        if not auth_response.user:
            raise ValueError("Invalid credentials")
        
        # Fetch app user data
        app_user = supabase.table("users").select("*").eq("id", auth_response.user.id).single().execute()
        
        if not app_user.data:
            raise ValueError("User not found")
        
        return {
            "access_token": auth_response.session.access_token,
            "refresh_token": auth_response.session.refresh_token,
            "user": app_user.data
        }
        
    except Exception as e:
        raise ValueError(f"Login failed: {str(e)}")


async def logout_user(supabase: Client, token: str) -> None:
    """
    Sign out user from Supabase Auth.
    Invalidates the current session on the server side.
    """
    try:
        supabase.auth.sign_out()
    except Exception as e:
        print(f"Logout error: {str(e)}")
