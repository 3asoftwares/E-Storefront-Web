import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

// Mock cart store with no user profile
const mockItems = [
    {
        id: 'prod-1',
        productId: 'prod-1',
        name: 'Test Product',
        price: 99.99,
        quantity: 1,
        sellerId: 'seller-1',
    },
];

jest.mock('@/store/cartStore', () => ({
    useCartStore: () => ({
        items: mockItems,
        userProfile: null, // No user logged in
        clearCart: jest.fn(),
    }),
}));

// Mock hooks
const mockCreateOrder = jest.fn();
jest.mock('@/lib/hooks', () => ({
    useCreateOrder: () => ({
        mutateAsync: mockCreateOrder,
        isPending: false,
    }),
    useAddresses: () => ({
        data: [],
        isLoading: false,
    }),
    useAddAddress: () => ({
        mutateAsync: jest.fn(),
        isPending: false,
    }),
}));

// Mock apollo client
jest.mock('@/lib/apollo/client', () => ({
    apolloClient: {
        query: jest.fn(),
    },
}));

// Mock GQL_QUERIES
jest.mock('@/lib/apollo/queries/queries', () => ({
    GQL_QUERIES: {
        VALIDATE_COUPON_QUERY: 'VALIDATE_COUPON_QUERY',
    },
}));

// Mock UI components
jest.mock('@3asoftwares/ui', () => ({
    Button: ({ children, onClick, disabled, variant, className, ...rest }: any) => (
        <button onClick={onClick} disabled={disabled} className={className} data-variant={variant} {...rest}>
            {children}
        </button>
    ),
    Input: ({ type, value, onChange, label, placeholder, disabled, ...rest }: any) => (
        <div>
            {label && <label>{label}</label>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                {...rest}
            />
        </div>
    ),
    Radio: ({ children, ...rest }: any) => (
        <div {...rest}>{children}</div>
    ),
    ToasterBox: ({ message, isOpen, onClose, type }: any) => (
        isOpen ? <div data-testid="toast" data-type={type}>{message}</div> : null
    ),
}));

// Mock FontAwesome
jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: ({ icon }: any) => <span data-testid="icon">{icon?.iconName || 'icon'}</span>,
}));

// Mock PageHeader
jest.mock('@/components', () => ({
    PageHeader: ({ title, subtitle }: any) => (
        <div data-testid="page-header">
            <h1>{title}</h1>
            <p>{subtitle}</p>
        </div>
    ),
}));

// Mock formatPrice
jest.mock('@3asoftwares/utils/client', () => ({
    formatPrice: (price: number) => `$${price.toFixed(2)}`,
    Logger: {
        error: jest.fn(),
    },
}));

import CheckoutPage from '@/app/checkout/page';

describe('CheckoutPage - No User Logged In', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the checkout page with items', () => {
        render(<CheckoutPage />);

        expect(screen.getByTestId('page-header')).toBeInTheDocument();
        expect(screen.getByText('Secure Checkout')).toBeInTheDocument();
    });

    it('should display no saved addresses message', () => {
        render(<CheckoutPage />);

        expect(screen.getByText(/No saved addresses/i) || screen.getByText(/Add new address/i)).toBeTruthy();
    });

    it('should show add new address button', () => {
        render(<CheckoutPage />);

        const addAddressBtn = screen.getByRole('button', { name: /add new address/i });
        expect(addAddressBtn).toBeInTheDocument();
    });

    it('should toggle new address form when button is clicked', () => {
        render(<CheckoutPage />);

        const addAddressBtn = screen.getByRole('button', { name: /add new address/i });
        fireEvent.click(addAddressBtn);

        expect(screen.getByPlaceholderText(/Full Name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Mobile Number/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Street Address/i)).toBeInTheDocument();
    });

    it('should have back to cart button', () => {
        render(<CheckoutPage />);

        const backBtn = screen.getByRole('button', { name: /Back to Cart/i });
        expect(backBtn).toBeInTheDocument();
    });

    it('should navigate to cart when back button is clicked', () => {
        render(<CheckoutPage />);

        const backBtn = screen.getByRole('button', { name: /Back to Cart/i });
        fireEvent.click(backBtn);

        expect(mockPush).toHaveBeenCalledWith('/cart');
    });

    it('should redirect to login when placing order without user', async () => {
        render(<CheckoutPage />);

        const placeOrderBtn = screen.getByRole('button', { name: /Place Order/i });
        fireEvent.click(placeOrderBtn);

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/login?redirect=/checkout');
        });
    });
});
