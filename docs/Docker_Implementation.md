# 🐳 Docker Implementation Documentation

## Overview

This document explains the Docker containerization strategy, configuration, and usage patterns for the E-Storefront application.

---

## 🎯 Why Docker?

### Benefits for Our Application

| Benefit | Description |
|---------|-------------|
| **Consistency** | Same environment across dev, staging, production |
| **Isolation** | Dependencies don't conflict with host system |
| **Portability** | Runs anywhere Docker is installed |
| **Scalability** | Easy to replicate and load balance |
| **CI/CD Integration** | Build once, deploy anywhere |
| **Reproducibility** | Exact same build every time |

### Docker vs Traditional Deployment

| Aspect | Traditional | Docker |
|--------|-------------|--------|
| Environment setup | Manual, error-prone | Automated, consistent |
| Dependency management | System-wide | Container-scoped |
| Scaling | Complex | Simple replication |
| Rollback | Difficult | Image-based, instant |
| Resource isolation | None | Complete |

---

## 📁 Docker Files Structure

```
E-Storefront-Web/
├── Dockerfile              # Development container
├── Dockerfile.prod         # Production container (multi-stage)
├── docker-compose.yml      # Local development orchestration
├── docker-compose.prod.yml # Production deployment
└── .dockerignore           # Build context exclusions
```

---

## 🔧 Development Dockerfile

### Purpose

- Hot module reload for rapid development
- Volume mounting for live code changes
- Development dependencies included

### Configuration

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies for native modules
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package*.json ./
COPY package-lock.json* ./
COPY yarn.lock* ./
COPY pnpm-lock.yaml* ./

# Install dependencies based on available lockfile
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "No lockfile found" && exit 1; \
  fi

# Copy source code
COPY . .

# Expose port
EXPOSE 3003

# Set environment variables
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3003
ENV HOSTNAME="0.0.0.0"

# Start development server
CMD ["npm", "run", "dev"]
```

### Key Features

| Feature | Implementation |
|---------|----------------|
| **Base Image** | `node:20-alpine` (lightweight) |
| **Native Modules** | `libc6-compat` for compatibility |
| **Lock File Support** | npm, yarn, and pnpm |
| **Hot Reload** | `npm run dev` with volume mount |
| **Port** | 3003 |

---

## 🚀 Production Dockerfile

### Purpose

- Optimized for production deployment
- Multi-stage build for smaller image size
- Security hardened with non-root user

### Configuration

```dockerfile
# Dockerfile.prod
# ========================================
# Stage 1: Dependencies
# ========================================
FROM node:20-alpine AS deps

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package*.json ./
COPY package-lock.json* ./
COPY yarn.lock* ./
COPY pnpm-lock.yaml* ./

RUN \
  if [ -f package-lock.json ]; then npm ci --include=dev; \
  elif [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "No lockfile found" && exit 1; \
  fi

# ========================================
# Stage 2: Builder
# ========================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_ENV=production
ARG NEXT_PUBLIC_AUTH_SERVICE_URL
ARG NEXT_PUBLIC_GRAPHQL_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID

ENV NEXT_PUBLIC_ENV=${NEXT_PUBLIC_ENV}
ENV NEXT_PUBLIC_AUTH_SERVICE_URL=${NEXT_PUBLIC_AUTH_SERVICE_URL}
ENV NEXT_PUBLIC_GRAPHQL_URL=${NEXT_PUBLIC_GRAPHQL_URL}
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ========================================
# Stage 3: Runner
# ========================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3003
ENV HOSTNAME="0.0.0.0"

# Security: Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built assets
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3003

CMD ["node", "server.js"]
```

### Multi-Stage Build Benefits

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      MULTI-STAGE BUILD                                   │
└─────────────────────────────────────────────────────────────────────────┘

  Stage 1: DEPS           Stage 2: BUILDER           Stage 3: RUNNER
  ─────────────           ─────────────────          ─────────────────
  ┌─────────────┐         ┌─────────────┐            ┌─────────────┐
  │ node:alpine │         │ node:alpine │            │ node:alpine │
  │             │         │             │            │             │
  │ node_modules│ ──────▶ │ node_modules│            │ server.js   │
  │ (~500MB)    │         │ source code │ ──────▶    │ static/     │
  │             │         │ .next build │            │ public/     │
  └─────────────┘         └─────────────┘            └─────────────┘
                                                     
                                                     Final: ~150MB
```

| Stage | Purpose | Size |
|-------|---------|------|
| **deps** | Install all dependencies | ~500MB |
| **builder** | Build Next.js application | ~800MB |
| **runner** | Production runtime only | ~150MB |

### Security Features

| Feature | Implementation |
|---------|----------------|
| **Non-root user** | `nextjs:nodejs` (UID 1001) |
| **Minimal image** | Alpine Linux base |
| **No dev deps** | Only production files copied |
| **File ownership** | Proper chown for files |

---

## 🐙 Docker Compose

### Development Configuration

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Development mode with hot reload
  storefront-dev:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: storefront-dev
    ports:
      - "3003:3003"
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_ENV=development
      - NEXT_PUBLIC_AUTH_SERVICE_URL=${NEXT_PUBLIC_AUTH_SERVICE_URL}
      - NEXT_PUBLIC_GRAPHQL_URL=${NEXT_PUBLIC_GRAPHQL_URL}
      - NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}
    profiles:
      - dev

  # Production mode
  storefront-prod:
    build:
      context: .
      dockerfile: Dockerfile.prod
      args:
        - NEXT_PUBLIC_ENV=production
        - NEXT_PUBLIC_AUTH_SERVICE_URL=${NEXT_PUBLIC_AUTH_SERVICE_URL}
        - NEXT_PUBLIC_GRAPHQL_URL=${NEXT_PUBLIC_GRAPHQL_URL}
        - NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}
    container_name: storefront-prod
    ports:
      - "3003:3003"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    profiles:
      - prod

  # Test mode
  storefront-test:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: storefront-test
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=test
    command: npm run test:coverage
    profiles:
      - test
```

### Production Compose

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  storefront:
    image: ghcr.io/your-org/e-storefront-web:latest
    container_name: storefront-production
    ports:
      - "3003:3003"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3003"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

---

## 🏃 Usage Commands

### Development

```bash
# Start development server
docker compose --profile dev up

# Rebuild and start
docker compose --profile dev up --build

# Run in background
docker compose --profile dev up -d

# View logs
docker compose --profile dev logs -f

# Stop containers
docker compose --profile dev down
```

### Production

```bash
# Build production image
docker compose --profile prod build

# Start production container
docker compose --profile prod up -d

# Or use production compose file
docker compose -f docker-compose.prod.yml up -d
```

### Testing

```bash
# Run tests in container
docker compose --profile test up

# Run tests and exit
docker compose --profile test run --rm storefront-test
```

### Direct Docker Commands

```bash
# Build image
docker build -t storefront-dev -f Dockerfile .
docker build -t storefront-prod -f Dockerfile.prod .

# Run container
docker run -p 3003:3003 storefront-dev
docker run -p 3003:3003 storefront-prod

# Interactive shell
docker run -it storefront-dev sh

# Check running containers
docker ps

# Stop all containers
docker stop $(docker ps -q)

# Remove stopped containers
docker container prune

# Remove unused images
docker image prune
```

---

## 📋 .dockerignore

```dockerfile
# .dockerignore
# Dependencies
node_modules
.pnp
.pnp.js

# Build outputs
.next
out
build
dist
*.tsbuildinfo

# Testing
coverage
.nyc_output

# Git
.git
.gitignore

# Environment files
.env
.env.*
!.env.example

# IDE and editors
.vscode
.idea
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Documentation
docs
*.md
!README.md

# Docker files (prevent recursion)
Dockerfile*
docker-compose*
.docker

# Logs
logs
*.log

# Test files
tests
__tests__
*.test.ts
*.test.tsx
*.spec.ts
*.spec.tsx

# Misc
.husky
.github
```

---

## 🔧 Environment Variables

### Build-Time Args

```dockerfile
ARG NEXT_PUBLIC_ENV=production
ARG NEXT_PUBLIC_AUTH_SERVICE_URL
ARG NEXT_PUBLIC_GRAPHQL_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
```

### Runtime Environment

```yaml
# docker-compose.yml
environment:
  - NODE_ENV=production
  - NEXT_PUBLIC_ENV=production
  - NEXT_PUBLIC_AUTH_SERVICE_URL=${NEXT_PUBLIC_AUTH_SERVICE_URL}
  - NEXT_PUBLIC_GRAPHQL_URL=${NEXT_PUBLIC_GRAPHQL_URL}
  - NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}
```

### Using .env File

```bash
# Create .env file
NEXT_PUBLIC_AUTH_SERVICE_URL=https://auth.example.com
NEXT_PUBLIC_GRAPHQL_URL=https://api.example.com/graphql
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id

# Docker Compose reads .env automatically
docker compose --profile prod up
```

---

## 📊 Image Size Optimization

### Optimization Techniques

| Technique | Impact |
|-----------|--------|
| **Alpine base** | 5MB vs 900MB (Debian) |
| **Multi-stage** | Only runtime files |
| **Standalone output** | No node_modules |
| **.dockerignore** | Smaller build context |
| **Layer caching** | Faster rebuilds |

### Size Comparison

```
┌──────────────────────────────────────────────┐
│              IMAGE SIZE COMPARISON            │
├──────────────────────────────────────────────┤
│ Development (node:20)          ~1.5 GB       │
│ Development (node:20-alpine)   ~800 MB       │
│ Production (multi-stage)       ~150 MB       │ ✓
└──────────────────────────────────────────────┘
```

---

## 🏥 Health Checks

```yaml
# docker-compose.prod.yml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3003"]
  interval: 30s      # Check every 30 seconds
  timeout: 10s       # Wait 10 seconds for response
  retries: 3         # Fail after 3 retries
  start_period: 40s  # Wait 40 seconds before first check
```

---

## 🔍 Debugging

### Access Container Shell

```bash
# Running container
docker exec -it storefront-dev sh

# New container
docker run -it --entrypoint sh storefront-dev
```

### View Logs

```bash
# All logs
docker logs storefront-dev

# Follow logs
docker logs -f storefront-dev

# Last 100 lines
docker logs --tail 100 storefront-dev
```

### Inspect Container

```bash
# Container info
docker inspect storefront-dev

# Resource usage
docker stats storefront-dev

# Running processes
docker top storefront-dev
```

---

## 📚 Related Documentation

- [CI/CD Pipeline](ci-cd-pipeline.md)
- [Deployment](deployment.md)
- [Architecture](architecture.md)
