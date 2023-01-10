#!/usr/bin/env bash

DOCKER_COMPOSE_COMMAND=""
if [ "$1" = "up" ] || [ "$1" = "start" ]; then
	DOCKER_COMPOSE_COMMAND="up -d"
elif [ "$1" = "down" ] || [ "$1" = "stop" ]; then
	DOCKER_COMPOSE_COMMAND="down"
else
	echo "Usage: ./runner.sh up|down"
	exit 1
fi

# Known services
SERVICES=(
	"authentication-gw"
	"users-api"
	"testbed-api"
	"external-service-demo"
	"access-to-finland-demo-front"
	#"tmt-productizer"
	#"JobsInFinland.Api.Productizer"
)

for SERVICE in "${SERVICES[@]}"; do
	echo "Running docker compose for ${SERVICE}"
	docker compose -f ../${SERVICE}/docker-compose.yml ${DOCKER_COMPOSE_COMMAND}
done

 