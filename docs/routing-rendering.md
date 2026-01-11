# 🛣️ Routing & Rendering

## Overview

This document explains Next.js App Router conventions, server-side rendering strategies, and routing patterns used in the E-Storefront application.

---

## 📁 Next.js App Router

### What is App Router?

App Router is Next.js 13+'s file-based routing system that uses the `app/` directory. It introduces:

- **Server Components** by default
- **Nested layouts** for shared UI
- **Loading/Error states** per route
- **Route groups** for organization

### Why App Router?

| Benefit | Description |
|---------|-------------|
| **Simpler Mental Model** | Folders = routes, files = UI |
| **Better Performance** | Server Components reduce JS bundle |
| **Improved DX** | Colocation of data fetching |
| **Streaming** | Progressive rendering |

---

## 🗺️ Route Structure

### File-Based Routing

```
app/
├── page.tsx              → /
├── products/
│   ├── page.tsx          → /products
│   └── [id]/
│       └── page.tsx      → /products/:id
├── cart/
│   └── page.tsx          → /cart
├── orders/
│   ├── page.tsx          → /orders
│   └── [id]/
│       └── page.tsx      → /orders/:id
└── login/
    └── page.tsx          → /login
```

### Special Files

| File | Purpose |
|------|---------|
| `page.tsx` | Unique UI for a route |
| `layout.tsx` | Shared UI wrapper |
| `loading.tsx` | Loading UI (Suspense fallback) |
| `error.tsx` | Error boundary |
| `not-found.tsx` | 404 page |
| `route.ts` | API endpoint |

---

## 🎯 Rendering Strategies

### Server-Side Rendering (SSR)

**What is it?**
HTML is generated on the server for each request.

**When to use:**
- Data changes frequently
- SEO is important
- Personalized content

**Implementation:**

```typescript
// app/products/page.tsx
export default async function ProductsPage() {
  // This fetches on every request
  const products = await getProducts();
  
  return <ProductList products={products} />;
}
```

### Static Site Generation (SSG)

**What is it?**
HTML is generated at build time and reused for every request.

**When to use:**
- Content rarely changes
- Pages are the same for all users
- Maximum performance needed

**Implementation:**

```typescript
// app/about/page.tsx
export default function AboutPage() {
  // No data fetching - static page
  return <AboutContent />;
}

// Can generate static paths
export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }];
}
```

### Incremental Static Regeneration (ISR)

**What is it?**
Static pages that revalidate after a specified interval.

**When to use:**
- Content changes periodically
- Want static performance with fresh data
- High traffic pages

**Implementation:**

```typescript
// app/products/[id]/page.tsx
export const revalidate = 3600; // Revalidate every hour

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);
  return <ProductDetail product={product} />;
}
```

### Client-Side Rendering (CSR)

**What is it?**
Content is rendered in the browser using JavaScript.

**When to use:**
- Private/personalized data
- Highly interactive UI
- No SEO requirement

**Implementation:**

```typescript
// components/Cart.tsx
'use client';

export default function Cart() {
  const { items } = useCartStore();
  
  return <CartItems items={items} />;
}
```

---

## 📊 Rendering Strategy by Page

| Page | Strategy | Reason |
|------|----------|--------|
| **Homepage** | SSR + ISR (1hr) | Fresh content, SEO important |
| **Product Listing** | SSR | Dynamic filters, SEO needed |
| **Product Detail** | SSG + ISR (1hr) | Static content, SEO critical |
| **Category Pages** | SSR + ISR | SEO, moderate changes |
| **Cart** | CSR | Private, highly interactive |
| **Checkout** | CSR | Private, form-heavy |
| **Orders** | CSR | Private user data |
| **Profile** | CSR | Private user data |
| **Login/Signup** | SSR | SEO for auth pages |
| **About/FAQ** | SSG | Static content |

---

## 🧩 Server vs Client Components

### Server Components (Default)

```typescript
// No 'use client' directive = Server Component
// app/products/page.tsx

export default async function ProductsPage() {
  // Can use async/await directly
  const products = await fetchProducts();
  
  // Can access server-only resources
  // Cannot use hooks or browser APIs
  
  return <ProductGrid products={products} />;
}
```

**Benefits:**
- No JavaScript sent to browser
- Direct database/API access
- Better security (secrets stay on server)
- Faster initial page load

### Client Components

```typescript
// 'use client' directive = Client Component
// components/AddToCartButton.tsx
'use client';

import { useCartStore } from '@/store/cartStore';

export default function AddToCartButton({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  
  // Can use hooks and browser APIs
  return (
    <button onClick={() => addItem(product)}>
      Add to Cart
    </button>
  );
}
```

**When to use:**
- Interactive elements (onClick, onChange)
- Browser APIs (localStorage, window)
- React hooks (useState, useEffect)
- Third-party client libraries

### Composition Pattern

```typescript
// Server Component wraps Client Component
// app/products/[id]/page.tsx

import AddToCartButton from '@/components/AddToCartButton';

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      {/* Client component for interactivity */}
      <AddToCartButton product={product} />
    </div>
  );
}
```

---

## 📐 Layouts

### Root Layout

```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
```

### Nested Layouts

```typescript
// app/products/layout.tsx
export default function ProductsLayout({ children }) {
  return (
    <div className="products-container">
      <Sidebar />
      <div className="products-content">
        {children}
      </div>
    </div>
  );
}
```

**Layout Hierarchy:**

```
RootLayout
├── Header
├── ProductsLayout
│   ├── Sidebar
│   └── ProductsPage (or ProductDetailPage)
└── Footer
```

---

## ⏳ Loading States

### Route-Level Loading

```typescript
// app/products/loading.tsx
export default function ProductsLoading() {
  return <ProductGridSkeleton />;
}
```

### Component-Level Suspense

```typescript
// app/products/page.tsx
import { Suspense } from 'react';

export default function ProductsPage() {
  return (
    <div>
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid />
      </Suspense>
      <Suspense fallback={<FiltersSkeleton />}>
        <Filters />
      </Suspense>
    </div>
  );
}
```

---

## ❌ Error Handling

### Error Boundary

```typescript
// app/products/error.tsx
'use client';

export default function ProductsError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### Not Found

```typescript
// app/products/[id]/not-found.tsx
export default function ProductNotFound() {
  return (
    <div>
      <h2>Product Not Found</h2>
      <p>The product you're looking for doesn't exist.</p>
    </div>
  );
}
```

---

## 🔗 Navigation

### Link Component

```typescript
import Link from 'next/link';

// Prefetches on hover
<Link href="/products">Products</Link>

// Dynamic route
<Link href={`/products/${product.id}`}>
  {product.name}
</Link>

// With query params
<Link href={{ pathname: '/products', query: { category: 'electronics' } }}>
  Electronics
</Link>
```

### Programmatic Navigation

```typescript
'use client';

import { useRouter } from 'next/navigation';

function CheckoutButton() {
  const router = useRouter();
  
  const handleCheckout = () => {
    // Navigate programmatically
    router.push('/checkout');
    
    // Other methods
    // router.replace('/checkout'); // No history entry
    // router.back(); // Go back
    // router.refresh(); // Refresh server components
  };
  
  return <button onClick={handleCheckout}>Checkout</button>;
}
```

---

## 🎣 Route Parameters

### Dynamic Routes

```typescript
// app/products/[id]/page.tsx
export default function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  return <div>Product ID: {params.id}</div>;
}
```

### Catch-All Routes

```typescript
// app/[...slug]/page.tsx
// Matches /a, /a/b, /a/b/c, etc.
export default function CatchAllPage({
  params,
}: {
  params: { slug: string[] };
}) {
  return <div>Slug: {params.slug.join('/')}</div>;
}
```

### Query Parameters

```typescript
'use client';

import { useSearchParams } from 'next/navigation';

function ProductFilters() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  
  return <div>Category: {category}</div>;
}
```

---

## 🔄 Data Fetching Patterns

### Parallel Data Fetching

```typescript
// Fetch in parallel for better performance
export default async function Page() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);
  
  return (
    <>
      <Categories data={categories} />
      <Products data={products} />
    </>
  );
}
```

### Sequential Data Fetching

```typescript
// When data depends on previous result
export default async function Page({ params }) {
  const product = await getProduct(params.id);
  const reviews = await getReviews(product.id);
  
  return (
    <>
      <ProductDetail product={product} />
      <Reviews reviews={reviews} />
    </>
  );
}
```

---

## 📚 Related Documentation

- [Architecture](architecture.md)
- [Performance](performance.md)
- [SEO](seo.md)
