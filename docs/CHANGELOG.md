# Changelog

All notable changes to the E-Storefront Web project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Comprehensive project documentation
- README.md with project overview and quick start guide
- CONTRIBUTING.md with contribution guidelines
- Architecture documentation
- API documentation
- Deployment guides for Vercel and Docker
- Environment configuration documentation
- Security best practices documentation
- Testing guidelines and strategies

### Changed

- Updated documentation folder structure

---

## [1.1.0] - 2026-01-15

### Added

- Performance optimization implementations
  - React.memo for ProductCard, ProductSlider, LazyImage components
  - useMemo hook optimizations for computed values
  - useCallback hook for event handlers
- Custom debounce and throttle utilities
  - `useDebounce` hook for search input
  - `useThrottle` hook for scroll events
  - `useScrollToBottom` hook for infinite scroll
- Code splitting with dynamic imports
  - Dynamic import of ProductSlider on home page
- Lazy loading enhancements
  - LazyImage component with Intersection Observer
  - Native lazy loading for product images
- SonarCloud integration for code quality

### Changed

- Improved search performance with debouncing
- Optimized price filter with debouncing
- Enhanced infinite scroll with throttling

### Fixed

- Cart calculation accuracy
- Product slider responsiveness
- Memory leaks in scroll event handlers

---

## [1.0.3] - 2026-01-01

### Added

- Customer support ticket system
- Product reviews and ratings
- Mark review as helpful functionality
- Address management (CRUD operations)
- Default address selection

### Changed

- Upgraded @3asoftwares/types to 1.0.3
- Upgraded @3asoftwares/utils to 1.0.10
- Improved error handling in forms

### Fixed

- Review submission validation
- Address form field alignment
- Ticket status display

---

## [1.0.2] - 2025-12-15

### Added

- Wishlist functionality
  - Add/remove products from wishlist
  - Wishlist page
  - Wishlist count in header
- Recently viewed products
  - Track last 12 viewed products
  - Display on product detail page
- Order cancellation feature
- Password reset flow
  - Forgot password page
  - Reset password with token validation

### Changed

- Upgraded @3asoftwares/ui to 1.0.2
- Improved cart persistence across sessions
- Enhanced header mobile menu

### Fixed

- Cart item quantity persistence
- Wishlist icon toggle state
- Mobile navigation overlay

---

## [1.0.1] - 2025-12-01

### Added

- Cypress E2E testing setup
  - Authentication flow tests
  - Cart functionality tests
  - Checkout process tests
  - Product browsing tests
- Jest unit testing configuration
- Coverage reporting with SonarCloud
- Docker development environment
- Docker production multi-stage build

### Changed

- Improved TypeScript configuration
- Enhanced ESLint rules
- Updated development workflow

### Fixed

- Build optimization for Docker
- Environment variable loading in containers
- Hot reload in development container

---

## [1.0.0] - 2025-11-15

### Added

- Initial release of E-Storefront Web
- **Core Features**
  - Product catalog with search and filtering
  - Category-based navigation
  - Product detail pages with images and specifications
  - Shopping cart with quantity management
  - Checkout flow with address selection
  - Order history and tracking
- **Authentication**
  - Email/password authentication
  - Google OAuth integration
  - Email verification
  - JWT token management with refresh
- **User Management**
  - User profile page
  - Address book management
  - Order history
- **Technical Foundation**
  - Next.js 16 with App Router
  - TypeScript throughout
  - Apollo Client for GraphQL
  - Zustand for cart state
  - Recoil for global state
  - React Query for caching
  - Tailwind CSS + DaisyUI styling
  - PWA support with service worker
- **Development Tools**
  - ESLint configuration
  - Prettier formatting
  - TypeScript strict mode

### Security

- Secure JWT token handling
- HTTPS enforcement
- Input validation
- XSS prevention

---

## Version History Summary

| Version | Date       | Highlights                              |
| ------- | ---------- | --------------------------------------- |
| 1.1.0   | 2026-01-15 | Performance optimizations, code quality |
| 1.0.3   | 2026-01-01 | Support tickets, reviews, addresses     |
| 1.0.2   | 2025-12-15 | Wishlist, password reset                |
| 1.0.1   | 2025-12-01 | Testing, Docker support                 |
| 1.0.0   | 2025-11-15 | Initial release                         |

---

## Upgrade Notes

### Upgrading to 1.1.0

No breaking changes. Performance optimizations are automatic.

```bash
git pull origin main
npm install
npm run build
```

### Upgrading to 1.0.3

Update shared packages:

```bash
npm update @3asoftwares/types @3asoftwares/utils
```

### Upgrading to 1.0.2

Update shared packages and run migrations if using local database:

```bash
npm update @3asoftwares/ui
```

---

## Contributing

When adding to this changelog:

1. Add entries under `[Unreleased]` during development
2. Move entries to a new version section when releasing
3. Use the following categories:
   - **Added** - New features
   - **Changed** - Changes in existing functionality
   - **Deprecated** - Soon-to-be removed features
   - **Removed** - Removed features
   - **Fixed** - Bug fixes
   - **Security** - Vulnerability fixes

---

[Unreleased]: https://github.com/3asoftwares/E-Storefront-Web/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/3asoftwares/E-Storefront-Web/compare/v1.0.3...v1.1.0
[1.0.3]: https://github.com/3asoftwares/E-Storefront-Web/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/3asoftwares/E-Storefront-Web/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/3asoftwares/E-Storefront-Web/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/3asoftwares/E-Storefront-Web/releases/tag/v1.0.0
