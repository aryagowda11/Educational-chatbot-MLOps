from datetime import timedelta
import uuid
from google.cloud import storage
from google.auth import default,transport
from google.auth import impersonated_credentials
import google.auth.transport.requests
from ..schemas.video import VideoUpload
from video_service.config.settings import settings
import httpx
import logging
from fastapi import HTTPException, UploadFile

logger = logging.getLogger(__name__)

async def chunked_file_reader(file_obj: UploadFile, chunk_size: int = 10 * 1024 * 1024):
    """
    Async generator that yields chunks from file.
    """
    file_obj.file.seek(0, 2)        
    total_size = file_obj.file.tell()
    file_obj.file.seek(0)

    read_so_far = 0
    while True:
        chunk = await file_obj.read(chunk_size)
        if not chunk:
            break
        
        read_so_far += len(chunk)
        
        if total_size > 0:
            progress_pct = (read_so_far / total_size) * 100
        else:
            progress_pct = 0

        logger.info(
            f"Upload progress: {read_so_far}/{total_size} bytes "
            f"({progress_pct:.2f}%)"
        )
        
        yield chunk
    
    logger.info("Upload progress: 100% (upload stream ended)")

async def upload_file_via_signed_url(signed_url: str, file_obj: UploadFile):
    """
    Streams the file to GCS via signed URL using an async generator.
    Prevents memory overflows & 'send_chunk' errors.
    """
    headers = {"Content-Type": "video/mp4"}

    # Provide the generator to `data=...`
    async with httpx.AsyncClient() as client:
        response = await client.put(
            signed_url,
            headers=headers,
            data=chunked_file_reader(file_obj)
        )

    if response.status_code != 200:
        logging.error(f"Upload failed: {response.status_code} - {response.text}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload to GCS: {response.text}"
        )

    logging.info("Upload completed successfully!")


def get_public_url(bucket_name: str, blob_name: str) -> str:
    """
    Generate a public URL for a GCS object.
    """
    return f"https://storage.cloud.google.com/{bucket_name}/{blob_name}"

# def generate_signed_url(bucket_name, blob_name):
#     storage_client = storage.Client()
#     bucket = storage_client.bucket(bucket_name)
#     blob = bucket.blob(blob_name)

#     url = blob.generate_signed_url(
#         version="v4",
#         expiration=timedelta(minutes=15),
#         method="GET"
#     )
#     return url

def get_service_account_credentials():
    credentials, project = google.auth.default(
        scopes="https://www.googleapis.com/auth/iam"
    )
    credentials.refresh(google.auth.transport.requests.Request())
    return credentials

    
def upload_file_to_gcs(course_id: str, video_id: str, file_type: str) -> str:
    """
    Uploads file_obj to GCS and returns the GCS path (or public URL).
    """
    
    client = storage.Client()
    bucket = client.bucket(settings.GCP_BUCKET)

    # Generate a unique blob name
    blob_name = f"storage/{course_id}/video/{video_id}.{file_type}"
    blob = bucket.blob(blob_name)
    SCOPES = [
    "https://www.googleapis.com/auth/devstorage.read_only",
    "https://www.googleapis.com/auth/iam"
    ]

    credentials, project = default(
        scopes=SCOPES
    )
    credentials.refresh(transport.requests.Request())

    # Upload directly from file-like object
    # blob.upload_from_file(file_obj)
    
    # Create signed URL for direct upload
    signed_url = blob.generate_signed_url(
        version="v4",
        expiration=timedelta(hours=1),
        method="PUT",
        content_type="video/mp4",
        service_account_email=credentials.service_account_email,
        access_token=credentials.token
    )
    public_url = get_public_url(settings.GCP_BUCKET, blob_name)
    # Return a GCS-style path
    return VideoUpload (
        video_id=video_id,
        signed_url=signed_url,
        storage_path= f"gs://{settings.GCP_BUCKET}/{blob_name}",
        public_url=public_url
    )
