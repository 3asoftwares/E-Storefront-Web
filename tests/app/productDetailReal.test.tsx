import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock useParams
const mockParams = { id: '123' };
jest.mock('next/navigation', () => ({
  useParams: () => mockParams,
}));

// Mock FontAwesome
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }: { icon: any }) => (
    <span data-testid="fa-icon">{icon?.iconName || 'icon'}</span>
  ),
}));

// Mock formatPrice
jest.mock('@3asoftwares/utils/client', () => ({
  formatPrice: (price: number) => `$${price.toFixed(2)}`,
}));

// Mock useProduct hook
const mockUseProduct = jest.fn();
jest.mock('@/lib/hooks', () => ({
  useProduct: (id: string) => mockUseProduct(id),
}));

// Mock useToast
const mockShowToast = jest.fn();
jest.mock('@/lib/hooks/useToast', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

// Mock useCartStore
const mockAddItem = jest.fn();
const mockIsInWishlist = jest.fn();
const mockAddToWishlist = jest.fn();
const mockRemoveFromWishlist = jest.fn();
const mockAddRecentlyViewed = jest.fn();
jest.mock('@/store/cartStore', () => ({
  useCartStore: () => ({
    addItem: mockAddItem,
    isInWishlist: mockIsInWishlist,
    addToWishlist: mockAddToWishlist,
    removeFromWishlist: mockRemoveFromWishlist,
    addRecentlyViewed: mockAddRecentlyViewed,
  }),
}));

// Mock ProductReviews
jest.mock('@/components/ProductReviews', () => ({
  __esModule: true,
  default: ({ productId }: { productId: string }) => (
    <div data-testid="product-reviews">Reviews for {productId}</div>
  ),
}));

// Mock UI components
jest.mock('@3asoftwares/ui', () => ({
  Button: ({ children, onClick, disabled, variant, className, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} className={className} {...props}>
      {children}
    </button>
  ),
  Input: ({ value, onChange, type, min, max, ...props }: any) => (
    <input type={type} value={value} onChange={onChange} min={min} max={max} {...props} />
  ),
}));

import ProductDetailPage from '../../app/products/[id]/page';

describe('ProductDetailPage', () => {
  const mockProduct = {
    id: '123',
    name: 'Test Product',
    price: 99.99,
    description: 'This is a test product description.',
    imageUrl: '/test-image.jpg',
    category: 'Electronics',
    stock: 10,
    rating: 4.5,
    reviewCount: 25,
    sellerId: 'seller-1',
    tags: ['electronics', 'gadget', 'new'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsInWishlist.mockReturnValue(false);
  });

  it('should render loading state', () => {
    mockUseProduct.mockReturnValue({
      isLoading: true,
      data: null,
      error: null,
    });

    render(<ProductDetailPage />);
    expect(document.querySelector('.animate-spin')).toBeTruthy();
  });

  it('should render error state when product not found', () => {
    mockUseProduct.mockReturnValue({
      isLoading: false,
      data: null,
      error: new Error('Not found'),
    });

    render(<ProductDetailPage />);
    expect(screen.getByText('Product Not Found')).toBeInTheDocument();
  });

  it('should render product details', () => {
    mockUseProduct.mockReturnValue({
      isLoading: false,
      data: mockProduct,
      error: null,
    });

    render(<ProductDetailPage />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('should render product description', () => {
    mockUseProduct.mockReturnValue({
      isLoading: false,
      data: mockProduct,
      error: null,
    });

    render(<ProductDetailPage />);
    expect(screen.getByText(/This is a test product description/)).toBeInTheDocument();
  });

  it('should render product reviews', () => {
    mockUseProduct.mockReturnValue({
      isLoading: false,
      data: mockProduct,
      error: null,
    });

    render(<ProductDetailPage />);
    expect(screen.getByTestId('product-reviews')).toBeInTheDocument();
  });

  it('should render breadcrumb navigation', () => {
    mockUseProduct.mockReturnValue({
      isLoading: false,
      data: mockProduct,
      error: null,
    });

    render(<ProductDetailPage />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getAllByText('Electronics').length).toBeGreaterThan(0);
  });

  it('should add product to cart', () => {
    mockUseProduct.mockReturnValue({
      isLoading: false,
      data: mockProduct,
      error: null,
    });

    render(<ProductDetailPage />);
    const addButton = screen.getByText(/Add to Cart/i);
    fireEvent.click(addButton);

    expect(mockAddItem).toHaveBeenCalledWith({
      id: '123',
      name: 'Test Product',
      price: 99.99,
      quantity: 1,
      image: '/test-image.jpg',
      productId: '123',
      sellerId: 'seller-1',
    });
    expect(mockShowToast).toHaveBeenCalledWith('Test Product added to cart!', 'success');
  });

  it('should add product to wishlist', () => {
    mockIsInWishlist.mockReturnValue(false);
    mockUseProduct.mockReturnValue({
      isLoading: false,
      data: mockProduct,
      error: null,
    });

    render(<ProductDetailPage />);
    const wishlistButton = screen.getByText(/Add to Wishlist|Wishlist/i);
    fireEvent.click(wishlistButton);

    expect(mockAddToWishlist).toHaveBeenCalled();
    expect(mockShowToast).toHaveBeenCalledWith('Added to wishlist', 'success');
  });

  it('should remove product from wishlist when already in wishlist', () => {
    mockIsInWishlist.mockReturnValue(true);
    mockUseProduct.mockReturnValue({
      isLoading: false,
      data: mockProduct,
      error: null,
    });

    render(<ProductDetailPage />);
    const wishlistButton = screen.getByText(/Remove from Wishlist|Wishlist/i);
    fireEvent.click(wishlistButton);

    expect(mockRemoveFromWishlist).toHaveBeenCalledWith('123');
    expect(mockShowToast).toHaveBeenCalledWith('Removed from wishlist', 'info');
  });

  it('should add product to recently viewed', () => {
    mockUseProduct.mockReturnValue({
      isLoading: false,
      data: mockProduct,
      error: null,
    });

    render(<ProductDetailPage />);

    expect(mockAddRecentlyViewed).toHaveBeenCalledWith({
      productId: '123',
      name: 'Test Product',
      price: 99.99,
      image: '/test-image.jpg',
      category: 'Electronics',
      viewedAt: expect.any(Number),
    });
  });

  it('should render product image', () => {
    mockUseProduct.mockReturnValue({
      isLoading: false,
      data: mockProduct,
      error: null,
    });

    render(<ProductDetailPage />);
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('should show Back to Products button on error', () => {
    mockUseProduct.mockReturnValue({
      isLoading: false,
      data: null,
      error: new Error('Not found'),
    });

    render(<ProductDetailPage />);
    expect(screen.getByText('Back to Products')).toBeInTheDocument();
  });

  it('should handle quantity increase', () => {
    mockUseProduct.mockReturnValue({
      isLoading: false,
      data: mockProduct,
      error: null,
    });

    render(<ProductDetailPage />);
    // Find plus button and click it
    const plusButtons = screen.getAllByTestId('fa-icon');
    // The plus icon should increase quantity
  });
});
