#!/usr/bin/env bash
# Starts and stops all the related services
# The script assumes that the services folders are located in the relative parent folder of this script
# The service folders must contain a docker-compose.yml file
#

DOCKER_COMPOSE_COMMAND=""
if [ "$1" = "up" ] || [ "$1" = "start" ]; then
	DOCKER_COMPOSE_COMMAND="up -d --build"
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
	echo "Running docker compose ${DOCKER_COMPOSE_COMMAND} for ${SERVICE}"
	if [ ${SERVICE} = "users-api" ]; then
		# If OS architecture is arm64, use the arm64 version of the users-api
		if [ $(uname -m) = "aarch64" ]; then
			export USERAPI_DOCKERFILE="Dockerfile.arm64"
		fi
	fi
	docker compose -f ../${SERVICE}/docker-compose.yml ${DOCKER_COMPOSE_COMMAND}
done

 