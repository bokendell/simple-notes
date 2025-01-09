# Use an official Python runtime as the base image
FROM python:3.12-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    bash \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables to prevent Python from writing pyc files and buffering stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir --upgrade uv

COPY pyproject.toml /app/
RUN uv lock || true
RUN uv sync

# Copy the Django project
COPY . /app/

# Make the entrypoint script executable
RUN chmod +x /app/entrypoint.sh

# Expose port 8000 for the backend
EXPOSE 8000

# Define the entrypoint
ENTRYPOINT ["./entrypoint.sh"]
