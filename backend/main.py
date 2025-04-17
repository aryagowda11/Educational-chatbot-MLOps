# main.py
import logging
import os
import sys
import psutil
import time
from dotenv import load_dotenv
from video_service.routers import courses, video
from chatbot_service.routers import chatbot as chat
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth.routers import protected, auth
from core.database.config import engine
from core.models.base import Base
from chatbot_service.services.utils import (
    setup_environment
)

LOCAL_API_URL = os.getenv("LOCAL_API_URL", "http://localhost:8000")
PRODUCTION_API_URL = os.getenv("PRODUCTION_API_URL", "https://my-service-193050266767.us-east4.run.app")

# Load environment variables from .env file
load_dotenv()

# In-memory session store keyed by (user_id + course_name + video_id)
sessions = {}

app = FastAPI(
    title="Project Graid API",
    version="1.0.0",
    redirect_slashes=False,
    servers=[
        {"url": LOCAL_API_URL, "description": "Local Development"},
        {"url": PRODUCTION_API_URL, "description": "Production"},
    ],
)

# # Global models (loaded once)
embed_model, llm, reranker = setup_environment()

# Configure Logging for Local Debugging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)


def get_memory_usage():
    process = psutil.Process()
    mem_info = process.memory_info()
    return {
        "memory_mb": mem_info.rss / 1024 / 1024,
        "cpu_percent": process.cpu_percent(interval=1),
    }

@app.get("/health")
async def health_check():
    usage = get_memory_usage()
    return {"status": "healthy", "usage": usage}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://graid.xyz", "https://www.graid.xyz"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app.include_router(auth.router)
app.include_router(protected.router)
app.include_router(courses.router)
app.include_router(video.router)
app.include_router(chat.router)
