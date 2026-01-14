# Performance Optimizations Implementation Guide

This document describes all the performance optimization techniques implemented in the E-Storefront web application.

## Table of Contents
1. [Memoization](#memoization)
2. [useMemo](#usememo)
3. [useCallback](#usecallback)
4. [Debouncing](#debouncing)
5. [Throttling](#throttling)
6. [Code Splitting](#code-splitting)
7. [Lazy Loading](#lazy-loading)

---

## 1. Memoization

### React.memo
Prevents unnecessary re-renders by memoizing component output.

**Implementation:**
- `ProductCard` component (components/ProductCard.tsx)
- `ProductSlider` component (components/ProductSlider.tsx)
- `LazyImage` component (components/LazyImage.tsx)

**Example:**
```tsx
const ProductCardComponent: React.FC<ProductCardProps> = ({ product }) => {
  // Component logic
};

export const ProductCard = React.memo(ProductCardComponent);
```

**Benefits:**
- Reduces unnecessary re-renders when parent components update
- Improves performance in lists with many items
- Particularly useful for product grids and sliders

---

## 2. useMemo

Memoizes expensive computations to avoid recalculating on every render.

**Implementations:**

### ProductCard (components/ProductCard.tsx)
```tsx
const isOutOfStock = useMemo(() => product.stock === 0, [product.stock]);

const isInCart = useMemo(
  () => items.some((item) => item.id === product.id),
  [items, product.id]
);

const heightClasses = useMemo(
  () => ({
    default: 'h-40 xs:h-48 sm:h-56',
    compact: 'h-28 xs:h-32',
    large: 'h-52 xs:h-60 sm:h-64',
  }),
  []
);
```

### ProductSlider (components/ProductSlider.tsx)
```tsx
const maxIndex = useMemo(
  () => Math.max(0, Math.ceil(totalItems / responsive) - 1),
  [totalItems, responsive]
);

const slides = useMemo(
  () => Array.from({ length: Math.ceil(totalItems / responsive) }).map(...),
  [totalItems, responsive, children]
);
```

### Header (components/Header.tsx)
```tsx
const cartItemCount = useMemo(() => {
  return items.length > 9 ? '9+' : items.length;
}, [items.length]);

const wishlistCount = useMemo(() => {
  return wishlist.length > 9 ? '9+' : wishlist.length;
}, [wishlist.length]);
```

### Products Page (app/products/page.tsx)
```tsx
const CATEGORIES = useMemo(
  () => [
    { value: 'All', label: 'All Categories' },
    ...categoryList.map((cat) => ({ value: cat.name, label: cat.name })),
  ],
  [categoryList]
);
```

**Benefits:**
- Prevents expensive calculations on every render
- Improves performance for complex data transformations
- Reduces memory allocations for constant values

---

## 3. useCallback

Memoizes callback functions to prevent unnecessary child re-renders.

**Implementations:**

### ProductCard (components/ProductCard.tsx)
```tsx
const handleAddToCart = useCallback(() => {
  onAddToCart?.(product);
}, [onAddToCart, product]);

const handleWishlistToggle = useCallback(() => {
  onWishlistToggle?.(product);
}, [onWishlistToggle, product]);
```

### Header (components/Header.tsx)
```tsx
const handleSearch = useCallback((e: React.FormEvent) => {
  e.preventDefault();
  if (searchQuery.trim()) {
    router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery('');
  }
}, [searchQuery, router]);

const handleLogout = useCallback(() => {
  clearAuthCookies();
  setUser(null);
  setIsMenuOpen(false);
  router.push('/');
}, [router]);

const toggleMobileMenu = useCallback(() => {
  setIsMobileMenuOpen(prev => !prev);
}, []);

const closeMobileMenu = useCallback(() => {
  setIsMobileMenuOpen(false);
}, []);
```

### Home Page (app/page.tsx)
```tsx
const handleAddToCart = useCallback((product: any) => {
  addItem({
    productId: product.id,
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 1,
  });
  showToast(`${product.name} added to cart!`, 'success');
}, [addItem, showToast]);
```

### Products Page (app/products/page.tsx)
```tsx
const handleAddToCart = useCallback((product: any) => {
  addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 1,
    image: product.imageUrl || '/placeholder.png',
    productId: product.id,
    sellerId: product.sellerId,
  });
  showToast(`${product.name} added to cart!`, 'success');
}, [addItem, showToast]);

const handleWishlistToggle = useCallback((product: any) => {
  if (isInWishlist(product.id)) {
    removeFromWishlist(product.id);
    showToast('Removed from wishlist', 'info');
  } else {
    addToWishlist({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl || '/placeholder.png',
      addedAt: Date.now(),
    });
    showToast('Added to wishlist', 'success');
  }
}, [isInWishlist, removeFromWishlist, addToWishlist, showToast]);
```

### ProductSlider (components/ProductSlider.tsx)
```tsx
const handleResize = useCallback(() => {
  const width = window.innerWidth;
  if (width < 640) {
    setResponsive(1); 
  } else if (width < 768) {
    setResponsive(2); 
  } else if (width < 1024) {
    setResponsive(3); 
  } else {
    setResponsive(itemsPerView); 
  }
}, [itemsPerView]);

const goToPrevious = useCallback(() => {
  setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
}, [maxIndex]);

const goToNext = useCallback(() => {
  setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
}, [maxIndex]);

const goToSlide = useCallback((index: number) => {
  setCurrentIndex(index);
}, []);
```

**Benefits:**
- Prevents child components from re-rendering unnecessarily
- Essential when passing callbacks to memoized child components
- Improves performance in interactive components

---

## 4. Debouncing

Delays function execution until after a specified time has passed since the last invocation.

**Implementation:**

### Custom Hook: useDebounce (lib/hooks/useDebounce.ts)
```tsx
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

### Utility Function: debounce (lib/utils/debounce.ts)
```tsx
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return function debounced(...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
```

### Usage in Products Page (app/products/page.tsx)
```tsx
const [tempSearch, setTempSearch] = useState('');
const [tempPriceRange, setTempPriceRange] = useState({ min: 0, max: 0 });

// Debounced values - automatically updates after 500ms delay
const search = useDebounce(tempSearch, 500);
const priceRange = useDebounce(tempPriceRange, 500);
```

**Use Cases:**
- Search input fields
- Price range filters
- Form validation
- API calls triggered by user input

**Benefits:**
- Reduces API calls (saves bandwidth and server resources)
- Improves user experience (no lag while typing)
- Prevents unnecessary re-renders
- Reduces computational overhead

---

## 5. Throttling

Limits function execution to once per specified time interval.

**Implementation:**

### Custom Hook: useThrottle (lib/hooks/useThrottle.ts)
```tsx
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  limit: number = 300
): (...args: Parameters<T>) => void {
  const inThrottle = useRef(false);
  const lastRan = useRef(Date.now());

  return useCallback(
    (...args: Parameters<T>) => {
      if (!inThrottle.current) {
        callback(...args);
        lastRan.current = Date.now();
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

### Utility Function: throttle (lib/utils/throttle.ts)
```tsx
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastResult: ReturnType<T>;

  return function throttled(...args: Parameters<T>) {
    if (!inThrottle) {
      lastResult = func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
    return lastResult;
  };
}
```

### Scroll Detection Hook: useScrollToBottom (lib/hooks/useScrollToBottom.ts)
```tsx
export function useScrollToBottom(
  callback: () => void,
  threshold: number = 300,
  throttleMs: number = 300
) {
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const handleScroll = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const clientHeight = window.innerHeight;

    if (scrollHeight - (scrollTop + clientHeight) <= threshold) {
      callbackRef.current();
    }
  }, [threshold]);

  const throttledScroll = useThrottle(handleScroll, throttleMs);

  useEffect(() => {
    window.addEventListener('scroll', throttledScroll);
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [throttledScroll]);
}
```

**Use Cases:**
- Scroll event handlers
- Window resize handlers
- Mouse move tracking
- Infinite scroll implementations

**Usage Example:**
```tsx
// In a component with infinite scroll
useScrollToBottom(() => {
  if (!isLoading && hasMore) {
    loadMoreProducts();
  }
}, 300, 300);
```

**Benefits:**
- Prevents performance issues from high-frequency events
- Reduces CPU usage during scroll/resize
- Improves responsiveness
- Essential for infinite scroll patterns

---

## 6. Code Splitting

Divides code into smaller chunks that are loaded on demand.

**Implementation:**

### Dynamic Import in Home Page (app/page.tsx)
```tsx
import dynamic from 'next/dynamic';

// Code Splitting - Lazy load ProductSlider component
const ProductSlider = dynamic(
  () => import('@/components').then((mod) => ({ default: mod.ProductSlider })),
  {
    loading: () => <LoadingProductGrid count={4} />,
    ssr: true,
  }
);
```

**Features:**
- Only loads ProductSlider when needed
- Shows loading skeleton while component loads
- Maintains SSR for better SEO
- Reduces initial bundle size

**Other Candidates for Code Splitting:**
```tsx
// Heavy chart libraries
const ProductAnalytics = dynamic(() => import('@/components/ProductAnalytics'), {
  loading: () => <Spinner />,
  ssr: false,
});

// Modal dialogs
const CheckoutModal = dynamic(() => import('@/components/CheckoutModal'));

// Admin panels
const AdminDashboard = dynamic(() => import('@/components/AdminDashboard'), {
  ssr: false,
});
```

**Benefits:**
- Smaller initial bundle size
- Faster page load times
- Better performance scores
- Improved user experience
- Reduced bandwidth usage

---

## 7. Lazy Loading

Defers loading of resources until they're needed.

**Implementation:**

### LazyImage Component (components/LazyImage.tsx)
```tsx
export const LazyImage: React.FC<LazyImageProps> = React.memo(({
  src,
  alt,
  fallback,
  threshold = 0.1,
  className = '',
  onError,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold,
      }
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, [src, threshold]);

  // ... rest of component
});
```

### Usage Example:
```tsx
import { LazyImage } from '@/components';

// In ProductCard or similar component
<LazyImage 
  src={product.imageUrl}
  alt={product.name}
  className="w-full h-full object-cover"
  fallback={
    <div className="flex items-center justify-center">
      <FontAwesomeIcon icon={faBox} className="w-16 h-16 text-gray-400" />
    </div>
  }
/>
```

### Native Lazy Loading in ProductCard:
```tsx
<img
  src={product.imageUrl}
  alt={product.name}
  loading="lazy"  // Native browser lazy loading
  className="w-full h-full object-cover"
  onError={handleImageError}
/>
```

**Benefits:**
- Reduces initial page load time
- Saves bandwidth (doesn't load off-screen images)
- Improves performance metrics (LCP, FCP)
- Better mobile experience
- SEO-friendly

---

## Performance Monitoring

### Metrics to Track:
1. **First Contentful Paint (FCP)** - Should improve with code splitting
2. **Largest Contentful Paint (LCP)** - Should improve with lazy loading
3. **Time to Interactive (TTI)** - Should improve with all optimizations
4. **Total Blocking Time (TBT)** - Should decrease with memoization
5. **Cumulative Layout Shift (CLS)** - Maintained with proper loading states

### Tools:
- Chrome DevTools Performance tab
- Lighthouse
- React DevTools Profiler
- Next.js built-in analytics

---

## Best Practices Summary

### ✅ Do:
- Use React.memo for components that render frequently with same props
- Use useMemo for expensive calculations
- Use useCallback for functions passed to memoized child components
- Debounce user input for search and filters
- Throttle scroll and resize event handlers
- Code split large components and third-party libraries
- Lazy load images that are below the fold
- Measure performance before and after optimizations

### ❌ Don't:
- Over-optimize: Don't memoize everything
- Use useMemo/useCallback for simple operations
- Forget to include all dependencies in dependency arrays
- Ignore the performance cost of the optimization itself
- Code split critical above-the-fold content
- Lazy load hero images or important content

---

## Implementation Checklist

- ✅ Memoization with React.memo
- ✅ useMemo for computed values
- ✅ useCallback for event handlers
- ✅ Debouncing for search inputs
- ✅ Throttling for scroll events
- ✅ Code splitting with dynamic imports
- ✅ Lazy loading for images

---

## File Structure

```
lib/
├── hooks/
│   ├── useDebounce.ts          # Debounce hook
│   ├── useThrottle.ts          # Throttle hook
│   ├── useScrollToBottom.ts    # Scroll detection with throttling
│   └── index.ts                # Export all hooks
├── utils/
│   ├── debounce.ts             # Debounce utility function
│   └── throttle.ts             # Throttle utility function
components/
├── LazyImage.tsx               # Lazy loading image component
├── ProductCard.tsx             # Optimized with memo & callbacks
├── ProductSlider.tsx           # Optimized with memo & callbacks
├── Header.tsx                  # Optimized with callbacks
└── index.ts                    # Export all components
app/
├── page.tsx                    # Home page with code splitting
└── products/
    └── page.tsx                # Products page with debouncing
```

---

## Additional Resources

- [React Optimization Docs](https://react.dev/reference/react)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web Vitals](https://web.dev/vitals/)
- [MDN Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
