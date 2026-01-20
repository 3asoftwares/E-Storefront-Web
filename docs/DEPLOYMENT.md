# Deployment Guide

This document provides comprehensive instructions for deploying the E-Storefront Web application to various environments.

## 📋 Table of Contents

- [Deployment Options](#deployment-options)
- [Prerequisites](#prerequisites)
- [Vercel Deployment](#vercel-deployment)
- [Docker Deployment](#docker-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Environment Configuration](#environment-configuration)
- [Post-Deployment Checklist](#post-deployment-checklist)
- [Rollback Procedures](#rollback-procedures)
- [Monitoring](#monitoring)

---

## 🚀 Deployment Options

| Platform    | Best For                          | Complexity |
| ----------- | --------------------------------- | ---------- |
| **Vercel**  | Production, automatic scaling     | Low        |
| **Docker**  | Self-hosted, Kubernetes           | Medium     |
| **AWS ECS** | Enterprise, custom infrastructure | High       |

---

## 📦 Prerequisites

### General Requirements

- Node.js >= 20.x
- npm >= 10.x
- Git repository access
- Environment variables configured

### Platform-Specific

| Platform | Requirements                             |
| -------- | ---------------------------------------- |
| Vercel   | Vercel account, GitHub/GitLab connection |
| Docker   | Docker Engine 24+, Docker Compose 2.x    |
| AWS      | AWS CLI, ECS/ECR access                  |

---

## ☁️ Vercel Deployment

### Initial Setup

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Import Project"
   - Select your Git repository
   - Choose the `E-Storefront-Web` folder

2. **Configure Project**

   ```
   Framework Preset: Next.js
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm ci
   ```

3. **Set Environment Variables**

   Navigate to Project Settings → Environment Variables and add:

   | Variable                       | Production                            | Preview                                       |
   | ------------------------------ | ------------------------------------- | --------------------------------------------- |
   | `NEXT_PUBLIC_ENV`              | `production`                          | `preview`                                     |
   | `NEXT_PUBLIC_GRAPHQL_URL`      | `https://api.3asoftwares.com/graphql` | `https://staging-api.3asoftwares.com/graphql` |
   | `NEXT_PUBLIC_AUTH_SERVICE_URL` | `https://auth.3asoftwares.com`        | `https://staging-auth.3asoftwares.com`        |
   | `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `<your-client-id>`                    | `<your-client-id>`                            |
   | `NEXT_PUBLIC_SITE_URL`         | `https://shop.3asoftwares.com`        | Auto-generated                                |

### Deployment Configuration

**vercel.json**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "devCommand": "npm run dev",
  "regions": ["iad1"],
  "git": {
    "deploymentEnabled": true
  }
}
```

### Automatic Deployments

| Branch      | Environment | URL                    |
| ----------- | ----------- | ---------------------- |
| `main`      | Production  | `shop.3asoftwares.com` |
| `develop`   | Preview     | Auto-generated         |
| `feature/*` | Preview     | Auto-generated         |

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## 🐳 Docker Deployment

### Development Environment

**Start Development Container:**

```bash
# Using docker-compose
docker-compose up storefront-dev

# Or build and run directly
docker build -f Dockerfile -t storefront-dev .
docker run -p 3004:3004 -v $(pwd):/app storefront-dev
```

**docker-compose.yml (development):**

```yaml
services:
  storefront-dev:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: storefront-dev
    ports:
      - '3004:3004'
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_ENV=development
      - NEXT_PUBLIC_GRAPHQL_URL=${NEXT_PUBLIC_GRAPHQL_URL:-http://localhost:4000/graphql}
```

### Production Deployment

**Build Production Image:**

```bash
# Build with build arguments
docker build \
  --build-arg NEXT_PUBLIC_ENV=production \
  --build-arg NEXT_PUBLIC_GRAPHQL_URL=https://api.3asoftwares.com/graphql \
  --build-arg NEXT_PUBLIC_AUTH_SERVICE_URL=https://auth.3asoftwares.com \
  --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id \
  -f Dockerfile.prod \
  -t storefront:latest .
```

**Run Production Container:**

```bash
docker run -d \
  --name storefront-prod \
  -p 3004:3004 \
  --restart unless-stopped \
  storefront:latest
```

**docker-compose.yml (production):**

```yaml
services:
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
      - '3004:3004'
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

**Deploy with Docker Compose:**

```bash
# Production deployment
docker-compose --profile production up -d storefront-prod

# View logs
docker-compose logs -f storefront-prod

# Stop
docker-compose down
```

### Multi-Stage Dockerfile

The production Dockerfile uses multi-stage builds for optimization:

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_ENV
ARG NEXT_PUBLIC_GRAPHQL_URL
ENV NEXT_PUBLIC_ENV=${NEXT_PUBLIC_ENV}
ENV NEXT_PUBLIC_GRAPHQL_URL=${NEXT_PUBLIC_GRAPHQL_URL}
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3004
CMD ["node", "server.js"]
```

### Container Registry

**Push to Docker Hub:**

```bash
docker tag storefront:latest 3asoftwares/storefront:latest
docker push 3asoftwares/storefront:latest
```

**Push to AWS ECR:**

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker tag storefront:latest <account>.dkr.ecr.us-east-1.amazonaws.com/storefront:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/storefront:latest
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

**.github/workflows/deploy.yml**

```yaml
name: Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint:ci

      - name: Run type check
        run: npm run type-check

      - name: Run tests
        run: npm run test:coverage

      - name: Upload coverage to SonarCloud
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_ENV: production
          NEXT_PUBLIC_GRAPHQL_URL: ${{ secrets.NEXT_PUBLIC_GRAPHQL_URL }}
          NEXT_PUBLIC_AUTH_SERVICE_URL: ${{ secrets.NEXT_PUBLIC_AUTH_SERVICE_URL }}
          NEXT_PUBLIC_GOOGLE_CLIENT_ID: ${{ secrets.NEXT_PUBLIC_GOOGLE_CLIENT_ID }}

  deploy-docker:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile.prod
          push: true
          tags: 3asoftwares/storefront:latest
          build-args: |
            NEXT_PUBLIC_ENV=production
            NEXT_PUBLIC_GRAPHQL_URL=${{ secrets.NEXT_PUBLIC_GRAPHQL_URL }}
            NEXT_PUBLIC_AUTH_SERVICE_URL=${{ secrets.NEXT_PUBLIC_AUTH_SERVICE_URL }}
            NEXT_PUBLIC_GOOGLE_CLIENT_ID=${{ secrets.NEXT_PUBLIC_GOOGLE_CLIENT_ID }}
```

### Pipeline Stages

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    Lint     │────▶│    Test     │────▶│    Build    │────▶│   Deploy    │
│   & Type    │     │  & Coverage │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

---

## ⚙️ Environment Configuration

### Production Environment Variables

| Variable                       | Required | Description                     |
| ------------------------------ | -------- | ------------------------------- |
| `NEXT_PUBLIC_ENV`              | Yes      | Environment name (`production`) |
| `NEXT_PUBLIC_GRAPHQL_URL`      | Yes      | GraphQL API endpoint            |
| `NEXT_PUBLIC_AUTH_SERVICE_URL` | Yes      | Authentication service URL      |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Yes      | Google OAuth client ID          |
| `NEXT_PUBLIC_SITE_URL`         | Yes      | Public site URL for SEO         |

### Environment File Example

**.env.production**

```bash
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_GRAPHQL_URL=https://api.3asoftwares.com/graphql
NEXT_PUBLIC_AUTH_SERVICE_URL=https://auth.3asoftwares.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
NEXT_PUBLIC_SITE_URL=https://shop.3asoftwares.com
```

---

## ✅ Post-Deployment Checklist

### Functional Verification

- [ ] Home page loads correctly
- [ ] Product listing displays products
- [ ] Product detail pages work
- [ ] Search functionality works
- [ ] Cart operations work
- [ ] User authentication works
- [ ] Checkout flow completes
- [ ] Order history displays

### Performance Verification

- [ ] Page load time < 3 seconds
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1

### Security Verification

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] API endpoints secured
- [ ] No sensitive data in logs

### Monitoring Verification

- [ ] Error tracking active
- [ ] Performance monitoring active
- [ ] Logs accessible
- [ ] Alerts configured

---

## ⏪ Rollback Procedures

### Vercel Rollback

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback <deployment-url>
```

Or via Vercel Dashboard:

1. Go to Deployments
2. Find the previous stable deployment
3. Click "..." → "Promote to Production"

### Docker Rollback

```bash
# List available images
docker images storefront

# Stop current container
docker stop storefront-prod

# Run previous version
docker run -d \
  --name storefront-prod \
  -p 3004:3004 \
  storefront:previous-tag

# Or with docker-compose, update image tag and:
docker-compose up -d storefront-prod
```

### Git Rollback

```bash
# Revert last commit
git revert HEAD

# Or reset to specific commit
git reset --hard <commit-hash>
git push --force origin main
```

---

## 📊 Monitoring

### Health Check Endpoint

Implement a health check endpoint:

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
  });
}
```

### Recommended Monitoring Tools

| Tool                 | Purpose              |
| -------------------- | -------------------- |
| **Vercel Analytics** | Performance, traffic |
| **Sentry**           | Error tracking       |
| **LogRocket**        | Session replay       |
| **Datadog**          | APM, logs            |

### Key Metrics to Monitor

- Response time (p50, p95, p99)
- Error rate
- Request volume
- CPU/Memory usage
- Core Web Vitals

---

## 📚 Related Documentation

- [ENVIRONMENT.md](ENVIRONMENT.md) - Environment configuration
- [SECURITY.md](SECURITY.md) - Security considerations
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
