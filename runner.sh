#!/usr/bin/env bash
# Starts and stops all the related services
# The script assumes that the services folders are located in the relative parent folder of this script
# The service folders must contain a docker-compose.yml file
#

ARCH=$(uname -m)
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

# Validate that the services folders exist
for SERVICE in "${SERVICES[@]}"; do
	if [ ! -d "../${SERVICE}" ]; then
		echo "Service folder not found: ${SERVICE}"
		exit 1
	fi
	if [ ! -f "../${SERVICE}/docker-compose.yml" ]; then
		echo "docker-compose.yml not found in service folder: ${SERVICE}"
		exit 1
	fi
done

# Run docker compose for each service
for SERVICE in "${SERVICES[@]}"; do
	echo "Running 'docker compose ${DOCKER_COMPOSE_COMMAND}' for ${SERVICE}"
	# Exception for users-api
	if [ ${SERVICE} = "users-api" ]; then
		# If OS architecture is arm64, use the arm64 version of the users-api
		if [ ${ARCH} = "arm64" ] || [ ${ARCH} = "aarch64" ]; then
			export USERAPI_DOCKERFILE="Dockerfile.arm64"
		fi
	fi
	docker compose -f ../${SERVICE}/docker-compose.yml ${DOCKER_COMPOSE_COMMAND}
done

# Echo the status of the services
echo ""
echo "> Status of the services:"
docker ps
 