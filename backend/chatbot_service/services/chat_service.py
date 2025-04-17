from sqlalchemy.ext.asyncio import AsyncSession
from openai import OpenAI
from pathlib import Path
import os,time
import asyncio
from initialization import embed_model, llm, reranker
from ..services.bot import conversational_qa_single
from ..services.intent_classifier import IntentClassifierChecker
from ..services.type_chat import LLMChat
from ..services.type_irrelevance import IrrelevantQuestion
from ..services.general_chat import LLMGeneralChat
from ..services.logger_config import context_logger
from ..services.chat_session import chat_session_manager
from ..services.utils import (
    log_chat_to_file, 
    get_adjacent_segments, 
    read_prompt, 
    build_chat_string
)
from datetime import datetime, timezone
from .custom_retreiver import get_global_cache
from groq import Groq,AsyncGroq
from dotenv import load_dotenv
import os
from langfuse.decorators import observe, langfuse_context

"""
Main chat service module for the GRAID application.
This module handles user interactions with educational video content,
classifies question intents, retrieves relevant content,
and manages chat sessions.

Implementation details are masked for security and intellectual property protection.
"""

# Configuration section - Kept visible to show dependencies but without revealing values
# Load environment variables from .env file
load_dotenv()

# Langfuse configuration
LANGFUSE_SECRET_KEY=os.getenv("LANGFUSE_SECRET_KEY")
LANGFUSE_PUBLIC_KEY=os.getenv("LANGFUSE_PUBLIC_KEY")
LANGFUSE_HOST="https://us.cloud.langfuse.com"
 
# Configure the Langfuse client
langfuse_context.configure(
    secret_key=LANGFUSE_SECRET_KEY,
    public_key=LANGFUSE_PUBLIC_KEY,
    host=LANGFUSE_HOST,
    enabled=True,
)

# Prompt file loading setup
base_dir = Path(__file__).resolve().parents[1]
prompt_file_1 = base_dir / "prompts/stage_1.yaml"
prompt_file_2 = base_dir / "prompts/stage_2_no_json.yaml"
intent_file = base_dir / "prompts/intent.yaml"
irrelevant_file = base_dir / "prompts/Irrelevant.yaml"
chat_prompt_file = base_dir / "prompts/chat.yaml"
general_chat_file = base_dir / "prompts/general_chat.yaml"

# Initialize model clients and load prompts
# Implementation masked for security
# ...

async def end_chat_session(session_key: str):
    """
    Ends a chat session, logs the conversation history, and cleans up resources.
    
    Args:
        session_key (str): Unique identifier for the chat session
        
    Returns:
        str: Confirmation message that the session has ended
        
    Implementation details masked for security and intellectual property protection.
    """
    # Implementation masked for security
    pass

@observe(name = "Chatbot")
async def get_answer(user_id:str, course_id: str, video_id: str, video_description: str, question: str, timestamp:float, session_key: str):
    """
    Main function for processing user questions and generating appropriate responses.
    
    This function orchestrates the entire chatbot pipeline:
    1. Calculates query embeddings asynchronously
    2. Retrieves chat history context
    3. Performs intent classification
    4. Based on intent, either:
       - Performs retrieval-augmented generation for content questions
       - Handles conversational queries
       - Responds to irrelevant questions
       - Manages general chat
    5. Tracks and logs interactions with Langfuse
    6. Updates the chat history
    
    Args:
        user_id (str): Identifier for the current user
        course_id (str): Identifier for the current course
        video_id (str): Identifier for the video being watched
        video_description (str): Description of the video content
        question (str): The user's question text
        timestamp (float): Current position in the video
        session_key (str): Unique identifier for this chat session
        
    Returns:
        str: The answer to the user's question
        
    Implementation details masked for security and intellectual property protection.
    """
    # Implementation masked for security
    pass