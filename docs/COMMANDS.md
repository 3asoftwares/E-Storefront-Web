# Quick Commands Reference

Quick reference guide for commonly used commands in the E-Storefront-Web application.

## 📦 Development

| Command         | Description                           |
| --------------- | ------------------------------------- |
| `npm run dev`   | Start development server on port 3004 |
| `npm run build` | Build the application for production  |
| `npm run start` | Start production server on port 3004  |

## 🧹 Code Quality

| Command                | Description                                   |
| ---------------------- | --------------------------------------------- |
| `npm run lint`         | Run ESLint on app, components, lib, and store |
| `npm run lint:fix`     | Run ESLint and auto-fix issues                |
| `npm run lint:ci`      | Run ESLint for CI (allows up to 100 warnings) |
| `npm run type-check`   | Run TypeScript type checking without emitting |
| `npm run format`       | Format code with Prettier                     |
| `npm run format:check` | Check code formatting without modifying files |

## 🧪 Testing

### Unit Tests (Jest)

| Command                 | Description                    |
| ----------------------- | ------------------------------ |
| `npm run test`          | Run all unit tests             |
| `npm run test:watch`    | Run tests in watch mode        |
| `npm run test:coverage` | Run tests with coverage report |

### E2E Tests (Cypress)

| Command                 | Description                            |
| ----------------------- | -------------------------------------- |
| `npm run cy:open`       | Open Cypress Test Runner (interactive) |
| `npm run cy:run`        | Run Cypress tests headlessly           |
| `npm run cy:run:headed` | Run Cypress tests with browser visible |
| `npm run cy:component`  | Run Cypress component tests            |
| `npm run cy:e2e`        | Start dev server and run E2E tests     |

## 🐳 Docker

### Using Docker Hub Images

| Command               | Description                                |
| --------------------- | ------------------------------------------ |
| `npm run docker:pull` | Pull dev and latest images from Docker Hub |
| `npm run docker:dev`  | Run development container                  |
| `npm run docker:prod` | Run production container                   |

### Building Docker Images

| Command                     | Description                    |
| --------------------------- | ------------------------------ |
| `npm run docker:build:dev`  | Build development Docker image |
| `npm run docker:build:prod` | Build production Docker image  |

### Docker Compose (Direct)

```bash
# Development
docker-compose up

# Production
docker-compose -f docker-compose.prod.yml up

# Using Docker Hub images
docker-compose -f docker-compose.hub.yml up storefront-dev
docker-compose -f docker-compose.hub.yml --profile production up storefront-prod
```

## 🔧 Git Commands

```bash
# Stage all changes
git add .

# Commit with message
git commit -m "your message"

# Push to remote
git push

# Pull latest changes
git pull

# Create and switch to new branch
git checkout -b feature/your-feature-name

# Switch branches
git checkout branch-name

# View status
git status

# View commit history
git log --oneline
```

## 📋 Useful Combinations

### Before Committing

```bash
# Run all checks before commit
npm run lint:fix && npm run type-check && npm run test
```

### Full CI Check Locally

```bash
# Simulate CI pipeline locally
npm run lint:ci && npm run type-check && npm run test:coverage
```

### Clean Build

```bash
# Remove node_modules and reinstall
rm -rf node_modules
npm install

# Or on Windows PowerShell
Remove-Item -Recurse -Force node_modules
npm install
```

### Fresh Start

```bash
# Clean install and start dev
npm ci && npm run dev
```

## 🌐 URLs

| Environment       | URL                                |
| ----------------- | ---------------------------------- |
| Development       | http://localhost:3004              |
| Cypress Dashboard | Opens automatically with `cy:open` |

## 📁 Key Directories

| Directory     | Purpose                              |
| ------------- | ------------------------------------ |
| `app/`        | Next.js App Router pages and layouts |
| `components/` | Reusable React components            |
| `lib/`        | Utilities, hooks, and Apollo client  |
| `store/`      | State management (Zustand, Recoil)   |
| `tests/`      | Unit test files                      |
| `cypress/`    | E2E test files                       |
| `docs/`       | Project documentation                |
| `public/`     | Static assets                        |

## 💡 Tips

1. **Fast Testing**: Use `npm run test:watch` during development for instant feedback
2. **Debug Cypress**: Use `npm run cy:open` for interactive debugging
3. **Quick Lint**: Run `npm run lint:fix` before commits to auto-fix issues
4. **Type Safety**: Run `npm run type-check` to catch type errors before building
5. **Coverage Report**: After `npm run test:coverage`, open `coverage/lcov-report/index.html` in browser

---

For more detailed documentation, see other files in the `docs/` directory.
