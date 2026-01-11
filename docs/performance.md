# ⚡ Performance Optimization

## Overview

This document explains the performance optimization strategies, techniques, and best practices used in the E-Storefront application to ensure fast loading times and smooth user experience.

---

## 🎯 Performance Goals

### Core Web Vitals Targets

| Metric | Target | Description |
|--------|--------|-------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Time until main content is visible |
| **FID** (First Input Delay) | < 100ms | Time until page responds to input |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Visual stability score |
| **TTFB** (Time to First Byte) | < 600ms | Server response time |
| **TTI** (Time to Interactive) | < 3.5s | Time until fully interactive |

### Why Performance Matters

| Impact | Description |
|--------|-------------|
| **Conversion** | 1s delay = 7% conversion loss |
| **Bounce Rate** | 3s+ load = 53% bounce rate |
| **SEO** | Core Web Vitals affect rankings |
| **User Experience** | Fast = perceived quality |

---

## 🖼️ Image Optimization

### Next.js Image Component

```typescript
// components/ProductCard.tsx
import Image from 'next/image';

export function ProductCard({ product }) {
  return (
    <div className="product-card">
      <Image
        src={product.thumbnail}
        alt={product.name}
        width={300}
        height={300}
        // Automatic optimizations:
        // - WebP/AVIF conversion
        // - Responsive sizing
        // - Lazy loading
        // - Blur placeholder
        placeholder="blur"
        blurDataURL={product.blurHash}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      />
    </div>
  );
}
```

### Image Optimization Benefits

| Feature | Benefit |
|---------|---------|
| **Format Conversion** | WebP/AVIF = 30-50% smaller |
| **Responsive Images** | Right size for viewport |
| **Lazy Loading** | Only load visible images |
| **Blur Placeholder** | Better perceived performance |
| **CDN Caching** | Edge-cached images |

### Image Configuration

```typescript
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'your-cdn.com' },
    ],
    // Image sizes for responsive
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Format preference
    formats: ['image/avif', 'image/webp'],
  },
};
```

---

## 📦 Bundle Optimization

### Code Splitting

Next.js automatically splits code by route:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CODE SPLITTING                                     │
└─────────────────────────────────────────────────────────────────────────────┘

  Initial Load:
  ├── framework.js (React, Next.js core)
  ├── main.js (shared components)
  └── page-specific.js (current route only)

  Route Change:
  └── Only load new route's code
```

### Dynamic Imports

```typescript
// Lazy load heavy components
import dynamic from 'next/dynamic';

// Only load when needed
const ProductReviews = dynamic(() => import('@/components/ProductReviews'), {
  loading: () => <ReviewsSkeleton />,
  ssr: false, // Client-only component
});

// With custom loading
const CheckoutForm = dynamic(
  () => import('@/components/CheckoutForm'),
  {
    loading: () => <FormSkeleton />,
  }
);
```

### Bundle Analysis

```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer

# Or add to package.json
{
  "scripts": {
    "analyze": "ANALYZE=true next build"
  }
}
```

---

## 🗃️ Caching Strategies

### Data Caching Layers

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CACHING LAYERS                                     │
└─────────────────────────────────────────────────────────────────────────────┘

1. BROWSER CACHE
   ├── Static assets (images, fonts, CSS, JS)
   └── Cache-Control headers

2. CDN CACHE (Vercel Edge)
   ├── Static pages
   ├── ISR pages
   └── API responses

3. APPLICATION CACHE
   ├── React Query (server state)
   ├── Apollo InMemoryCache (GraphQL)
   └── Zustand persist (client state)

4. SERVICE WORKER (PWA)
   └── Offline support
```

### React Query Caching

```typescript
// lib/hooks/useProducts.ts
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    // Cache configuration
    staleTime: 5 * 60 * 1000, // Fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
```

### Static Generation with Revalidation

```typescript
// app/products/[id]/page.tsx

// Revalidate every hour
export const revalidate = 3600;

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);
  return <ProductDetail product={product} />;
}

// Or on-demand revalidation
export async function generateStaticParams() {
  const products = await getTopProducts();
  return products.map((p) => ({ id: p.id }));
}
```

---

## 🚀 Server Components

### Benefits

| Benefit | Description |
|---------|-------------|
| **Reduced Bundle** | No JS sent to browser |
| **Direct Data Access** | Fetch on server |
| **Security** | Secrets stay on server |
| **Streaming** | Progressive rendering |

### Pattern

```typescript
// Server Component (default) - No "use client"
// app/products/page.tsx
export default async function ProductsPage() {
  // Fetch directly on server
  const products = await getProducts();
  
  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// Client Component - Only for interactivity
// components/AddToCartButton.tsx
'use client';

export function AddToCartButton({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  
  return (
    <button onClick={() => addItem(product)}>
      Add to Cart
    </button>
  );
}
```

---

## ⚡ Rendering Optimization

### React Optimization Patterns

```typescript
// 1. Memoize expensive components
import { memo } from 'react';

const ProductCard = memo(function ProductCard({ product }) {
  return <div>{/* ... */}</div>;
});

// 2. Use useMemo for expensive calculations
const sortedProducts = useMemo(() => {
  return [...products].sort((a, b) => a.price - b.price);
}, [products]);

// 3. Use useCallback for event handlers
const handleAddToCart = useCallback(() => {
  addItem(product);
}, [product, addItem]);

// 4. Selective Zustand subscriptions
// ❌ Bad - subscribes to entire store
const store = useCartStore();

// ✅ Good - subscribes to specific slice
const itemCount = useCartStore((s) => s.items.length);
```

### Virtualization for Long Lists

```typescript
// For large product lists
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualProductList({ products }) {
  const parentRef = useRef(null);
  
  const virtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
  });
  
  return (
    <div ref={parentRef} className="h-screen overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <ProductCard product={products[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🔤 Font Optimization

### Next.js Font Optimization

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';

// Automatic optimization:
// - Self-hosted fonts
// - Zero layout shift
// - Preloading
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({ children }) {
  return (
    <html className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

### Font Benefits

| Feature | Benefit |
|---------|---------|
| **Self-Hosted** | No external requests |
| **Preloaded** | Available immediately |
| **font-display: swap** | Text visible during load |
| **Subsetting** | Only needed characters |

---

## 📊 Performance Monitoring

### Web Vitals Tracking

```typescript
// app/layout.tsx
import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Send to analytics
    analytics.track('web-vital', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
    });
  });
  
  return null;
}
```

### Performance Checklist

| Area | Optimization |
|------|--------------|
| **Images** | Next/Image, lazy loading, proper sizing |
| **JavaScript** | Code splitting, dynamic imports, tree shaking |
| **CSS** | Tailwind purge, critical CSS inline |
| **Fonts** | Self-hosted, preloaded, swap display |
| **Caching** | React Query, ISR, CDN caching |
| **Rendering** | Server Components, streaming |
| **Third Party** | Lazy load, async scripts |

---

## 🎛️ Configuration Optimizations

### Next.js Production Build

```typescript
// next.config.ts
const nextConfig = {
  // Standalone output for Docker
  output: 'standalone',
  
  // Compress responses
  compress: true,
  
  // Optimize packages
  experimental: {
    optimizePackageImports: ['@3asoftwares/ui'],
  },
  
  // Headers for caching
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

### Tailwind CSS Optimization

```typescript
// tailwind.config.ts
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  // Unused styles removed in production
};
```

---

## 📱 Mobile Performance

### Responsive Loading

```typescript
// Load different components for mobile
const MobileNav = dynamic(() => import('./MobileNav'), {
  ssr: false,
});

const DesktopNav = dynamic(() => import('./DesktopNav'), {
  ssr: false,
});

function Navigation() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return isMobile ? <MobileNav /> : <DesktopNav />;
}
```

### Touch Optimization

```css
/* Larger touch targets for mobile */
.btn {
  min-height: 44px;
  min-width: 44px;
}

/* Prevent 300ms tap delay */
html {
  touch-action: manipulation;
}
```

---

## 📈 Performance Metrics Dashboard

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| LCP | 2.1s | < 2.5s | ✅ |
| FID | 45ms | < 100ms | ✅ |
| CLS | 0.05 | < 0.1 | ✅ |
| Bundle Size | 180KB | < 200KB | ✅ |
| First Load | 2.8s | < 3.0s | ✅ |

---

## 📚 Related Documentation

- [Architecture](architecture.md)
- [Routing & Rendering](routing-rendering.md)
- [SEO](seo.md)
