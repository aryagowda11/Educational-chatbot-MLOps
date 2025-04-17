# Use Python 3.12 slim base image (compatible with your pyproject.toml: >=3.9,<3.13)
FROM python:3.12-slim

# Set work directory
WORKDIR /app

# Environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    POETRY_VIRTUALENVS_CREATE=false \
    PATH="/root/.local/bin:$PATH"

# Install system dependencies and Poetry
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    gcc \
    git \
    && curl -sSL https://install.python-poetry.org | python3 - \
    && rm -rf /var/lib/apt/lists/*

# Copy only the files needed to install dependencies first (for caching)
COPY pyproject.toml poetry.lock* ./

# Install project dependencies using Poetry
RUN poetry install --no-root

# Copy rest of the application
COPY . .

# Create a non-root user and switch to it
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

# Default command to run your app
# CMD ["python", "-m", "src.API_Calling"]
