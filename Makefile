# Default command:
up: sync
	docker-compose up -d

up-verbose: sync
	docker-compose up

kill: sync-stop
	docker-compose kill

down-all: kill
	docker-compose down -v

logs:
	docker-compose logs -f

sync:
	docker-sync start

sync-stop:
	docker-sync stop

clean: down-all
	docker-sync clean

full-restart: kill
	make clean
	make up-verbose