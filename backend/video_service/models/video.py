from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, UniqueConstraint, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from core.models.base import Base
from .course import Course
import enum

class VideoStatus(str, enum.Enum):
    CREATED = "CREATED"      # When video record is first created
    UPLOADED = "UPLOADED"    # When video is uploaded to GCS
    PROCESSED = "PROCESSED"  # When video processing is complete

class Video(Base):
    __tablename__ = "videos"
    __table_args__ = {"schema": "graid_db"}

    video_id = Column(UUID(as_uuid=True), primary_key=True, index=True, server_default="gen_random_uuid()")
    course_id = Column(Integer, ForeignKey("graid_db.courses.course_id"), nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(String(255))
    storage_path = Column(String(255))
    url = Column(String(255))
    status = Column(Enum(VideoStatus, name='video_status', create_type=False), nullable=False, default=VideoStatus.CREATED)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    course = relationship("Course", back_populates="videos")