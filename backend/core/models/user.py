from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, UniqueConstraint, Boolean
from sqlalchemy.orm import relationship
from auth.models.rbac import Role
from .base import Base

class Org(Base):
    __tablename__ = "org"
    __table_args__ = {"schema": "graid_db"}

    org_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship("User", back_populates="org")


class User(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": "graid_db"}

    firstname = Column(String(50), nullable=True)
    lastname = Column(String(50), nullable=False)
    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    # username = Column(String(100), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    role_id = Column(Integer, ForeignKey("graid_db.roles.role_id"), nullable=False)
    org_id = Column(Integer, ForeignKey("graid_db.org.org_id"), nullable=False)
    status = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    auth = relationship("Auth", back_populates="user", uselist=False)
    role = relationship("Role", back_populates="users")
    org = relationship("Org", back_populates="users")


class Auth(Base):
    __tablename__ = "auth"
    __table_args__ = {"schema": "graid_db"}

    auth_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("graid_db.users.user_id"), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="auth")