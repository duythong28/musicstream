#!/bin/bash

# Set your registry URL
REGISTRY="registry.digitalocean.com/music-stream-registry"

# Build and push all services
services=("user-service" "song-service" "album-service" "api-gateway")

for service in "${services[@]}"
do
  echo "Building $service..."
  docker build -t $REGISTRY/$service:latest ./$service
  
  echo "Pushing $service..."
  docker push $REGISTRY/$service:latest
done

echo "All images built and pushed successfully!"