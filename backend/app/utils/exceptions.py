"""
Custom exception classes for business logic errors.
"""

from typing import Optional


class AppException(Exception):
    """Base exception for application-specific errors."""
    
    def __init__(
        self,
        message: str,
        error_code: str,
        status_code: int = 400
    ):
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        super().__init__(self.message)


class AuthenticationError(AppException):
    """Authentication-related errors."""
    
    def __init__(self, message: str, error_code: str = "AUTH_ERROR"):
        super().__init__(message, error_code, status_code=401)


class InvalidCredentialsError(AuthenticationError):
    """Invalid login credentials."""
    
    def __init__(self, message: str = "Invalid email or password"):
        super().__init__(message, error_code="AUTH_001")


class TokenExpiredError(AuthenticationError):
    """JWT token has expired."""
    
    def __init__(self, message: str = "Token has expired"):
        super().__init__(message, error_code="AUTH_002")


class InvalidTokenError(AuthenticationError):
    """Invalid JWT token."""
    
    def __init__(self, message: str = "Invalid or malformed token"):
        super().__init__(message, error_code="AUTH_003")


class UserNotFoundError(AuthenticationError):
    """User not found in database."""
    
    def __init__(self, message: str = "User not found"):
        super().__init__(message, error_code="AUTH_004")


class UserAlreadyExistsError(AppException):
    """User with email already exists."""
    
    def __init__(self, message: str = "User with this email already exists"):
        super().__init__(message, error_code="USER_001", status_code=409)


class InsufficientBalanceError(AppException):
    """User has insufficient balance for transaction."""
    
    def __init__(self, message: str = "Insufficient balance for this transaction"):
        super().__init__(message, error_code="USER_002", status_code=400)


class InvalidTransactionTypeError(AppException):
    """Invalid transaction type provided."""
    
    def __init__(self, message: str = "Invalid transaction type. Must be BUY or SELL"):
        super().__init__(message, error_code="TRANS_001", status_code=400)


class InsufficientSharesError(AppException):
    """User has insufficient shares to sell."""
    
    def __init__(self, message: str = "Insufficient shares to sell"):
        super().__init__(message, error_code="TRANS_002", status_code=400)


class HoldingNotFoundError(AppException):
    """Holding not found for user."""
    
    def __init__(self, message: str = "Holding not found"):
        super().__init__(message, error_code="PORT_001", status_code=404)


class StockNotFoundError(AppException):
    """Stock symbol not found."""
    
    def __init__(self, message: str = "Stock symbol not found"):
        super().__init__(message, error_code="STOCK_001", status_code=404)


class StockAPIError(AppException):
    """Error communicating with stock data API."""
    
    def __init__(self, message: str = "Error fetching stock data"):
        super().__init__(message, error_code="STOCK_002", status_code=503)
