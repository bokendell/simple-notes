# +--------------------------------------------------------------------------+
# |                                Variables                                 |
# +--------------------------------------------------------------------------+

# Import variables from .env
ifneq (,$(wildcard ./.env))
	include .env
	export
endif

SUCCESS_COLOR = \033[0;32m
INFO_COLOR = \033[0;36m
ERROR_COLOR = \033[0;31m
WARNING_COLOR = \033[0;33m
NO_COLOR = \033[0m

VALID_CONTAINERS = $(BACKEND_CONTAINER_NAME) $(DB_CONTAINER_NAME) $(FRONTEND_CONTAINER_NAME)

# +--------------------------------------------------------------------------+
# |                                Functions                                 |
# +--------------------------------------------------------------------------+

# Function to display informational messages based on verbosity
VERBOSE ?= 1
define INFO
	if [ $(VERBOSE) -eq 1 ]; then echo "$(INFO_COLOR)$1$(NO_COLOR)"; fi
endef

# Function to display warning messages
define WARNING
	echo "$(WARNING_COLOR)$1$(NO_COLOR)"
endef

# Function to display error messages and exit
define ERROR_EXIT
	echo "$(ERROR_COLOR)$1$(NO_COLOR)" && exit 1
endef

# Validate if the container name is valid
validate_container = \
	@if [ -n "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		CONTAINER="$(filter-out $@,$(MAKECMDGOALS))"; \
		if ! echo "$(VALID_CONTAINERS)" | grep -wq "$$CONTAINER"; then \
			echo "$(ERROR_COLOR)Error: $$CONTAINER is not a valid service name.$(NO_COLOR)"; \
			exit 1; \
		fi; \
	fi

# Prompt for confirmation

# +--------------------------------------------------------------------------+
# |                                Commands                                  |
# +--------------------------------------------------------------------------+

help:
	@echo "Available Makefile commands:"
	@echo "  up [service]                 Start all services or a specific service in detached mode."
	@echo "  down [service]               Stop all services or a specific service."
	@echo "  build [service]              Build all containers or a specific service."
	@echo "  build-nocache [service]      Build all containers or a specific service without cache."
	@echo "  restart [service]            Restart all services or a specific service."
	@echo "  restart-nocache [service]    Restart all services or a specific service without cache."
	@echo "  term [service]               Open a terminal for a specific service."
	@echo "  prune                        Prune unused Docker objects."
	@echo "  delete [service]             Delete a specific service container, image, and volume."
	@echo "  reset [service]              Reset a specific service container."
	@echo "  logs [service]               Display logs for all services or a specific service."
	@echo "  ps                           List all containers."
	@echo "  pull [service]               Pull latest images for all services or a specific service."
	@echo "  exec [service] [cmd]         Execute a command in a specific service container."
	@echo "  migrations [message]         Create a new migration with an optional message."
	@echo "  migrate                      Apply migrations."
	@echo "  uv [args]                    Execute a uv command with optional arguments."
	@echo "  uv-add [package]             Add a Python package."
	@echo "  uv-run [command]             Run a uv command."
	@echo "  python-shell                 Open a Python shell inside the backend container."
	@echo "  uv-sync                      Install Python packages."
	@echo "  uv-lock                      Generate a uv.lock file."
	@echo "  freeze-requirements          Freeze Python dependencies to requirements.txt."

# +--------------------------------------------------------------------------+
# |                                 Docker                                   |
# +--------------------------------------------------------------------------+

up:
	$(call validate_container)
	@if [ -n "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		CONTAINER="$(filter-out $@,$(MAKECMDGOALS))"; \
		$(call INFO, "Starting $$CONTAINER in detached mode..."); \
		docker compose up -d $$CONTAINER; \
	else \
		$(call INFO, "Starting all services in detached mode..."); \
		docker compose up -d; \
	fi
	@$(call INFO, "Services started successfully.")

down:
	$(call validate_container)
	@if [ -n "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		CONTAINER="$(filter-out $@,$(MAKECMDGOALS))"; \
		$(call INFO, "Stopping $$CONTAINER..."); \
		docker compose stop $$CONTAINER; \
	else \
		$(call INFO, "Stopping all containers..."); \
		docker compose down; \
	fi
	@$(call INFO, "Containers stopped successfully.")

build:
	$(call validate_container)
	@if [ -n "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		CONTAINER="$(filter-out $@,$(MAKECMDGOALS))"; \
		$(call INFO, "Building $$CONTAINER..."); \
		docker compose build $$CONTAINER; \
	else \
		$(call INFO, "Building all containers..."); \
		docker compose build; \
	fi
	@$(call INFO, "Build completed successfully.")

build-nocache:
	$(call validate_container)
	@if [ -n "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		CONTAINER="$(filter-out $@,$(MAKECMDGOALS))"; \
		$(call INFO, "Building $$CONTAINER without cache..."); \
		docker compose build --no-cache $$CONTAINER; \
	else \
		$(call INFO, "Building all containers without cache..."); \
		docker compose build --no-cache; \
	fi
	@$(call INFO, "Build without cache completed successfully.")

restart:
	$(call validate_container)
	@if [ -n "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		CONTAINER="$(filter-out $@,$(MAKECMDGOALS))"; \
		$(call INFO, "Restarting $$CONTAINER..."); \
		docker compose down $$CONTAINER; \
		docker system prune -f; \
		docker compose build $$CONTAINER; \
		docker compose up -d $$CONTAINER; \
	else \
		$(call INFO, "Restarting all services..."); \
		docker compose down; \
		docker system prune -f; \
		docker compose build; \
		docker compose up -d; \
	fi
	@$(call INFO, "Restart completed successfully.")

restart-nocache:
	$(call validate_container)
	@if [ -n "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		CONTAINER="$(filter-out $@,$(MAKECMDGOALS))"; \
		$(call INFO, "Restarting $$CONTAINER without cache..."); \
		docker compose down $$CONTAINER; \
		docker system prune -f; \
		docker compose build --no-cache $$CONTAINER; \
		docker compose up -d $$CONTAINER; \
	else \
		$(call INFO, "Restarting all services without cache..."); \
		docker compose down; \
		docker system prune -f; \
		docker compose build --no-cache; \
		docker compose up -d; \
	fi
	@$(call INFO, "Restart without cache completed successfully.")

term:
	$(call validate_container)
	@if [ -n "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		CONTAINER="$(filter-out $@,$(MAKECMDGOALS))"; \
		$(call INFO, "Opening terminal for $$CONTAINER..."); \
		docker exec -it $(PROJECT_NAME)-$$CONTAINER /bin/sh; \
	else \
		$(call ERROR_EXIT, "Please specify the container to open a terminal for."); \
	fi

prune:
	@$(call INFO, "Pruning unused Docker objects...")
	docker system prune -f
	@$(call INFO, "Pruning completed successfully.")

delete:
	$(call validate_container)
	@if [ -n "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		CONTAINER="$(filter-out $@,$(MAKECMDGOALS))"; \
		if [ "$$CONTAINER" = "$(DB_CONTAINER_NAME)" ]; then \
			$(call WARNING, "Are you sure you want to delete your database? This action cannot be undone!"); \
			read -p "Type 'y/n' to confirm: " CONFIRM && [ "$$CONFIRM" = "y" ]; \
			if [ $$? -ne 0 ]; then \
				$(call ERROR_EXIT, "Database deletion aborted."); \
				exit 1; \
			fi; \
		fi; \
		$(call INFO, "Deleting $$CONTAINER..."); \
		docker compose stop $$CONTAINER || { $(call ERROR_EXIT, "Failed to stop $$CONTAINER."); } ; \
		docker compose rm -f $$CONTAINER || { $(call ERROR_EXIT, "Failed to remove $$CONTAINER."); } ; \
		docker image rm $(PROJECT_NAME)-$$CONTAINER || { $(call WARNING, "Failed to remove image for $$CONTAINER. It might not exist."); } ; \
		if docker volume inspect $(PROJECT_NAME)-$$CONTAINER-data > /dev/null 2>&1; then \
			docker volume rm $(PROJECT_NAME)-$$CONTAINER-data || { $(call WARNING, "Failed to remove volume for $$CONTAINER."); } ; \
			$(call INFO, "Volume for $$CONTAINER deleted successfully."); \
		else \
			$(call INFO, "No volume exists for $$CONTAINER."); \
		fi; \
	else \
		$(call ERROR_EXIT, "Please specify the container to delete."); \
	fi

reset:
	$(call validate_container)
	@if [ -n "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		CONTAINER="$(filter-out $@,$(MAKECMDGOALS))"; \
		if [ "$$CONTAINER" = "$(DB_CONTAINER_NAME)" ]; then \
			$(call WARNING, "Are you sure you want to delete your database? This action cannot be undone!"); \
			read -p "Type 'y/n' to confirm: " CONFIRM && [ "$$CONFIRM" = "y" ]; \
			if [ $$? -ne 0 ]; then \
				$(call ERROR_EXIT, "Database deletion aborted."); \
				exit 1; \
			fi; \
		fi; \
		$(call INFO, "Deleting $$CONTAINER..."); \
		docker compose stop $$CONTAINER || { $(call ERROR_EXIT, "Failed to stop $$CONTAINER."); } ; \
		docker compose rm -f $$CONTAINER || { $(call ERROR_EXIT, "Failed to remove $$CONTAINER."); } ; \
		docker image rm $(PROJECT_NAME)-$$CONTAINER || { $(call WARNING, "Failed to remove image for $$CONTAINER. It might not exist."); } ; \
		if docker volume inspect $(PROJECT_NAME)-$$CONTAINER-data > /dev/null 2>&1; then \
			docker volume rm $(PROJECT_NAME)-$$CONTAINER-data || { $(call WARNING, "Failed to remove volume for $$CONTAINER."); } ; \
			$(call INFO, "Volume for $$CONTAINER deleted successfully."); \
		else \
			$(call INFO, "No volume exists for $$CONTAINER."); \
		fi; \
		docker compose build --no-cache $$CONTAINER; \
		docker compose up -d $$CONTAINER; \
		$(call INFO, "$$CONTAINER reset successfully."); \
	else \
		$(call ERROR_EXIT, "Please specify the container to reset."); \
	fi

logs:
	$(call validate_container)
	@if [ -n "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		CONTAINER="$(filter-out $@,$(MAKECMDGOALS))"; \
		$(call INFO, "Displaying logs for $$CONTAINER..."); \
		docker compose logs -f $$CONTAINER; \
	else \
		$(call INFO, "Displaying logs for all containers..."); \
		docker compose logs -f; \
	fi

ps:
	$(call INFO, "Listing all containers...")
	docker compose ps
	$(call INFO, "Container list displayed successfully.")

# +--------------------------------------------------------------------------+
# |                                 Database                                 |
# +--------------------------------------------------------------------------+

migrations:
	@if [ -n "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		$(call INFO, "Creating a new migration: $(filter-out $@,$(MAKECMDGOALS))..."); \
		docker compose exec $(BACKEND_CONTAINER_NAME) uv run manage.py makemigrations --name "$(filter-out $@,$(MAKECMDGOALS))" || \
			$(call ERROR_EXIT, "Failed to create migration."); \
	else \
		$(call INFO, "Creating a new migration..."); \
		docker compose exec $(BACKEND_CONTAINER_NAME) uv run manage.py makemigrations || \
			$(call INFO,  migration created successfully."); \
	fi
	$(call INFO,  migration created successfully.")

migrate:
	$(call INFO, "Applying migrations...")
	docker compose exec $(BACKEND_CONTAINER_NAME) uv run manage.py migrate || \
		$(call INFO, "Migrations applied successfully.")
	$(call INFO, "Migrations applied successfully.")

# +--------------------------------------------------------------------------+
# |                                  Python                                  |
# +--------------------------------------------------------------------------+

uv:
	$(call INFO, "Executing uv command...$(filter-out $@,$(MAKECMDGOALS))...")
	docker compose exec $(BACKEND_CONTAINER_NAME) uv $(filter-out $@,$(MAKECMDGOALS)) || \
		$(call INFO, "uv command executed successfully.")
	$(call INFO, "uv command executed successfully.")

uv-add:
	$(call INFO, "Adding Python package...$(filter-out $@,$(MAKECMDGOALS))...")
	docker compose exec $(BACKEND_CONTAINER_NAME) uv add $(filter-out $@,$(MAKECMDGOALS)) || \
		$(call INFO, "Python package added successfully.")
	@echo "$(SUCCESS_COLOR)Python package added successfully.$(NO_COLOR)"

uv-run:
	$(call INFO, "Executing uv-run command...$(filter-out $@,$(MAKECMDGOALS))...")
	docker compose exec $(BACKEND_CONTAINER_NAME) uv run $(filter-out $@,$(MAKECMDGOALS)) || \
		$(call INFO, "uv-run command executed successfully.")
	$(call INFO, "uv-run command executed successfully.")

python-shell:
	$(call INFO, "Exiting Python shell...")
	docker compose exec $(BACKEND_CONTAINER_NAME) uv run python || \
		$(call ERROR_EXIT, "Failed to start Python shell.")
	$(call INFO, "Exited Python shell.")

uv-sync:
	$(call INFO, "Installing Python packages...")
	docker compose exec $(BACKEND_CONTAINER_NAME) uv run sync || \
		$(call ERROR_EXIT, "Failed to install Python packages.")
	$(call INFO, "Python packages installed successfully.")

uv-lock:
	$(call INFO, "Generating uv.lock file...")
	docker compose exec $(BACKEND_CONTAINER_NAME) uv run lock || \
		$(call ERROR_EXIT, "Failed to generate uv.lock file.")
	$(call INFO, "uv.lock file generated successfully.")

freeze-requirements:
	$(call INFO, "Freezing Python dependencies...")
	docker compose exec $(BACKEND_CONTAINER_NAME) uv run pip freeze > requirements.txt || \
		$(call ERROR_EXIT, "Failed to freeze Python dependencies.")
	$(call INFO, "Python dependencies frozen successfully.")

.PHONY: help \
	up \
	down \
	build \
	build-nocache \
	restart \
	restart-nocache \
	term \
	prune \
	delete \
	reset \
	logs \
	ps \
	pull \
	exec \
	migrations \
	migrate \
	uv \
	uv-add \
	uv-run \
	python-shell \
	uv-sync \
	uv-lock \
	freeze-requirements

%:
	@: