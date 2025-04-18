import os
from pydantic_settings import BaseSettings
from pydantic import PostgresDsn
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL: PostgresDsn = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/dbname")
GCP_BUCKET: str = os.getenv("GCP_BUCKET", "my-gcs-bucket")
GCP_PROJECT = os.getenv("GCP_PROJECT")

class Settings(BaseSettings):
    DATABASE_URL: str = DATABASE_URL
    GCP_PROJECT: str = GCP_PROJECT
    GCP_BUCKET: str = GCP_BUCKET

settings = Settings()