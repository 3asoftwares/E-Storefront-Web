# CI/CD Documentation

Continuous Integration and Deployment pipelines for E-Storefront Web.

---

## 📑 Table of Contents

- [Overview](#overview)
- [GitHub Actions Workflows](#github-actions-workflows)
- [Pipeline Stages](#pipeline-stages)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Docker Hub Integration](#docker-hub-integration)

---

## 🌐 Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CI/CD PIPELINE                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Push/PR          Build          Test          Deploy                       │
│  ┌────────┐      ┌────────┐     ┌────────┐    ┌─────────────────────────┐  │
│  │ GitHub │ ──▶  │ Build  │ ──▶ │ Tests  │ ──▶│ Vercel (Preview/Prod)  │  │
│  │ Action │      │ Next.js│     │ Lint   │    │ Docker Hub             │  │
│  └────────┘      └────────┘     │ Type   │    └─────────────────────────┘  │
│                                 └────────┘                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ⚙️ GitHub Actions Workflows

### CI Workflow (`.github/workflows/ci.yml`)

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Type check
        run: yarn type-check

      - name: Lint
        run: yarn lint:ci

      - name: Run tests
        run: yarn test:coverage

      - name: Build
        run: yarn build
        env:
          NEXT_PUBLIC_GRAPHQL_API: ${{ secrets.NEXT_PUBLIC_GRAPHQL_API }}

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info
```

### Docker Build Workflow

```yaml
name: Docker Build

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  docker:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

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
          tags: |
            3asoftwares/storefront:latest
            3asoftwares/storefront:${{ github.sha }}
```

---

## 🔄 Pipeline Stages

### 1. Install

```bash
yarn install --frozen-lockfile
```

### 2. Type Check

```bash
yarn type-check
# Runs: tsc --noEmit
```

### 3. Lint

```bash
yarn lint:ci
# Runs: eslint app components lib store --max-warnings 100
```

### 4. Test

```bash
yarn test:coverage
# Runs: jest --coverage
```

### 5. Build

```bash
yarn build
# Runs: next build
```

### 6. E2E Tests (Optional)

```bash
yarn cy:e2e
# Runs Cypress E2E tests against dev server
```

---

## 🔐 Environment Variables

### GitHub Secrets Required

| Secret                    | Description             |
| ------------------------- | ----------------------- |
| `NEXT_PUBLIC_GRAPHQL_API` | GraphQL API endpoint    |
| `DOCKER_USERNAME`         | Docker Hub username     |
| `DOCKER_TOKEN`            | Docker Hub access token |
| `VERCEL_TOKEN`            | Vercel deployment token |
| `VERCEL_ORG_ID`           | Vercel organization ID  |
| `VERCEL_PROJECT_ID`       | Vercel project ID       |
| `SONAR_TOKEN`             | SonarCloud token        |

### Vercel Environment Variables

Set in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_GRAPHQL_API=https://api.example.com/graphql
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

---

## 🚀 Deployment

### Vercel (Automatic)

- **Preview**: Every PR gets a preview deployment
- **Production**: Merges to `main` deploy to production

### Vercel CLI (Manual)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy preview
vercel

# Deploy production
vercel --prod
```

### Docker Deployment

```bash
# Pull latest image
docker pull 3asoftwares/storefront:latest

# Run container
docker run -d \
  -p 3004:3004 \
  -e NEXT_PUBLIC_GRAPHQL_API=https://api.example.com/graphql \
  3asoftwares/storefront:latest
```

---

## 🐳 Docker Hub Integration

### Images

| Tag      | Description                |
| -------- | -------------------------- |
| `latest` | Production build from main |
| `dev`    | Development build          |
| `v1.x.x` | Version tagged releases    |

### Build Commands

```bash
# Build dev image
yarn docker:build:dev

# Build prod image
yarn docker:build:prod

# Pull images
yarn docker:pull
```

---

## 📊 SonarCloud Integration

### Configuration (`sonar-project.properties`)

```properties
sonar.projectKey=3asoftwares_E-Storefront-Web
sonar.organization=3asoftwares
sonar.sources=app,components,lib,store
sonar.tests=tests
sonar.javascript.lcov.reportPaths=coverage/lcov.info
```

### Quality Gates

| Metric          | Requirement |
| --------------- | ----------- |
| Coverage        | ≥ 80%       |
| Duplications    | ≤ 3%        |
| Maintainability | A           |
| Reliability     | A           |
| Security        | A           |

---

## 🔧 Local CI Simulation

Run the full CI pipeline locally:

```bash
# Install dependencies
yarn install

# Run all checks
yarn type-check && yarn lint && yarn test:coverage && yarn build

# Or use the validation script
yarn lint && yarn test && echo "✅ Ready for PR!"
```

---

## Related Documentation

- [TESTING.md](TESTING.md) - Testing guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment details
- [DOCKER_HUB_SETUP.md](DOCKER_HUB_SETUP.md) - Docker setup guide
