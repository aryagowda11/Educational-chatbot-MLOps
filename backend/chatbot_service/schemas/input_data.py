from pydantic import BaseModel

"""
Input data schema definitions for the GRAID application.
This module defines the data models used for API requests
to interact with the chatbot service.

Implementation details are masked for security and intellectual property protection.
"""

class InputData(BaseModel):
    """
    Input data model for the chatbot API request.
    
    This class defines the structure of incoming requests to the chatbot service,
    including user identification, context information, and the actual query.
    
    Attributes:
        user_id (str): Identifier for the current user
        course_id (int): ID of the course being accessed
        video_id (str): The ID of the video being queried
        question (str): The user's question text
        timestamp (float): The timestamp in the video related to the question
        video_description (str): Description of the video content for context
        end_session (bool): Flag to signal when the conversation ends
        
    Implementation details masked for security and intellectual property protection.
    """
    # Implementation masked for security
    user_id: str
    course_id: int
    video_id: str
    question: str
    timestamp: float
    video_description: str
    end_session: bool = False  # To signal when the conversation ends