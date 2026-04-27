#!/bin/bash

# HPCL Scholar Deployment Script for Ubuntu
echo "------------------------------------------------"
echo "Initializing Deployment Environment..."
echo "------------------------------------------------"

# Update system
echo "Checking for updates..."
sudo apt-get update -y

# Check if Docker is installed
if ! [ -x "$(command -v docker)" ]; then
  echo "Docker not found. Installing Docker..."
  sudo apt-get install -y ca-certificates curl gnupg lsb-release
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  sudo usermod -aG docker $USER
  echo "Docker installed successfully."
  rm get-docker.sh
else
  echo "Docker is already installed."
fi

# Check if Docker Compose is installed
if ! [ -x "$(command -v docker-compose)" ]; then
  echo "Docker Compose not found. Installing Docker Compose..."
  sudo apt-get install -y docker-compose
  echo "Docker Compose installed successfully."
else
  echo "Docker Compose is already installed."
fi

# Build the docker image
echo "Building HPCL Scholar Image..."
docker-compose build

# Start the container
echo "Starting HPCL Scholar on port 8080..."
docker-compose up -d

echo "------------------------------------------------"
echo "Deployment complete!"
echo "Access the app at: http://your-vps-ip:8080"
echo "------------------------------------------------"
