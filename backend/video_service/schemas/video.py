from .course import CourseRead
from pydantic import BaseModel, Field
from typing import Optional, List
import uuid

class VideoCreate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

class VideoRead(BaseModel):
    video_id: uuid.UUID
    course_id: int
    title: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    # s3_path: Optional[str] = None
    storage_path: Optional[str] = None
    
class VideoUpload(BaseModel):
    video_id: uuid.UUID
    signed_url: Optional[str] = None
    storage_path: Optional[str] = None
    public_url: Optional[str] = None

    class Config:
        orm_mode = True

class CourseWithVideosRead(CourseRead):
    videos: List[VideoRead] = []

    class Config:
        orm_mode = True




# Create a response model for the specific columns
class VideoInstructorResponse(BaseModel):
    url: Optional[str]
    video_id: uuid.UUID
    title: str
    description: str
    instructor_username: str


    class Config:
        orm_mode = True