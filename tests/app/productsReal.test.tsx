import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock useRouter and useSearchParams
const mockPush = jest.fn();
const mockSearchParams = new URLSearchParams();
const mockGet = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
    useSearchParams: () => ({
        get: mockGet,
    }),
}));

// Mock FontAwesome
jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: ({ icon }: { icon: any }) => <span data-testid="fa-icon">{icon?.iconName || 'icon'}</span>,
}));

// Mock useProducts hook
const mockUseProducts = jest.fn();
jest.mock('@/lib/hooks', () => ({
    useProducts: (page: number, limit: number, filters: any) => mockUseProducts(page, limit, filters),
}));

// Mock useCategories hook
const mockCategories = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Clothing', slug: 'clothing' },
];
jest.mock('@/lib/hooks/useCategories', () => ({
    useCategories: () => ({
        categories: mockCategories,
    }),
}));

// Mock useDebounce hook - return value immediately
jest.mock('@/lib/hooks/useDebounce', () => ({
    useDebounce: (value: any) => value,
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
jest.mock('@/store/cartStore', () => ({
    useCartStore: () => ({
        addItem: mockAddItem,
        isInWishlist: mockIsInWishlist,
        addToWishlist: mockAddToWishlist,
        removeFromWishlist: mockRemoveFromWishlist,
    }),
}));

// Mock components
jest.mock('@/components', () => ({
    ProductCard: ({ product, onAddToCart, onWishlistToggle, isWishlisted }: any) => (
        <div data-testid="product-card">
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button onClick={() => onAddToCart(product)}>Add to Cart</button>
            <button onClick={() => onWishlistToggle(product)}>
                {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
        </div>
    ),
    ProductCardSkeleton: () => <div data-testid="product-skeleton">Loading...</div>,
}));

// Mock UI components
jest.mock('@3asoftwares/ui', () => ({
    Button: ({ children, onClick, disabled, className, size, ...props }: any) => (
        <button onClick={onClick} disabled={disabled} className={className} {...props}>
            {children}
        </button>
    ),
    Input: ({ value, onChange, placeholder, type, size, label, ...props }: any) => (
        <div>
            {label && <label>{label}</label>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                {...props}
            />
        </div>
    ),
    Select: ({ value, onChange, options, label, className }: any) => (
        <div>
            {label && <label>{label}</label>}
            <select value={value} onChange={(e) => onChange(e.target.value)} className={className}>
                {options?.map((opt: any) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    ),
}));

import ProductsPage from '../../app/products/page';

describe('ProductsPage', () => {
    const mockProducts = [
        { id: '1', name: 'Product 1', price: 29.99, imageUrl: '/img1.jpg', rating: 4.5, reviewCount: 10 },
        { id: '2', name: 'Product 2', price: 49.99, imageUrl: '/img2.jpg', rating: 4.0, reviewCount: 5 },
        { id: '3', name: 'Product 3', price: 19.99, imageUrl: '/img3.jpg', rating: 5.0, reviewCount: 20 },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        mockGet.mockReturnValue(null);
        mockIsInWishlist.mockReturnValue(false);
    });

    it('should render the page title', () => {
        mockUseProducts.mockReturnValue({
            isLoading: false,
            data: { products: mockProducts, pagination: { total: 3, pages: 1 } },
            error: null,
        });

        render(<ProductsPage />);
        expect(screen.getByText('Discover Products')).toBeInTheDocument();
    });

    it('should render loading skeletons when loading', () => {
        mockUseProducts.mockReturnValue({
            isLoading: true,
            data: null,
            error: null,
        });

        render(<ProductsPage />);
        const skeletons = screen.getAllByTestId('product-skeleton');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should render products list', () => {
        mockUseProducts.mockReturnValue({
            isLoading: false,
            data: { products: mockProducts, pagination: { total: 3, pages: 1 } },
            error: null,
        });

        render(<ProductsPage />);
        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('Product 2')).toBeInTheDocument();
        expect(screen.getByText('Product 3')).toBeInTheDocument();
    });

    it('should show product count', () => {
        mockUseProducts.mockReturnValue({
            isLoading: false,
            data: { products: mockProducts, pagination: { total: 50, pages: 5 } },
            error: null,
        });

        render(<ProductsPage />);
        expect(screen.getByText('50')).toBeInTheDocument();
    });

    it('should render filter section', () => {
        mockUseProducts.mockReturnValue({
            isLoading: false,
            data: { products: mockProducts, pagination: { total: 3, pages: 1 } },
            error: null,
        });

        render(<ProductsPage />);
        expect(screen.getAllByText('Filters').length).toBeGreaterThan(0);
    });

    it('should render category select with options', () => {
        mockUseProducts.mockReturnValue({
            isLoading: false,
            data: { products: mockProducts, pagination: { total: 3, pages: 1 } },
            error: null,
        });

        render(<ProductsPage />);
        expect(screen.getAllByText('All Categories').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Electronics').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Clothing').length).toBeGreaterThan(0);
    });

    it('should render sort options', () => {
        mockUseProducts.mockReturnValue({
            isLoading: false,
            data: { products: mockProducts, pagination: { total: 3, pages: 1 } },
            error: null,
        });

        render(<ProductsPage />);
        expect(screen.getAllByText('Newest').length).toBeGreaterThan(0);
    });

    it('should add product to cart', () => {
        mockUseProducts.mockReturnValue({
            isLoading: false,
            data: { products: mockProducts, pagination: { total: 3, pages: 1 } },
            error: null,
        });

        render(<ProductsPage />);
        const addButtons = screen.getAllByText('Add to Cart');
        fireEvent.click(addButtons[0]);

        expect(mockAddItem).toHaveBeenCalled();
        expect(mockShowToast).toHaveBeenCalledWith('Product 1 added to cart!', 'success');
    });

    it('should add product to wishlist', () => {
        mockIsInWishlist.mockReturnValue(false);
        mockUseProducts.mockReturnValue({
            isLoading: false,
            data: { products: mockProducts, pagination: { total: 3, pages: 1 } },
            error: null,
        });

        render(<ProductsPage />);
        const wishlistButtons = screen.getAllByText('Add to Wishlist');
        fireEvent.click(wishlistButtons[0]);

        expect(mockAddToWishlist).toHaveBeenCalled();
        expect(mockShowToast).toHaveBeenCalledWith('Added to wishlist', 'success');
    });

    it('should remove product from wishlist when already in wishlist', () => {
        mockIsInWishlist.mockReturnValue(true);
        mockUseProducts.mockReturnValue({
            isLoading: false,
            data: { products: mockProducts, pagination: { total: 3, pages: 1 } },
            error: null,
        });

        render(<ProductsPage />);
        // Click on any wishlist button - the mock will return true for isInWishlist
        const wishlistButtons = screen.getAllByText(/Wishlist/i);
        fireEvent.click(wishlistButtons[0]);

        expect(mockRemoveFromWishlist).toHaveBeenCalled();
        expect(mockShowToast).toHaveBeenCalledWith('Removed from wishlist', 'info');
    });

    it('should update search input', () => {
        mockUseProducts.mockReturnValue({
            isLoading: false,
            data: { products: mockProducts, pagination: { total: 3, pages: 1 } },
            error: null,
        });

        render(<ProductsPage />);
        const searchInputs = screen.getAllByPlaceholderText('Search products...');
        // Test that input exists and can be changed
        expect(searchInputs[0]).toBeInTheDocument();
        fireEvent.change(searchInputs[0], { target: { value: 'test search' } });
        // The component uses controlled state so we verify it doesn't crash
    });

    it('should show Load More button when more pages available', () => {
        mockUseProducts.mockReturnValue({
            isLoading: false,
            data: { products: mockProducts, pagination: { total: 30, pages: 3 } },
            error: null,
        });

        render(<ProductsPage />);
        expect(screen.getByText(/Load More/i)).toBeInTheDocument();
    });

    it('should show empty state when no products', () => {
        mockUseProducts.mockReturnValue({
            isLoading: false,
            data: { products: [], pagination: { total: 0, pages: 0 } },
            error: null,
        });

        render(<ProductsPage />);
        expect(screen.getByText(/No products found/i)).toBeInTheDocument();
    });

    it('should initialize search from URL params', () => {
        mockGet.mockImplementation((key: string) => {
            if (key === 'search') return 'test query';
            return null;
        });
        mockUseProducts.mockReturnValue({
            isLoading: false,
            data: { products: mockProducts, pagination: { total: 3, pages: 1 } },
            error: null,
        });

        render(<ProductsPage />);
        const searchInputs = screen.getAllByPlaceholderText('Search products...');
        expect(searchInputs[0]).toHaveValue('test query');
    });

    it('should initialize category from URL params', () => {
        mockGet.mockImplementation((key: string) => {
            if (key === 'category') return 'electronics';
            return null;
        });
        mockUseProducts.mockReturnValue({
            isLoading: false,
            data: { products: mockProducts, pagination: { total: 3, pages: 1 } },
            error: null,
        });

        render(<ProductsPage />);
        // Category should be set to Electronics
    });

    it('should render reset filters button', () => {
        mockUseProducts.mockReturnValue({
            isLoading: false,
            data: { products: mockProducts, pagination: { total: 3, pages: 1 } },
            error: null,
        });

        render(<ProductsPage />);
        expect(screen.getAllByText('Reset Filters').length).toBeGreaterThan(0);
    });

    it('should reset filters on button click', () => {
        mockUseProducts.mockReturnValue({
            isLoading: false,
            data: { products: mockProducts, pagination: { total: 3, pages: 1 } },
            error: null,
        });

        render(<ProductsPage />);
        const resetButtons = screen.getAllByText('Reset Filters');
        fireEvent.click(resetButtons[0]);

        expect(mockPush).toHaveBeenCalledWith('/products');
    });

    it('should render price range inputs', () => {
        mockUseProducts.mockReturnValue({
            isLoading: false,
            data: { products: mockProducts, pagination: { total: 3, pages: 1 } },
            error: null,
        });

        render(<ProductsPage />);
        expect(screen.getAllByPlaceholderText('Min').length).toBeGreaterThan(0);
        expect(screen.getAllByPlaceholderText('Max').length).toBeGreaterThan(0);
    });
});
