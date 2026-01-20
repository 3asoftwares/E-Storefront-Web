# 3A Softwares E-Storefront

Customer-facing e-commerce storefront built with Next.js 16, featuring product browsing, shopping cart, wishlist, checkout, and user authentication.

## Quick Start

### Development Environment

```bash
# Pull and run development image (with hot-reload)
docker run -it -p 3004:3004 \
  -v $(pwd):/app \
  -v /app/node_modules \
  3asoftwares/storefront:dev
```

### Production Environment

```bash
# Pull and run production image
docker run -d -p 3004:3004 3asoftwares/storefront:latest
```

### Using Docker Compose

```bash
# Clone the repository
git clone https://github.com/3asoftwares/E-Storefront-Web.git
cd E-Storefront-Web

# Development
docker-compose -f docker-compose.hub.yml up storefront-dev

# Production
docker-compose -f docker-compose.hub.yml --profile production up storefront-prod
```

## Available Tags

| Tag      | Description                              | Size   |
| -------- | ---------------------------------------- | ------ |
| `latest` | Production build (optimized)             | ~100MB |
| `dev`    | Development build (with devDependencies) | ~1.2GB |
| `v1.x.x` | Specific version releases                | ~100MB |

## Multi-Platform Support

Images are built for:

- `linux/amd64` - Intel/AMD processors (Windows, Intel Macs)
- `linux/arm64` - ARM processors (Apple Silicon M1/M2/M3)

## Environment Variables

| Variable                       | Description                          | Required |
| ------------------------------ | ------------------------------------ | -------- |
| `NEXT_PUBLIC_GRAPHQL_URL`      | GraphQL API endpoint                 | Yes      |
| `NEXT_PUBLIC_AUTH_SERVICE_URL` | Auth service endpoint                | Yes      |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID               | No       |
| `NEXT_PUBLIC_ENV`              | Environment (development/production) | No       |

## Source Code

- **GitHub:** https://github.com/3asoftwares/E-Storefront-Web
- **Documentation:** https://github.com/3asoftwares/E-Storefront-Web/tree/main/docs

## Tech Stack

- Next.js 16.1.1 (App Router)
- TypeScript 5.x
- Apollo Client (GraphQL)
- Zustand + React Query (State)
- Tailwind CSS + DaisyUI

## License

MIT License - 3A Softwares
