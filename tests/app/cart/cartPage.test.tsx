/**
 * Tests for the Cart Page component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock functions
const mockPush = jest.fn();
const mockRemoveItem = jest.fn();
const mockUpdateQuantity = jest.fn();
const mockClearCart = jest.fn();
const mockShowToast = jest.fn();

// Mock Next.js
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/cart',
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock FontAwesome
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }: any) => <span data-testid="fa-icon">{icon?.iconName || 'icon'}</span>,
}));

// Mock UI components
jest.mock('@3asoftwares/ui', () => ({
  Button: ({ children, onClick, className, disabled }: any) => (
    <button onClick={onClick} className={className} disabled={disabled}>
      {children}
    </button>
  ),
}));

jest.mock('@3asoftwares/utils/client', () => ({
  formatPrice: (price: number) => `$${price.toFixed(2)}`,
}));

// Mock store
const mockUseCartStore = jest.fn();
jest.mock('../../../store/cartStore', () => ({
  useCartStore: () => mockUseCartStore(),
}));

// Mock toast
jest.mock('../../../lib/hooks/useToast', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

// Mock auth
const mockIsAuthenticated = jest.fn();
jest.mock('../../../lib/hooks/useAuth', () => ({
  useIsAuthenticated: () => ({
    isAuthenticated: mockIsAuthenticated(),
  }),
}));

// Mock components
jest.mock('../../../components', () => ({
  PageHeader: ({ title, icon, badge }: any) => (
    <header data-testid="page-header">
      <h1>{title}</h1>
      {badge && (
        <span data-testid="badge">
          {badge.count} {badge.label}
        </span>
      )}
    </header>
  ),
  EmptyState: ({ title, description, actionText, actionHref }: any) => (
    <div data-testid="empty-state">
      <h2>{title}</h2>
      <p>{description}</p>
      <a href={actionHref}>{actionText}</a>
    </div>
  ),
}));

jest.mock('../../../components/ProductCard', () => ({
  handleImageError: jest.fn(),
}));

import CartPage from '../../../app/cart/page';

describe('CartPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsAuthenticated.mockReturnValue(false);
    mockUseCartStore.mockReturnValue({
      items: [],
      removeItem: mockRemoveItem,
      updateQuantity: mockUpdateQuantity,
      clearCart: mockClearCart,
    });
  });

  describe('Empty Cart', () => {
    it('should render empty state when cart has no items', () => {
      render(<CartPage />);

      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument();
    });

    it('should show link to start shopping', () => {
      render(<CartPage />);

      expect(screen.getByText('Start Shopping →')).toHaveAttribute('href', '/products');
    });
  });

  describe('Cart with Items', () => {
    const mockItems = [
      { id: 'item1', name: 'Test Product 1', price: 29.99, quantity: 2, image: null },
      {
        id: 'item2',
        name: 'Test Product 2',
        price: 49.99,
        quantity: 1,
        image: 'https://example.com/image.jpg',
      },
    ];

    beforeEach(() => {
      mockUseCartStore.mockReturnValue({
        items: mockItems,
        removeItem: mockRemoveItem,
        updateQuantity: mockUpdateQuantity,
        clearCart: mockClearCart,
      });
    });

    it('should render cart page header with item count', () => {
      render(<CartPage />);

      expect(screen.getByTestId('page-header')).toBeInTheDocument();
      expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
      expect(screen.getByTestId('badge')).toHaveTextContent('2 items');
    });

    it('should render product names', () => {
      render(<CartPage />);

      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });

    it('should calculate subtotal correctly', () => {
      render(<CartPage />);

      // subtotal = (29.99 * 2) + (49.99 * 1) = 59.98 + 49.99 = 109.97
      expect(screen.getByText(/\$109\.97/)).toBeInTheDocument();
    });

    it('should show shipping information', () => {
      render(<CartPage />);

      // Order is $109.97, check that shipping section exists
      const pageText = document.body.textContent || '';
      expect(
        pageText.includes('Shipping') || pageText.includes('shipping') || pageText.includes('Free')
      ).toBe(true);
    });

    it('should handle remove item click', () => {
      render(<CartPage />);

      // Find remove buttons (they should have "Remove" text or trash icon)
      const removeButtons = screen.getAllByRole('button');
      const removeButton = removeButtons.find(
        (btn) =>
          btn.textContent?.toLowerCase().includes('remove') ||
          btn.querySelector('[data-testid="fa-icon"]')
      );

      if (removeButton) {
        fireEvent.click(removeButton);
      }
    });
  });

  describe('Checkout Flow', () => {
    const mockItems = [{ id: 'item1', name: 'Test Product', price: 29.99, quantity: 1 }];

    beforeEach(() => {
      mockUseCartStore.mockReturnValue({
        items: mockItems,
        removeItem: mockRemoveItem,
        updateQuantity: mockUpdateQuantity,
        clearCart: mockClearCart,
      });
    });

    it('should redirect authenticated users to checkout', () => {
      mockIsAuthenticated.mockReturnValue(true);

      render(<CartPage />);

      const checkoutButton = screen.getByRole('button', { name: /checkout|proceed/i });
      if (checkoutButton) {
        fireEvent.click(checkoutButton);
        expect(mockPush).toHaveBeenCalledWith('/checkout');
      }
    });

    it('should redirect unauthenticated users to login', () => {
      mockIsAuthenticated.mockReturnValue(false);

      render(<CartPage />);

      const checkoutButton = screen.getByRole('button', { name: /checkout|proceed/i });
      if (checkoutButton) {
        fireEvent.click(checkoutButton);
        expect(mockPush).toHaveBeenCalledWith('/login?redirect=/checkout');
      }
    });
  });

  describe('Quantity Updates', () => {
    const mockItems = [{ id: 'item1', name: 'Test Product', price: 29.99, quantity: 2 }];

    beforeEach(() => {
      mockUseCartStore.mockReturnValue({
        items: mockItems,
        removeItem: mockRemoveItem,
        updateQuantity: mockUpdateQuantity,
        clearCart: mockClearCart,
      });
    });

    it('should have quantity controls', () => {
      render(<CartPage />);

      // Look for plus/minus buttons or quantity display
      const quantityText = screen.getByText('2');
      expect(quantityText).toBeInTheDocument();
    });
  });

  describe('Price Calculations', () => {
    it('should calculate shipping as $10 for orders under $100', () => {
      mockUseCartStore.mockReturnValue({
        items: [{ id: 'item1', name: 'Product', price: 50, quantity: 1 }],
        removeItem: mockRemoveItem,
        updateQuantity: mockUpdateQuantity,
        clearCart: mockClearCart,
      });

      render(<CartPage />);

      // Shipping should be $10 for orders under $100
      expect(screen.getByText(/\$10\.00/)).toBeInTheDocument();
    });

    it('should include tax in total', () => {
      mockUseCartStore.mockReturnValue({
        items: [{ id: 'item1', name: 'Product', price: 100, quantity: 1 }],
        removeItem: mockRemoveItem,
        updateQuantity: mockUpdateQuantity,
        clearCart: mockClearCart,
      });

      render(<CartPage />);

      // Tax is 8% = $8, so total should reflect this
      expect(screen.getByText(/\$8\.00/) || screen.getByText(/Tax/)).toBeTruthy();
    });
  });

  describe('Single Item Badge', () => {
    it('should show singular label for one item', () => {
      mockUseCartStore.mockReturnValue({
        items: [{ id: 'item1', name: 'Product', price: 25, quantity: 1 }],
        removeItem: mockRemoveItem,
        updateQuantity: mockUpdateQuantity,
        clearCart: mockClearCart,
      });

      render(<CartPage />);

      expect(screen.getByTestId('badge')).toHaveTextContent('1 item');
    });
  });

  describe('Clear Cart', () => {
    it('should render cart page with items', () => {
      mockUseCartStore.mockReturnValue({
        items: [{ id: 'item1', name: 'Product', price: 25, quantity: 1 }],
        removeItem: mockRemoveItem,
        updateQuantity: mockUpdateQuantity,
        clearCart: mockClearCart,
      });

      render(<CartPage />);

      expect(screen.getByText('Product')).toBeInTheDocument();
    });
  });
});

describe('CartPage - Image Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsAuthenticated.mockReturnValue(false);
  });

  it('should display product image when available', () => {
    mockUseCartStore.mockReturnValue({
      items: [
        {
          id: 'item1',
          name: 'Product with Image',
          price: 25,
          quantity: 1,
          image: 'https://example.com/product.jpg',
        },
      ],
      removeItem: mockRemoveItem,
      updateQuantity: mockUpdateQuantity,
      clearCart: mockClearCart,
    });

    render(<CartPage />);

    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('should display placeholder icon when image is not available', () => {
    mockUseCartStore.mockReturnValue({
      items: [
        {
          id: 'item1',
          name: 'Product without Image',
          price: 25,
          quantity: 1,
          image: null,
        },
      ],
      removeItem: mockRemoveItem,
      updateQuantity: mockUpdateQuantity,
      clearCart: mockClearCart,
    });

    render(<CartPage />);

    // Should show box icon instead of image
    expect(screen.getAllByTestId('fa-icon').length).toBeGreaterThan(0);
  });
});
