<<<<<<< HEAD
from src.llms_initialize import *
from src.processing_chunks import *
from llama_index.core.retrievers import VectorIndexRetriever
from src.pinecone_db import *
from google.cloud import storage
from dotenv import load_dotenv
import os
import logging
import io
import pandas as pd

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler()],
)

logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
logger.debug("Loading environment variables")

os.environ["GROQ_API_KEY"] = os.getenv("GROQ_API_KEY_3")
os.environ["PINECONE_API_KEY"] = os.getenv("PINECONE_API_KEY")
pinecone_environment = "us-east-1"
api_key = os.environ["PINECONE_API_KEY"]


# Initialize Google Cloud Storage client
storage_client = storage.Client()


def upload_to_gcs(data, gcs_path):
    """Uploads a file or DataFrame to Google Cloud Storage."""
    bucket = storage_client.bucket(GCS_BUCKET_NAME)
    blob = bucket.blob(gcs_path)

    if isinstance(data, pd.DataFrame):
        buffer = io.StringIO()
        data.to_csv(buffer, index=False)
        blob.upload_from_string(buffer.getvalue(), content_type="text/csv")
    else:
        blob.upload_from_filename(data)

    logger.info(f"Uploaded to gs://{GCS_BUCKET_NAME}/{gcs_path}")


def delete_gcs_folder(folder_path):
    """Deletes all files inside a GCS folder after processing."""
    bucket = storage_client.bucket(GCS_BUCKET_NAME)
    blobs = list(bucket.list_blobs(prefix=folder_path))

def main(gcs_video_path):
    """
    Main preprocessing function that processes videos stored in GCS.
    
    Args:
        gcs_video_path (str): Full GCS path of the uploaded video.
    """
    try:
        logger.info(f"Starting preprocessing for video: {gcs_video_path}")

        # Extract course name and video ID from the GCS path
        path_parts = gcs_video_path.split("/")
        if len(path_parts) < 3:
            logger.error(f"Invalid GCS path structure: {gcs_video_path}")
            return

        course_name = path_parts[1]  # Example: "Logistic Regression"
        video_id = path_parts[2]  # Example: "video_001"

        logger.info(f"Detected Course: {course_name}, Video ID: {video_id}")


        # Check if video exists in GCS
        bucket = storage_client.bucket(GCS_BUCKET_NAME)
        blob = bucket.blob(gcs_video_path)
        if not blob.exists():
            logger.error(f"Video file not found in GCS: gs://{GCS_BUCKET_NAME}/{gcs_video_path}")
            return

        # Set up environment
        logger.info("Setting up environment...")
        embed_model, llm = setup_environment()

        # Process video directly from GCS
        logger.info(f"Processing video: gs://{GCS_BUCKET_NAME}/{gcs_video_path}")


      
        logger.info("Creating vector index...")
        

        # Upload CSVs to GCS
        logger.info("Uploading processed CSVs to GCS...")
       
        # Delete chunks from GCS after CSVs are stored
        logger.info("Deleting temporary chunks from GCS...")
        delete_gcs_folder(gcs_chunks_path)

        logger.info("Processing completed successfully!")

    except Exception as e:
        logger.error(f"Error in main processing: {str(e)}", exc_info=True)
        raise


if __name__ == "__main__":
    try:
        logger.info("Starting preprocessing script")
        # The script will be called with a GCS path argument from Cloud Functions or Kubernetes
        gcs_video_path = os.getenv("GCS_VIDEO_PATH")
        if not gcs_video_path:
            raise ValueError("GCS_VIDEO_PATH environment variable is missing.")
        main(gcs_video_path)
    except Exception as e:
        logger.critical("Fatal error in main script", exc_info=True)
        raise
=======
import functions_framework
from google.cloud import storage
from dotenv import load_dotenv
import os 
import shutil
from src.processing_chunks import *
from src.file import get_local_video_path,create_files_in_bucket_from_df,create_directory_structure,extract_course_video_info_from_path
from src.logger_config import get_logger
from src.vector_db import create_vector_index
from src.llms_initialize import setup_environment
from src.description_processor import LLMChat
from src.API_Calling import update_video_processing_status
from pathlib import Path

"""
Main module for the GRAID preprocessing pipeline.
This module defines the cloud function entry point for the video processing system,
orchestrating the complete workflow from video upload detection to indexed, 
searchable content ready for the chatbot service.

Implementation details are masked for security and intellectual property protection.
"""

# Load .env file
load_dotenv()

# Configure logging
logger = get_logger()

valid_file_extensions = ['mp4']

# Triggered by a change in a storage bucket
@functions_framework.cloud_event
def process_event(cloud_event) -> None:
    """
    Cloud function entry point triggered by a storage event.
    
    This function orchestrates the entire video processing pipeline:
    1. Validates file format and extracts course and video IDs
    2. Downloads the video from cloud storage
    3. Creates the local directory structure for processing
    4. Initializes embedding and language models
    5. Processes the video into transcription and structured data
    6. Creates vector indices for semantic search
    7. Generates a comprehensive video description
    8. Updates the video processing status in the database
    9. Cleans up temporary files
    
    Args:
        cloud_event: The cloud event object containing storage event data
        
    Returns:
        tuple: (message, status_code) indicating success or failure
        
    Implementation details masked for security and intellectual property protection.
    """
    # Implementation masked for security
    pass
    

def get_video_description(llm, vector_df):
    """
    Generates a structured description of the video using an LLM.
    
    This function:
    1. Concatenates all corrected text segments from the video
    2. Loads the specialized description generation prompt
    3. Uses the LLM to generate a comprehensive video description
    4. Logs the generated description
    
    Args:
        llm: The language model to use for description generation
        vector_df: DataFrame containing processed video text segments
        
    Returns:
        str: The generated video description
        
    Implementation details masked for security and intellectual property protection.
    """
    # Implementation masked for security
    pass
>>>>>>> 911c895 (Initial Mask commit)
