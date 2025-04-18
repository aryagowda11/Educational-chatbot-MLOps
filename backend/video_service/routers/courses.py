from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, case, insert, text, or_, union_all, literal_column, null
from typing import List, Dict, Union, Optional, Literal
from pydantic import BaseModel
import uuid

from core.database.config import get_db
from ..models.course import Course, InstructorCourseMap, UserCourseMap
from ..models.video import Video
from ..schemas.course import CourseCreate, CourseRead, StudentResponse, EnrollStudentsRequest, SearchResult

from auth.dependencies.security import get_authorized_user
from core.models.user import User
from ..models.video import VideoStatus
from ..schemas.video import VideoRead

router = APIRouter(prefix="/courses", tags=["Courses"])



@router.post("/", status_code=201)
async def create_course(
    payload: CourseCreate,
    user: User = Depends(get_authorized_user([1, 2])),
    db: AsyncSession = Depends(get_db),
):
    """
    Creates a new course.

    A new course is created by a user (typically an instructor). The user is automatically 
    assigned as an instructor for the created course.

    ### Parameters:
    - **payload** (`CourseCreate`, required): Contains course title and description.
    - **user** (`User`, required): The authenticated user creating the course.
    - **db** (`AsyncSession`, required): Database session.

    ### Errors:
    - `403 Forbidden`: If the user is inactive.
    """

    if not user.status:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not active."
        )

    new_course = Course(
        title=payload.title,
        description=payload.description
    )
    db.add(new_course)
    await db.flush()

    # instructor_map = InstructorCourseMap(
    #     instructor_id=user.user_id,
    #     course_id=new_course.course_id
    # )
    # db.add(instructor_map)
    
    # Map this instructor to the new course
    # TODO remove this for instructors
    user_map = UserCourseMap(
        user_id=user.user_id,
        course_id=new_course.course_id
    )
    db.add(user_map)
    
    await db.commit()
    await db.refresh(new_course)
    
    return Response(status_code=201)


@router.get("/{course_id}/course", response_model=CourseRead)
async def get_course(
    course_id: int,
    user: User = Depends(get_authorized_user([1, 2, 3])),
    db: AsyncSession = Depends(get_db),
):
    """
    Retrieves course details by `course_id`.

    Users must be enrolled or mapped to the course to access it.

    ### Parameters:
    - **course_id** (`int`, required): The ID of the course to fetch.
    - **user** (`User`, required): The authenticated user requesting the course.
    - **db** (`AsyncSession`, required): Database session.

    ### Returns:
    - **CourseRead**: The course details.

    ### Errors:
    - `403 Forbidden`: If the user is inactive. 
    - `404 Not Found`: If the course is not found or the user is unauthorized.
    """
    
    if not user.status:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not active."
        )

    query = (
        select(Course)
        # .join(InstructorCourseMap, InstructorCourseMap.course_id == Course.course_id)
        .join(UserCourseMap, UserCourseMap.course_id == Course.course_id)
        .join(User, User.user_id == UserCourseMap.user_id and User.role_id == 2)
        .where(
            Course.course_id == course_id
        )
    )
    result = await db.execute(query)
    course = result.scalar_one_or_none()

    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found or not authorized to access."
        )

    return course

@router.get("/", response_model=List[CourseRead])
async def list_my_courses(
    user: User = Depends(get_authorized_user([1, 2, 3])),
    db: AsyncSession = Depends(get_db),
):
    """
    Retrieves all courses the authenticated user is enrolled in or instructs.

    The response includes a **count of videos** in each course.

    ### Parameters:
    - **user** (`User`, required): The authenticated user requesting their courses.
    - **db** (`AsyncSession`, required): Database session.

    ### Returns:
    - **List[CourseRead]**: A list of courses, each with video count.

    ### Errors:
    - `403 Forbidden`: If the user is inactive.
    - Returns an empty list if no courses are found.
    """
    
    if not user.status:     
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="User is not active."
        )
    
     # Query courses with video count using LEFT JOIN
    query = (
        select(
            Course,
            func.count(Video.video_id).label('video_count')
        )
        .join(UserCourseMap, UserCourseMap.course_id == Course.course_id)
        .outerjoin(Video, Video.course_id == Course.course_id)  # LEFT JOIN with videos
        .where(UserCourseMap.user_id == user.user_id)
        .where(Video.status == VideoStatus.PROCESSED)
        .group_by(Course.course_id)  # Group by to get count per course
        .order_by(Course.created_at.desc())
    )
    result = await db.execute(query)
    courses_with_counts = result.all()

    # Transform the result to include video count
    return [
        {
            **course.__dict__,
            'video_count': count
        }
        for course, count in courses_with_counts
    ]


@router.get("/{course_id}/students", response_model=List[StudentResponse])
async def get_all_students(
    course_id: int,
    user: User = Depends(get_authorized_user([1, 2])),
    db: AsyncSession = Depends(get_db),
):
    """
    Retrieves all students with their enrollment status.
    """
    query = (
        select(
            User.user_id,
            User.username,
            User.email,
            case(
                (UserCourseMap.course_id == course_id, 'ENROLLED'),
                else_='NOT ENROLLED'
            ).label('enrollment_status')
        )
        .outerjoin(
            UserCourseMap,
            (User.user_id == UserCourseMap.user_id) & 
            (UserCourseMap.course_id == course_id)
        )
        .where(User.role_id == 3)  # Only get students
        .group_by(
            User.user_id,
            User.username,
            User.email,
            UserCourseMap.course_id
        )
    )
    
    result = await db.execute(query)
    students = result.all()
    
    return [
        StudentResponse(
            user_id=row.user_id,
            username=row.username,
            email=row.email,
            enrollment_status=row.enrollment_status
        )
        for row in students
    ]


@router.post("/{course_id}/students", response_model=Dict[str, object])
async def enroll_students(
    course_id: int,
    request: EnrollStudentsRequest,
    user: User = Depends(get_authorized_user([1, 2])),
    db: AsyncSession = Depends(get_db),
):
    """
    Enrolls multiple students in a course using a bulk upsert operation.
    
    Args:
        course_id: The ID of the course
        request: EnrollStudentsRequest containing list of student IDs to enroll
        
    Returns:
        Dictionary containing success and failure information
    """
    if user.role_id != 2:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not an instructor."
        )

    try:
        # Verify all students exist and are actually students
        student_query = (
            select(
                User.user_id,
                User.username,
                User.email,
                User.role_id
            )
            .where(
                User.user_id.in_(request.student_ids),
                User.role_id == 3  # Ensure they're students
            )
        )
        result = await db.execute(student_query)
        valid_students = result.all()

        if not valid_students:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No valid students found in the provided list."
            )

        # Get the IDs of valid students
        valid_student_ids = [student.user_id for student in valid_students]
        
        # Create list of values for bulk insert
        for student_id in valid_student_ids:
            # Insert each student individually with ON CONFLICT DO NOTHING
            stmt = text("""
                INSERT INTO graid_db.user_course_map (user_id, course_id)
                VALUES (:user_id, :course_id)
                ON CONFLICT (user_id, course_id) DO NOTHING
            """)
            await db.execute(stmt, {"user_id": student_id, "course_id": course_id})
        
        await db.commit()

        return {
            "success": True,
            "message": "Students enrolled successfully"
        }

    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to enroll students: {str(e)}"
        )
    
@router.delete("/{course_id}/students", response_model=Dict[str, object])
async def delete_students_enrollment(
    course_id: int,
    request: EnrollStudentsRequest,
    user: User = Depends(get_authorized_user([1, 2])),
    db: AsyncSession = Depends(get_db),
):
    """
    Deletes multiple students from a course using a bulk delete operation.
    
    Args:
        course_id: The ID of the course
        request: EnrollStudentsRequest containing list of student IDs to delete
        
    Returns:
        Dictionary containing success and failure information
    """
    if user.role_id != 2:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not an instructor."
        )
    
    try:
        # Verify all students exist and are enrolled in the course
        student_query = (
            select(
                UserCourseMap.user_id
            )
            .where(
                UserCourseMap.user_id.in_(request.student_ids),
                UserCourseMap.course_id == course_id
            )   
        )
        result = await db.execute(student_query)
        valid_students = result.all()

        if not valid_students:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No valid students found in the provided list."  
            )
        
        # Get the IDs of valid students
        valid_student_ids = [student.user_id for student in valid_students]
        
        # Create list of values for bulk delete
        for student_id in valid_student_ids:
            stmt = text("""
                DELETE FROM graid_db.user_course_map
                WHERE user_id = :user_id AND course_id = :course_id
            """)
            await db.execute(stmt, {"user_id": student_id, "course_id": course_id})
        
        await db.commit()
        
        return {
            "success": True,
            "message": "Students unenrolled successfully"
        }
    
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to unenroll students: {str(e)}"
        )   


@router.get("/search", response_model=List[SearchResult])
async def search_courses(
    query: str,
    user: User = Depends(get_authorized_user([1, 2, 3])),
    db: AsyncSession = Depends(get_db),
):
    """
    Search through courses and videos that the user has access to.
    
    The search looks for matches in titles and descriptions of both courses and videos.
    Only returns results from courses the user is enrolled in or instructs.
    
    ### Parameters:
    - **query** (`str`, required): Search term to look for in titles and descriptions
    - **user** (`User`, required): The authenticated user making the request
    - **db** (`AsyncSession`, required): Database session
    
    ### Returns:
    - List[SearchResult]: Combined list of matching courses and videos
    
    ### Errors:
    - `403 Forbidden`: If the user is inactive
    """
    if not user.status:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not active."
        )
    
    # Query for courses with literal type and null video fields
    course_query = (
        select(
            literal_column("'course'").label('type'),
            Course.course_id,
            Course.title,
            Course.description,
            null().label('video_id'),
            null().label('url')
        )
        .select_from(Course)
        .join(UserCourseMap, UserCourseMap.course_id == Course.course_id)
        .where(
            UserCourseMap.user_id == user.user_id,
            Course.title.ilike(f"%{query}%")
        )
    )
    
    # Query for videos with literal type
    video_query = (
        select(
            literal_column("'video'").label('type'),
            Video.course_id,
            Video.title,
            Video.description,
            Video.video_id,
            Video.url
        )
        .select_from(Video)
        .join(Course, Course.course_id == Video.course_id)
        .join(UserCourseMap, UserCourseMap.course_id == Course.course_id)
        .where(
            UserCourseMap.user_id == user.user_id,
            Video.status == VideoStatus.PROCESSED,
            Video.title.ilike(f"%{query}%")
        )
    )
    
    # Combine queries with UNION ALL
    combined_query = union_all(course_query, video_query)
    
    # Execute the combined query
    result = await db.execute(combined_query)
    rows = result.all()
    
    # Convert results to SearchResult objects
    return [
        SearchResult(
            type=row.type,
            course_id=row.course_id,
            title=row.title,
            description=row.description,
            video_id=row.video_id,
            url=row.url
        )
        for row in rows
    ]