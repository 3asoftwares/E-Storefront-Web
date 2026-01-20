# Environment Configuration

This document describes all environment variables used in the E-Storefront Web application.

## 📋 Table of Contents

- [Overview](#overview)
- [Environment Files](#environment-files)
- [Variable Reference](#variable-reference)
- [Environment-Specific Configurations](#environment-specific-configurations)
- [Secrets Management](#secrets-management)
- [Validation](#validation)

---

## 🌐 Overview

The E-Storefront application uses environment variables for configuration. Next.js supports environment variables through `.env` files with the following conventions:

- `NEXT_PUBLIC_*` - Exposed to the browser (public)
- Other variables - Server-side only (private)

### Loading Order

```
.env.local        # Loaded in all environments, ignored by git
.env.development  # Loaded in development
.env.production   # Loaded in production
.env              # Default, loaded in all environments
```

**Priority:** `.env.local` > `.env.{environment}` > `.env`

---

## 📁 Environment Files

### Development Setup

Create a `.env.local` file in the project root:

```bash
# Copy the example file
cp .env.example .env.local

# Edit with your values
code .env.local
```

### File Templates

**.env.example** (template for developers):

```bash
# =============================================================================
# E-Storefront Environment Configuration
# =============================================================================

# Application Environment
NEXT_PUBLIC_ENV=development

# API Endpoints
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:3011

# Authentication
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3004
```

**.env.development**:

```bash
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:3011
NEXT_PUBLIC_SITE_URL=http://localhost:3004
```

**.env.production**:

```bash
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_GRAPHQL_URL=https://api.3asoftwares.com/graphql
NEXT_PUBLIC_AUTH_SERVICE_URL=https://auth.3asoftwares.com
NEXT_PUBLIC_SITE_URL=https://shop.3asoftwares.com
```

---

## 📖 Variable Reference

### Core Application Variables

| Variable          | Type   | Required | Default       | Description                                                      |
| ----------------- | ------ | -------- | ------------- | ---------------------------------------------------------------- |
| `NEXT_PUBLIC_ENV` | string | Yes      | `development` | Application environment (`development`, `staging`, `production`) |
| `NODE_ENV`        | string | No       | Auto-set      | Node.js environment, set automatically by Next.js                |

### API Configuration

| Variable                       | Type | Required | Default                         | Description                     |
| ------------------------------ | ---- | -------- | ------------------------------- | ------------------------------- |
| `NEXT_PUBLIC_GRAPHQL_URL`      | URL  | Yes      | `http://localhost:4000/graphql` | GraphQL API endpoint URL        |
| `NEXT_PUBLIC_AUTH_SERVICE_URL` | URL  | Yes      | `http://localhost:3011`         | Authentication service base URL |

### Authentication

| Variable                       | Type   | Required | Default | Description                                 |
| ------------------------------ | ------ | -------- | ------- | ------------------------------------------- |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | string | Yes      | -       | Google OAuth 2.0 client ID for social login |

### Site Configuration

| Variable               | Type | Required | Default                 | Description                                         |
| ---------------------- | ---- | -------- | ----------------------- | --------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | URL  | Yes      | `http://localhost:3004` | Public site URL (used for SEO meta tags, OG images) |

### Build Configuration

| Variable                  | Type    | Required | Default | Description                                |
| ------------------------- | ------- | -------- | ------- | ------------------------------------------ |
| `NEXT_TELEMETRY_DISABLED` | boolean | No       | `0`     | Disable Next.js telemetry (`1` to disable) |

---

## 🌍 Environment-Specific Configurations

### Development

```bash
# .env.local or .env.development
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:3011
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<dev-google-client-id>
NEXT_PUBLIC_SITE_URL=http://localhost:3004
```

**Characteristics:**

- Local backend services
- Debug mode enabled
- React Query DevTools visible
- Hot reloading enabled

### Staging

```bash
NEXT_PUBLIC_ENV=staging
NEXT_PUBLIC_GRAPHQL_URL=https://staging-api.3asoftwares.com/graphql
NEXT_PUBLIC_AUTH_SERVICE_URL=https://staging-auth.3asoftwares.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<staging-google-client-id>
NEXT_PUBLIC_SITE_URL=https://staging.3asoftwares.com
```

**Characteristics:**

- Staging backend services
- Production-like configuration
- Debug tools disabled
- Used for QA testing

### Production

```bash
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_GRAPHQL_URL=https://api.3asoftwares.com/graphql
NEXT_PUBLIC_AUTH_SERVICE_URL=https://auth.3asoftwares.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<prod-google-client-id>
NEXT_PUBLIC_SITE_URL=https://shop.3asoftwares.com
```

**Characteristics:**

- Production backend services
- All optimizations enabled
- No debug tools
- Error tracking enabled

---

## 🔐 Secrets Management

### Local Development

- Store secrets in `.env.local` (gitignored)
- Never commit secrets to the repository
- Use example files with placeholder values

### CI/CD (GitHub Actions)

Store secrets in GitHub repository settings:

```yaml
# .github/workflows/deploy.yml
env:
  NEXT_PUBLIC_GRAPHQL_URL: ${{ secrets.NEXT_PUBLIC_GRAPHQL_URL }}
  NEXT_PUBLIC_AUTH_SERVICE_URL: ${{ secrets.NEXT_PUBLIC_AUTH_SERVICE_URL }}
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: ${{ secrets.NEXT_PUBLIC_GOOGLE_CLIENT_ID }}
```

### Vercel

Set environment variables in Vercel Dashboard:

1. Go to Project Settings → Environment Variables
2. Add each variable with appropriate scope:
   - **Production**: Only production deployments
   - **Preview**: Preview/staging deployments
   - **Development**: Local development (optional)

### Docker

Pass environment variables at build time:

```bash
docker build \
  --build-arg NEXT_PUBLIC_ENV=production \
  --build-arg NEXT_PUBLIC_GRAPHQL_URL=https://api.example.com/graphql \
  -t storefront:latest .
```

Or at runtime:

```bash
docker run \
  -e NEXT_PUBLIC_ENV=production \
  -e NEXT_PUBLIC_GRAPHQL_URL=https://api.example.com/graphql \
  storefront:latest
```

---

## ✅ Validation

### TypeScript Environment Validation

Create a type-safe environment configuration:

```typescript
// lib/env.ts
const requiredEnvVars = [
  'NEXT_PUBLIC_GRAPHQL_URL',
  'NEXT_PUBLIC_AUTH_SERVICE_URL',
  'NEXT_PUBLIC_GOOGLE_CLIENT_ID',
] as const;

export function validateEnv() {
  const missing: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

export const env = {
  NODE_ENV: process.env.NODE_ENV,
  APP_ENV: process.env.NEXT_PUBLIC_ENV || 'development',
  GRAPHQL_URL: process.env.NEXT_PUBLIC_GRAPHQL_URL!,
  AUTH_SERVICE_URL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL!,
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3004',

  isDevelopment: process.env.NEXT_PUBLIC_ENV === 'development',
  isStaging: process.env.NEXT_PUBLIC_ENV === 'staging',
  isProduction: process.env.NEXT_PUBLIC_ENV === 'production',
};
```

### Runtime Checks

```typescript
// app/layout.tsx or app/providers.tsx
if (typeof window === 'undefined') {
  // Server-side validation
  const requiredVars = ['NEXT_PUBLIC_GRAPHQL_URL', 'NEXT_PUBLIC_AUTH_SERVICE_URL'];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      console.warn(`Warning: ${varName} is not set`);
    }
  }
}
```

---

## 🔧 Common Issues

### Variable Not Available in Browser

**Problem:** Environment variable returns `undefined` in client-side code.

**Solution:** Ensure the variable name starts with `NEXT_PUBLIC_`:

```bash
# ❌ Wrong - won't be available in browser
SECRET_KEY=abc123

# ✅ Correct - available in browser
NEXT_PUBLIC_API_KEY=abc123
```

### Changes Not Reflected

**Problem:** Updated environment variables not working.

**Solution:** Restart the development server:

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

### Docker Build Issues

**Problem:** Environment variables not set during Docker build.

**Solution:** Pass as build arguments:

```dockerfile
ARG NEXT_PUBLIC_GRAPHQL_URL
ENV NEXT_PUBLIC_GRAPHQL_URL=${NEXT_PUBLIC_GRAPHQL_URL}
```

```bash
docker build --build-arg NEXT_PUBLIC_GRAPHQL_URL=https://api.example.com .
```

---

## 📚 Related Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment procedures
- [SECURITY.md](SECURITY.md) - Security best practices
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
