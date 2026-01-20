# Contributing to E-Storefront Web

Thank you for your interest in contributing to the 3A Softwares E-Storefront! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branch Naming Convention](#branch-naming-convention)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors. We expect everyone to:

- Be respectful and considerate
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Trolling or insulting/derogatory remarks
- Public or private harassment
- Publishing others' private information without consent

## 🚀 Getting Started

### Prerequisites

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/<your-username>/E-Storefront-Web.git
   cd E-Storefront-Web
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/3asoftwares/E-Storefront-Web.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```

### Environment Setup

1. Copy the environment example file:
   ```bash
   cp .env.example .env.local
   ```
2. Configure the required environment variables (see [ENVIRONMENT.md](docs/ENVIRONMENT.md))
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🔄 Development Workflow

### 1. Sync with Upstream

Before starting any work, ensure your fork is up-to-date:

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes

- Write clean, readable code
- Follow the coding standards
- Add tests for new functionality
- Update documentation as needed

### 4. Test Your Changes

```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Run unit tests
npm test

# Run E2E tests
npm run cy:run
```

### 5. Commit and Push

```bash
git add .
git commit -m "feat: add your feature description"
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

Open a PR against the `main` branch of the upstream repository.

## 🌿 Branch Naming Convention

Use the following prefixes for branch names:

| Prefix      | Purpose                   | Example                     |
| ----------- | ------------------------- | --------------------------- |
| `feature/`  | New features              | `feature/product-filters`   |
| `bugfix/`   | Bug fixes                 | `bugfix/cart-calculation`   |
| `hotfix/`   | Critical production fixes | `hotfix/checkout-crash`     |
| `refactor/` | Code refactoring          | `refactor/auth-flow`        |
| `docs/`     | Documentation updates     | `docs/api-endpoints`        |
| `test/`     | Test additions/updates    | `test/checkout-flow`        |
| `chore/`    | Maintenance tasks         | `chore/update-dependencies` |

## 📝 Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Types

| Type       | Description                               |
| ---------- | ----------------------------------------- |
| `feat`     | New feature                               |
| `fix`      | Bug fix                                   |
| `docs`     | Documentation changes                     |
| `style`    | Code style (formatting, semicolons, etc.) |
| `refactor` | Code refactoring                          |
| `test`     | Adding or updating tests                  |
| `chore`    | Maintenance tasks                         |
| `perf`     | Performance improvements                  |
| `ci`       | CI/CD changes                             |
| `revert`   | Reverting previous commits                |

### Examples

```bash
# Feature
feat(cart): add quantity limit validation

# Bug fix
fix(checkout): resolve payment processing error

# Documentation
docs(readme): update installation instructions

# Refactoring
refactor(auth): simplify token refresh logic
```

## 🔀 Pull Request Process

### Before Submitting

1. ✅ Ensure all tests pass
   ```bash
   npm run test
   ```
2. ✅ Run linting and fix all issues
   ```bash
   npm run lint:fix
   ```
3. ✅ Run type checking
   ```bash
   npm run type-check
   ```
4. ✅ Format code
   ```bash
   npm run format
   ```
5. ✅ Update documentation if needed
6. ✅ Add/update tests for new functionality
7. ✅ Rebase on latest `main` if needed
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

### PR Template

When creating a PR, include:

```markdown
## Description

Brief description of the changes.

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

Describe the testing done.

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No new warnings introduced
```

### Review Process

1. **Automated Checks**: CI pipeline runs tests and linting
2. **Code Review**: At least one maintainer review required
3. **Address Feedback**: Make requested changes
4. **Merge**: Maintainer merges after approval

## 💻 Coding Standards

### TypeScript

- Use strict TypeScript configuration
- Define types for all function parameters and return values
- Avoid `any` type; use `unknown` if type is truly unknown
- Use interfaces for object shapes, types for unions/primitives

```typescript
// ✅ Good
interface ProductProps {
  id: string;
  name: string;
  price: number;
}

function getProduct(id: string): Promise<ProductProps> {
  // implementation
}

// ❌ Bad
function getProduct(id: any): any {
  // implementation
}
```

### React Components

- Use functional components with hooks
- Apply `React.memo` for components with expensive renders
- Use `useMemo` and `useCallback` for optimization
- Follow component file structure:

```typescript
// Component structure
'use client'; // if client component

import { useState, useCallback, useMemo } from 'react';
// External imports
// Internal imports

interface ComponentProps {
  // props definition
}

export default function ComponentName({ prop1, prop2 }: ComponentProps) {
  // Hooks
  // Memoized values
  // Callbacks
  // Render
}
```

### File Naming

- **Components**: PascalCase (`ProductCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useProducts.ts`)
- **Utilities**: camelCase (`formatPrice.ts`)
- **Types**: camelCase or PascalCase (`types.ts`, `Product.ts`)

### Code Formatting

- Use Prettier for consistent formatting
- Run `npm run format` before committing
- Configure your editor to format on save

## 🧪 Testing Requirements

### Unit Tests (Jest)

- Test all utility functions
- Test custom hooks
- Test component behavior
- Aim for minimum 60% coverage on new code

```typescript
// Example test
describe('useCart', () => {
  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem({ id: '1', name: 'Product', price: 10, quantity: 1 });
    });

    expect(result.current.items).toHaveLength(1);
  });
});
```

### E2E Tests (Cypress)

- Test critical user flows
- Use data-testid for element selection
- Keep tests isolated and independent

```typescript
// Example E2E test
describe('Checkout Flow', () => {
  it('should complete checkout successfully', () => {
    cy.login('test@example.com', 'password');
    cy.visit('/cart');
    cy.get('[data-testid="checkout-button"]').click();
    // ... complete flow
  });
});
```

## 📖 Documentation

### When to Document

- New features or components
- API changes
- Configuration changes
- Complex logic or algorithms

### Documentation Locations

| Type                   | Location               |
| ---------------------- | ---------------------- |
| Component props        | JSDoc comments in code |
| API endpoints          | `docs/API.md`          |
| Environment variables  | `docs/ENVIRONMENT.md`  |
| Architecture decisions | `docs/ARCHITECTURE.md` |
| Deployment procedures  | `docs/DEPLOYMENT.md`   |

---

## ❓ Questions?

If you have questions or need help:

1. Check existing documentation
2. Search existing issues
3. Open a new issue with the `question` label
4. Reach out to maintainers

Thank you for contributing to E-Storefront Web! 🎉
