image:
	docker build -f ./app/Dockerfile -t "1c23-tp-1-node:latest" ./app

up: image
	docker-compose up -d