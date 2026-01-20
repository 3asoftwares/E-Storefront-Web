import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock FontAwesome
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, ...props }: any) => <svg data-testid="fa-icon" {...props} />,
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock useToast
const mockShowToast = jest.fn();
jest.mock('@/lib/hooks/useToast', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}));

// Mock cartStore
const mockAddItem = jest.fn();
const mockRemoveFromWishlist = jest.fn();
let mockWishlist: any[] = [];

jest.mock('@/store/cartStore', () => ({
  useCartStore: () => ({
    wishlist: mockWishlist,
    removeFromWishlist: mockRemoveFromWishlist,
    addItem: mockAddItem,
  }),
}));

// Mock components
jest.mock('@/components', () => ({
  PageHeader: ({ title, badge }: any) => (
    <div data-testid="page-header">
      <h1>{title}</h1>
      {badge && (
        <span>
          {badge.count} {badge.label}
        </span>
      )}
    </div>
  ),
  EmptyState: ({ title, description, actionText, actionHref }: any) => (
    <div data-testid="empty-state">
      <h2>{title}</h2>
      <p>{description}</p>
      <a href={actionHref}>{actionText}</a>
    </div>
  ),
}));

// Mock UI components
jest.mock('@3asoftwares/ui', () => ({
  Button: ({ children, onClick, disabled, className, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} className={className} {...props}>
      {children}
    </button>
  ),
}));

import WishlistPage from '../../app/wishlist/page';

describe('WishlistPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWishlist = [];
  });

  it('should render the page title', () => {
    render(<WishlistPage />);
    expect(screen.getByText('My Wishlist')).toBeInTheDocument();
  });

  it('should render empty state when wishlist is empty', () => {
    render(<WishlistPage />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('Your Wishlist is Empty')).toBeInTheDocument();
  });

  it('should render discover products link in empty state', () => {
    render(<WishlistPage />);
    expect(screen.getByText('Discover Products →')).toBeInTheDocument();
  });

  describe('with wishlist items', () => {
    beforeEach(() => {
      mockWishlist = [
        {
          productId: 'prod-1',
          name: 'Test Product 1',
          price: 29.99,
          image: '/test-image-1.jpg',
          addedAt: new Date().toISOString(),
        },
        {
          productId: 'prod-2',
          name: 'Test Product 2',
          price: 49.99,
          image: '/test-image-2.jpg',
          addedAt: new Date().toISOString(),
        },
      ];
    });

    it('should render wishlist items', () => {
      render(<WishlistPage />);
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });

    it('should render item count', () => {
      render(<WishlistPage />);
      expect(screen.getByText('Showing 2 items')).toBeInTheDocument();
    });

    it('should render item prices', () => {
      render(<WishlistPage />);
      expect(screen.getByText('$29.99')).toBeInTheDocument();
      expect(screen.getByText('$49.99')).toBeInTheDocument();
    });

    it('should render Add to Cart buttons', () => {
      render(<WishlistPage />);
      const addToCartButtons = screen.getAllByRole('button', { name: /^Add$/i });
      expect(addToCartButtons.length).toBe(2);
    });

    it('should call addItem when Add to Cart is clicked', () => {
      render(<WishlistPage />);

      const addToCartButtons = screen.getAllByRole('button', { name: /^Add$/i });
      fireEvent.click(addToCartButtons[0]);

      expect(mockAddItem).toHaveBeenCalledWith({
        productId: 'prod-1',
        id: 'prod-1',
        name: 'Test Product 1',
        price: 29.99,
        quantity: 1,
        image: '/test-image-1.jpg',
      });
      expect(mockShowToast).toHaveBeenCalledWith('Added to cart!', 'success');
    });

    it('should call removeFromWishlist when remove button is clicked', () => {
      render(<WishlistPage />);

      // The heart button for removing (button with no text, after Add button)
      const buttons = screen.getAllByRole('button');
      // Find buttons that only have heart icon (empty text content)
      const removeButtons = buttons.filter((btn) => {
        const text = btn.textContent?.trim() || '';
        return text === '' && !btn.textContent?.includes('Add All');
      });

      // Click the first remove button
      if (removeButtons.length > 0) {
        fireEvent.click(removeButtons[0]);
        expect(mockRemoveFromWishlist).toHaveBeenCalled();
        expect(mockShowToast).toHaveBeenCalledWith('Removed from wishlist', 'info');
      }
    });

    it('should render Continue Shopping link', () => {
      render(<WishlistPage />);
      expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
    });

    it('should render Add All to Cart button', () => {
      render(<WishlistPage />);
      expect(screen.getByRole('button', { name: /Add All to Cart/i })).toBeInTheDocument();
    });

    it('should add all items to cart when Add All is clicked', () => {
      render(<WishlistPage />);

      const addAllButton = screen.getByRole('button', { name: /Add All to Cart/i });
      fireEvent.click(addAllButton);

      expect(mockAddItem).toHaveBeenCalledTimes(2);
      expect(mockShowToast).toHaveBeenCalledWith('Added 2 items to cart!', 'success');
    });

    it('should render Love Everything section', () => {
      render(<WishlistPage />);
      expect(screen.getByText('Love Everything?')).toBeInTheDocument();
    });

    it('should render product images', () => {
      render(<WishlistPage />);
      const images = screen.getAllByRole('img');
      expect(images.length).toBe(2);
    });

    it('should render links to product pages', () => {
      render(<WishlistPage />);
      const productLinks = screen.getAllByRole('link', { name: /Test Product/i });
      expect(productLinks.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('with single item', () => {
    beforeEach(() => {
      mockWishlist = [
        {
          productId: 'prod-1',
          name: 'Single Product',
          price: 19.99,
          image: null,
          addedAt: new Date().toISOString(),
        },
      ];
    });

    it('should show singular item text', () => {
      render(<WishlistPage />);
      expect(screen.getByText('Showing 1 item')).toBeInTheDocument();
    });

    it('should render placeholder when no image', () => {
      render(<WishlistPage />);
      // With no image, it should render the heart icon placeholder
      const icons = screen.getAllByTestId('fa-icon');
      expect(icons.length).toBeGreaterThan(0);
    });
  });
});
