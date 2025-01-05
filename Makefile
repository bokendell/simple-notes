up:
	docker-compose up -d

down:
	docker-compose down

build:
	docker-compose build

shell-%:
	docker-compose exec $* sh

restart: down build up

reset-db: delete-db
	docker-compose up -d db

delete-db:
	docker-compose down -v