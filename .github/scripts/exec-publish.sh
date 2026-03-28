set -euo pipefail

# image name
IMAGE_NAME="${DOCKER_USERNAME}/${DOCKER_IMAGE_NAME}"

# build image from Dockerfile
docker buildx build -t $IMAGE_NAME .

# login to docker
docker login -u $DOCKER_USERNAME -p $DOCKER_TOKEN

# push to DockerHub
docker push $IMAGE_NAME

# cache clear
docker buildx prune -af
