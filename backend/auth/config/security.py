import os
from pydantic import PostgresDsn
from dotenv import load_dotenv

"""
Security Configuration module for the GRAID authentication system.
This module provides centralized security settings management including
database connections, JWT configuration, password hashing parameters,
and default user role settings.

Implementation details are masked for security and intellectual property protection.
"""

load_dotenv()

def get_env_var(var_name: str, default: str = None) -> str:
    """
    Safely retrieves environment variables with validation.
    
    This function:
    1. Attempts to retrieve the specified environment variable
    2. Uses the provided default if the variable is not found
    3. Raises an error if the variable is required but not set
    
    Args:
        var_name (str): Name of the environment variable to retrieve
        default (str, optional): Default value if not found
        
    Returns:
        str: Value of the environment variable
        
    Raises:
        EnvironmentError: If the variable is not set and no default is provided
        
    Implementation details masked for security and intellectual property protection.
    """
    # Implementation masked for security
    pass

# Security configuration constants with default values
# All sensitive values are loaded from environment variables
DATABASE_URL: PostgresDsn = None  # Masked for security reasons
SECRET_KEY = None  # Masked for security reasons
ALGORITHM = "HS256"  # Default algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # Default expiration
REFRESH_TOKEN_EXPIRE_DAYS = 7  # Default refresh period
ARGON2_MEMORY_COST = 102400  # Default memory cost
ARGON2_PARALLELISM = 8  # Default parallelism
JWT_ISSUER = "graid-auth"  # Default issuer
JWT_AUDIENCE = "graid-client"  # Default audience
DEFAULT_ROLE_ID = 3  # Default role ID
DEFAULT_ORG_ID = 1  # Default organization ID

class SecuritySettings:
    """
    Centralized container for all security-related settings.
    
    This class provides a single point of access for all security
    configuration parameters used throughout the authentication system.
    
    Implementation details masked for security and intellectual property protection.
    """
    DATABASE_URL: str = DATABASE_URL
    SECRET_KEY: str = SECRET_KEY
    ALGORITHM: str = ALGORITHM
    ACCESS_TOKEN_EXPIRE_MINUTES: int = ACCESS_TOKEN_EXPIRE_MINUTES
    REFRESH_TOKEN_EXPIRE_DAYS: int = REFRESH_TOKEN_EXPIRE_DAYS
    ARGON2_MEMORY_COST: int = ARGON2_MEMORY_COST
    ARGON2_PARALLELISM: int = ARGON2_PARALLELISM
    JWT_ISSUER: str = JWT_ISSUER
    JWT_AUDIENCE: str = JWT_AUDIENCE
    DEFAULT_ROLE_ID: int = DEFAULT_ROLE_ID
    DEFAULT_ORG_ID: int = DEFAULT_ORG_ID

# Global instance of security settings
security_settings = SecuritySettings()
