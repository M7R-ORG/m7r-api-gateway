set -euo pipefail

# image name
IMAGE_NAME="${DOCKER_USERNAME}/${DOCKER_IMAGE_NAME}"

# release tag (fallback to latest for manual runs)
IMAGE_TAG="${IMAGE_TAG:-latest}"

# build image from Dockerfile
docker buildx build -t "$IMAGE_NAME:$IMAGE_TAG" -t "$IMAGE_NAME:latest" .

# login to docker
docker login -u $DOCKER_USERNAME -p $DOCKER_TOKEN

# push to DockerHub
docker push "$IMAGE_NAME:$IMAGE_TAG"
docker push "$IMAGE_NAME:latest"

# cache clear
docker buildx prune -af
