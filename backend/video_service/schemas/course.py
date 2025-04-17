from pydantic import BaseModel, Field
from typing import Optional, List, Literal
import uuid

class CourseCreate(BaseModel):
    title: str = Field(..., max_length=20)
    description: Optional[str] = Field(None, max_length=255)

class CourseRead(BaseModel):
    course_id: int
    title: str
    description: Optional[str] = None
    video_count: int

    class Config:
        orm_mode = True


class StudentResponse(BaseModel):
    user_id: int
    username: str
    email: str
    enrollment_status: str

    class Config:
        orm_mode = True

class EnrollStudentsRequest(BaseModel):
    student_ids: List[int]


class SearchResult(BaseModel):
    type: Literal["course", "video"]  # enforce only these two values
    course_id: int
    title: str
    description: Optional[str] = None
    video_id: Optional[uuid.UUID] = None
    url: Optional[str] = None

    class Config:
        orm_mode = True