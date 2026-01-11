# 🚀 Deployment Documentation

## Overview

This document explains the deployment strategies, environments, and procedures for the E-Storefront application.

---

## 🎯 Deployment Options

### Available Platforms

| Platform | Best For | Scaling |
|----------|----------|---------|
| **Vercel** | Easiest setup, auto-scaling | Serverless |
| **Docker** | Full control, portability | Container orchestration |
| **VPS** | Cost-effective, dedicated | Manual or scripts |
| **Kubernetes** | Large-scale, enterprise | Auto-scaling |

---

## 🌐 Vercel Deployment

### Why Vercel?

| Benefit | Description |
|---------|-------------|
| **Zero Config** | Built for Next.js |
| **Edge Network** | Global CDN |
| **Preview Deploys** | Every PR gets a URL |
| **Auto Scaling** | Serverless by default |
| **Analytics** | Built-in performance monitoring |

### Setup Steps

#### 1. Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Select "E-Storefront-Web"

#### 2. Configure Build

```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm ci",
  "devCommand": "npm run dev"
}
```

#### 3. Environment Variables

Configure in Vercel Dashboard → Settings → Environment Variables:

| Variable | Description | Environments |
|----------|-------------|--------------|
| `NEXT_PUBLIC_AUTH_SERVICE_URL` | Authentication API URL | All |
| `NEXT_PUBLIC_GRAPHQL_URL` | GraphQL API endpoint | All |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID | All |
| `NEXT_PUBLIC_ENV` | Environment identifier | Per env |

#### 4. Domain Configuration

1. Go to Project Settings → Domains
2. Add custom domain: `store.3asoftwares.com`
3. Configure DNS records:
   ```
   Type: CNAME
   Name: store
   Value: cname.vercel-dns.com
   ```

### Environment URLs

| Environment | Trigger | URL |
|-------------|---------|-----|
| **Production** | Push to `main` | `store.3asoftwares.com` |
| **Preview** | Pull Request | `[branch]-[project].vercel.app` |
| **Development** | Local | `localhost:3003` |

### Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy preview
vercel

# Deploy production
vercel --prod

# Set environment variable
vercel env add NEXT_PUBLIC_API_URL

# Pull environment variables
vercel env pull .env.local
```

---

## 🐳 Docker Deployment

### Prerequisites

- Docker installed on server
- SSH access to server
- Docker Compose installed

### Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
```

### Deployment Steps

#### 1. Pull Docker Image

```bash
# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Pull latest image
docker pull ghcr.io/your-org/e-storefront-web:latest
```

#### 2. Create Environment File

```bash
# Create .env file
cat > .env << EOF
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_AUTH_SERVICE_URL=https://auth.example.com
NEXT_PUBLIC_GRAPHQL_URL=https://api.example.com/graphql
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id
EOF
```

#### 3. Create Docker Compose File

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
    env_file:
      - .env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3003"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

#### 4. Deploy

```bash
# Start container
docker compose -f docker-compose.prod.yml up -d

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Check status
docker compose -f docker-compose.prod.yml ps
```

### Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/storefront
server {
    listen 80;
    server_name store.3asoftwares.com;
    
    location / {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/storefront /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### SSL with Certbot

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d store.3asoftwares.com

# Auto-renewal is enabled by default
sudo certbot renew --dry-run
```

---

## 📊 Environments

### Environment Matrix

| Environment | Purpose | URL | Branch |
|-------------|---------|-----|--------|
| **Development** | Local testing | localhost:3003 | feature/* |
| **Staging** | Pre-production testing | staging.store.3asoftwares.com | develop |
| **Production** | Live users | store.3asoftwares.com | main |

### Environment Variables per Stage

```bash
# Development (.env.development)
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:4000
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql

# Staging (.env.staging)
NEXT_PUBLIC_ENV=staging
NEXT_PUBLIC_AUTH_SERVICE_URL=https://staging-auth.3asoftwares.com
NEXT_PUBLIC_GRAPHQL_URL=https://staging-api.3asoftwares.com/graphql

# Production (.env.production)
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_AUTH_SERVICE_URL=https://auth.3asoftwares.com
NEXT_PUBLIC_GRAPHQL_URL=https://api.3asoftwares.com/graphql
```

---

## 🔄 Deployment Flow

### Automated Deployment

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      DEPLOYMENT FLOW                                     │
└─────────────────────────────────────────────────────────────────────────┘

  Developer                 CI/CD                      Environments
  ─────────                 ─────                      ────────────
     │                        │                             │
     │  Push to feature/*     │                             │
     ├───────────────────────▶│ Run CI (lint, test, build) │
     │                        │                             │
     │  Create PR             │                             │
     ├───────────────────────▶│ Deploy Preview    ─────────▶│ Preview URL
     │                        │                             │
     │  Merge to develop      │                             │
     ├───────────────────────▶│ Deploy Staging   ─────────▶│ Staging
     │                        │                             │
     │  Merge to main         │                             │
     ├───────────────────────▶│ Deploy Production ────────▶│ Production
     │                        │                             │
```

### Manual Deployment (Rollback)

```bash
# List available image tags
docker images ghcr.io/your-org/e-storefront-web

# Rollback to specific version
docker compose -f docker-compose.prod.yml down
export IMAGE_TAG=sha-abc123
docker compose -f docker-compose.prod.yml up -d

# Or on Vercel
vercel rollback
```

---

## 🏥 Health Checks

### Application Health

```bash
# Check health endpoint
curl -f http://localhost:3003

# Check with status code
curl -o /dev/null -s -w "%{http_code}" http://localhost:3003
```

### Monitoring

| Tool | Purpose |
|------|---------|
| **Vercel Analytics** | Web Vitals, page views |
| **Docker Healthcheck** | Container health |
| **UptimeRobot** | External monitoring |
| **Sentry** | Error tracking |

---

## 📋 Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Environment variables set
- [ ] Database migrations run (if applicable)
- [ ] Feature flags configured

### Post-Deployment

- [ ] Smoke tests passing
- [ ] Health check responding
- [ ] Logs showing no errors
- [ ] Performance within SLA
- [ ] Notify team of deployment

### Rollback Plan

- [ ] Know the previous version tag
- [ ] Rollback command ready
- [ ] Team notified of rollback procedure

---

## 🔐 Security Considerations

### Secrets Management

| Secret | Storage | Access |
|--------|---------|--------|
| API Keys | GitHub Secrets | CI/CD only |
| OAuth Credentials | Environment variables | Runtime |
| SSH Keys | GitHub Secrets | Deployment |

### Security Headers

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
];
```

---

## 🛠️ Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **Build fails** | Check environment variables |
| **Container won't start** | Check port conflicts |
| **SSL errors** | Renew certificates |
| **502 Bad Gateway** | Check container health |
| **Slow performance** | Check resource limits |

### Debugging Commands

```bash
# Vercel
vercel logs
vercel inspect <deployment-url>

# Docker
docker logs storefront-production
docker exec -it storefront-production sh
docker stats storefront-production

# Server
journalctl -u docker
tail -f /var/log/nginx/error.log
```

---

## 📚 Related Documentation

- [CI/CD Pipeline](ci-cd-pipeline.md)
- [Docker Implementation](docker-implementation.md)
- [Architecture](architecture.md)
