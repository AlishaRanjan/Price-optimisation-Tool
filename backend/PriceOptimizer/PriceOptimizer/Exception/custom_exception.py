class TokenValidationError(Exception):
    """Exception raised when there is an issue with token validation."""

    def __init__(self, message="Invalid or missing token"):
        self.message = message
        super().__init__(self.message)


class UserIDValidationError(Exception):
    """Exception raised when there is an issue with User ID validation."""
    
    def __init__(self, message="User ID mismatch or not found"):
        self.message = message
        super().__init__(self.message)
