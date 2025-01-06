# +--------------------------------------------------------------------------+
# |                                Variables                                 |
# +--------------------------------------------------------------------------+

SUCCESS_COLOR = \033[0;32m
INFO_COLOR = \033[0;36m
ERROR_COLOR = \033[0;31m
WARNING_COLOR = \033[0;33m
NO_COLOR = \033[0m

BACKEND_CONTAINER_NAME = app
DB_CONTAINER_NAME = db
FRONTEND_CONTAINER_NAME = frontend

PROJECT_NAME = simplenotes

VALID_CONTAINERS = $(BACKEND_CONTAINER_NAME) $(DB_CONTAINER_NAME) $(FRONTEND_CONTAINER_NAME)

# +--------------------------------------------------------------------------+
# |                              Docker Commands                             |
# +--------------------------------------------------------------------------+

validate_container = \
	@if [ -n "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		CONTAINER="$(filter-out $@,$(MAKECMDGOALS))"; \
		if ! echo "$(VALID_CONTAINERS)" | grep -wq "$$CONTAINER"; then \
			echo "$(ERROR_COLOR)Error: $$CONTAINER is not a valid service name.$(NO_COLOR)"; \
			exit 1; \
		fi; \
	fi

up:
	$(call validate_container)
	@if [ -n "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		CONTAINER="$(filter-out $@,$(MAKECMDGOALS))"; \
		echo "$(INFO_COLOR)Starting $$CONTAINER in detached mode...$(NO_COLOR)"; \
		docker compose up $$CONTAINER; \
	else \
		echo "$(INFO_COLOR)Starting all services in detached mode...$(NO_COLOR)"; \
		docker-compose up; \
	fi
	echo "$(SUCCESS_COLOR)Services started successfully.$(NO_COLOR)";


down:
	$(call validate_container)
	@if [ -n "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		CONTAINER="$(filter-out $@,$(MAKECMDGOALS))"; \
		echo "$(INFO_COLOR)Stopping $$CONTAINER...$(NO_COLOR)"; \
		docker compose stop $$CONTAINER; \
	else \
		echo "$(INFO_COLOR)Stopping all containers...$(NO_COLOR)"; \
		docker-compose down; \
	fi
	echo "$(SUCCESS_COLOR)Containers stopped successfully.$(NO_COLOR)";

build:
	$(call validate_container)
	@if [ -n "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		CONTAINER="$(filter-out $@,$(MAKECMDGOALS))"; \
		echo "$(INFO_COLOR)Building $$CONTAINER...$(NO_COLOR)"; \
		docker-compose build $$CONTAINER; \
	else \
		echo "$(INFO_COLOR)Building all containers...$(NO_COLOR)"; \
		docker-compose build; \
	fi
	echo "$(SUCCESS_COLOR)Build completed successfully.$(NO_COLOR)";

build-nocache:
	$(call validate_container)
	@if [ -n "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		CONTAINER="$(filter-out $@,$(MAKECMDGOALS))"; \
		echo "$(INFO_COLOR)Building $$CONTAINER without cache...$(NO_COLOR)"; \
		docker-compose build --no-cache $$CONTAINER; \
	else \
		echo "$(INFO_COLOR)Building all containers without cache...$(NO_COLOR)"; \
		docker-compose build --no-cache; \
	fi
	echo "$(SUCCESS_COLOR)Build without cache completed successfully.$(NO_COLOR)";

restart: down build up

restart-nocache: down build-nocache up

term:
	$(call validate_container)
	@if [ -n "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		CONTAINER="$(filter-out $@,$(MAKECMDGOALS))"; \
		echo "$(INFO_COLOR)Opening terminal for $$CONTAINER...$(NO_COLOR)"; \
		docker exec -it $$CONTAINER /bin/sh; \
	else \
		echo "$(ERROR_COLOR)Please specify the container to open a terminal for.$(NO_COLOR)"; \
	fi

prune:
	echo "$(WARNING_COLOR)Pruning unused Docker objects...$(NO_COLOR)";
	docker system prune -f
	echo "$(SUCCESS_COLOR)Pruning completed successfully.$(NO_COLOR)";

delete:
	$(call validate_container)
	@if [ -n "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		CONTAINER="$(filter-out $@,$(MAKECMDGOALS))"; \
		if [ "$$CONTAINER" = "$(DB_CONTAINER_NAME)" ]; then \
			echo "$(WARNING_COLOR)Are you sure you want to delete your database? This action cannot be undone!$(NO_COLOR)"; \
			read -p "Type 'y/n' to confirm: " CONFIRM && [ "$$CONFIRM" = "y" ]; \
			if [ $$? -ne 0 ]; then \
				echo "$(INFO_COLOR)Aborting delete operation.$(NO_COLOR)"; \
				exit 1; \
			fi; \
		fi; \
		echo "$(INFO_COLOR)Deleting $$CONTAINER...$(NO_COLOR)"; \
		docker-compose stop $$CONTAINER; \
		docker container rm $(PROJECT_NAME)-$$CONTAINER; \
		docker image rm $$CONTAINER; \
		if docker volume inspect $(PROJECT_NAME)-$$CONTAINER > /dev/null 2>&1; then \
			docker volume rm $(PROJECT_NAME)-$$CONTAINER; \
			echo "$(SUCCESS_COLOR)Volume for $$CONTAINER deleted successfully.$(NO_COLOR)"; \
		else \
			echo "$(INFO_COLOR)No volume exists for $$CONTAINER.$(NO_COLOR)"; \
		fi; \
	else \
		echo "$(ERROR_COLOR)Please specify the container to delete.$(NO_COLOR)"; \
		exit 1; \
	fi

reset:
	$(call validate_container)
	@if [ -n "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		CONTAINER="$(filter-out $@,$(MAKECMDGOALS))"; \
		if [ "$$CONTAINER" = "$(DB_CONTAINER_NAME)" ]; then \
			echo "$(WARNING_COLOR)Are you sure you want to reset your database? This action cannot be undone!$(NO_COLOR)"; \
			read -p "Type 'y' to confirm: " CONFIRM && [ "$$CONFIRM" = "y" ]; \
			if [ $$? -ne 0 ]; then \
				echo "$(INFO_COLOR)Aborting reset operation.$(NO_COLOR)"; \
				exit 1; \
			fi; \
		fi; \
		echo "$(INFO_COLOR)Resetting $$CONTAINER...$(NO_COLOR)"; \
		docker-compose stop $$CONTAINER; \
		docker container rm $(PROJECT_NAME)-$$CONTAINER; \
		docker-compose build --no-cache $$CONTAINER; \
		docker-compose up -d $$CONTAINER; \
		echo "$(SUCCESS_COLOR)Container $$CONTAINER has been reset successfully.$(NO_COLOR)"; \
	else \
		echo "$(ERROR_COLOR)Please specify the container to reset.$(NO_COLOR)"; \
		exit 1; \
	fi

logs:
	$(call validate_container)
	@if [ -n "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		CONTAINER="$(filter-out $@,$(MAKECMDGOALS))"; \
		echo "$(INFO_COLOR)Displaying logs for $$CONTAINER...$(NO_COLOR)"; \
		docker-compose logs -f $$CONTAINER; \
	else \
		echo "$(INFO_COLOR)Displaying logs for all containers...$(NO_COLOR)"; \
		docker-compose logs -f; \
	fi

ps:
	@echo "$(INFO_COLOR)Listing all containers...$(NO_COLOR)";
	docker-compose ps
	@echo "$(SUCCESS_COLOR)Container list displayed successfully.$(NO_COLOR)";
