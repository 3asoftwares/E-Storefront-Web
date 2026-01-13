# 🔄 CI/CD Pipeline Documentation

## Overview

This document explains the Continuous Integration and Continuous Deployment (CI/CD) pipeline implemented using GitHub Actions for the E-Storefront application.

---

## 🎯 What is CI/CD?

### Continuous Integration (CI)

**What:** Automatically build and test code changes when pushed to the repository.

**Why:**
| Benefit | Description |
|---------|-------------|
| **Early Bug Detection** | Find issues before they reach production |
| **Code Quality** | Enforce standards with automated checks |
| **Fast Feedback** | Developers know immediately if something breaks |
| **Confidence** | Changes are validated before merging |

### Continuous Deployment (CD)

**What:** Automatically deploy validated code to staging/production environments.

**Why:**
| Benefit | Description |
|---------|-------------|
| **Speed** | Faster time to production |
| **Reliability** | Consistent, repeatable deployments |
| **Reduced Risk** | Small, incremental changes |
| **Efficiency** | No manual deployment steps |

---

## 🏗️ Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CI/CD PIPELINE FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

  TRIGGER                    CONTINUOUS INTEGRATION                    CD
  ───────                    ──────────────────────                    ──
     │                                 │                                │
     │    ┌─────────┐    ┌─────────┐    ┌─────────┐                    │
     ├───▶│  Push   │───▶│  Lint   │───▶│  Test   │                    │
     │    │ to PR   │    │ & Type  │    │Coverage │                    │
     │    └─────────┘    │  Check  │    └────┬────┘                    │
     │                   └─────────┘         │                         │
     │                                       │                         │
     │    ┌─────────────────────────────────┘                         │
     │    │                                                            │
     │    ▼                                                            │
     │  ┌─────────┐    ┌─────────┐                                    │
     │  │  Build  │───▶│ Docker  │                                    │
     │  │   App   │    │ Build   │                                    │
     │  └─────────┘    └────┬────┘                                    │
     │                      │                                          │
     │                      │           CONTINUOUS DEPLOYMENT          │
     │    ┌─────────┐      │           ─────────────────────          │
     └───▶│ Push to │      │                    │                      │
          │  Main   │──────┤                    │                      │
          └─────────┘      │                    ▼                      │
                           │              ┌──────────┐                 │
                           │              │  Push    │                 │
                           └─────────────▶│  Image   │                 │
                                          │  to GHCR │                 │
                                          └────┬─────┘                 │
                                               │                       │
                         ┌─────────────────────┼───────────────────┐   │
                         ▼                     ▼                   ▼   │
                   ┌──────────┐          ┌──────────┐        ┌──────────┐
                   │ Deploy   │          │ Deploy   │        │ Deploy   │
                   │ Staging  │────────▶│Production│        │ Vercel   │
                   └──────────┘ Manual   └──────────┘        └──────────┘
                                Approval
```

---

## 📁 Workflow Files

### Directory Structure

```
.github/
├── workflows/
│   ├── ci.yml              # Continuous Integration
│   └── cd.yml              # Continuous Deployment
├── PULL_REQUEST_TEMPLATE.md
└── ISSUE_TEMPLATE/
    ├── bug_report.md
    └── feature_request.md
```

---

## 🔵 CI Workflow (ci.yml)

### Workflow Overview

| Job | Purpose | Runs On |
|-----|---------|---------|
| **lint** | ESLint + TypeScript check | Every push/PR |
| **test** | Unit tests + coverage | After lint |
| **build** | Build application | After test |
| **docker-build** | Test Docker build | After test |
| **security** | Security scanning | After lint |

### Workflow Configuration

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches:
      - main
      - develop
      - 'feature/**'
      - 'release/**'
  pull_request:
    branches:
      - main
      - develop

env:
  NODE_VERSION: '20'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # ================================================
  # LINT & TYPE CHECK
  # ================================================
  lint:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run TypeScript type check
        run: npx tsc --noEmit

  # ================================================
  # UNIT TESTS
  # ================================================
  test:
    name: Unit Tests
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests with coverage
        run: npm run test:coverage

      - name: Upload coverage reports
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./coverage/lcov.info
          flags: unittests
          name: storefront-coverage
          fail_ci_if_error: false

      - name: Upload coverage artifacts
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/
          retention-days: 7

  # ================================================
  # BUILD APPLICATION
  # ================================================
  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

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
          NEXT_PUBLIC_AUTH_SERVICE_URL: ${{ secrets.NEXT_PUBLIC_AUTH_SERVICE_URL }}
          NEXT_PUBLIC_GRAPHQL_URL: ${{ secrets.NEXT_PUBLIC_GRAPHQL_URL }}
          NEXT_PUBLIC_GOOGLE_CLIENT_ID: ${{ secrets.NEXT_PUBLIC_GOOGLE_CLIENT_ID }}

  # ================================================
  # DOCKER BUILD TEST
  # ================================================
  docker-build:
    name: Docker Build Test
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build Docker image (test)
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile.prod
          push: false
          tags: ${{ env.IMAGE_NAME }}:test
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # ================================================
  # SECURITY SCAN
  # ================================================
  security:
    name: Security Scan
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run npm audit
        run: npm audit --audit-level=high
        continue-on-error: true

      - name: Run Dependency Review
        uses: actions/dependency-review-action@v4
        if: github.event_name == 'pull_request'
```

---

## 🟢 CD Workflow (cd.yml)

### Workflow Overview

| Job | Purpose | Trigger |
|-----|---------|---------|
| **build-and-push** | Build and push Docker image | Push to main |
| **deploy-staging** | Deploy to staging environment | After build |
| **deploy-production** | Deploy to production | Manual trigger |

### Workflow Configuration

```yaml
# .github/workflows/cd.yml
name: CD

on:
  push:
    branches:
      - main
    paths-ignore:
      - '**.md'
      - '.gitignore'
      - 'docs/**'
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deployment environment'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production

env:
  NODE_VERSION: '20'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # ================================================
  # BUILD AND PUSH DOCKER IMAGE
  # ================================================
  build-and-push:
    name: Build & Push Docker Image
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    outputs:
      image_tag: ${{ steps.meta.outputs.tags }}
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata for Docker
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=sha,prefix=
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile.prod
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          build-args: |
            NEXT_PUBLIC_ENV=production
            NEXT_PUBLIC_AUTH_SERVICE_URL=${{ secrets.NEXT_PUBLIC_AUTH_SERVICE_URL }}
            NEXT_PUBLIC_GRAPHQL_URL=${{ secrets.NEXT_PUBLIC_GRAPHQL_URL }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          platforms: linux/amd64,linux/arm64

  # ================================================
  # DEPLOY TO STAGING
  # ================================================
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: build-and-push
    environment:
      name: staging
      url: ${{ vars.STAGING_URL }}
    steps:
      - name: Deploy to Staging Server
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USER }}
          key: ${{ secrets.STAGING_SSH_KEY }}
          script: |
            cd ${{ secrets.STAGING_DEPLOY_PATH }}
            docker pull ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
            docker compose -f docker-compose.prod.yml down
            docker compose -f docker-compose.prod.yml up -d
            docker system prune -f

      - name: Health Check
        run: |
          sleep 30
          curl -f ${{ vars.STAGING_URL }} || exit 1

  # ================================================
  # DEPLOY TO PRODUCTION (Manual Trigger)
  # ================================================
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [build-and-push, deploy-staging]
    if: github.event_name == 'workflow_dispatch' && github.event.inputs.environment == 'production'
    environment:
      name: production
      url: ${{ vars.PRODUCTION_URL }}
    steps:
      - name: Deploy to Production Server
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.PRODUCTION_HOST }}
          username: ${{ secrets.PRODUCTION_USER }}
          key: ${{ secrets.PRODUCTION_SSH_KEY }}
          script: |
            cd ${{ secrets.PRODUCTION_DEPLOY_PATH }}
            docker pull ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
            docker compose -f docker-compose.prod.yml down
            docker compose -f docker-compose.prod.yml up -d
            docker system prune -f
```

---

## 🔐 Required Secrets

### GitHub Repository Secrets

Configure in **Settings → Secrets and variables → Actions**:

| Secret | Description |
|--------|-------------|
| `NEXT_PUBLIC_AUTH_SERVICE_URL` | Auth service URL |
| `NEXT_PUBLIC_GRAPHQL_URL` | GraphQL API URL |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `STAGING_HOST` | Staging server hostname |
| `STAGING_USER` | Staging SSH username |
| `STAGING_SSH_KEY` | Staging SSH private key |
| `STAGING_DEPLOY_PATH` | Deployment path on staging |
| `PRODUCTION_HOST` | Production server hostname |
| `PRODUCTION_USER` | Production SSH username |
| `PRODUCTION_SSH_KEY` | Production SSH private key |
| `PRODUCTION_DEPLOY_PATH` | Deployment path on production |
| `CODECOV_TOKEN` | Codecov upload token |
| `SLACK_WEBHOOK_URL` | Slack notifications (optional) |

### Environment Variables

Configure in **Settings → Environments**:

| Variable | Environment |
|----------|-------------|
| `STAGING_URL` | staging |
| `PRODUCTION_URL` | production |

---

## 📊 Pipeline Stages

### Stage 1: Code Quality (Lint)

```
┌─────────────────────────────────────────────────────────────┐
│                    LINT & TYPE CHECK                         │
├─────────────────────────────────────────────────────────────┤
│  1. Checkout code                                           │
│  2. Setup Node.js with cache                                │
│  3. Install dependencies (npm ci)                           │
│  4. Run ESLint                                              │
│  5. Run TypeScript type check                               │
└─────────────────────────────────────────────────────────────┘
```

### Stage 2: Testing

```
┌─────────────────────────────────────────────────────────────┐
│                      UNIT TESTS                              │
├─────────────────────────────────────────────────────────────┤
│  1. Run Jest with coverage                                  │
│  2. Generate coverage report                                │
│  3. Upload to Codecov                                       │
│  4. Store artifacts                                         │
│  5. Fail if coverage < threshold                           │
└─────────────────────────────────────────────────────────────┘
```

### Stage 3: Build

```
┌─────────────────────────────────────────────────────────────┐
│                    BUILD APPLICATION                         │
├─────────────────────────────────────────────────────────────┤
│  1. Install dependencies                                    │
│  2. Run Next.js build                                       │
│  3. Inject environment variables                            │
│  4. Store build artifacts                                   │
└─────────────────────────────────────────────────────────────┘
```

### Stage 4: Docker

```
┌─────────────────────────────────────────────────────────────┐
│                     DOCKER BUILD                             │
├─────────────────────────────────────────────────────────────┤
│  1. Setup Docker Buildx                                     │
│  2. Login to GitHub Container Registry                      │
│  3. Build multi-platform image (amd64, arm64)              │
│  4. Push to registry with tags                              │
│  5. Cache layers for faster builds                          │
└─────────────────────────────────────────────────────────────┘
```

### Stage 5: Deploy

```
┌─────────────────────────────────────────────────────────────┐
│                      DEPLOYMENT                              │
├─────────────────────────────────────────────────────────────┤
│  1. SSH into server                                         │
│  2. Pull latest image                                       │
│  3. Stop existing containers                                │
│  4. Start new containers                                    │
│  5. Run health check                                        │
│  6. Cleanup old images                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Workflow Triggers

| Trigger | CI | CD |
|---------|----|----|
| Push to `main` | ✅ | ✅ |
| Push to `develop` | ✅ | ❌ |
| Push to `feature/*` | ✅ | ❌ |
| Pull Request | ✅ | ❌ |
| Manual Dispatch | ❌ | ✅ |
| Tag Release | ❌ | ✅ |

---

## 📈 Monitoring & Notifications

### Build Status Badge

```markdown
![CI](https://github.com/your-org/e-storefront-web/actions/workflows/ci.yml/badge.svg)
```

### Slack Notifications

```yaml
- name: Notify Slack
  uses: slackapi/slack-github-action@v1.25.0
  with:
    payload: |
      {
        "text": "Deployment ${{ job.status }}",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Deployment Status*\nEnvironment: ${{ matrix.environment }}\nStatus: ${{ job.status }}"
            }
          }
        ]
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

## 🛠️ Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **npm ci fails** | Clear cache, check lockfile |
| **Tests timeout** | Increase Jest timeout |
| **Docker build fails** | Check Dockerfile syntax |
| **Deploy fails** | Verify SSH keys and paths |
| **Coverage too low** | Write more tests |

### Debug Mode

```yaml
- name: Debug
  run: |
    echo "Event: ${{ github.event_name }}"
    echo "Ref: ${{ github.ref }}"
    echo "SHA: ${{ github.sha }}"
```

---

## 📚 Related Documentation

- [Docker Implementation](docker-implementation.md)
- [Deployment](deployment.md)
- [Testing](testing.md)
