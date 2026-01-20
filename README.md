# E-Storefront Web

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Coverage](https://img.shields.io/badge/Coverage-17%25-yellow)](./coverage/lcov-report/index.html)

Customer-facing e-commerce storefront application built with Next.js, featuring product browsing, shopping cart, wishlist, checkout, and user authentication.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Customer Features

- 🛒 **Shopping Cart** - Add, update, remove items with persistent storage
- ❤️ **Wishlist** - Save favorite products for later
- 🔍 **Product Search** - Search with filters (category, price range, sorting)
- 📦 **Order Management** - Track orders and order history
- 👤 **User Authentication** - Email/password and Google OAuth login
- 📍 **Address Management** - Multiple shipping addresses
- ⭐ **Product Reviews** - Rate and review purchased products
- 🎫 **Support Tickets** - Customer support system

### Technical Features

- ⚡ **Performance Optimized** - React.memo, useMemo, useCallback, code splitting
- 📱 **PWA Support** - Offline capability with service worker
- 🎨 **Responsive Design** - Mobile-first with Tailwind CSS + DaisyUI
- 🔄 **Real-time Updates** - Apollo Client with cache management
- 🔐 **Secure Auth** - JWT tokens with automatic refresh
- 🧪 **Comprehensive Testing** - Jest unit tests + Cypress E2E
- 📊 **Code Quality** - ESLint, Prettier, SonarCloud integration

## 🛠 Tech Stack

| Category             | Technologies                         |
| -------------------- | ------------------------------------ |
| **Framework**        | Next.js 16.1.1 (App Router)          |
| **Language**         | TypeScript 5.x                       |
| **State Management** | Zustand, React Query                 |
| **API Layer**        | Apollo Client (GraphQL)              |
| **Styling**          | Tailwind CSS, DaisyUI                |
| **Icons**            | FontAwesome                          |
| **Testing**          | Jest, React Testing Library, Cypress |
| **Code Quality**     | ESLint, Prettier, SonarCloud         |
| **Containerization** | Docker, Docker Compose               |
| **Deployment**       | Vercel, Docker                       |

## 🎨 Technology Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     E-Storefront Web Technology Stack                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                           UI LAYER                                     │ │
│  ├────────────────────────────────────────────────────────────────────────┤ │
│  │                                                                        │ │
│  │   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐   │ │
│  │   │   Tailwind CSS  │  │     DaisyUI     │  │    FontAwesome      │   │ │
│  │   │   Utility-first │  │   Components    │  │      Icons          │   │ │
│  │   └─────────────────┘  └─────────────────┘  └─────────────────────┘   │ │
│  │                                                                        │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                      │                                       │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                       FRAMEWORK LAYER                                  │ │
│  ├────────────────────────────────────────────────────────────────────────┤ │
│  │                                                                        │ │
│  │   ┌─────────────────────────────────────────────────────────────────┐ │ │
│  │   │                    Next.js 16.1.1 (App Router)                  │ │ │
│  │   │     Server Components │ SSR │ ISR │ API Routes │ Middleware    │ │ │
│  │   └─────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                        │ │
│  │   ┌──────────────────────┐  ┌──────────────────────────────────────┐  │ │
│  │   │    React 18          │  │        TypeScript 5.x                │  │ │
│  │   │  Hooks │ Suspense    │  │   Type Safety │ Interfaces          │  │ │
│  │   └──────────────────────┘  └──────────────────────────────────────┘  │ │
│  │                                                                        │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                      │                                       │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                       STATE MANAGEMENT                                 │ │
│  ├────────────────────────────────────────────────────────────────────────┤ │
│  │                                                                        │ │
│  │   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │ │
│  │   │     Zustand      │  │   React Query    │  │   Apollo Client  │   │ │
│  │   │  Client State    │  │  Server State    │  │   GraphQL Data   │   │ │
│  │   │  Cart, UI, Auth  │  │  Caching, Sync   │  │   Queries/Mut    │   │ │
│  │   └──────────────────┘  └──────────────────┘  └──────────────────┘   │ │
│  │                                                                        │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                      │                                       │
│                                      ▼                                       │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                           API LAYER                                    │ │
│  │                GraphQL Gateway (Apollo Federation)                     │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                       TESTING & QUALITY                                │ │
│  ├────────────────────────────────────────────────────────────────────────┤ │
│  │   Jest │ React Testing Library │ Cypress │ ESLint │ Prettier │ Sonar  │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                         DEPLOYMENT                                     │ │
│  ├────────────────────────────────────────────────────────────────────────┤ │
│  │           Vercel (Production) │ Docker (Development/Staging)          │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

For detailed technology documentation, see [E-Storefront/docs/technologies](../E-Storefront/docs/technologies/).

## 📦 Prerequisites

- **Node.js** >= 20.x
- **npm** >= 10.x (or yarn/pnpm)
- **Docker** (optional, for containerized development)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/3asoftwares/E-Storefront-Web.git
cd E-Storefront-Web
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration (see [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md) for details).

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3004](http://localhost:3004) to view the application.

### Docker Development

```bash
# Development mode
docker-compose up storefront-dev

# Production mode
docker-compose --profile production up storefront-prod
```

## 📁 Project Structure

```
E-Storefront-Web/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   ├── providers.tsx       # App providers (Apollo, React Query, etc.)
│   ├── cart/               # Shopping cart page
│   ├── checkout/           # Checkout flow
│   ├── products/           # Product listing and details
│   ├── orders/             # Order history and details
│   ├── profile/            # User profile management
│   ├── login/              # Authentication pages
│   ├── signup/
│   ├── wishlist/           # User wishlist
│   └── ...                 # Other feature pages
├── components/             # Reusable React components
│   ├── Header.tsx          # Navigation header
│   ├── Footer.tsx          # Site footer
│   ├── ProductCard.tsx     # Product display card
│   ├── ProductSlider.tsx   # Featured products carousel
│   └── ...                 # Other components
├── lib/                    # Utilities and configurations
│   ├── apollo/             # Apollo Client setup
│   │   ├── client.ts       # Apollo Client configuration
│   │   └── queries/        # GraphQL queries and mutations
│   ├── hooks/              # Custom React hooks
│   └── utils/              # Utility functions
├── store/                  # State management
│   ├── cartStore.ts        # Zustand cart store
│   ├── categoryStore.ts    # Category state
│   └── recoilState.ts      # Recoil atoms
├── types/                  # TypeScript type definitions
├── tests/                  # Jest unit tests
├── cypress/                # Cypress E2E tests
├── public/                 # Static assets
└── docs/                   # Documentation
```

## 📜 Available Scripts

| Command                 | Description                           |
| ----------------------- | ------------------------------------- |
| `npm run dev`           | Start development server on port 3004 |
| `npm run build`         | Build for production                  |
| `npm start`             | Start production server               |
| `npm run lint`          | Run ESLint                            |
| `npm run lint:fix`      | Fix ESLint issues                     |
| `npm run type-check`    | TypeScript type checking              |
| `npm test`              | Run Jest tests                        |
| `npm run test:watch`    | Run tests in watch mode               |
| `npm run test:coverage` | Generate coverage report              |
| `npm run cy:open`       | Open Cypress test runner              |
| `npm run cy:run`        | Run Cypress tests headlessly          |
| `npm run format`        | Format code with Prettier             |
| `npm run format:check`  | Check code formatting                 |

## 📚 Documentation

All documentation is located in the [`docs/`](docs/) folder:

### Core Documentation

| Document                                | Description                             |
| --------------------------------------- | --------------------------------------- |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture and design patterns |
| [API.md](docs/API.md)                   | GraphQL API reference and integration   |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md)     | Deployment guides (Vercel, Docker)      |
| [ENVIRONMENT.md](docs/ENVIRONMENT.md)   | Environment variables configuration     |
| [SECURITY.md](docs/SECURITY.md)         | Security policies and best practices    |
| [TESTING.md](docs/TESTING.md)           | Testing strategies and guidelines       |

### Technology Guides

| Document                                                | Description               |
| ------------------------------------------------------- | ------------------------- |
| [NEXTJS](docs/technologies/NEXTJS.md)                   | Next.js 16 App Router     |
| [TYPESCRIPT](docs/technologies/TYPESCRIPT.md)           | TypeScript configuration  |
| [ZUSTAND](docs/technologies/ZUSTAND.md)                 | Zustand state management  |
| [REACT_QUERY](docs/technologies/REACT_QUERY.md)         | TanStack React Query      |
| [APOLLO_CLIENT](docs/technologies/APOLLO_CLIENT.md)     | Apollo Client GraphQL     |
| [TAILWIND_CSS](docs/technologies/TAILWIND_CSS.md)       | Tailwind CSS styling      |
| [JEST](docs/technologies/JEST.md)                       | Jest unit testing         |
| [CYPRESS](docs/technologies/CYPRESS.md)                 | Cypress E2E testing       |
| [ESLINT_PRETTIER](docs/technologies/ESLINT_PRETTIER.md) | ESLint & Prettier         |
| [SONARCLOUD](docs/technologies/SONARCLOUD.md)           | SonarCloud analysis       |
| [CI_CD](docs/technologies/CI_CD.md)                     | CI/CD with GitHub Actions |
| [DOCKER](docs/technologies/DOCKER.md)                   | Docker containerization   |

### Additional Documentation

| Document                                                            | Description             |
| ------------------------------------------------------------------- | ----------------------- |
| [CONTRIBUTING.md](docs/CONTRIBUTING.md)                             | Contribution guidelines |
| [CHANGELOG.md](docs/CHANGELOG.md)                                   | Version history         |
| [PERFORMANCE_IMPLEMENTATION.md](docs/PERFORMANCE_IMPLEMENTATION.md) | Performance guide       |

## 🤝 Contributing

We welcome contributions! Please read our [CONTRIBUTING.md](docs/CONTRIBUTING.md) for details on:

- Code of Conduct
- Development workflow
- Pull request process
- Coding standards

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ by <a href="https://3asoftwares.com">3A Softwares</a>
</p>
