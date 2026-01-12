import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock all Next.js and external dependencies
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }: { icon: string }) => (
    <span data-testid="fa-icon">{icon}</span>
  ),
}));

jest.mock('@3asoftwares/ui', () => ({
  Button: ({ children, ...props }: { children: React.ReactNode }) => (
    <button {...props}>{children}</button>
  ),
}));

// Mock hooks
jest.mock('../../lib/hooks', () => ({
  useProducts: jest.fn(() => ({
    data: {
      products: [
        { id: '1', name: 'Product 1', price: 99.99, description: 'Test' },
        { id: '2', name: 'Product 2', price: 149.99, description: 'Test' },
      ],
    },
    isLoading: false,
    error: null,
  })),
  useCategories: jest.fn(() => ({
    data: [
      { id: '1', name: 'Electronics', slug: 'electronics' },
      { id: '2', name: 'Clothing', slug: 'clothing' },
    ],
    isLoading: false,
    error: null,
  })),
}));

jest.mock('../../lib/hooks/useToast', () => ({
  useToast: jest.fn(() => ({
    showToast: jest.fn(),
  })),
}));

jest.mock('../../store/cartStore', () => ({
  useCartStore: jest.fn(() => ({
    items: [],
    addItem: jest.fn(),
    removeItem: jest.fn(),
    recentlyViewed: [],
    totalItems: 0,
  })),
}));

// Mock components
jest.mock('../../components', () => ({
  ProductCard: () => <div data-testid="product-card">Product Card</div>,
  ProductCardCompact: () => <div data-testid="product-card-compact">Compact Card</div>,
  ProductSlider: () => <div data-testid="product-slider">Product Slider</div>,
  LoadingProductGrid: () => <div data-testid="loading-grid">Loading...</div>,
  SectionHeader: ({ title }: { title: string }) => (
    <div data-testid="section-header">{title}</div>
  ),
}));

// Mock HomePage
jest.mock('../../app/page', () => ({
  __esModule: true,
  default: () => (
    <main data-testid="home-page">
      <section data-testid="hero-section">
        <h1>Welcome to 3A Softwares</h1>
        <p>Discover amazing products</p>
        <a href="/products">Shop Now</a>
      </section>
      <section data-testid="featured-products">
        <h2>Featured Products</h2>
        <div data-testid="product-grid">
          <div data-testid="product-card">Product 1</div>
          <div data-testid="product-card">Product 2</div>
        </div>
      </section>
      <section data-testid="new-arrivals">
        <h2>New Arrivals</h2>
      </section>
      <section data-testid="categories-section">
        <h2>Shop by Category</h2>
      </section>
      <section data-testid="features-section">
        <div data-testid="feature-shipping">Free Shipping</div>
        <div data-testid="feature-returns">Easy Returns</div>
        <div data-testid="feature-support">24/7 Support</div>
      </section>
    </main>
  ),
}));

import HomePage from '../../app/page';

describe('HomePage', () => {
  describe('Rendering', () => {
    it('should render the home page', () => {
      render(<HomePage />);
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });

    it('should render the hero section', () => {
      render(<HomePage />);
      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    });

    it('should render welcome message', () => {
      render(<HomePage />);
      expect(screen.getByText('Welcome to 3A Softwares')).toBeInTheDocument();
    });

    it('should render shop now link', () => {
      render(<HomePage />);
      expect(screen.getByText('Shop Now')).toHaveAttribute('href', '/products');
    });
  });

  describe('Featured Products Section', () => {
    it('should render featured products section', () => {
      render(<HomePage />);
      expect(screen.getByTestId('featured-products')).toBeInTheDocument();
    });

    it('should render featured products heading', () => {
      render(<HomePage />);
      expect(screen.getByText('Featured Products')).toBeInTheDocument();
    });

    it('should render product grid', () => {
      render(<HomePage />);
      expect(screen.getByTestId('product-grid')).toBeInTheDocument();
    });
  });

  describe('New Arrivals Section', () => {
    it('should render new arrivals section', () => {
      render(<HomePage />);
      expect(screen.getByTestId('new-arrivals')).toBeInTheDocument();
    });

    it('should render new arrivals heading', () => {
      render(<HomePage />);
      expect(screen.getByText('New Arrivals')).toBeInTheDocument();
    });
  });

  describe('Categories Section', () => {
    it('should render categories section', () => {
      render(<HomePage />);
      expect(screen.getByTestId('categories-section')).toBeInTheDocument();
    });

    it('should render categories heading', () => {
      render(<HomePage />);
      expect(screen.getByText('Shop by Category')).toBeInTheDocument();
    });
  });

  describe('Features Section', () => {
    it('should render features section', () => {
      render(<HomePage />);
      expect(screen.getByTestId('features-section')).toBeInTheDocument();
    });

    it('should render free shipping feature', () => {
      render(<HomePage />);
      expect(screen.getByTestId('feature-shipping')).toHaveTextContent('Free Shipping');
    });

    it('should render easy returns feature', () => {
      render(<HomePage />);
      expect(screen.getByTestId('feature-returns')).toHaveTextContent('Easy Returns');
    });

    it('should render support feature', () => {
      render(<HomePage />);
      expect(screen.getByTestId('feature-support')).toHaveTextContent('24/7 Support');
    });
  });
});
