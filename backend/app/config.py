"""
Configuration management for the application.
Loads environment variables and provides application settings.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    Uses Pydantic for validation and type checking.
    """
    
    # Supabase configuration
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    
    # CORS configuration
    CORS_ORIGINS: str = "http://localhost:3000"
    
    # Alpha Vantage API configuration
    ALPHA_VANTAGE_API_KEY: str = ""
    
    # Application configuration
    APP_NAME: str = "Trading Application API"
    DEBUG: bool = False
    
    # Automatically loads and replaces the secrets here with their actual value
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore"
    )
    
    @property
    def cors_origins_list(self) -> List[str]:
        """
        Parse CORS_ORIGINS string into a list.
        
        FastAPI's CORSMiddleware requires a list of allowed origins,
        but environment variables are stored as strings. This property
        converts the comma-separated string (e.g., "http://localhost:3000,http://localhost:3001")
        into a list that the middleware can use.
        """
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

# Create settings instance
settings = Settings()
