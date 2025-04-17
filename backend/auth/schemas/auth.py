from datetime import datetime
from pydantic import BaseModel, EmailStr, field_validator, ConfigDict
from typing import Optional
import re

class UserBase(BaseModel):
    email: EmailStr
    
    def validate_email(self) -> str:
        
        errors = []
        if not re.match(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$", self.email):
            errors.append("Invalid email format")
        if not re.search(r"@northeastern\.edu$", self.email):
            errors.append("Email domain must be northeastern.edu")
        
        if errors:
            raise ValueError("; ".join(errors))
        return self.email
    
    model_config = ConfigDict(json_schema_extra={
        "example": {
            "email": "user@northeastern.edu"
        }
    })

class UserCreate(UserBase):
    firstname: str
    lastname: str
    # username: str
    password: str
    role_id: int
    
    def validate_password(self) -> str:
        errors = []
        if len(self.password) < 12:
            errors.append("Must be at least 12 characters")
        if not re.search(r"[A-Z]", self.password):
            errors.append("Missing uppercase letter")
        if not re.search(r"[a-z]", self.password):
            errors.append("Missing lowercase letter")
        if not re.search(r"\d", self.password):
            errors.append("Missing number")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", self.password):
            errors.append("Missing special character")
        if re.search(r"(?i)password|123456|qwerty", self.password):
            errors.append("Common password patterns not allowed")
        
        if errors:
            raise ValueError("; ".join(errors))
        return self.password
    
    model_config = ConfigDict(json_schema_extra={
        "example": {
            "firstname": "John",
            "lastname": "Doe",
            "email": "user@example.com",
            # "username": "user",
            "password": "SecurePass123!@#",
            "role_id": 1
        }
    })

class UserLogin(UserBase):
    password: str
    model_config = ConfigDict(json_schema_extra={
        "example": {
            "email": "user@example.com",
            "password": "SecurePass123!@#"
        }
    })

class UserResponse(UserBase):
    firstname: str
    lastname: str
    user_id: int
    # username: str
    status: bool
    created_at: datetime
    role_id: int
    org_id: int
    
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "firstname": "John",
                "lastname": "Doe",
                "user_id": 1,
                # "username": "user",
                "email": "user@example.com",
                "status": "false",
                "created_at": "2024-01-01T00:00:00Z",
                "role_id": 2,
                "org_id": 1
            }
        }
    )

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int
    
    model_config = ConfigDict(json_schema_extra={
        "example": {
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "token_type": "bearer",
            "expires_in": 1800
        }
    })

class HTTPErrorResponse(BaseModel):
    detail: str
    status_code: int
    
    model_config = ConfigDict(json_schema_extra={
        "example": {
            "detail": "Invalid credentials",
            "status_code": 401
        }
    })

class PasswordReset(BaseModel):
    new_password: str
    token: str

