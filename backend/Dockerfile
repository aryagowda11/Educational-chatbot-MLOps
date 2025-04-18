# Use a base image
FROM python:3.13.2

# Set a working directory
WORKDIR /app

# Copy only the pyproject.toml and poetry.lock
COPY backend/pyproject.toml backend/poetry.lock /app/

# Install Poetry in the container
RUN pip install --no-cache-dir poetry==2.1.1

# Install project dependencies
RUN poetry install --no-root --no-interaction --no-ansi

# Copy the rest of the application code
COPY backend/ /app/

# Expose port 8080
EXPOSE 8080

# Run uvicorn
CMD ["poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
