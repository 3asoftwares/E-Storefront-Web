# Performance Optimization

Performance best practices and optimizations for E-Storefront Web.

---

## 📑 Table of Contents

- [Overview](#overview)
- [React Optimizations](#react-optimizations)
- [Next.js Optimizations](#nextjs-optimizations)
- [Bundle Optimization](#bundle-optimization)
- [Image Optimization](#image-optimization)
- [Caching Strategies](#caching-strategies)
- [Monitoring](#monitoring)

---

## 🌐 Overview

### Core Web Vitals Targets

| Metric | Target  | Description              |
| ------ | ------- | ------------------------ |
| LCP    | < 2.5s  | Largest Contentful Paint |
| FID    | < 100ms | First Input Delay        |
| CLS    | < 0.1   | Cumulative Layout Shift  |
| TTFB   | < 600ms | Time to First Byte       |

---

## ⚛️ React Optimizations

### React.memo

Prevent re-renders for components with unchanged props:

```tsx
// components/ProductCard.tsx
const ProductCardComponent: React.FC<ProductCardProps> = ({ product }) => {
  // Component logic
};

export const ProductCard = React.memo(ProductCardComponent);

// Applied to: ProductCard, ProductSlider, LazyImage, CartItem
```

### useMemo

Memoize expensive computations:

```tsx
// Expensive calculations
const isOutOfStock = useMemo(() => product.stock === 0, [product.stock]);

const isInCart = useMemo(() => items.some((item) => item.id === product.id), [items, product.id]);

// Complex transformations
const sortedProducts = useMemo(() => products.sort((a, b) => a.price - b.price), [products]);
```

### useCallback

Memoize event handlers:

```tsx
const handleAddToCart = useCallback(() => {
  addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 1,
  });
}, [product, addItem]);

const handleSearch = useCallback(
  (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/products?search=${encodeURIComponent(query)}`);
  },
  [query, router]
);
```

---

## 🚀 Next.js Optimizations

### Dynamic Imports (Code Splitting)

```tsx
import dynamic from 'next/dynamic';

// Heavy components loaded on demand
const ProductSlider = dynamic(() => import('@/components/ProductSlider'), {
  loading: () => <SliderSkeleton />,
  ssr: true,
});

// Client-only components
const ChartComponent = dynamic(() => import('@/components/Chart'), { ssr: false });
```

### Image Optimization

```tsx
import Image from 'next/image';

<Image
  src={product.imageUrl}
  alt={product.name}
  width={400}
  height={400}
  loading="lazy"
  placeholder="blur"
  blurDataURL={BLUR_PLACEHOLDER}
  sizes="(max-width: 768px) 100vw, 50vw"
/>;
```

### Route Prefetching

```tsx
import Link from 'next/link';

// Automatic prefetch on hover
<Link href="/products" prefetch={true}>
  Products
</Link>;

// Manual prefetch
router.prefetch('/checkout');
```

---

## 📦 Bundle Optimization

### Bundle Analysis

```bash
# Analyze bundle size
ANALYZE=true yarn build
```

### Tree Shaking

```tsx
// ✅ Good - Named imports enable tree shaking
import { formatPrice, formatDate } from '@3asoftwares/utils';

// ❌ Bad - Imports entire package
import * as utils from '@3asoftwares/utils';
```

### Lazy Loading Libraries

```tsx
// Load heavy libraries on demand
const loadChartJS = () => import('chart.js');

useEffect(() => {
  if (showChart) {
    loadChartJS().then((ChartJS) => {
      // Initialize chart
    });
  }
}, [showChart]);
```

---

## 🖼️ Image Optimization

### Next.js Image Component

```tsx
// Responsive images with automatic optimization
<Image
  src="/hero.jpg"
  alt="Hero"
  fill
  priority // Above-the-fold images
  sizes="100vw"
  quality={85}
/>
```

### LazyImage Component

```tsx
// components/LazyImage.tsx
export const LazyImage = React.memo(({ src, alt, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLoaded(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return <img ref={imgRef} src={isLoaded ? src : undefined} alt={alt} loading="lazy" {...props} />;
});
```

---

## 💾 Caching Strategies

### React Query Caching

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

### Apollo Client Cache

```tsx
const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          products: {
            keyArgs: ['category', 'search'],
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});
```

### Service Worker (PWA)

```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\..*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60, // 1 hour
        },
      },
    },
  ],
});
```

---

## 🎯 Debouncing & Throttling

### useDebounce Hook

```tsx
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Usage
const debouncedSearch = useDebounce(searchQuery, 300);
```

### useThrottle Hook

```tsx
export function useThrottle<T extends (...args: any[]) => any>(callback: T, limit: number) {
  const inThrottle = useRef(false);

  return useCallback(
    (...args: Parameters<T>) => {
      if (!inThrottle.current) {
        callback(...args);
        inThrottle.current = true;
        setTimeout(() => {
          inThrottle.current = false;
        }, limit);
      }
    },
    [callback, limit]
  );
}
```

---

## 📊 Monitoring

### Web Vitals Tracking

```tsx
// app/layout.tsx
import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric);
    // Send to analytics
    analytics.track('web-vital', {
      name: metric.name,
      value: metric.value,
      id: metric.id,
    });
  });
}
```

### Lighthouse CI

```bash
# Run Lighthouse audit
npx lighthouse http://localhost:3004 --view
```

---

## ✅ Performance Checklist

### Before Production

- [ ] Run bundle analysis
- [ ] Enable image optimization
- [ ] Implement code splitting
- [ ] Add proper caching headers
- [ ] Enable gzip/brotli compression
- [ ] Test Core Web Vitals

### Ongoing

- [ ] Monitor Lighthouse scores
- [ ] Track real user metrics
- [ ] Review bundle size on PRs
- [ ] Profile React renders

---

## Related Documentation

- [PERFORMANCE_IMPLEMENTATION.md](PERFORMANCE_IMPLEMENTATION.md) - Implementation checklist
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [TESTING.md](TESTING.md) - Performance testing
