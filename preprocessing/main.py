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
