"""
Custom middleware for request logging and processing.
"""

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
import logging
import time
import uuid

logger = logging.getLogger(__name__)


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Logs incoming requests and outgoing responses.
    Tracks request duration.
    """
    
    async def dispatch(self, request: Request, call_next) -> Response:
        # Log incoming request
        logger.info(
            f"{request.method} {request.url.path} | "
            f"Client: {request.client.host if request.client else 'unknown'}"
        )
        
        # Track request duration
        start_time = time.time()
        
        try:
            response = await call_next(request)
            duration = time.time() - start_time
            
            # Log response
            logger.info(
                f"{request.method} {request.url.path} | "
                f"Status: {response.status_code} | Duration: {duration:.3f}s"
            )
            
            return response
            
        except Exception as exc:
            duration = time.time() - start_time
            logger.error(
                f"{request.method} {request.url.path} | "
                f"Error: {type(exc).__name__} | Duration: {duration:.3f}s",
                exc_info=True
            )
            raise
