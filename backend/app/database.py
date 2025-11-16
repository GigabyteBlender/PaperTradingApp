"""
Database connection using Supabase client.
- Supabase client initialization
- Helper function to get Supabase client instance
"""

from supabase import create_client, Client
from app.config import settings

# Initialize Supabase client
# The client handles all database operations using Supabase's REST API
supabase: Client = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_KEY
)


def get_supabase() -> Client:
    """
    Get Supabase client instance.
    
    This function can be used as a dependency in FastAPI endpoints
    to access the Supabase client.
    
    Returns:
        Client: Supabase client instance
    """
    return supabase
