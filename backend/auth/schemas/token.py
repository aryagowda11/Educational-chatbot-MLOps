from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import List, Optional
from pydantic import ConfigDict
from core.models.user import User

class TokenData(BaseModel):
    """
    JWT token payload schema with security enhancements
    """
    sub: EmailStr = Field(..., description="Subject identifier (user email)")
    scopes: List[str] = Field(
        default_factory=list,
        description="List of granted permissions based on RBAC"
    )
    iat: datetime = Field(
        default_factory=lambda: datetime.now(),
        description="Issued at timestamp"
    )
    exp: datetime = Field(
        description="Expiration timestamp",
        example="2025-02-20T17:45:00Z"
    )
    role_id: int = Field(
        ...,
        description="User's role ID for quick access checks",
        gt=0
    )
    org_id: int = Field(
        ...,
        description="Organization context",
        gt=0
    )

    @field_validator('scopes')
    @classmethod
    def validate_scopes(cls, v: List[str]) -> List[str]:
        if not all(isinstance(scope, str) for scope in v):
            raise ValueError("All scopes must be strings")
        return v

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "sub": "user@example.com",
                "scopes": ["student:basic"],
                "iat": "2025-02-20T17:27:00Z",
                "exp": "2025-02-20T17:57:00Z",
                "role_id": 3,
                "org_id": 1
            }
        }
    )

class LoginResponse(BaseModel):
    """
    OAuth2-compliant token response with security headers
    """
    user_id: int = Field(
        ...,
        description="User ID"
    )
    firstname: str = Field(
        ...,
        description="First name"
    )
    lastname: str = Field(
        ...,
        description="Last name"
    )
    # username: str = Field(
    #     ...,
    #     description="Username"
    role_id : int = Field(
        ...,
        description="User's role ID for scope check",
        gt=0
    )
    access_token: str = Field(
        ...,
        min_length=32,
        description="JWT access token"
    )
    token_type: str = Field(
        "bearer",
        pattern="^bearer$",
        description="Token type as per OAuth2 spec"
    )
    expires_in: int = Field(
        1800,
        gt=0,
        description="Token validity in seconds"
    )
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "user_id": 123,
                # "username": "user",
                "role_id": 2,
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "expires_in": 1800
            }
        }
    )

class TokenPayload(BaseModel):
    """
    Decoded JWT payload validation schema
    """
    sub: EmailStr
    scopes: List[str] = []
    iat: datetime
    exp: datetime
    role_id: int
    org_id: int
