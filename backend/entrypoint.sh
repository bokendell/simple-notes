#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Function to display messages
echo_info() {
    echo -e "\033[1;34m$1\033[0m"
}

run_migrations() {
    echo_info "Running migrations..."
    uv run manage.py migrate
}

collect_static_files() {
    echo_info "Collecting static files..."
    uv run manage.py collectstatic --noinput
}

start_dev_server() {
    echo_info "Starting dev server..."
    run_migrations
    collect_static_files

    echo_info "Starting Django development server..."
    exec uv run manage.py runserver 0.0.0.0:${DOCKER_BACKEND_PORT}
}

start_prod_server() {
    echo_info "Starting production server..."
    run_migrations
    collect_static_files

    echo_info "Starting Gunicorn server..."
    exec uv run -m gunicorn auth_site.wsgi:application --bind 0.0.0.0:${DOCKER_BACKEND_PORT}
}

echo_info "Starting entrypoint script..."

if [ "$APP_ENV" = "development" ]; then
    echo_info "Running in Development mode."
    start_dev_server

elif [ "$APP_ENV" = "production" ]; then
    echo_info "Running in Production mode."
    start_prod_server

else
    echo "Error: Unknown APP_ENV value '$APP_ENV'. Use 'development' or 'production'."
    exit 1
fi
