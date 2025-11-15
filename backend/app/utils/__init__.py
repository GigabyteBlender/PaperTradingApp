"""
Utility modules for the application.
"""

from app.utils.exceptions import (
    AppException,
    AuthenticationError,
    InvalidCredentialsError,
    TokenExpiredError,
    InvalidTokenError,
    UserNotFoundError,
    UserAlreadyExistsError,
    InsufficientBalanceError,
    InvalidTransactionTypeError,
    InsufficientSharesError,
    HoldingNotFoundError,
    StockNotFoundError,
    StockAPIError
)

from app.utils.error_handlers import (
    app_exception_handler,
    http_exception_handler,
    validation_exception_handler,
    general_exception_handler
)

from app.utils.middleware import RequestLoggingMiddleware

__all__ = [
    # Exceptions
    "AppException",
    "AuthenticationError",
    "InvalidCredentialsError",
    "TokenExpiredError",
    "InvalidTokenError",
    "UserNotFoundError",
    "UserAlreadyExistsError",
    "InsufficientBalanceError",
    "InvalidTransactionTypeError",
    "InsufficientSharesError",
    "HoldingNotFoundError",
    "StockNotFoundError",
    "StockAPIError",
    # Error handlers
    "app_exception_handler",
    "http_exception_handler",
    "validation_exception_handler",
    "general_exception_handler",
    # Middleware
    "RequestLoggingMiddleware",
]
