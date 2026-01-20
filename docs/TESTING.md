# Testing Documentation

This document provides comprehensive testing guidelines, strategies, and best practices for the E-Storefront Web application.

## 📋 Table of Contents

- [Overview](#overview)
- [Testing Stack](#testing-stack)
- [Test Structure](#test-structure)
- [Unit Testing](#unit-testing)
- [Component Testing](#component-testing)
- [Integration Testing](#integration-testing)
- [End-to-End Testing](#end-to-end-testing)
- [Coverage Requirements](#coverage-requirements)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)

---

## 🎯 Overview

### Testing Philosophy

1. **Test Behavior, Not Implementation** - Focus on what the code does, not how
2. **Pyramid Strategy** - More unit tests, fewer E2E tests
3. **Fast Feedback** - Tests should run quickly
4. **Reliable Results** - No flaky tests

### Test Pyramid

```
           ╱╲
          ╱  ╲
         ╱ E2E╲         ← Few, slow, high confidence
        ╱──────╲
       ╱        ╲
      ╱Integration╲     ← Some, medium speed
     ╱──────────────╲
    ╱                ╲
   ╱    Unit Tests    ╲  ← Many, fast, isolated
  ╱────────────────────╲
```

---

## 🛠 Testing Stack

| Tool                      | Purpose                  | Location            |
| ------------------------- | ------------------------ | ------------------- |
| **Jest**                  | Unit & component testing | `tests/`            |
| **React Testing Library** | Component testing        | `tests/components/` |
| **Cypress**               | E2E testing              | `cypress/`          |
| **MSW**                   | API mocking              | `tests/__mocks__/`  |

### Configuration Files

| File                | Purpose                     |
| ------------------- | --------------------------- |
| `jest.config.js`    | Jest configuration          |
| `cypress.config.ts` | Cypress configuration       |
| `tests/setup.tsx`   | Jest setup and global mocks |

---

## 📁 Test Structure

```
tests/
├── setup.tsx                 # Global test setup
├── __mocks__/               # Mock implementations
│   ├── ui-library.tsx       # @3asoftwares/ui mock
│   ├── utils.ts             # @3asoftwares/utils mock
│   ├── types.ts             # @3asoftwares/types mock
│   └── fontawesome.tsx      # FontAwesome mock
├── app/                     # Page component tests
│   ├── page.test.tsx        # Home page tests
│   └── ...
├── components/              # Component tests
│   ├── Header.test.tsx
│   ├── ProductCard.test.tsx
│   └── ...
├── hooks/                   # Custom hook tests
│   ├── useAuth.test.ts
│   ├── useProducts.test.ts
│   └── ...
├── lib/                     # Utility tests
│   └── utils/
│       ├── debounce.test.ts
│       └── throttle.test.ts
└── store/                   # Store tests
    └── cartStore.test.ts

cypress/
├── e2e/                     # E2E test specs
│   ├── auth.cy.ts           # Authentication flows
│   ├── cart.cy.ts           # Cart functionality
│   ├── checkout.cy.ts       # Checkout process
│   ├── home.cy.ts           # Home page
│   └── products.cy.ts       # Product browsing
├── support/
│   ├── commands.ts          # Custom commands
│   ├── component.ts         # Component test setup
│   └── e2e.ts              # E2E test setup
└── tsconfig.json
```

---

## 🧪 Unit Testing

### Setup

**jest.config.js:**

```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/tests/setup.tsx'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@3asoftwares/utils$': '<rootDir>/tests/__mocks__/utils.ts',
    '^@3asoftwares/ui$': '<rootDir>/tests/__mocks__/ui-library.tsx',
    '^@3asoftwares/types$': '<rootDir>/tests/__mocks__/types.ts',
  },
  testMatch: ['**/tests/**/*.test.ts', '**/tests/**/*.test.tsx'],
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'store/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    '!**/*.d.ts',
  ],
};

module.exports = createJestConfig(customJestConfig);
```

### Running Unit Tests

```bash
# Run all tests
npm test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- tests/components/Header.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="should add item to cart"
```

### Writing Unit Tests

**Utility Function Test:**

```typescript
// tests/lib/utils/debounce.test.ts
import { debounce } from '@/lib/utils/debounce';

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should delay function execution', () => {
    const callback = jest.fn();
    const debouncedFn = debounce(callback, 300);

    debouncedFn();
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(300);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should cancel previous calls', () => {
    const callback = jest.fn();
    const debouncedFn = debounce(callback, 300);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    jest.advanceTimersByTime(300);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
```

**Store Test:**

```typescript
// tests/store/cartStore.test.ts
import { useCartStore } from '@/store/cartStore';
import { act, renderHook } from '@testing-library/react';

describe('useCartStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useCartStore());
    act(() => {
      result.current.clearCart();
    });
  });

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCartStore());
    const item = { id: '1', name: 'Product', price: 10, quantity: 1 };

    act(() => {
      result.current.addItem(item);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual(item);
  });

  it('should update quantity for existing item', () => {
    const { result } = renderHook(() => useCartStore());
    const item = { id: '1', name: 'Product', price: 10, quantity: 1 };

    act(() => {
      result.current.addItem(item);
      result.current.addItem({ ...item, quantity: 2 });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(3);
  });

  it('should calculate total price correctly', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem({ id: '1', name: 'A', price: 10, quantity: 2 });
      result.current.addItem({ id: '2', name: 'B', price: 15, quantity: 1 });
    });

    expect(result.current.getTotalPrice()).toBe(35);
  });
});
```

---

## 🧩 Component Testing

### Testing React Components

**Component Test:**

```typescript
// tests/components/ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '@/components/ProductCard';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  image: '/test-image.jpg',
  description: 'Test description',
};

describe('ProductCard', () => {
  it('should render product information', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('should call onAddToCart when button is clicked', () => {
    const onAddToCart = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);

    fireEvent.click(screen.getByTestId('add-to-cart-button'));

    expect(onAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('should show out of stock message when stock is 0', () => {
    render(<ProductCard product={{ ...mockProduct, stock: 0 }} />);

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    expect(screen.getByTestId('add-to-cart-button')).toBeDisabled();
  });
});
```

### Testing Hooks

```typescript
// tests/hooks/useDebounce.test.ts
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/lib/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return debounced value after delay', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    expect(result.current).toBe('initial');

    rerender({ value: 'updated', delay: 500 });
    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updated');
  });
});
```

### Testing with Providers

```typescript
// tests/utils/renderWithProviders.tsx
import { render, RenderOptions } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        {children}
      </RecoilRoot>
    </QueryClientProvider>
  );
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: RenderOptions
) {
  return render(ui, { wrapper: AllProviders, ...options });
}
```

---

## 🔗 Integration Testing

### Testing API Integration

```typescript
// tests/hooks/useProducts.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { useProducts } from '@/lib/hooks/useProducts';
import { GQL_QUERIES } from '@/lib/apollo/queries/queries';

const mockProducts = {
  request: {
    query: GQL_QUERIES.GET_PRODUCTS_QUERY,
    variables: { page: 1, limit: 12 },
  },
  result: {
    data: {
      products: {
        products: [
          { id: '1', name: 'Product 1', price: 10 },
          { id: '2', name: 'Product 2', price: 20 },
        ],
        total: 2,
        page: 1,
        totalPages: 1,
      },
    },
  },
};

describe('useProducts', () => {
  it('should fetch and return products', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockedProvider mocks={[mockProducts]} addTypename={false}>
        {children}
      </MockedProvider>
    );

    const { result } = renderHook(
      () => useProducts({ page: 1, limit: 12 }),
      { wrapper }
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toHaveLength(2);
    expect(result.current.products[0].name).toBe('Product 1');
  });
});
```

---

## 🌐 End-to-End Testing

### Cypress Configuration

**cypress.config.ts:**

```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3004',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    supportFile: 'cypress/support/e2e.ts',
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
```

### Running E2E Tests

```bash
# Open Cypress UI
npm run cy:open

# Run headlessly
npm run cy:run

# Run with dev server
npm run cy:e2e

# Run specific spec
npx cypress run --spec "cypress/e2e/auth.cy.ts"
```

### Writing E2E Tests

**Authentication Flow:**

```typescript
// cypress/e2e/auth.cy.ts
describe('Authentication', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });

  describe('Login', () => {
    it('should display login form', () => {
      cy.visit('/login');
      cy.get('[data-testid="login-form"]').should('be.visible');
      cy.get('[data-testid="email-input"]').should('be.visible');
      cy.get('[data-testid="password-input"]').should('be.visible');
    });

    it('should login successfully with valid credentials', () => {
      cy.intercept('POST', '**/graphql', (req) => {
        if (req.body.operationName === 'Login') {
          req.reply({
            data: {
              login: {
                token: 'mock-jwt-token',
                user: { id: '1', email: 'test@example.com', name: 'Test' },
              },
            },
          });
        }
      });

      cy.visit('/login');
      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="login-button"]').click();

      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('should show error for invalid credentials', () => {
      cy.intercept('POST', '**/graphql', (req) => {
        if (req.body.operationName === 'Login') {
          req.reply({
            errors: [{ message: 'Invalid credentials' }],
          });
        }
      });

      cy.visit('/login');
      cy.get('[data-testid="email-input"]').type('wrong@email.com');
      cy.get('[data-testid="password-input"]').type('wrongpassword');
      cy.get('[data-testid="login-button"]').click();

      cy.get('[data-testid="login-error"]').should('be.visible');
    });
  });
});
```

**Cart Flow:**

```typescript
// cypress/e2e/cart.cy.ts
describe('Shopping Cart', () => {
  beforeEach(() => {
    cy.visit('/products');
  });

  it('should add product to cart', () => {
    cy.get('[data-testid="product-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="add-to-cart"]').click();
      });

    cy.get('[data-testid="cart-count"]').should('contain', '1');
  });

  it('should update quantity in cart', () => {
    // Add product
    cy.get('[data-testid="product-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="add-to-cart"]').click();
      });

    cy.visit('/cart');

    cy.get('[data-testid="quantity-increase"]').click();
    cy.get('[data-testid="item-quantity"]').should('contain', '2');
  });

  it('should remove item from cart', () => {
    cy.get('[data-testid="product-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="add-to-cart"]').click();
      });

    cy.visit('/cart');
    cy.get('[data-testid="remove-item"]').click();

    cy.get('[data-testid="empty-cart-message"]').should('be.visible');
  });
});
```

### Custom Commands

```typescript
// cypress/support/commands.ts
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      addToCart(productId: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.intercept('POST', '**/graphql', (req) => {
    if (req.body.operationName === 'Login') {
      req.reply({
        data: {
          login: {
            token: 'mock-token',
            user: { id: '1', email, name: 'Test User' },
          },
        },
      });
    }
  });

  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
  cy.url().should('not.include', '/login');
});

Cypress.Commands.add('addToCart', (productId: string) => {
  cy.get(`[data-testid="product-${productId}"]`).within(() => {
    cy.get('[data-testid="add-to-cart"]').click();
  });
});
```

---

## 📊 Coverage Requirements

### Current Thresholds

```javascript
// jest.config.js
coverageThreshold: {
  global: {
    branches: 10,
    functions: 15,
    lines: 15,
    statements: 15,
  },
},
```

### Target Thresholds

| Metric     | Current | Target |
| ---------- | ------- | ------ |
| Branches   | 10%     | 60%    |
| Functions  | 15%     | 60%    |
| Lines      | 15%     | 60%    |
| Statements | 15%     | 60%    |

### Coverage Report

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/lcov-report/index.html
```

---

## 🔄 CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: cypress-io/github-action@v6
        with:
          start: npm start
          wait-on: 'http://localhost:3004'
```

---

## ✅ Best Practices

### General Guidelines

1. **Arrange-Act-Assert Pattern**

   ```typescript
   it('should add item to cart', () => {
     // Arrange
     const item = { id: '1', name: 'Product', price: 10 };

     // Act
     addToCart(item);

     // Assert
     expect(cart.items).toContainEqual(item);
   });
   ```

2. **One Assertion Per Test** (when practical)

3. **Descriptive Test Names**

   ```typescript
   // ✅ Good
   it('should show error message when email is invalid');

   // ❌ Bad
   it('email test');
   ```

4. **Use data-testid for E2E Selection**

   ```tsx
   <button data-testid="submit-button">Submit</button>
   ```

5. **Clean Up After Tests**
   ```typescript
   afterEach(() => {
     cleanup();
     jest.clearAllMocks();
   });
   ```

### What to Test

| Category       | What to Test                                |
| -------------- | ------------------------------------------- |
| **Components** | Rendering, user interactions, state changes |
| **Hooks**      | Return values, side effects, error handling |
| **Utilities**  | Input/output, edge cases, error handling    |
| **Store**      | Actions, selectors, state updates           |
| **E2E**        | Critical user flows, integrations           |

### What NOT to Test

- Implementation details
- Third-party library internals
- Framework code (Next.js, React)
- CSS styles (unless critical)

---

## 📚 Related Documentation

- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [Jest Documentation](https://jestjs.io/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Testing Library](https://testing-library.com/)
