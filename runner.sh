#!/usr/bin/env bash

DOCKER_COMPOSE_COMMAND=""
if [ "$1" = "up" ]; then
	DOCKER_COMPOSE_COMMAND="up -d"
elif [ "$1" = "down" ]; then
	DOCKER_COMPOSE_COMMAND="down"
else
	echo "Usage: ./runner.sh up|down"
	exit 1
fi

# Known services
SERVICES=(
	"authentication-gw"
	"users-api"
	"external-service-demo"
	"access-to-finland-demo-front"
	#"tmt-productizer"
	#"JobsInFinland.Api.Productizer"
)

for SERVICE in "${SERVICES[@]}"; do
	echo "Running docker compose for ${SERVICE}"
	docker compose -f ../${SERVICE}/docker-compose.yml ${DOCKER_COMPOSE_COMMAND}
done

 