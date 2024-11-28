#!/bin/bash

# Function to run Trivy using its Docker image
run_trivy_scan() {
    local image_name=$1
    echo "Scanning image: $image_name"
    
    docker run --rm \
        -v /var/run/docker.sock:/var/run/docker.sock \
        aquasec/trivy:latest image "$image_name"
}

# Build and scan backend Docker image
echo "Building backend Docker image..."
docker build -t merchant-feedback-backend ./project-backend

echo "Scanning backend Docker image..."
run_trivy_scan merchant-feedback-backend

# Build and scan frontend Docker image
echo "Building frontend Docker image..."
docker build -t merchant-feedback-frontend ./project-frontend

echo "Scanning frontend Docker image..."
run_trivy_scan merchant-feedback-frontend

