#!/bin/bash
# =============================================================================
# Docker Hub Build & Push Script
# 3A Softwares - E-Storefront-Web
# =============================================================================
# This script builds and pushes Docker images to Docker Hub
#
# Usage:
#   ./scripts/docker-push.sh              # Push latest
#   ./scripts/docker-push.sh v1.1.0       # Push specific version
#   ./scripts/docker-push.sh dev          # Push dev image only
# =============================================================================

set -e

# Configuration
DOCKER_HUB_USERNAME="3asoftwares"
IMAGE_NAME="storefront"
VERSION=${1:-"latest"}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN} Docker Hub Build & Push Script${NC}"
echo -e "${GREEN} 3A Softwares - E-Storefront-Web${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""

# Check if logged in to Docker Hub
if ! docker info 2>/dev/null | grep -q "Username"; then
    echo -e "${YELLOW}Please login to Docker Hub first:${NC}"
    docker login
fi

# Function to build and push
build_and_push() {
    local dockerfile=$1
    local tag=$2
    local platform=$3
    
    echo -e "\n${GREEN}Building: ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}:${tag}${NC}"
    echo -e "Dockerfile: ${dockerfile}"
    echo -e "Platform: ${platform}"
    echo ""
    
    # Build with multi-platform support
    docker buildx build \
        --platform ${platform} \
        -f ${dockerfile} \
        -t ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}:${tag} \
        --push \
        .
    
    echo -e "${GREEN}✓ Pushed: ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}:${tag}${NC}"
}

# Create buildx builder if not exists
if ! docker buildx inspect multiarch 2>/dev/null; then
    echo -e "${YELLOW}Creating multi-platform builder...${NC}"
    docker buildx create --name multiarch --use
fi

# Use the builder
docker buildx use multiarch

case $VERSION in
    "dev")
        # Build only dev image
        build_and_push "Dockerfile.dev" "dev" "linux/amd64,linux/arm64"
        ;;
    "prod"|"production")
        # Build only prod image
        build_and_push "Dockerfile.prod" "latest" "linux/amd64,linux/arm64"
        ;;
    "all")
        # Build both images
        build_and_push "Dockerfile.dev" "dev" "linux/amd64,linux/arm64"
        build_and_push "Dockerfile.prod" "latest" "linux/amd64,linux/arm64"
        ;;
    *)
        # Build with specific version tag
        build_and_push "Dockerfile.prod" "${VERSION}" "linux/amd64,linux/arm64"
        build_and_push "Dockerfile.prod" "latest" "linux/amd64,linux/arm64"
        build_and_push "Dockerfile.dev" "dev" "linux/amd64,linux/arm64"
        ;;
esac

echo -e "\n${GREEN}=========================================${NC}"
echo -e "${GREEN} Build & Push Complete!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "Images available at:"
echo -e "  ${YELLOW}https://hub.docker.com/r/${DOCKER_HUB_USERNAME}/${IMAGE_NAME}${NC}"
echo ""
echo -e "Pull commands:"
echo -e "  docker pull ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}:latest  ${GREEN}# Production${NC}"
echo -e "  docker pull ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}:dev     ${GREEN}# Development${NC}"
echo -e "  docker pull ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}:${VERSION}  ${GREEN}# Specific version${NC}"
echo ""
