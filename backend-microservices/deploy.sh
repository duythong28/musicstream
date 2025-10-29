#!/bin/bash

echo "Creating namespace..."
kubectl apply -f k8s/namespace.yaml

echo "Creating secrets..."
kubectl apply -f k8s/secrets.yaml

echo "Deploying services..."
kubectl apply -f k8s/user-service-deployment.yaml
kubectl apply -f k8s/song-service-deployment.yaml
kubectl apply -f k8s/album-service-deployment.yaml
kubectl apply -f k8s/api-gateway-deployment.yaml

echo "Waiting for deployments..."
kubectl wait --for=condition=available --timeout=300s \
  deployment/user-service \
  deployment/song-service \
  deployment/album-service \
  deployment/api-gateway \
  -n music-stream

echo "Deployment complete!"
echo "Getting service status..."
kubectl get all -n music-stream