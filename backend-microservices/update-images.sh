#!/bin/bash

REGISTRY="registry.digitalocean.com/music-stream-registry"

# Update all deployment files
sed -i "s|youracr.azurecr.io|$REGISTRY|g" k8s/*-deployment.yaml
sed -i "s|your-registry|$REGISTRY|g" k8s/*-deployment.yaml