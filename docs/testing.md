# 🧪 Testing Documentation

## Overview

This document explains the testing strategy, patterns, and coverage requirements for the E-Storefront application.

---

## 🎯 Testing Philosophy

### Why Testing Matters

| Benefit | Description |
|---------|-------------|
| **Confidence** | Deploy with certainty |
| **Regression Prevention** | Catch bugs before production |
| **Documentation** | Tests describe expected behavior |
| **Refactoring Safety** | Change code without fear |
| **Quality Assurance** | Maintain code standards |

### Testing Pyramid

```
                    ┌─────────┐
                    │   E2E   │  ← Few, slow, high value
                    │  Tests  │
                ┌───┴─────────┴───┐
                │  Integration    │  ← Some, moderate speed
                │     Tests       │
            ┌───┴─────────────────┴───┐
            │       Unit Tests         │  ← Many, fast, low cost
            └──────────────────────────┘
```

---

## 🛠️ Testing Stack

### Technologies

| Tool | Purpose |
|------|---------|
| **Jest 29.7** | Test runner and framework |
| **React Testing Library 14.2** | Component testing utilities |
| **@testing-library/jest-dom** | Custom DOM matchers |
| **@testing-library/user-event** | User interaction simulation |

### Why These Tools?

| Tool | Reason |
|------|--------|
| **Jest** | Zero-config, fast, great DX |
| **RTL** | Tests user behavior, not implementation |
| **User Event** | Realistic user interactions |

---

## ⚙️ Configuration

### Jest Configuration

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  // Test environment
  testEnvironment: 'jest-environment-jsdom',
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.tsx'],
  
  // Module aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@3asoftwares/utils$': '<rootDir>/tests/__mocks__/utils.ts',
    '^@3asoftwares/utils/client$': '<rootDir>/tests/__mocks__/utils.ts',
    '^@3asoftwares/ui$': '<rootDir>/tests/__mocks__/ui-library.tsx',
    '^@3asoftwares/types$': '<rootDir>/tests/__mocks__/types.ts',
    '^@fortawesome/react-fontawesome$': '<rootDir>/tests/__mocks__/fontawesome.tsx',
  },
  
  // Test file patterns
  testMatch: ['**/tests/**/*.test.ts', '**/tests/**/*.test.tsx'],
  
  // Coverage configuration
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'store/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    '!**/*.d.ts',
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

### Test Setup

```typescript
// tests/setup.tsx
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
  useParams: () => ({}),
}));

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock Next.js Image
jest.mock('next/image', () => {
  return ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  );
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock scrollTo
window.scrollTo = jest.fn();
```

---

## 📁 Test Structure

```
tests/
├── setup.tsx                    # Jest setup and global mocks
├── __mocks__/                   # Mock implementations
│   ├── fontawesome.tsx          # FontAwesome icons mock
│   ├── types.ts                 # Type definitions mock
│   ├── ui-library.tsx           # @3asoftwares/ui mock
│   └── utils.ts                 # @3asoftwares/utils mock
├── components/                  # Component tests
│   ├── EmptyState.test.tsx
│   ├── FeaturedCategories.test.tsx
│   ├── FeaturedProducts.test.tsx
│   ├── Footer.test.tsx
│   ├── GoogleSignInButton.test.tsx
│   ├── Header.test.tsx
│   ├── ProductCard.test.tsx
│   ├── ProductReviews.test.tsx
│   └── SectionHeader.test.tsx
├── hooks/                       # Custom hooks tests
│   ├── useAuth.test.tsx
│   ├── useOrders.test.tsx
│   └── useProducts.test.tsx
├── lib/                         # Library/utility tests
│   └── apollo-client.test.ts
└── store/                       # State store tests
    └── cartStore.test.ts
```

---

## 🧩 Component Testing

### Basic Component Test

```typescript
// tests/components/ProductCard.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductCard } from '@/components/ProductCard';

// Mock data
const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 29.99,
  thumbnail: '/test-image.jpg',
  rating: 4.5,
  reviewCount: 100,
  inStock: true,
};

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByAltText('Test Product')).toBeInTheDocument();
  });
  
  it('shows rating when available', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(100)')).toBeInTheDocument();
  });
  
  it('calls onAddToCart when button is clicked', async () => {
    const user = userEvent.setup();
    const onAddToCart = jest.fn();
    
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);
    
    await user.click(screen.getByRole('button', { name: /add to cart/i }));
    
    expect(onAddToCart).toHaveBeenCalledWith(mockProduct);
  });
  
  it('shows out of stock badge when not in stock', () => {
    render(<ProductCard product={{ ...mockProduct, inStock: false }} />);
    
    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
  });
});
```

### Testing with Context

```typescript
// tests/components/Header.test.tsx
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecoilRoot } from 'recoil';
import { Header } from '@/components/Header';

// Create wrapper with providers
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        {children}
      </RecoilRoot>
    </QueryClientProvider>
  );
};

describe('Header', () => {
  it('renders logo and navigation', () => {
    render(<Header />, { wrapper: createWrapper() });
    
    expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
  
  it('shows cart item count', () => {
    // Pre-populate cart store
    jest.mock('@/store/cartStore', () => ({
      useCartStore: () => ({ items: [{ id: '1' }, { id: '2' }] }),
    }));
    
    render(<Header />, { wrapper: createWrapper() });
    
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
```

---

## 🪝 Hook Testing

### Testing Custom Hooks

```typescript
// tests/hooks/useProducts.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProducts } from '@/lib/hooks/useProducts';

// Mock Apollo Client
jest.mock('@/lib/apollo/client', () => ({
  apolloClient: {
    query: jest.fn(),
  },
}));

import { apolloClient } from '@/lib/apollo/client';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('fetches products successfully', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1' },
      { id: '2', name: 'Product 2' },
    ];
    
    (apolloClient.query as jest.Mock).mockResolvedValue({
      data: { products: mockProducts },
    });
    
    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });
    
    // Initially loading
    expect(result.current.isLoading).toBe(true);
    
    // Wait for data
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.data).toEqual(mockProducts);
  });
  
  it('handles errors gracefully', async () => {
    (apolloClient.query as jest.Mock).mockRejectedValue(
      new Error('Network error')
    );
    
    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });
    
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    
    expect(result.current.error?.message).toBe('Network error');
  });
});
```

---

## 🗃️ Store Testing

### Testing Zustand Store

```typescript
// tests/store/cartStore.test.ts
import { act } from '@testing-library/react';
import { useCartStore } from '@/store/cartStore';

describe('cartStore', () => {
  beforeEach(() => {
    // Reset store before each test
    act(() => {
      useCartStore.setState({
        items: [],
        wishlist: [],
        recentlyViewed: [],
      });
    });
  });
  
  describe('addItem', () => {
    it('adds item to cart', () => {
      const item = { id: '1', name: 'Product', price: 10, quantity: 1 };
      
      act(() => {
        useCartStore.getState().addItem(item);
      });
      
      expect(useCartStore.getState().items).toHaveLength(1);
      expect(useCartStore.getState().items[0]).toEqual(item);
    });
    
    it('increases quantity if item already exists', () => {
      const item = { id: '1', name: 'Product', price: 10, quantity: 1 };
      
      act(() => {
        useCartStore.getState().addItem(item);
        useCartStore.getState().addItem(item);
      });
      
      expect(useCartStore.getState().items).toHaveLength(1);
      expect(useCartStore.getState().items[0].quantity).toBe(2);
    });
  });
  
  describe('removeItem', () => {
    it('removes item from cart', () => {
      act(() => {
        useCartStore.setState({
          items: [{ id: '1', name: 'Product', price: 10, quantity: 1 }],
        });
        useCartStore.getState().removeItem('1');
      });
      
      expect(useCartStore.getState().items).toHaveLength(0);
    });
  });
  
  describe('getTotal', () => {
    it('calculates cart total correctly', () => {
      act(() => {
        useCartStore.setState({
          items: [
            { id: '1', name: 'Product 1', price: 10, quantity: 2 },
            { id: '2', name: 'Product 2', price: 15, quantity: 1 },
          ],
        });
      });
      
      expect(useCartStore.getState().getTotal()).toBe(35);
    });
  });
});
```

---

## 🎭 Mocking Patterns

### Mock File Examples

```typescript
// tests/__mocks__/utils.ts
export const formatPrice = (price: number) => `$${price.toFixed(2)}`;
export const getCurrentUser = jest.fn(() => null);
export const getAccessToken = jest.fn(() => null);
export const storeAuth = jest.fn();
export const clearAuth = jest.fn();
export const Logger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};
```

```typescript
// tests/__mocks__/ui-library.tsx
export const Button = ({ children, onClick }: any) => (
  <button onClick={onClick}>{children}</button>
);

export const Card = ({ children }: any) => (
  <div className="card">{children}</div>
);

export const Input = ({ value, onChange, placeholder }: any) => (
  <input value={value} onChange={onChange} placeholder={placeholder} />
);
```

### Apollo Client Mock

```typescript
// tests/lib/apollo-client.test.ts
jest.mock('@3asoftwares/utils/client', () => ({
  getAccessToken: jest.fn(),
  clearAuth: jest.fn(),
  Logger: { error: jest.fn() },
}));

import { getAccessToken, clearAuth } from '@3asoftwares/utils/client';

describe('Apollo Client', () => {
  it('adds authorization header when token exists', async () => {
    (getAccessToken as jest.Mock).mockReturnValue('test-token');
    
    // Test auth link behavior
  });
  
  it('clears auth on UNAUTHENTICATED error', async () => {
    // Simulate UNAUTHENTICATED error
    
    expect(clearAuth).toHaveBeenCalled();
  });
});
```

---

## 📊 Coverage Requirements

### Coverage Thresholds

```javascript
// jest.config.js
coverageThreshold: {
  global: {
    branches: 60,
    functions: 60,
    lines: 60,
    statements: 60,
  },
},
```

### Running Coverage

```bash
# Run tests with coverage
npm run test:coverage

# View HTML report
open coverage/lcov-report/index.html
```

### Coverage Report Example

```
-----------------------|---------|----------|---------|---------|
File                   | % Stmts | % Branch | % Funcs | % Lines |
-----------------------|---------|----------|---------|---------|
All files              |   72.5  |   65.3   |   70.1  |   71.8  |
 components/           |   78.2  |   68.4   |   75.0  |   77.5  |
  ProductCard.tsx      |   85.0  |   72.0   |   80.0  |   84.0  |
  Header.tsx           |   70.0  |   65.0   |   68.0  |   69.0  |
 hooks/                |   68.5  |   62.0   |   66.0  |   67.8  |
  useProducts.ts       |   75.0  |   70.0   |   72.0  |   74.0  |
  useAuth.ts           |   62.0  |   54.0   |   60.0  |   61.0  |
 store/                |   82.0  |   78.0   |   80.0  |   81.0  |
  cartStore.ts         |   82.0  |   78.0   |   80.0  |   81.0  |
-----------------------|---------|----------|---------|---------|
```

---

## ✅ Testing Best Practices

### Do's

| Practice | Reason |
|----------|--------|
| ✅ Test behavior, not implementation | More resilient to refactoring |
| ✅ Use user-centric queries | `getByRole`, `getByText` |
| ✅ Test edge cases | Empty states, errors, loading |
| ✅ Keep tests focused | One concept per test |
| ✅ Use meaningful names | Describe expected behavior |

### Don'ts

| Anti-Pattern | Reason |
|--------------|--------|
| ❌ Test implementation details | Brittle tests |
| ❌ Use `getByTestId` first | Not accessible |
| ❌ Test third-party code | Already tested |
| ❌ Snapshot everything | Hard to maintain |
| ❌ Skip async handling | Race conditions |

---

## 🔧 Running Tests

```bash
# Run all tests
npm test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific file
npm test -- ProductCard.test.tsx

# Run with pattern
npm test -- --testPathPattern=components
```

---

## 📚 Related Documentation

- [CI/CD Pipeline](ci-cd-pipeline.md)
- [Architecture](architecture.md)
- [Performance](performance.md)
