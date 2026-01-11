# 🔍 SEO Documentation

## Overview

This document explains the Search Engine Optimization (SEO) strategies, metadata management, and discoverability features implemented in the E-Storefront application.

---

## 🎯 SEO Goals

### Why SEO Matters for E-Commerce

| Impact | Description |
|--------|-------------|
| **Organic Traffic** | 53% of website traffic comes from organic search |
| **Cost Efficiency** | Free traffic vs. paid advertising |
| **Trust** | Higher rankings = perceived credibility |
| **Long-term ROI** | Compounds over time |
| **User Intent** | Searchers have high purchase intent |

### SEO Objectives

| Objective | Strategy |
|-----------|----------|
| **Product Discovery** | Optimize product pages for search |
| **Category Rankings** | Target category keywords |
| **Brand Visibility** | Build brand awareness |
| **Local SEO** | Target geographic markets |
| **Rich Results** | Structured data for enhanced listings |

---

## 📝 Metadata Strategy

### Next.js Metadata API

```typescript
// app/layout.tsx - Global metadata
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://store.3asoftwares.com'),
  title: {
    default: '3A Softwares Store - Quality Products',
    template: '%s | 3A Softwares Store',
  },
  description: 'Shop the best products at 3A Softwares Store. Fast shipping, secure payments, and excellent customer service.',
  keywords: ['e-commerce', 'online shopping', 'products', '3A Softwares'],
  authors: [{ name: '3A Softwares' }],
  creator: '3A Softwares',
  publisher: '3A Softwares',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://store.3asoftwares.com',
    siteName: '3A Softwares Store',
    title: '3A Softwares Store - Quality Products',
    description: 'Shop the best products at 3A Softwares Store.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '3A Softwares Store',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '3A Softwares Store',
    description: 'Shop the best products at 3A Softwares Store.',
    images: ['/twitter-image.png'],
    creator: '@3asoftwares',
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
};
```

### Page-Specific Metadata

```typescript
// app/products/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Products',
  description: 'Browse our complete collection of quality products. Filter by category, price, and more.',
  openGraph: {
    title: 'Shop All Products | 3A Softwares Store',
    description: 'Browse our complete collection of quality products.',
  },
};
```

### Dynamic Metadata

```typescript
// app/products/[id]/page.tsx
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { id: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const product = await getProduct(params.id);
  
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images.map((img) => ({
        url: img,
        width: 800,
        height: 600,
        alt: product.name,
      })),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description.slice(0, 160),
      images: [product.images[0]],
    },
  };
}
```

---

## 🗺️ Sitemap Configuration

### Dynamic Sitemap

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://store.3asoftwares.com';
  
  // Static pages
  const staticPages = [
    '',
    '/products',
    '/about',
    '/contact',
    '/faq',
    '/shipping',
    '/returns',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));
  
  // Dynamic product pages
  const products = await getAllProducts();
  const productPages = products.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));
  
  // Category pages
  const categories = await getAllCategories();
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/products?category=${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));
  
  return [...staticPages, ...productPages, ...categoryPages];
}
```

### Sitemap Benefits

| Benefit | Description |
|---------|-------------|
| **Discovery** | Helps search engines find all pages |
| **Priority** | Indicates important pages |
| **Freshness** | Shows when content was updated |
| **Crawl Efficiency** | Guides crawler behavior |

---

## 🤖 Robots.txt

```typescript
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/cart',
          '/checkout',
          '/orders',
          '/profile',
          '/api/',
          '/_next/',
          '/admin/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/cart', '/checkout', '/orders', '/profile'],
      },
    ],
    sitemap: 'https://store.3asoftwares.com/sitemap.xml',
  };
}
```

---

## 📊 Structured Data (JSON-LD)

### Product Schema

```typescript
// components/ProductJsonLd.tsx
interface ProductJsonLdProps {
  product: Product;
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand || '3A Softwares',
    },
    offers: {
      '@type': 'Offer',
      url: `https://store.3asoftwares.com/products/${product.id}`,
      priceCurrency: 'USD',
      price: product.price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: '3A Softwares Store',
      },
    },
    aggregateRating: product.reviewCount > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    } : undefined,
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

### Organization Schema

```typescript
// components/OrganizationJsonLd.tsx
export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '3A Softwares',
    url: 'https://store.3asoftwares.com',
    logo: 'https://store.3asoftwares.com/logo.png',
    sameAs: [
      'https://twitter.com/3asoftwares',
      'https://facebook.com/3asoftwares',
      'https://linkedin.com/company/3asoftwares',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-XXX-XXX-XXXX',
      contactType: 'customer service',
      availableLanguage: 'English',
    },
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

### Breadcrumb Schema

```typescript
// components/BreadcrumbJsonLd.tsx
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

---

## 🔗 Canonical URLs

### Implementation

```typescript
// app/products/[id]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    alternates: {
      canonical: `https://store.3asoftwares.com/products/${params.id}`,
    },
  };
}
```

### Why Canonical URLs?

| Issue | Solution |
|-------|----------|
| Duplicate content | Point to primary URL |
| Parameter variations | Consolidate link equity |
| Multiple domains | Specify preferred domain |
| Pagination | Handle paginated content |

---

## 📱 Social Media Optimization

### Open Graph Tags

```html
<!-- Rendered output -->
<meta property="og:title" content="Product Name | 3A Softwares Store">
<meta property="og:description" content="Product description...">
<meta property="og:image" content="https://store.3asoftwares.com/product-image.jpg">
<meta property="og:url" content="https://store.3asoftwares.com/products/123">
<meta property="og:type" content="product">
<meta property="og:site_name" content="3A Softwares Store">
```

### Twitter Cards

```html
<!-- Rendered output -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Product Name">
<meta name="twitter:description" content="Product description...">
<meta name="twitter:image" content="https://store.3asoftwares.com/product-image.jpg">
<meta name="twitter:creator" content="@3asoftwares">
```

---

## 🏷️ On-Page SEO

### Heading Hierarchy

```typescript
// Proper heading structure
<h1>Product Name</h1>  {/* Only one per page */}
  <h2>Description</h2>
  <h2>Specifications</h2>
    <h3>Technical Details</h3>
    <h3>Dimensions</h3>
  <h2>Customer Reviews</h2>
    <h3>Top Reviews</h3>
```

### Semantic HTML

```typescript
// components/ProductPage.tsx
export function ProductPage({ product }) {
  return (
    <article itemScope itemType="https://schema.org/Product">
      <header>
        <h1 itemProp="name">{product.name}</h1>
        <p itemProp="description">{product.description}</p>
      </header>
      
      <section aria-label="Product Images">
        <figure>
          <img
            src={product.image}
            alt={product.name}
            itemProp="image"
          />
          <figcaption>{product.imageCaption}</figcaption>
        </figure>
      </section>
      
      <section aria-label="Pricing">
        <data itemProp="price" value={product.price}>
          ${product.price}
        </data>
      </section>
      
      <aside aria-label="Related Products">
        <Recommendations />
      </aside>
    </article>
  );
}
```

### Image Alt Text

```typescript
// Descriptive alt text
<Image
  src={product.image}
  alt={`${product.name} - ${product.color} ${product.category}`}
/>

// Example: "Nike Air Max 90 - White Running Shoes"
```

---

## 🔍 Technical SEO

### Performance (Core Web Vitals)

| Factor | Impact | Our Solution |
|--------|--------|--------------|
| **LCP** | Ranking factor | Image optimization, SSR |
| **FID** | User experience | Code splitting |
| **CLS** | User experience | Dimension hints |

### Mobile-First

```typescript
// Responsive meta tag
<meta name="viewport" content="width=device-width, initial-scale=1" />

// Mobile-friendly design
// - Touch-friendly buttons
// - Readable text without zoom
// - No horizontal scroll
```

### HTTPS

All pages served over HTTPS (handled by Vercel/hosting).

### Page Speed

- Image optimization
- Code splitting
- Lazy loading
- CDN caching

---

## 📊 SEO Checklist

### Per-Page Checklist

| Item | Required | Optimal |
|------|----------|---------|
| Title tag | ✅ 50-60 chars | Include primary keyword |
| Meta description | ✅ 150-160 chars | Include CTA |
| H1 heading | ✅ One per page | Match title intent |
| Images | ✅ Alt text | Descriptive, keyword-rich |
| Internal links | ✅ Relevant links | Breadcrumbs |
| Canonical URL | ✅ Set | Absolute URL |
| Structured data | ⭐ Product schema | Rich results |
| OG/Twitter tags | ⭐ Social sharing | Preview images |

### Site-Wide Checklist

| Item | Status |
|------|--------|
| Sitemap.xml | ✅ |
| Robots.txt | ✅ |
| HTTPS | ✅ |
| Mobile-friendly | ✅ |
| Core Web Vitals | ✅ |
| Structured data | ✅ |
| 404 page | ✅ |
| Clean URLs | ✅ |

---

## 📚 Related Documentation

- [Performance](performance.md)
- [Routing & Rendering](routing-rendering.md)
- [Next.js Overview](nextjs-overview.md)
