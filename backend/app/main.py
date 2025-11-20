"""
FastAPI application entry point.
Initializes the FastAPI app with CORS configuration and includes all routers.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.config import settings
from app.utils.exceptions import AppException
from app.utils.error_handlers import (
    app_exception_handler,
    http_exception_handler,
    validation_exception_handler,
    general_exception_handler
)
from app.utils.middleware import RequestLoggingMiddleware
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

# Initialize FastAPI application
app = FastAPI(
    title="backend",
    description="Backend API for my NEA",
    version="1.0.0"
)

# Register exception handlers
# Custom app exceptions handled first for specific error codes
app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

# Add request logging middleware
app.add_middleware(RequestLoggingMiddleware)

# Configure CORS - must be added after other middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint to verify API is running."""
    return {"message": "Trading Application API", "status": "running"}

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

# Include routers
from app.routers import auth, portfolio, transactions, stocks, recommendations
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(portfolio.router, prefix="/api/portfolio", tags=["Portfolio"])
app.include_router(transactions.router, prefix="/api/transactions", tags=["Transactions"])
app.include_router(stocks.router, prefix="/api/stocks", tags=["Stocks"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["Recommendations"])
