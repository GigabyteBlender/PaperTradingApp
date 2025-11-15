"""
Global exception handlers for consistent error responses.
"""

from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.utils.exceptions import AppException
import logging

logger = logging.getLogger(__name__)


async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    """
    Handle custom application exceptions.
    Returns consistent error response format with error code.
    """
    logger.warning(
        f"AppException: {exc.error_code} - {exc.message} | Path: {request.url.path}"
    )
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.message,
            "error_code": exc.error_code,
            "status_code": exc.status_code
        }
    )


async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    """
    Handle standard HTTP exceptions.
    Provides consistent format for HTTP errors.
    """
    logger.warning(
        f"HTTPException: {exc.status_code} - {exc.detail} | Path: {request.url.path}"
    )
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "error_code": f"HTTP_{exc.status_code}",
            "status_code": exc.status_code
        }
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """
    Handle Pydantic validation errors.
    Returns detailed validation error information.
    """
    logger.warning(
        f"ValidationError: {exc.errors()} | Path: {request.url.path}"
    )
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": "Validation error",
            "error_code": "VALIDATION_ERROR",
            "status_code": 422,
            "errors": exc.errors()
        }
    )


async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Handle unexpected exceptions.
    Logs full error and returns generic message to client.
    """
    logger.error(
        f"Unhandled exception: {type(exc).__name__} - {str(exc)} | Path: {request.url.path}",
        exc_info=True
    )
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "An unexpected error occurred",
            "error_code": "INTERNAL_ERROR",
            "status_code": 500
        }
    )
