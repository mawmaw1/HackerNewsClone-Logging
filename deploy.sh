#!/bin/bash

BUILD_NUMBER=$1
DOCKER_ID=$2
# stop all running containers with our web application
docker stop `docker ps -a | grep ${DOCKER_ID}/hnclogger | awk '{print substr ($0, 0, 12)}'`
# remove all of those containers
docker rm `docker ps -a | grep ${DOCKER_ID}/hnclogger | awk '{print substr ($0, 0, 12)}'`

docker system prune -af

if (( ${BUILD_NUMBER} >= 2 )); then
    # remove old image
    docker rmi ${DOCKER_ID}/hnclogger:${BUILD_NUMBER}
fi
# get the newest version of the containerized web application and run it
docker pull ${DOCKER_ID}/hnclogger:${BUILD_NUMBER}
docker run --name hnclogger --network hncnetwork -d -ti -p 8089:8080 ${DOCKER_ID}/hnclogger:${BUILD_NUMBER}
