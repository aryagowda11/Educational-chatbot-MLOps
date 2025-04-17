import uuid
from fastapi import APIRouter, Depends, HTTPException, status, File, Form, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
import logging

from core.database.config import get_db
from ..models.video import Video,VideoStatus
from ..models.course import Course, UserCourseMap
from ..schemas.video import VideoRead, VideoUpload , VideoInstructorResponse
from video_service.services.gcs_service import upload_file_to_gcs, upload_file_via_signed_url
from auth.dependencies.security import get_authorized_user
from core.models.user import User
from pydantic import BaseModel


router = APIRouter(prefix="/videos", tags=["Videos"])
logger = logging.getLogger(__name__)


@router.post("/", response_model=VideoUpload)
async def prepare_upload(
    course_id: int = Form(...),
    file_name: str = Form(...), 
    # video_file: UploadFile = File(...),
    title: str = Form(None),
    description: str = Form(None),
    user: User = Depends(get_authorized_user([1, 2])),
    db: AsyncSession = Depends(get_db)
):
    """
    Prepares a new video upload for a specified course by generating a signed URL for direct upload.

    This endpoint performs the following steps:
    
    1. Validates that the authenticated user is active.
    2. Checks that the specified course exists.
    3. Verifies that the user is authorized (i.e. mapped as an instructor or admin for the course).
    4. Creates a preliminary Video record in the database to generate a unique video_id (without committing the storage path).
    5. Generates a unique signed URL and storage path based on the course title, lecture title, and video_id.
       The signed URL allows a direct upload to Google Cloud Storage (GCS) without passing the file data through Cloud Run.
       
    **Important:**  
    The actual file upload is expected to be performed separately using the returned signed URL.
    A subsequent PATCH request should be made to finalize the upload (commit the storage path in the database) after a successful file upload.

    **Parameters:**
    - **course_id** (`int`, required): ID of the course to which the video belongs.
    - **video_file** (`UploadFile`, required): The video file to be uploaded (note: this endpoint does not directly process the file).
    - **title** (`str`, optional): Title of the video/lecture.
    - **description** (`str`, optional): Description of the video.
    - **user** (`User`, required): The authenticated user making the request; must have an instructor/admin role.
    - **db** (`AsyncSession`, required): The database session.

    **Returns:**
    - A `VideoUpload` object containing:
      - `video_id`: The unique identifier for the video.
      - `signed_url`: A pre-signed URL for direct upload to GCS.
      - `storage_path`: The intended GCS storage path for the uploaded video.

    **Errors:**
    - `403 Forbidden`: If the user is inactive or not authorized as an instructor/admin for the course.
    - `404 Not Found`: If the specified course does not exist.
    - `500 Internal Server Error`: If an error occurs during signed URL generation or database operations.
    """
    
    if not user.status: 
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not active."
        )

    # Validate that the course exists
    result = await db.execute(select(Course).filter(Course.course_id == course_id))
    course = result.scalars().first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    

    # Ensure user is mapped as an instructor (or admin) for this course
    result = await db.execute(select(UserCourseMap)
        .filter(
            UserCourseMap.course_id == course_id,
            UserCourseMap.user_id == user.user_id
        )
    )
    mapping = result.scalar_one_or_none()
    
    if not mapping:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not an instructor for this course."
        )

    # # Validate the uploaded file is a video
    # if not video_file.content_type.startswith("video/"):
    #     raise HTTPException(
    #         status_code=status.HTTP_400_BAD_REQUEST,
    #         detail="Uploaded file must be a valid video."
    #     )
    
    # logger.info(f"Starting upload for course_id={course_id}, title={title}")

    try:
        # Save video metadata without storage path
        new_video = Video(
            course_id=course_id,
            title=title,
            description=description,
            storage_path=None,
            status=VideoStatus.CREATED  # Explicitly set initial status
        )
        db.add(new_video)
        await db.flush()

        # Retrieve the generated `video_id`
        video_id = new_video.video_id

        file_type = file_name.split(".")[-1]

        # Upload the video using `video_id`
        video_upload: VideoUpload | None = upload_file_to_gcs(course_id, video_id, file_type)
        
        logger.info(f"Generated signed URL for {video_upload.storage_path}")
    
        # await upload_file_via_signed_url(video_upload.signed_url, video_file)

        #Update video record with `storage_path`
        new_video.storage_path = video_upload.storage_path
        new_video.url = video_upload.public_url
        await db.commit()
        
        # logger.info(f"Upload complete for video_id={video_id}, stored at {video_upload.storage_path}")

    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

    # Return the final video data
    return video_upload

@router.patch("/{video_id}/finalize")
async def finalize_video_upload(
    video_id: str,
    storage_path: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Finalizes the video upload by updating the corresponding video record in the database with the confirmed storage path.

    This endpoint should be called after a successful direct upload to GCS using the signed URL.
    It updates the video record (previously created in the prepare step) with the actual GCS storage path,
    ensuring that the database only reflects fully uploaded files.

    **Parameters:**
    - **video_id** (`str`, required): The unique identifier for the video (generated during the prepare upload step).
    - **storage_path** (`str`, required): The confirmed GCS storage path for the uploaded video.
    - **db** (`AsyncSession`, required): The database session.

    **Returns:**
    - A JSON object with a confirmation message indicating that the video upload has been finalized.

    **Errors:**
    - `404 Not Found`: If no video record exists with the provided video_id.
    - `500 Internal Server Error`: If an error occurs while updating the database.
    """
    result = await db.execute(select(Video).filter(Video.video_id == video_id))
    video = result.scalars().first()
    
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    # ✅ Update storage path
    video.storage_path = storage_path
    video.status = VideoStatus.UPLOADED

    await db.commit()
    return {"message": "Video upload finalized"}


@router.get("/{video_id}/video", response_model=VideoRead)
async def list_lecture(
    video_id: uuid.UUID,
    user: User = Depends(get_authorized_user([1, 2, 3])),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieves the metadata of a specific video.

    ### Parameters:
    - **video_id** (`int`, required): The ID of the video to fetch.
    - **user** (`User`, required): The authenticated user making the request.
    - **db** (`AsyncSession`, required): Database session.

    ### Returns:
    - **VideoRead**: The video metadata.

    ### Errors:
    - `403 Forbidden`: If the user is inactive or lacks permissions.
    - `404 Not Found`: If the video does not exist.
    """

    if not user.status: 
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not active."
        )

    #TODO: Implement permission checks for this course

    # Check if the video exists and belongs to the course
    lecture_result = await db.execute(
        select(Video)
        .filter(Video.video_id == video_id)
    )
    lecture = lecture_result.scalar_one_or_none()

    if not lecture:
        raise HTTPException(status_code=404, detail="Lecture Video not found")

    return lecture


# # Create a response model for the specific columns
# class VideoInstructorResponse(BaseModel):
#     url: Optional[str]
#     video_id: uuid.UUID
#     title: str
#     instructor_username: str
#     description: str

#     class Config:
#         orm_mode = True

@router.get("/courses/{course_id}", response_model=List[VideoInstructorResponse])
async def list_lectures(
    course_id: int,
    user: User = Depends(get_authorized_user([1, 2, 3])),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieves a list of videos with instructor information for a given course.
    """
    if not user.status: 
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="User is not active."
        )

    # Create the query selecting specific columns
    query = (
        select(
            Video.url,
            Video.video_id,
            Video.title,
            Video.description,
            User.username.label('instructor_username')
        )
        .join(Course, Course.course_id == Video.course_id)
        .join(UserCourseMap, UserCourseMap.course_id == Course.course_id)
        .join(User, User.user_id == UserCourseMap.user_id)
        .filter(Course.course_id == course_id)
        .filter(User.role_id == 2)
        .filter(Video.status == VideoStatus.PROCESSED)
        .order_by(Video.video_id.asc())
    )
    
    result = await db.execute(query)
    videos = result.all()
    
    if not videos:
        # Check if course exists
        course_result = await db.execute(
            select(Course).filter(Course.course_id == course_id)
        )
        course = course_result.scalar_one_or_none()
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        return []  # Course exists but has no videos
        
    # Convert the result rows to VideoInstructorResponse objects
    return [
        VideoInstructorResponse(
            url=row.url,
            video_id=row.video_id,
            title=row.title,
            description=row.description,
            instructor_username=row.instructor_username
        )
        for row in videos
    ]

@router.patch("/{video_id}/status")
async def update_video_status(
    video_id: str,
    status: str,
    description: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Updates the status and description of a video.
    """

    if not video_id:
        raise HTTPException(status_code=400, detail="Video ID is required")
    
    try:
        # Validate that the status is a valid enum value
        video_status = VideoStatus(status)
    except ValueError:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid status."
        )
    
    result = await db.execute(select(Video).filter(Video.video_id == video_id))
    video = result.scalar_one_or_none()

    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    video.status = video_status
    video.description = description
    await db.commit()
    return {"message": "Video status updated"}
    