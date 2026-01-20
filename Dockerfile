# Storefront Development Dockerfile (Next.js)
# For local development with hot reload
#
# NOTE: For Docker Hub images, use Dockerfile.dev instead
# See docs/DOCKER_HUB_SETUP.md for details

FROM node:20.10.0-alpine3.19

WORKDIR /app

# Install dependencies for native modules
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# Install dependencies
RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile; \
  else npm install; \
  fi

# Copy source code
COPY . .

# Expose port
EXPOSE 3004

# Environment
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Start development server
CMD ["npm", "run", "dev"]
