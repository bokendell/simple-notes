# Use an official Python runtime as the base image
FROM python:3.8-slim

# Set environment variables to prevent Python from writing pyc files and buffering stdout/stderr
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy the Django project
COPY . /app/

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose port 8000 for the backend
EXPOSE 8000

# Define the default command to run migrations and start the server
CMD ["sh", "-c", "python manage.py migrate && gunicorn auth_site.wsgi:application --bind 0.0.0.0:8000"]
