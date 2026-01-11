# 📁 Project Structure

## Overview

This document explains the folder organization, file naming conventions, and architectural decisions behind the project structure.

---

## 🗂️ Root Directory

```
e-storefront-web/
├── 📁 app/                    # Next.js App Router (pages & layouts)
├── 📁 components/             # Reusable UI components
├── 📁 lib/                    # Utilities, hooks, and services
├── 📁 store/                  # State management
├── 📁 tests/                  # Test files and mocks
├── 📁 public/                 # Static assets
├── 📁 docs/                   # Documentation
├── 📁 .github/                # GitHub workflows and templates
├── 📁 types/                  # TypeScript declarations
├── 📁 coverage/               # Test coverage reports
├── 📄 package.json            # Dependencies and scripts
├── 📄 next.config.ts          # Next.js configuration
├── 📄 tailwind.config.ts      # Tailwind CSS configuration
├── 📄 tsconfig.json           # TypeScript configuration
├── 📄 jest.config.js          # Jest configuration
├── 📄 postcss.config.js       # PostCSS configuration
├── 📄 Dockerfile              # Development Docker
├── 📄 Dockerfile.prod         # Production Docker
├── 📄 docker-compose.yml      # Docker Compose
└── 📄 README.md               # Project documentation
```

---

## 📱 App Directory (Next.js App Router)

The `app/` directory uses Next.js 16 App Router conventions.

```
app/
├── 📄 layout.tsx              # Root layout (providers, header, footer)
├── 📄 page.tsx                # Homepage (/)
├── 📄 providers.tsx           # Context providers wrapper
├── 📄 globals.css             # Global styles
├── 📄 manifest.json           # PWA manifest
│
├── 📁 products/               # Product routes (/products)
│   ├── 📄 layout.tsx          # Products layout
│   ├── 📄 page.tsx            # Product listing (/products)
│   └── 📁 [id]/               # Dynamic product route
│       └── 📄 page.tsx        # Product detail (/products/:id)
│
├── 📁 cart/                   # Cart route (/cart)
│   └── 📄 page.tsx
│
├── 📁 checkout/               # Checkout route (/checkout)
│   └── 📄 page.tsx
│
├── 📁 orders/                 # Order routes (/orders)
│   ├── 📄 page.tsx            # Order history (/orders)
│   └── 📁 [id]/               # Order detail route
│       └── 📄 page.tsx        # Order detail (/orders/:id)
│
├── 📁 profile/                # Profile route (/profile)
│   └── 📄 page.tsx
│
├── 📁 wishlist/               # Wishlist route (/wishlist)
│   └── 📄 page.tsx
│
├── 📁 login/                  # Login route (/login)
│   └── 📄 page.tsx
│
├── 📁 signup/                 # Signup route (/signup)
│   └── 📄 page.tsx
│
├── 📁 forgot-password/        # Password reset request
│   └── 📄 page.tsx
│
├── 📁 reset-password/         # Password reset form
│   └── 📄 page.tsx
│
├── 📁 verify-email/           # Email verification
│   └── 📄 page.tsx
│
├── 📁 about/                  # About page (/about)
│   └── 📄 page.tsx
│
├── 📁 contact/                # Contact page (/contact)
│   └── 📄 page.tsx
│
├── 📁 faq/                    # FAQ page (/faq)
│   └── 📄 page.tsx
│
├── 📁 shipping/               # Shipping info (/shipping)
│   └── 📄 page.tsx
│
└── 📁 returns/                # Returns policy (/returns)
    └── 📄 page.tsx
```

### File Conventions

| File | Purpose |
|------|---------|
| `page.tsx` | Page component (renders at route) |
| `layout.tsx` | Shared layout wrapper |
| `loading.tsx` | Loading UI (Suspense fallback) |
| `error.tsx` | Error boundary |
| `not-found.tsx` | 404 page |

---

## 🧩 Components Directory

```
components/
├── 📄 index.ts                # Barrel export file
│
├── 📄 Header.tsx              # Main navigation header
├── 📄 HeaderWrapper.tsx       # Client-side header wrapper
├── 📄 Footer.tsx              # Site footer
├── 📄 FooterWrapper.tsx       # Client-side footer wrapper
│
├── 📄 ProductCard.tsx         # Product display card
├── 📄 ProductCardCompact.tsx  # Compact product card variant
├── 📄 ProductCardSkeleton.tsx # Loading skeleton for product card
├── 📄 ProductSlider.tsx       # Product carousel/slider
├── 📄 ProductForm.tsx         # Product form (admin)
├── 📄 ProductReviews.tsx      # Product reviews section
│
├── 📄 FeaturedProducts.tsx    # Featured products section
├── 📄 FeaturedCategories.tsx  # Category browsing section
├── 📄 Recommendations.tsx     # Product recommendations
│
├── 📄 LoadingProductGrid.tsx  # Grid of loading skeletons
├── 📄 EmptyState.tsx          # Empty state display
├── 📄 PageHeader.tsx          # Page header with icon/title
├── 📄 SectionHeader.tsx       # Section header component
│
├── 📄 CategoryModal.tsx       # Category selection modal
└── 📄 GoogleSignInButton.tsx  # Google OAuth button
```

### Component Naming Conventions

| Pattern | Example | Usage |
|---------|---------|-------|
| `PascalCase` | `ProductCard.tsx` | All components |
| `*Wrapper` | `HeaderWrapper.tsx` | Client-side wrappers |
| `*Skeleton` | `ProductCardSkeleton.tsx` | Loading states |
| `*Modal` | `CategoryModal.tsx` | Modal dialogs |
| `*Form` | `ProductForm.tsx` | Form components |

---

## 📚 Lib Directory

```
lib/
├── 📁 apollo/                 # GraphQL client setup
│   ├── 📄 client.ts           # Apollo Client configuration
│   └── 📁 queries/            # GraphQL operations
│       ├── 📄 index.ts        # All queries and mutations
│       └── 📄 fragments.ts    # Shared GraphQL fragments
│
└── 📁 hooks/                  # Custom React hooks
    ├── 📄 index.ts            # Barrel export
    │
    ├── 📄 useAuth.ts          # Authentication operations
    ├── 📄 useInitializeAuth.ts# Auth initialization
    ├── 📄 useTokenValidator.ts# Token validation/refresh
    │
    ├── 📄 useProducts.ts      # Product data fetching
    ├── 📄 useCategories.ts    # Category data fetching
    ├── 📄 useOrders.ts        # Order operations
    ├── 📄 useReviews.ts       # Review operations
    ├── 📄 useAddresses.ts     # Address management
    │
    ├── 📄 usePasswordReset.ts # Password reset flow
    ├── 📄 useEmailVerification.ts # Email verification
    ├── 📄 useUpdateProfile.ts # Profile updates
    │
    └── 📄 useToast.tsx        # Toast notifications
```

### Hook Naming Conventions

| Pattern | Example | Purpose |
|---------|---------|---------|
| `use*` | `useProducts` | Custom hooks (React convention) |
| `use[Entity]` | `useOrders` | Data fetching hooks |
| `use[Action]` | `usePasswordReset` | Action-based hooks |

---

## 🗃️ Store Directory

```
store/
├── 📄 index.ts                # Barrel export
├── 📄 cartStore.ts            # Zustand cart store
├── 📄 categoryStore.ts        # Zustand category store
└── 📄 recoilState.ts          # Recoil atoms and selectors
```

### Store Structure Pattern

```typescript
// cartStore.ts structure
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      wishlist: [],
      recentlyViewed: [],
      addresses: [],
      
      // Actions
      addItem: (item) => set(...),
      removeItem: (id) => set(...),
      clearCart: () => set(...),
      
      // Computed (via get())
      getTotal: () => get().items.reduce(...),
    }),
    { name: 'cart-storage' }
  )
);
```

---

## 🧪 Tests Directory

```
tests/
├── 📄 setup.tsx               # Jest setup file
│
├── 📁 __mocks__/              # Mock implementations
│   ├── 📄 fontawesome.tsx     # FontAwesome mock
│   ├── 📄 types.ts            # Type mocks
│   ├── 📄 ui-library.tsx      # @3asoftwares/ui mock
│   └── 📄 utils.ts            # @3asoftwares/utils mock
│
├── 📁 components/             # Component tests
│   ├── 📄 EmptyState.test.tsx
│   ├── 📄 FeaturedCategories.test.tsx
│   ├── 📄 FeaturedProducts.test.tsx
│   ├── 📄 Footer.test.tsx
│   ├── 📄 GoogleSignInButton.test.tsx
│   ├── 📄 Header.test.tsx
│   ├── 📄 ProductCard.test.tsx
│   ├── 📄 ProductReviews.test.tsx
│   └── 📄 SectionHeader.test.tsx
│
├── 📁 hooks/                  # Hook tests
│   ├── 📄 useAuth.test.tsx
│   ├── 📄 useOrders.test.tsx
│   └── 📄 useProducts.test.tsx
│
├── 📁 lib/                    # Library tests
│   └── 📄 apollo-client.test.ts
│
└── 📁 store/                  # Store tests
    └── 📄 cartStore.test.ts
```

### Test Naming Conventions

| Pattern | Example | Description |
|---------|---------|-------------|
| `*.test.tsx` | `ProductCard.test.tsx` | Component tests |
| `*.test.ts` | `cartStore.test.ts` | Non-component tests |
| `__mocks__/` | `fontawesome.tsx` | Mock files |

---

## 📂 Public Directory

```
public/
├── 📄 sw.js                   # Service Worker (PWA)
├── 📄 favicon.ico             # Favicon
├── 📄 robots.txt              # Search engine rules
├── 📄 sitemap.xml             # Sitemap
└── 📁 images/                 # Static images
    ├── logo.svg
    └── ...
```

---

## 📝 Types Directory

```
types/
└── 📄 declarations.d.ts       # TypeScript declarations
```

### Declaration Patterns

```typescript
// declarations.d.ts
declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}

declare module '@3asoftwares/ui' {
  // UI component types
}
```

---

## ⚙️ Configuration Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js configuration (output, images, webpack) |
| `tailwind.config.ts` | Tailwind CSS theme, plugins, content paths |
| `tsconfig.json` | TypeScript compiler options, paths |
| `jest.config.js` | Jest test runner configuration |
| `postcss.config.js` | CSS processing configuration |
| `.env.example` | Environment variable template |
| `.gitignore` | Git ignore patterns |
| `.dockerignore` | Docker build ignore patterns |

---

## 🐳 Docker Files

| File | Purpose |
|------|---------|
| `Dockerfile` | Development Docker image |
| `Dockerfile.prod` | Multi-stage production image |
| `docker-compose.yml` | Local development compose |
| `docker-compose.prod.yml` | Production compose |

---

## 📊 Import Aliases

Configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Usage Examples

```typescript
// Instead of relative imports
import { ProductCard } from '../../../components/ProductCard';

// Use alias imports
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/lib/hooks/useProducts';
import { useCartStore } from '@/store/cartStore';
```

---

## 📚 Related Documentation

- [Architecture](architecture.md)
- [Routing & Rendering](routing-rendering.md)
- [State Management](state-management.md)
