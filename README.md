# 🛍️ E-Storefront Web Application

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?logo=next.js)
![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)
![Tests](https://img.shields.io/badge/Coverage-60%25+-brightgreen)

**A modern, full-featured e-commerce storefront built with Next.js 16 App Router**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Tech Stack](#-tech-stack)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Documentation](#-documentation)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Scripts](#-scripts)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

E-Storefront is a **customer-facing e-commerce web application** that provides a complete online shopping experience. Built with modern React patterns and Next.js 16 App Router, it delivers exceptional performance, SEO optimization, and a seamless user experience.

### Why E-Storefront?

| Benefit | Description |
|---------|-------------|
| 🚀 **Performance** | Server-side rendering, image optimization, code splitting |
| 🔍 **SEO-Ready** | Metadata API, dynamic sitemaps, structured data |
| 📱 **Responsive** | Mobile-first design with Tailwind CSS |
| 🔒 **Secure** | JWT authentication, Google OAuth, secure token handling |
| 🧪 **Tested** | 60%+ code coverage with Jest & React Testing Library |
| 🐳 **Containerized** | Docker-ready with multi-stage production builds |
| 🔄 **CI/CD** | Automated testing and deployment with GitHub Actions |

---

## ✨ Features

### 🛒 Shopping Experience

| Feature | Description |
|---------|-------------|
| **Product Catalog** | Browse products with filtering, sorting, and search |
| **Category Navigation** | Organized browsing by product categories |
| **Product Details** | Rich product pages with images, reviews, specifications |
| **Shopping Cart** | Full cart management with quantity controls |
| **Wishlist** | Save products for later purchase |
| **Recently Viewed** | Track browsing history (up to 12 items) |

### 💳 Checkout & Orders

| Feature | Description |
|---------|-------------|
| **Multi-Step Checkout** | Address → Delivery → Payment → Review |
| **Address Management** | Save and manage multiple addresses |
| **Coupon Codes** | Apply discount codes at checkout |
| **Order History** | View past orders with status tracking |
| **Order Details** | Detailed order information and invoices |

### 👤 User Account

| Feature | Description |
|---------|-------------|
| **Email/Password Auth** | Traditional registration and login |
| **Google OAuth** | One-click sign in with Google |
| **Email Verification** | Secure email confirmation flow |
| **Password Reset** | Self-service password recovery |
| **Profile Management** | Update personal information |

### 📄 Information Pages

| Page | Purpose |
|------|---------|
| **About** | Company story and values |
| **Contact** | Contact form for inquiries |
| **FAQ** | Searchable frequently asked questions |
| **Shipping** | Shipping methods and policies |
| **Returns** | Return policy and process |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ 
- **npm**, **yarn**, or **pnpm**
- **Docker** (optional, for containerized development)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/e-storefront-web.git
cd e-storefront-web

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

The application will be available at **http://localhost:3003**

### Docker Development

```bash
# Start with Docker Compose
docker compose up storefront-dev

# Or build and run manually
docker build -t storefront-dev .
docker run -p 3003:3003 storefront-dev
```

### Production Build

```bash
# Local production build
npm run build
npm start

# Docker production build
docker build -f Dockerfile.prod -t storefront-prod \
  --build-arg NEXT_PUBLIC_AUTH_SERVICE_URL=https://auth.example.com \
  --build-arg NEXT_PUBLIC_GRAPHQL_URL=https://api.example.com/graphql \
  .

docker run -p 3003:3003 storefront-prod
```

---

## 📚 Documentation

Comprehensive documentation is available in the `docs/` folder:

| Document | Description |
|----------|-------------|
| [Next.js Overview](docs/nextjs-overview.md) | App purpose, SEO goals, technology choices |
| [Tech Stack](docs/tech-stack.md) | Detailed technology breakdown |
| [Architecture](docs/architecture.md) | System design and patterns |
| [Project Structure](docs/project-structure.md) | Folder organization and conventions |
| [Routing & Rendering](docs/routing-rendering.md) | App Router, SSR/SSG/ISR strategies |
| [State Management](docs/state-management.md) | Zustand, Recoil, React Query patterns |
| [API Layer](docs/api-layer.md) | GraphQL integration, error handling |
| [Authentication](docs/auth-flow.md) | JWT handling, OAuth, middleware |
| [Performance](docs/performance.md) | Optimization strategies |
| [SEO](docs/seo.md) | Metadata, sitemaps, structured data |
| [Testing](docs/testing.md) | Test strategy and coverage |
| [CI/CD Pipeline](docs/ci-cd-pipeline.md) | GitHub Actions workflows |
| [Docker](docs/docker-implementation.md) | Container configuration |
| [Deployment](docs/deployment.md) | Vercel, Docker, environment setup |
| [API Documentation](docs/api-documentation.md) | GraphQL queries and mutations |

---

## 🛠️ Tech Stack

### Core Framework
- **Next.js 16.1.1** - React framework with App Router
- **React 18.2** - UI library with Server Components
- **TypeScript 5.0** - Type-safe development

### State Management
- **Zustand 4.4** - Client state (cart, wishlist, user)
- **Recoil 0.7** - UI state (filters, search)
- **TanStack React Query 5.90** - Server state caching

### API & Data
- **Apollo Client 3.8** - GraphQL client
- **GraphQL 16.8** - Query language
- **Axios 1.6** - REST API calls

### Styling
- **Tailwind CSS 3.4** - Utility-first CSS
- **DaisyUI 4.4** - Component library
- **FontAwesome 7.1** - Icons

### Testing
- **Jest 29.7** - Test runner
- **React Testing Library 14.2** - Component testing

### DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **Vercel** - Deployment platform

---

## 📁 Project Structure

```
e-storefront-web/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   ├── providers.tsx       # Context providers
│   ├── globals.css         # Global styles
│   ├── products/           # Product pages
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout flow
│   ├── orders/             # Order management
│   ├── profile/            # User profile
│   ├── login/              # Authentication
│   ├── signup/             # Registration
│   └── ...                 # Other pages
├── components/             # Reusable UI components
│   ├── Header.tsx          # Navigation header
│   ├── Footer.tsx          # Site footer
│   ├── ProductCard.tsx     # Product display
│   └── ...                 # Other components
├── lib/                    # Utilities and services
│   ├── apollo/             # GraphQL client setup
│   │   ├── client.ts       # Apollo Client config
│   │   └── queries/        # GraphQL operations
│   └── hooks/              # Custom React hooks
├── store/                  # State management
│   ├── cartStore.ts        # Zustand cart store
│   ├── categoryStore.ts    # Category state
│   └── recoilState.ts      # Recoil atoms
├── tests/                  # Test files
│   ├── __mocks__/          # Mock implementations
│   ├── components/         # Component tests
│   ├── hooks/              # Hook tests
│   └── store/              # Store tests
├── public/                 # Static assets
├── docs/                   # Documentation
├── .github/                # GitHub configuration
│   └── workflows/          # CI/CD workflows
├── Dockerfile              # Development Docker
├── Dockerfile.prod         # Production Docker
└── docker-compose.yml      # Docker Compose config
```

---

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (port 3003) |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

---

## 🔧 Environment Variables

Create `.env.local` from `.env.example`:

```env
# Environment
NEXT_PUBLIC_ENV=development

# API Configuration
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:3011
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql

# OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- All tests pass (`npm test`)
- Code follows linting rules (`npm run lint`)
- Coverage remains above 60%

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Related Projects

| Package | Description |
|---------|-------------|
| `@3asoftwares/ui` | Shared UI component library |
| `@3asoftwares/types` | Shared TypeScript types |
| `@3asoftwares/utils` | Shared utilities |

---

<div align="center">

**Built with ❤️ by 3A Softwares**

</div>
