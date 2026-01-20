# Architecture Documentation

This document describes the high-level architecture, design patterns, and technical decisions for the E-Storefront Web application.

## 📋 Table of Contents

- [System Overview](#system-overview)
- [Architecture Diagram](#architecture-diagram)
- [Frontend Architecture](#frontend-architecture)
- [State Management](#state-management)
- [Data Flow](#data-flow)
- [API Layer](#api-layer)
- [Authentication Flow](#authentication-flow)
- [Performance Optimizations](#performance-optimizations)
- [Design Patterns](#design-patterns)
- [Technology Decisions](#technology-decisions)

---

## 🏗 System Overview

E-Storefront Web is a customer-facing e-commerce application built as a modern single-page application (SPA) using Next.js with the App Router. It follows a client-server architecture where the frontend communicates with backend services via GraphQL.

### Key Architectural Principles

1. **Server-Side Rendering (SSR)** - SEO-friendly pages with initial server render
2. **Client-Side Interactivity** - Rich interactions powered by React
3. **Separation of Concerns** - Clear boundaries between UI, state, and data layers
4. **Performance First** - Optimized for Core Web Vitals
5. **Type Safety** - Full TypeScript coverage

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Client (Browser)                            │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                        Next.js Application                       │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │   │
│  │  │   Pages     │  │  Components │  │     State Management     │  │   │
│  │  │  (App Dir)  │  │             │  │  ┌───────┐ ┌──────────┐ │  │   │
│  │  │  - Home     │  │  - Header   │  │  │Zustand│ │ Recoil   │ │  │   │
│  │  │  - Products │  │  - Footer   │  │  │ Cart  │ │ Atoms    │ │  │   │
│  │  │  - Cart     │  │  - Cards    │  │  │ Store │ │          │ │  │   │
│  │  │  - Checkout │  │  - Forms    │  │  └───────┘ └──────────┘ │  │   │
│  │  │  - Orders   │  │  - Modals   │  └─────────────────────────┘  │   │
│  │  └─────────────┘  └─────────────┘                               │   │
│  │                                                                  │   │
│  │  ┌─────────────────────────────────────────────────────────────┐│   │
│  │  │                    Data Layer                                ││   │
│  │  │  ┌──────────────────┐  ┌─────────────────────────────────┐ ││   │
│  │  │  │   Apollo Client   │  │       React Query              │ ││   │
│  │  │  │   (GraphQL)       │  │  (Server State Caching)        │ ││   │
│  │  │  └──────────────────┘  └─────────────────────────────────┘ ││   │
│  │  └─────────────────────────────────────────────────────────────┘│   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS (GraphQL)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          Backend Services                                │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────┐  ┌─────────────────┐  ┌───────────────────────┐ │
│  │   GraphQL Gateway   │  │  Auth Service   │  │   CDN (Cloudinary)    │ │
│  │   (Port 4000)       │  │  (Port 3011)    │  │   (Images/Assets)     │ │
│  └────────────────────┘  └─────────────────┘  └───────────────────────┘ │
│           │                       │                                      │
│           ▼                       ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                         Database Layer                           │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🖥 Frontend Architecture

### Next.js App Router Structure

The application uses Next.js 16+ App Router for file-based routing:

```
app/
├── layout.tsx          # Root layout (providers, header, footer)
├── page.tsx            # Home page (/)
├── providers.tsx       # Client providers wrapper
├── globals.css         # Global styles
│
├── products/
│   ├── layout.tsx      # Products layout
│   ├── page.tsx        # Product listing (/products)
│   └── [id]/
│       └── page.tsx    # Product detail (/products/:id)
│
├── cart/
│   └── page.tsx        # Shopping cart (/cart)
│
├── checkout/
│   └── page.tsx        # Checkout flow (/checkout)
│
├── orders/
│   ├── page.tsx        # Order history (/orders)
│   └── [id]/
│       └── page.tsx    # Order detail (/orders/:id)
│
└── ...                 # Other feature routes
```

### Component Architecture

Components follow a hierarchical structure:

```
┌─────────────────────────────────────────────────────────────┐
│                        Pages (app/)                          │
│   Route-specific, data fetching, layout composition          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Feature Components                         │
│   ProductCard, ProductSlider, ProductReviews, etc.           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     UI Components                            │
│   Button, Input, Modal (from @3asoftwares/ui)                │
└─────────────────────────────────────────────────────────────┘
```

### Component Categories

| Category     | Location                              | Purpose                    |
| ------------ | ------------------------------------- | -------------------------- |
| **Layout**   | `components/Header.tsx`, `Footer.tsx` | App-wide layout components |
| **Feature**  | `components/ProductCard.tsx`          | Domain-specific UI         |
| **Shared**   | `@3asoftwares/ui`                     | Reusable UI primitives     |
| **Wrappers** | `components/HeaderWrapper.tsx`        | Client/Server boundaries   |

---

## 🔄 State Management

The application uses a hybrid state management approach:

### 1. Zustand (Client State)

Used for persistent client-side state like cart and wishlist.

```typescript
// store/cartStore.ts
interface CartStore {
  items: CartItem[];
  wishlist: WishlistItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  // ...
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      wishlist: [],
      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),
      // ...
    }),
    { name: 'cart-storage' }
  )
);
```

### 2. Apollo Client (Server State)

Used for GraphQL data fetching with intelligent caching.

```typescript
// lib/apollo/client.ts
export const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          products: {
            keyArgs: ['search', 'category', 'page'],
            merge(existing, incoming) {
              /* ... */
            },
          },
        },
      },
    },
  }),
});
```

### 3. React Query (Optional Caching)

Used for additional server state management alongside Apollo.

### 4. Recoil (Shared State)

Used for global state that doesn't need persistence.

```typescript
// store/recoilState.ts
export const categoryState = atom<Category[]>({
  key: 'categoryState',
  default: [],
});
```

### State Management Decision Matrix

| State Type    | Solution          | Example             |
| ------------- | ----------------- | ------------------- |
| Cart/Wishlist | Zustand + persist | Shopping cart items |
| Server Data   | Apollo Client     | Products, orders    |
| Form State    | React useState    | Input values        |
| Global UI     | Recoil            | Modal states        |
| URL State     | Next.js router    | Search params       |

---

## 🔀 Data Flow

### Unidirectional Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Actions   │────▶│    Store    │────▶│    View     │
│  (Events)   │     │   (State)   │     │  (React)    │
└─────────────┘     └─────────────┘     └─────────────┘
       ▲                                       │
       └───────────────────────────────────────┘
                    User Interactions
```

### GraphQL Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Component  │────▶│   Apollo    │────▶│   GraphQL   │
│   (Hook)    │     │   Client    │     │   Server    │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       │                   ▼                   │
       │            ┌─────────────┐            │
       ◀────────────│   Cache     │◀───────────┘
                    └─────────────┘
```

---

## 🔌 API Layer

### GraphQL Integration

All API communication happens through a centralized GraphQL layer:

```typescript
// lib/apollo/queries/queries.ts
export const GQL_QUERIES = {
  // Products
  GET_PRODUCTS_QUERY: gql`...`,
  GET_PRODUCT_QUERY: gql`...`,

  // Orders
  GET_ORDERS_QUERY: gql`...`,
  CREATE_ORDER_MUTATION: gql`...`,

  // Auth
  LOGIN_MUTATION: gql`...`,
  REGISTER_MUTATION: gql`...`,
  // ...
};
```

### Custom Hooks

Data fetching is abstracted into custom hooks:

```typescript
// lib/hooks/useProducts.ts
export function useProducts(filters: ProductFilters) {
  return useQuery(GQL_QUERIES.GET_PRODUCTS_QUERY, {
    variables: filters,
    // ...options
  });
}

// lib/hooks/useAuth.ts
export function useAuth() {
  const [login] = useMutation(GQL_QUERIES.LOGIN_MUTATION);
  const [register] = useMutation(GQL_QUERIES.REGISTER_MUTATION);
  // ...
}
```

---

## 🔐 Authentication Flow

### JWT Authentication

```
┌──────────────────────────────────────────────────────────────────┐
│                        Authentication Flow                        │
└──────────────────────────────────────────────────────────────────┘

1. Login Request
   ┌────────┐         ┌────────────┐         ┌────────────┐
   │ Client │────────▶│  GraphQL   │────────▶│   Auth     │
   │        │         │  Gateway   │         │  Service   │
   └────────┘         └────────────┘         └────────────┘
                                                    │
2. Token Response                                   │
   ┌────────┐         ┌────────────┐               │
   │ Client │◀────────│ JWT Token  │◀──────────────┘
   │        │         │ + Refresh  │
   └────────┘         └────────────┘

3. Authenticated Requests
   ┌────────┐         ┌────────────┐         ┌────────────┐
   │ Client │────────▶│  GraphQL   │────────▶│  Backend   │
   │ + JWT  │         │  Gateway   │         │  Services  │
   └────────┘         └────────────┘         └────────────┘
```

### Token Storage

- **Access Token**: Stored in memory and localStorage
- **Refresh Token**: Stored in httpOnly cookies (when possible)
- **User Data**: Cached in Zustand store

---

## ⚡ Performance Optimizations

### 1. React Optimizations

```typescript
// Component memoization
export default React.memo(ProductCard);

// Value memoization
const cartTotal = useMemo(
  () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  [items]
);

// Callback memoization
const handleAddToCart = useCallback(
  (product) => {
    addItem(product);
  },
  [addItem]
);
```

### 2. Code Splitting

```typescript
// Dynamic imports
const ProductSlider = dynamic(
  () => import('@/components/ProductSlider'),
  { loading: () => <LoadingProductGrid /> }
);
```

### 3. Image Optimization

- Next.js `<Image>` component with automatic optimization
- Lazy loading with Intersection Observer
- Cloudinary CDN for image delivery

### 4. Debouncing & Throttling

```typescript
// Search input debouncing
const debouncedSearch = useDebounce(searchQuery, 300);

// Scroll event throttling
const throttledScroll = useThrottle(handleScroll, 100);
```

---

## 🎨 Design Patterns

### 1. Provider Pattern

```typescript
// app/providers.tsx
export function Providers({ children }) {
  return (
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <ToastProvider>
            {children}
          </ToastProvider>
        </RecoilRoot>
      </QueryClientProvider>
    </ApolloProvider>
  );
}
```

### 2. Custom Hook Pattern

```typescript
// Encapsulate complex logic in hooks
function useProductFilters() {
  const [filters, setFilters] = useState(defaultFilters);
  const debouncedFilters = useDebounce(filters, 300);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  return { filters: debouncedFilters, updateFilter };
}
```

### 3. Compound Component Pattern

```typescript
// Related components grouped together
<ProductCard>
  <ProductCard.Image src={product.image} />
  <ProductCard.Title>{product.name}</ProductCard.Title>
  <ProductCard.Price value={product.price} />
  <ProductCard.Actions>
    <AddToCartButton />
  </ProductCard.Actions>
</ProductCard>
```

### 4. Container/Presenter Pattern

- **Container**: Handles data fetching and state
- **Presenter**: Pure UI rendering

---

## 🔧 Technology Decisions

### Why Next.js App Router?

| Requirement          | Solution                    |
| -------------------- | --------------------------- |
| SEO                  | Server-side rendering       |
| Performance          | Automatic code splitting    |
| Developer Experience | File-based routing          |
| Type Safety          | Built-in TypeScript support |

### Why Zustand over Redux?

| Factor         | Decision               |
| -------------- | ---------------------- |
| Boilerplate    | Minimal setup required |
| Bundle Size    | Lightweight (~1kb)     |
| Learning Curve | Simple API             |
| Persistence    | Built-in middleware    |

### Why Apollo Client?

| Factor         | Decision                     |
| -------------- | ---------------------------- |
| GraphQL Native | Full GraphQL support         |
| Caching        | Intelligent normalized cache |
| DevTools       | Excellent debugging tools    |
| Ecosystem      | Large community              |

### Why Tailwind CSS + DaisyUI?

| Factor             | Decision                |
| ------------------ | ----------------------- |
| Developer Velocity | Utility-first approach  |
| Bundle Size        | Purged unused styles    |
| Customization      | Theme configuration     |
| Components         | Pre-built UI components |

---

## 📚 Related Documentation

- [API Documentation](API.md) - GraphQL API reference
- [Performance Guide](../PERFORMANCE_IMPLEMENTATION.md) - Optimization details
- [Testing Guide](TESTING.md) - Testing strategies
- [Deployment Guide](DEPLOYMENT.md) - Deployment procedures
