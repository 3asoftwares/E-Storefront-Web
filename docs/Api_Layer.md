# 🌐 API Layer Documentation

## Overview

This document explains the API integration architecture, GraphQL usage, error handling patterns, and data fetching strategies used in the E-Storefront application.

---

## 🎯 API Architecture

### API Stack

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           API LAYER ARCHITECTURE                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              APPLICATION                                     │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                     Custom Hooks (lib/hooks/)                          │  │
│  │   useProducts │ useOrders │ useAuth │ useReviews │ useAddresses       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    │                                         │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                     TanStack React Query                               │  │
│  │              (Caching, Deduplication, Background Refresh)              │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    │                                         │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                        Apollo Client                                   │  │
│  │   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │  │
│  │   │  Auth Link  │→│ Error Link  │→│ HTTP Link   │→│   Cache     │    │  │
│  │   └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            EXTERNAL APIS                                     │
│  ┌───────────────────────┐           ┌───────────────────────┐              │
│  │     GraphQL API       │           │      Auth API         │              │
│  │  ─────────────────    │           │  ─────────────────    │              │
│  │  Products, Orders     │           │  JWT, OAuth           │              │
│  │  Categories, Reviews  │           │  Token Refresh        │              │
│  │  Addresses, Coupons   │           │  Email Verification   │              │
│  └───────────────────────┘           └───────────────────────┘              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔷 GraphQL Integration

### What is GraphQL?

GraphQL is a query language for APIs that allows clients to request exactly the data they need, nothing more, nothing less.

### Why GraphQL?

| Benefit | Description |
|---------|-------------|
| **Precise Data Fetching** | Request only needed fields |
| **Single Endpoint** | One URL for all operations |
| **Type System** | Strong typing via schema |
| **Introspection** | Self-documenting API |
| **Real-time** | Subscriptions support |
| **Developer Tools** | GraphQL Playground, Apollo DevTools |

### Apollo Client Configuration

```typescript
// lib/apollo/client.ts
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// HTTP Link - connects to GraphQL endpoint
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
});

// Auth Link - adds authorization header
const authLink = setContext((_, { headers }) => {
  const token = getAccessToken(); // From auth utility
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Error Link - handles errors globally
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(`[GraphQL error]: Message: ${message}`);
      
      // Handle authentication errors
      if (extensions?.code === 'UNAUTHENTICATED') {
        clearAuth();
        window.location.href = '/login';
      }
    });
  }
  
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Cache configuration
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        products: {
          // Merge paginated results
          keyArgs: ['category', 'search'],
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
        orders: {
          keyArgs: false,
          merge(existing = [], incoming) {
            return incoming; // Replace for orders
          },
        },
      },
    },
    Product: {
      keyFields: ['id'],
    },
    Order: {
      keyFields: ['id'],
    },
  },
});

// Create Apollo Client
export const apolloClient = new ApolloClient({
  link: from([authLink, errorLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
```

---

## 📝 GraphQL Operations

### Query Examples

```typescript
// lib/apollo/queries/index.ts
import { gql } from '@apollo/client';

// ============ PRODUCT QUERIES ============

export const GET_PRODUCTS = gql`
  query GetProducts(
    $limit: Int
    $offset: Int
    $category: ID
    $search: String
    $sort: ProductSort
  ) {
    products(
      limit: $limit
      offset: $offset
      category: $category
      search: $search
      sort: $sort
    ) {
      id
      name
      slug
      price
      comparePrice
      thumbnail
      rating
      reviewCount
      inStock
      category {
        id
        name
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      slug
      description
      price
      comparePrice
      images
      rating
      reviewCount
      inStock
      specifications {
        name
        value
      }
      category {
        id
        name
        slug
      }
      seller {
        id
        name
      }
    }
  }
`;

// ============ ORDER QUERIES ============

export const GET_ORDERS = gql`
  query GetOrders($limit: Int, $offset: Int) {
    orders(limit: $limit, offset: $offset) {
      id
      orderNumber
      status
      total
      createdAt
      items {
        id
        product {
          name
          thumbnail
        }
        quantity
        price
      }
    }
  }
`;

export const GET_ORDER = gql`
  query GetOrder($id: ID!) {
    order(id: $id) {
      id
      orderNumber
      status
      subtotal
      tax
      shipping
      total
      createdAt
      shippingAddress {
        street
        city
        state
        zip
        country
      }
      items {
        id
        product {
          id
          name
          thumbnail
        }
        quantity
        price
      }
      payment {
        method
        status
      }
    }
  }
`;

// ============ CATEGORY QUERIES ============

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      slug
      image
      productCount
    }
  }
`;
```

### Mutation Examples

```typescript
// lib/apollo/queries/index.ts (continued)

// ============ AUTH MUTATIONS ============

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      refreshToken
      user {
        id
        email
        firstName
        lastName
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
        firstName
        lastName
      }
    }
  }
`;

export const GOOGLE_AUTH = gql`
  mutation GoogleAuth($token: String!) {
    googleAuth(token: $token) {
      accessToken
      refreshToken
      user {
        id
        email
        firstName
        lastName
      }
    }
  }
`;

// ============ ORDER MUTATIONS ============

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      orderNumber
      status
      total
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation CancelOrder($id: ID!) {
    cancelOrder(id: $id) {
      id
      status
    }
  }
`;

// ============ REVIEW MUTATIONS ============

export const CREATE_REVIEW = gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      id
      rating
      comment
      createdAt
      user {
        firstName
      }
    }
  }
`;

// ============ ADDRESS MUTATIONS ============

export const ADD_ADDRESS = gql`
  mutation AddAddress($input: AddressInput!) {
    addAddress(input: $input) {
      id
      label
      street
      city
      state
      zip
      country
      isDefault
    }
  }
`;

export const UPDATE_ADDRESS = gql`
  mutation UpdateAddress($id: ID!, $input: AddressInput!) {
    updateAddress(id: $id, input: $input) {
      id
      label
      street
      city
      state
      zip
      country
      isDefault
    }
  }
`;

export const DELETE_ADDRESS = gql`
  mutation DeleteAddress($id: ID!) {
    deleteAddress(id: $id)
  }
`;
```

---

## 🪝 Custom Hooks

### Products Hook

```typescript
// lib/hooks/useProducts.ts
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { apolloClient } from '@/lib/apollo/client';
import { GET_PRODUCTS, GET_PRODUCT } from '@/lib/apollo/queries';

interface UseProductsOptions {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
  sort?: 'price-asc' | 'price-desc' | 'newest' | 'rating';
}

export function useProducts(options: UseProductsOptions = {}) {
  const { category, search, limit = 20, offset = 0, sort } = options;
  
  return useQuery({
    queryKey: ['products', { category, search, limit, offset, sort }],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GET_PRODUCTS,
        variables: { category, search, limit, offset, sort },
        fetchPolicy: 'network-only',
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
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useInfiniteProducts(options: Omit<UseProductsOptions, 'offset'> = {}) {
  const { category, search, limit = 20, sort } = options;
  
  return useInfiniteQuery({
    queryKey: ['products', 'infinite', { category, search, sort }],
    queryFn: async ({ pageParam = 0 }) => {
      const { data } = await apolloClient.query({
        query: GET_PRODUCTS,
        variables: { category, search, limit, offset: pageParam, sort },
      });
      return data.products;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) return undefined;
      return allPages.flat().length;
    },
    initialPageParam: 0,
  });
}
```

### Orders Hook

```typescript
// lib/hooks/useOrders.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apolloClient } from '@/lib/apollo/client';
import { GET_ORDERS, GET_ORDER, CREATE_ORDER, CANCEL_ORDER } from '@/lib/apollo/queries';

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GET_ORDERS,
        fetchPolicy: 'network-only',
      });
      return data.orders;
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GET_ORDER,
        variables: { id },
      });
      return data.order;
    },
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: CreateOrderInput) => {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_ORDER,
        variables: { input },
      });
      return data.createOrder;
    },
    onSuccess: (newOrder) => {
      // Add to orders cache
      queryClient.setQueryData(['orders'], (old: Order[] = []) => [
        newOrder,
        ...old,
      ]);
      
      // Invalidate for fresh data
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apolloClient.mutate({
        mutation: CANCEL_ORDER,
        variables: { id },
      });
      return data.cancelOrder;
    },
    onSuccess: (updatedOrder) => {
      // Update order in cache
      queryClient.setQueryData(['order', updatedOrder.id], updatedOrder);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
```

---

## ❌ Error Handling

### Error Types

| Type | Description | Handling |
|------|-------------|----------|
| **Network Error** | Connection failed | Show retry option |
| **Authentication Error** | Token expired/invalid | Redirect to login |
| **Validation Error** | Invalid input | Show field errors |
| **Not Found** | Resource doesn't exist | Show 404 page |
| **Server Error** | Backend failure | Show error message |

### Global Error Handler

```typescript
// lib/apollo/client.ts
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach((error) => {
      const { message, extensions } = error;
      
      switch (extensions?.code) {
        case 'UNAUTHENTICATED':
          // Clear auth and redirect
          clearAuth();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          break;
          
        case 'FORBIDDEN':
          // User doesn't have permission
          console.error('Permission denied:', message);
          break;
          
        case 'BAD_USER_INPUT':
          // Validation error - let component handle
          break;
          
        case 'NOT_FOUND':
          // Resource not found - let component handle
          break;
          
        default:
          // Log unexpected errors
          console.error('GraphQL Error:', message);
      }
    });
  }
  
  if (networkError) {
    console.error('Network Error:', networkError);
    // Could show toast notification here
  }
});
```

### Component-Level Error Handling

```typescript
// components/ProductList.tsx
'use client';

import { useProducts } from '@/lib/hooks/useProducts';

export function ProductList() {
  const { data, isLoading, error, refetch } = useProducts();
  
  if (isLoading) {
    return <ProductGridSkeleton />;
  }
  
  if (error) {
    return (
      <div className="error-state">
        <h3>Failed to load products</h3>
        <p>{error.message}</p>
        <button onClick={() => refetch()}>
          Try Again
        </button>
      </div>
    );
  }
  
  if (!data || data.length === 0) {
    return <EmptyState message="No products found" />;
  }
  
  return (
    <div className="product-grid">
      {data.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Form Error Handling

```typescript
// components/LoginForm.tsx
'use client';

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await login({ email, password });
      router.push('/');
    } catch (err) {
      if (err instanceof Error) {
        // Handle specific error messages
        if (err.message.includes('Invalid credentials')) {
          setError('Email or password is incorrect');
        } else if (err.message.includes('Email not verified')) {
          setError('Please verify your email first');
        } else {
          setError('Login failed. Please try again.');
        }
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-error">{error}</div>
      )}
      {/* Form fields */}
    </form>
  );
}
```

---

## 🔒 REST API (Auth Service)

### Auth API Integration

```typescript
// lib/hooks/useAuth.ts
import axios from 'axios';

const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
authApi.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle token refresh
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const { data } = await authApi.post('/refresh', { refreshToken });
          storeAuth(data);
          
          // Retry original request
          error.config.headers.Authorization = `Bearer ${data.accessToken}`;
          return authApi(error.config);
        } catch {
          clearAuth();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export { authApi };
```

### Email Verification

```typescript
// lib/hooks/useEmailVerification.ts
import { authApi } from './useAuth';

export function useEmailVerification() {
  const sendVerification = async (email: string) => {
    const { data } = await authApi.post('/send-verification', { email });
    return data;
  };
  
  const verifyEmail = async (token: string) => {
    const { data } = await authApi.post('/verify-email', { token });
    return data;
  };
  
  return { sendVerification, verifyEmail };
}
```

---

## 📊 Caching Strategy

### Cache Policies

| Data Type | Cache Time | Strategy |
|-----------|------------|----------|
| Products | 5 minutes | Cache-first, background refetch |
| Product Detail | 10 minutes | Cache-first |
| Categories | 1 hour | Cache-first |
| Orders | No cache | Network-only |
| User Profile | 5 minutes | Cache-first |
| Reviews | 5 minutes | Cache-first |

### Cache Invalidation

```typescript
// When to invalidate cache

// After creating order
queryClient.invalidateQueries({ queryKey: ['orders'] });

// After submitting review
queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
queryClient.invalidateQueries({ queryKey: ['product', productId] });

// After updating profile
queryClient.invalidateQueries({ queryKey: ['user'] });

// After adding address
queryClient.invalidateQueries({ queryKey: ['addresses'] });
```

---

## 📚 Related Documentation

- [Architecture](architecture.md)
- [State Management](state-management.md)
- [Authentication](auth-flow.md)
- [API Reference](api-documentation.md)
