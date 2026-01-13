# 🗃️ State Management

## Overview

This document explains the state management architecture, patterns, and best practices used in the E-Storefront application.

---

## 🎯 State Categories

### State Classification

| Type | Technology | Description | Examples |
|------|------------|-------------|----------|
| **Client State** | Zustand | User-controlled, persisted | Cart, wishlist, preferences |
| **UI State** | Recoil | Ephemeral, UI-specific | Filters, modals, sort order |
| **Server State** | React Query | Remote data, cached | Products, orders, reviews |
| **URL State** | Next.js Router | Navigation, shareable | Page, product ID, filters |

### State Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            STATE ARCHITECTURE                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                                URL STATE                                     │
│                    (Next.js Router - useSearchParams)                        │
│              /products?category=electronics&sort=price                       │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │ ▲
                                    ▼ │
┌─────────────────────────────────────────────────────────────────────────────┐
│                                 UI STATE                                     │
│                        (Recoil - atoms/selectors)                            │
│                    searchQuery, priceRange, sortOrder                        │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
┌─────────────────────────┐ ┌─────────────┐ ┌─────────────────────────┐
│     CLIENT STATE        │ │SERVER STATE │ │     COMPONENT STATE     │
│     (Zustand)           │ │(React Query)│ │     (useState)          │
│                         │ │             │ │                         │
│ • cart items            │ │ • products  │ │ • form inputs           │
│ • wishlist              │ │ • orders    │ │ • loading states        │
│ • recently viewed       │ │ • reviews   │ │ • UI toggles            │
│ • user preferences      │ │ • categories│ │                         │
│                         │ │             │ │                         │
│ [localStorage persist]  │ │ [API cache] │ │ [component lifecycle]   │
└─────────────────────────┘ └─────────────┘ └─────────────────────────┘
```

---

## 🐻 Zustand (Client State)

### What is Zustand?

Zustand is a small, fast, and scalable state management library. It uses a simple API with no boilerplate.

### Why Zustand?

| Benefit | Description |
|---------|-------------|
| **Minimal API** | Simple to learn and use |
| **No Providers** | Direct store access |
| **Persistence** | Built-in localStorage middleware |
| **TypeScript** | Excellent type inference |
| **Performance** | Selective subscriptions |
| **Size** | ~1KB gzipped |

### Cart Store Implementation

```typescript
// store/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  // State
  items: CartItem[];
  wishlist: string[];
  recentlyViewed: string[];
  addresses: Address[];
  
  // Cart Actions
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  
  // Wishlist Actions
  addToWishlist: (id: string) => void;
  removeFromWishlist: (id: string) => void;
  
  // Recently Viewed
  addToRecentlyViewed: (id: string) => void;
  
  // Computed
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial State
      items: [],
      wishlist: [],
      recentlyViewed: [],
      addresses: [],
      
      // Cart Actions
      addItem: (item) => set((state) => {
        const existing = state.items.find((i) => i.id === item.id);
        if (existing) {
          return {
            items: state.items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          };
        }
        return { items: [...state.items, item] };
      }),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      })),
      
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map((i) =>
          i.id === id ? { ...i, quantity } : i
        ),
      })),
      
      clearCart: () => set({ items: [] }),
      
      // Wishlist Actions
      addToWishlist: (id) => set((state) => ({
        wishlist: [...state.wishlist, id],
      })),
      
      removeFromWishlist: (id) => set((state) => ({
        wishlist: state.wishlist.filter((i) => i !== id),
      })),
      
      // Recently Viewed (max 12)
      addToRecentlyViewed: (id) => set((state) => ({
        recentlyViewed: [
          id,
          ...state.recentlyViewed.filter((i) => i !== id),
        ].slice(0, 12),
      })),
      
      // Computed Values
      getTotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },
      
      getItemCount: () => {
        return get().items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage', // localStorage key
      partialize: (state) => ({
        items: state.items,
        wishlist: state.wishlist,
        recentlyViewed: state.recentlyViewed,
      }),
    }
  )
);
```

### Using Zustand in Components

```typescript
// components/CartIcon.tsx
'use client';

import { useCartStore } from '@/store/cartStore';

export function CartIcon() {
  // Subscribe to specific slice
  const itemCount = useCartStore((state) => state.getItemCount());
  
  return (
    <div className="cart-icon">
      <ShoppingCart />
      {itemCount > 0 && (
        <span className="badge">{itemCount}</span>
      )}
    </div>
  );
}
```

```typescript
// components/AddToCartButton.tsx
'use client';

import { useCartStore } from '@/store/cartStore';

export function AddToCartButton({ product }) {
  // Get action without subscribing to state
  const addItem = useCartStore((state) => state.addItem);
  
  return (
    <button onClick={() => addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    })}>
      Add to Cart
    </button>
  );
}
```

---

## ⚛️ Recoil (UI State)

### What is Recoil?

Recoil is a state management library with atomic state units (atoms) and derived state (selectors).

### Why Recoil?

| Benefit | Description |
|---------|-------------|
| **Atoms** | Fine-grained state units |
| **Selectors** | Computed/derived state |
| **Async Selectors** | Built-in async support |
| **React-like** | Feels like useState |
| **DevTools** | Debug state changes |

### Recoil State Implementation

```typescript
// store/recoilState.ts
import { atom, selector } from 'recoil';

// ============ ATOMS (source of truth) ============

export const searchQueryAtom = atom<string>({
  key: 'searchQuery',
  default: '',
});

export const categoryFilterAtom = atom<string | null>({
  key: 'categoryFilter',
  default: null,
});

export const priceRangeAtom = atom<[number, number]>({
  key: 'priceRange',
  default: [0, 10000],
});

export const sortOrderAtom = atom<'price-asc' | 'price-desc' | 'name' | 'newest'>({
  key: 'sortOrder',
  default: 'newest',
});

export const productsAtom = atom<Product[]>({
  key: 'products',
  default: [],
});

// ============ SELECTORS (derived state) ============

export const filteredProductsSelector = selector<Product[]>({
  key: 'filteredProducts',
  get: ({ get }) => {
    const products = get(productsAtom);
    const search = get(searchQueryAtom).toLowerCase();
    const category = get(categoryFilterAtom);
    const [minPrice, maxPrice] = get(priceRangeAtom);
    
    return products.filter((product) => {
      // Search filter
      if (search && !product.name.toLowerCase().includes(search)) {
        return false;
      }
      
      // Category filter
      if (category && product.category !== category) {
        return false;
      }
      
      // Price filter
      if (product.price < minPrice || product.price > maxPrice) {
        return false;
      }
      
      return true;
    });
  },
});

export const sortedProductsSelector = selector<Product[]>({
  key: 'sortedProducts',
  get: ({ get }) => {
    const products = get(filteredProductsSelector);
    const sortOrder = get(sortOrderAtom);
    
    return [...products].sort((a, b) => {
      switch (sortOrder) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  },
});
```

### Using Recoil in Components

```typescript
// components/ProductFilters.tsx
'use client';

import { useRecoilState, useRecoilValue } from 'recoil';
import {
  searchQueryAtom,
  categoryFilterAtom,
  priceRangeAtom,
  sortOrderAtom,
} from '@/store/recoilState';

export function ProductFilters() {
  const [search, setSearch] = useRecoilState(searchQueryAtom);
  const [category, setCategory] = useRecoilState(categoryFilterAtom);
  const [priceRange, setPriceRange] = useRecoilState(priceRangeAtom);
  const [sortOrder, setSortOrder] = useRecoilState(sortOrderAtom);
  
  return (
    <div className="filters">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
      />
      
      <select
        value={category || ''}
        onChange={(e) => setCategory(e.target.value || null)}
      >
        <option value="">All Categories</option>
        {/* category options */}
      </select>
      
      {/* Price range slider */}
      {/* Sort dropdown */}
    </div>
  );
}
```

```typescript
// components/ProductGrid.tsx
'use client';

import { useRecoilValue } from 'recoil';
import { sortedProductsSelector } from '@/store/recoilState';

export function ProductGrid() {
  // Subscribe to derived state
  const products = useRecoilValue(sortedProductsSelector);
  
  return (
    <div className="grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

---

## 🔄 TanStack React Query (Server State)

### What is React Query?

React Query is a data-fetching and server state management library that handles caching, background updates, and synchronization.

### Why React Query?

| Benefit | Description |
|---------|-------------|
| **Caching** | Automatic response caching |
| **Deduplication** | Prevents duplicate requests |
| **Background Refetch** | Keeps data fresh |
| **Stale While Revalidate** | Show cached data while fetching |
| **Optimistic Updates** | Instant UI feedback |
| **DevTools** | Visualize cache state |

### Query Implementation

```typescript
// lib/hooks/useProducts.ts
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { apolloClient } from '@/lib/apollo/client';
import { GET_PRODUCTS, GET_PRODUCT } from '@/lib/apollo/queries';

export function useProducts(options?: {
  category?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['products', options],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GET_PRODUCTS,
        variables: options,
      });
      return data.products;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GET_PRODUCT,
        variables: { id },
      });
      return data.product;
    },
    enabled: !!id, // Only fetch if id exists
  });
}

export function useInfiniteProducts(category?: string) {
  return useInfiniteQuery({
    queryKey: ['products', 'infinite', category],
    queryFn: async ({ pageParam = 0 }) => {
      const { data } = await apolloClient.query({
        query: GET_PRODUCTS,
        variables: {
          category,
          offset: pageParam,
          limit: 20,
        },
      });
      return data.products;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 20 ? allPages.length * 20 : undefined;
    },
    initialPageParam: 0,
  });
}
```

### Mutation Implementation

```typescript
// lib/hooks/useOrders.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderData) => {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_ORDER,
        variables: orderData,
      });
      return data.createOrder;
    },
    onSuccess: () => {
      // Invalidate and refetch orders
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      console.error('Order creation failed:', error);
    },
  });
}
```

### Using React Query in Components

```typescript
// app/products/page.tsx
'use client';

import { useProducts } from '@/lib/hooks/useProducts';

export default function ProductsPage() {
  const { data, isLoading, error, refetch } = useProducts();
  
  if (isLoading) return <ProductGridSkeleton />;
  if (error) return <ErrorState onRetry={refetch} />;
  
  return <ProductGrid products={data} />;
}
```

---

## 🔗 State Integration Patterns

### Combining State Types

```typescript
// components/ProductCard.tsx
'use client';

import { useCartStore } from '@/store/cartStore';
import { useRecoilValue } from 'recoil';
import { currencyAtom } from '@/store/recoilState';

export function ProductCard({ product }) {
  // Client state (Zustand)
  const addItem = useCartStore((s) => s.addItem);
  const wishlist = useCartStore((s) => s.wishlist);
  const isInWishlist = wishlist.includes(product.id);
  
  // UI state (Recoil)
  const currency = useRecoilValue(currencyAtom);
  
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>{formatPrice(product.price, currency)}</p>
      
      <button onClick={() => addItem(product)}>
        Add to Cart
      </button>
      
      <button className={isInWishlist ? 'active' : ''}>
        {isInWishlist ? '❤️' : '🤍'}
      </button>
    </div>
  );
}
```

### Provider Setup

```typescript
// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RecoilRoot } from 'recoil';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/lib/apollo/client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={apolloClient}>
        <RecoilRoot>
          {children}
        </RecoilRoot>
      </ApolloProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
```

---

## 📊 State Management Comparison

| Aspect | Zustand | Recoil | React Query |
|--------|---------|--------|-------------|
| **Use Case** | Client state | UI state | Server state |
| **Persistence** | localStorage | Memory/URL | Memory cache |
| **Updates** | Synchronous | Synchronous | Asynchronous |
| **Boilerplate** | Minimal | Low | Low |
| **DevTools** | Yes | Yes | Yes |
| **SSR** | Needs hydration | Needs hydration | Built-in |

---

## 🎯 Best Practices

### Do's

✅ Use Zustand for client-side data that needs persistence
✅ Use Recoil for UI state like filters and search
✅ Use React Query for all server data fetching
✅ Keep state close to where it's used
✅ Use selectors for derived state

### Don'ts

❌ Don't duplicate server state in client stores
❌ Don't use global state for component-local state
❌ Don't mutate state directly
❌ Don't over-engineer state management

---

## 📚 Related Documentation

- [Architecture](architecture.md)
- [API Layer](api-layer.md)
- [Performance](performance.md)
