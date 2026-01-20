# Docker Hub Setup Guide

## Overview

This guide explains how to set up the E-Storefront application on a new machine (Windows or Mac) using pre-built Docker images from Docker Hub. This ensures consistent environments across all development machines.

---

## Prerequisites

1. **Docker Desktop** installed
   - Windows: [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
   - Mac: [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)

2. **Git** for cloning the repository

---

## Quick Start

### Option 1: Development Environment (Recommended for developers)

```bash
# 1. Clone the repository
git clone https://github.com/3asoftwares/E-Storefront-Web.git
cd E-Storefront-Web

# 2. Copy environment file
cp .env.example .env.local

# 3. Pull and run development image
docker-compose -f docker-compose.hub.yml up storefront-dev
```

This will:

- Pull the pre-built dev image from Docker Hub (`3asoftwares/storefront:dev`)
- Mount your local source code for hot-reload
- Use the container's pre-installed `node_modules`
- Start the development server at http://localhost:3004

### Option 2: Production Environment (For testing/staging)

```bash
# Pull and run production image
docker-compose -f docker-compose.hub.yml --profile production up storefront-prod
```

---

## Docker Images

| Image                    | Tag      | Purpose          | Size   |
| ------------------------ | -------- | ---------------- | ------ |
| `3asoftwares/storefront` | `latest` | Production       | ~100MB |
| `3asoftwares/storefront` | `dev`    | Development      | ~1.2GB |
| `3asoftwares/storefront` | `v1.1.0` | Specific version | ~100MB |

### Pulling Images Manually

```bash
# Pull development image
docker pull 3asoftwares/storefront:dev

# Pull production image
docker pull 3asoftwares/storefront:latest

# Pull specific version
docker pull 3asoftwares/storefront:v1.1.0
```

---

## Multi-Platform Support

Our images are built for both architectures:

- **linux/amd64** - Intel/AMD (Windows, Intel Macs)
- **linux/arm64** - Apple Silicon (M1/M2/M3 Macs)

Docker automatically pulls the correct image for your machine.

---

## Environment Configuration

### 1. Create Environment File

```bash
cp .env.example .env.local
```

### 2. Edit Environment Variables

```env
# .env.local

# Backend Services (use host.docker.internal from inside container)
NEXT_PUBLIC_AUTH_SERVICE_URL=http://host.docker.internal:3011
NEXT_PUBLIC_GRAPHQL_URL=http://host.docker.internal:4000/graphql

# Google OAuth (optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

# Environment
NEXT_PUBLIC_ENV=development
```

### Connecting to Local Backend Services

When running backend services on your host machine:

- Use `host.docker.internal` instead of `localhost`
- This works on both Windows and Mac

```env
NEXT_PUBLIC_GRAPHQL_URL=http://host.docker.internal:4000/graphql
```

---

## Development Workflow

### Starting Development Server

```bash
# Start development container
docker-compose -f docker-compose.hub.yml up storefront-dev

# Or in detached mode
docker-compose -f docker-compose.hub.yml up -d storefront-dev
```

### Viewing Logs

```bash
docker-compose -f docker-compose.hub.yml logs -f storefront-dev
```

### Stopping

```bash
docker-compose -f docker-compose.hub.yml down
```

### Rebuilding After Package Changes

If `package.json` changes, you need to rebuild the dev image:

```bash
# Option 1: Pull latest dev image (if updated on Docker Hub)
docker pull 3asoftwares/storefront:dev

# Option 2: Build locally
docker-compose build storefront-dev
```

---

## Commands Reference

### Docker Compose Commands

```bash
# Start development
docker-compose -f docker-compose.hub.yml up storefront-dev

# Start production
docker-compose -f docker-compose.hub.yml --profile production up storefront-prod

# Start in background
docker-compose -f docker-compose.hub.yml up -d storefront-dev

# View logs
docker-compose -f docker-compose.hub.yml logs -f

# Stop all services
docker-compose -f docker-compose.hub.yml down

# Stop and remove volumes
docker-compose -f docker-compose.hub.yml down -v
```

### Direct Docker Commands

```bash
# Run dev container directly
docker run -it -p 3004:3004 \
  -v $(pwd):/app \
  -v /app/node_modules \
  -e NEXT_PUBLIC_GRAPHQL_URL=http://host.docker.internal:4000/graphql \
  3asoftwares/storefront:dev

# Run production container
docker run -d -p 3004:3004 3asoftwares/storefront:latest

# Execute shell in running container
docker exec -it storefront-dev sh

# View running containers
docker ps
```

---

## Troubleshooting

### Hot Reload Not Working (Windows/Mac)

The dev image has polling enabled by default. If issues persist:

```bash
# Set environment variables explicitly
docker-compose -f docker-compose.hub.yml up storefront-dev \
  -e WATCHPACK_POLLING=true \
  -e CHOKIDAR_USEPOLLING=true
```

### Permission Errors on Linux

```bash
# Run with current user
docker-compose -f docker-compose.hub.yml run --user $(id -u):$(id -g) storefront-dev
```

### Container Can't Connect to Host Services

Use `host.docker.internal` in your `.env.local`:

```env
NEXT_PUBLIC_GRAPHQL_URL=http://host.docker.internal:4000/graphql
```

### Image Pull Errors

```bash
# Login to Docker Hub
docker login

# Then pull
docker pull 3asoftwares/storefront:dev
```

### Clearing Docker Cache

```bash
# Remove all stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Remove everything (nuclear option)
docker system prune -a
```

---

## Building and Pushing Images (Maintainers)

### PowerShell (Windows)

```powershell
# Push all images
.\scripts\docker-push.ps1

# Push specific version
.\scripts\docker-push.ps1 -Version v1.1.0

# Push dev only
.\scripts\docker-push.ps1 -Version dev

# Push prod only
.\scripts\docker-push.ps1 -Version prod
```

### Bash (Mac/Linux)

```bash
# Make script executable
chmod +x ./scripts/docker-push.sh

# Push all images
./scripts/docker-push.sh

# Push specific version
./scripts/docker-push.sh v1.1.0

# Push dev only
./scripts/docker-push.sh dev
```

### Manual Build & Push

```bash
# Build multi-platform images
docker buildx create --name multiarch --use

# Build and push dev
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -f Dockerfile.dev \
  -t 3asoftwares/storefront:dev \
  --push .

# Build and push prod
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -f Dockerfile.prod \
  -t 3asoftwares/storefront:latest \
  -t 3asoftwares/storefront:v1.1.0 \
  --push .
```

---

## Image Contents

### Development Image (`dev`)

```
Node.js 20.10.0 (Alpine 3.19)
├── All npm dependencies (including devDependencies)
├── Source code
├── Hot-reload enabled
├── File watching polling (for Windows/Mac)
└── Health check configured
```

### Production Image (`latest`)

```
Node.js 20.10.0 (Alpine 3.19)
├── Standalone Next.js build
├── Production dependencies only
├── Non-root user (nextjs)
├── Health check configured
└── Optimized for size (~100MB)
```

---

## Version History

| Version  | Date       | Changes                    |
| -------- | ---------- | -------------------------- |
| `v1.1.0` | 2026-01-20 | Initial Docker Hub release |
| `dev`    | 2026-01-20 | Development environment    |

---

## Support

For issues with Docker setup:

1. Check [Troubleshooting](#troubleshooting) section
2. Open an issue at [GitHub Issues](https://github.com/3asoftwares/E-Storefront-Web/issues)
3. Contact: dev@3asoftwares.com
