from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from core.models.base import Base

"""
Role-Based Access Control (RBAC) models for the GRAID authentication system.
This module defines the SQLAlchemy database models for roles, permissions,
and role-permission relationships that form the foundation of the
access control system.

Implementation details are masked for security and intellectual property protection.
"""

class Role(Base):
    """
    Database model representing user roles in the system.
    
    Roles define broad access levels (e.g., admin, tutor, student)
    that determine what actions users can perform in the application.
    
    Implementation details masked for security and intellectual property protection.
    """
    __tablename__ = "roles"
    __table_args__ = {"schema": "graid_db"}

    role_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    role_name = Column(String(100), unique=True, nullable=False)
    description = Column(String(255))

    users = relationship("User", back_populates="role")
    role_permissions = relationship("RolePermission", back_populates="role")

class Permission(Base):
    """
    Database model representing granular permissions in the system.
    
    Permissions define specific actions that can be performed
    (e.g., create_course, view_analytics, update_user).
    
    Implementation details masked for security and intellectual property protection.
    """
    __tablename__ = "permissions"
    __table_args__ = {"schema": "graid_db"}

    permission_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    permission_name = Column(String(100), unique=True, nullable=False)
    description = Column(String(255))

    role_permissions = relationship("RolePermission", back_populates="permission")

class RolePermission(Base):
    """
    Database model representing the many-to-many relationship
    between roles and permissions.
    
    This association table connects roles to their granted permissions,
    enabling flexible access control configuration.
    
    Implementation details masked for security and intellectual property protection.
    """
    __tablename__ = "role_permissions"
    __table_args__ = {"schema": "graid_db"}

    role_permission_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    role_id = Column(Integer, ForeignKey("graid_db.roles.role_id"), nullable=False)
    permission_id = Column(Integer, ForeignKey("graid_db.permissions.permission_id"), nullable=False)

    role = relationship("Role", back_populates="role_permissions")
    permission = relationship("Permission", back_populates="role_permissions")
