from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from core.models.base import Base
from core.models.user import User

class Course(Base):
    __tablename__ = "courses"
    __table_args__ = {"schema": "graid_db"}

    course_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(20), nullable=False)
    description = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    videos = relationship("Video", back_populates="course")
    user_courses = relationship("UserCourseMap", back_populates="course")
    instructor_courses = relationship("InstructorCourseMap", back_populates="course")


class UserCourseMap(Base):
    __tablename__ = "user_course_map"
    __table_args__ = (
        UniqueConstraint('user_id', 'course_id'),
        {"schema": "graid_db"}
    )

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("graid_db.users.user_id"), nullable=False)
    course_id = Column(Integer, ForeignKey("graid_db.courses.course_id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")
    course = relationship("Course", back_populates="user_courses")

class InstructorCourseMap(Base):
    __tablename__ = "instructor_course_map"
    __table_args__ = (
        UniqueConstraint('instructor_id', 'course_id'),
        {"schema": "graid_db"}
    )

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    instructor_id = Column(Integer, ForeignKey("graid_db.users.user_id"), nullable=False)
    course_id = Column(Integer, ForeignKey("graid_db.courses.course_id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    instructor = relationship("User")
    course = relationship("Course", back_populates="instructor_courses")