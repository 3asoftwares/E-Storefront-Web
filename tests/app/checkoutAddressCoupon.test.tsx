import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock cart store with user and new address scenario
const mockItems = [
  {
    id: 'prod-1',
    productId: 'prod-1',
    name: 'Test Product',
    price: 99.99,
    quantity: 2,
    sellerId: 'seller-1',
  },
];

const mockUserProfile = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
};

const mockClearCart = jest.fn();

jest.mock('@/store/cartStore', () => ({
  useCartStore: () => ({
    items: mockItems,
    userProfile: mockUserProfile,
    clearCart: mockClearCart,
  }),
}));

// Mock hooks with addresses loading state
const mockAddAddressMutation = jest.fn();
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
    mutateAsync: mockAddAddressMutation,
    isPending: false,
  }),
}));

// Mock apollo client for coupon validation
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
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-variant={variant}
      {...rest}
    >
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
  Radio: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
  ToasterBox: ({ message, isOpen, onClose, type }: any) =>
    isOpen ? (
      <div data-testid="toast" data-type={type}>
        {message}
      </div>
    ) : null,
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
import { apolloClient } from '@/lib/apollo/client';

const mockApolloQuery = apolloClient.query as jest.Mock;

describe('CheckoutPage - New Address Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show new address form when add button clicked', () => {
    render(<CheckoutPage />);

    const addBtn = screen.getByRole('button', { name: /add new address/i });
    fireEvent.click(addBtn);

    expect(screen.getByPlaceholderText(/Full Name/i)).toBeInTheDocument();
  });

  it('should toggle back to saved addresses', () => {
    render(<CheckoutPage />);

    const addBtn = screen.getByRole('button', { name: /add new address/i });
    fireEvent.click(addBtn);

    const backBtn = screen.getByRole('button', { name: /Use saved address/i });
    fireEvent.click(backBtn);

    expect(screen.getByRole('button', { name: /add new address/i })).toBeInTheDocument();
  });

  it('should fill in new address form fields', () => {
    render(<CheckoutPage />);

    const addBtn = screen.getByRole('button', { name: /add new address/i });
    fireEvent.click(addBtn);

    const nameInput = screen.getByPlaceholderText(/Full Name/i);
    const mobileInput = screen.getByPlaceholderText(/Mobile Number/i);
    const streetInput = screen.getByPlaceholderText(/Street Address/i);

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(mobileInput, { target: { value: '1234567890' } });
    fireEvent.change(streetInput, { target: { value: '123 Main St' } });

    expect(nameInput).toHaveValue('John Doe');
    expect(mobileInput).toHaveValue('1234567890');
    expect(streetInput).toHaveValue('123 Main St');
  });

  it('should validate address when placing order with new address', async () => {
    render(<CheckoutPage />);

    // Add new address
    const addBtn = screen.getByRole('button', { name: /add new address/i });
    fireEvent.click(addBtn);

    // Try to place order without filling address
    const placeOrderBtn = screen.getByRole('button', { name: /Place Order/i });
    fireEvent.click(placeOrderBtn);

    // Should not call createOrder as validation should fail
    await waitFor(() => {
      expect(mockCreateOrder).not.toHaveBeenCalled();
    });
  });
});

describe('CheckoutPage - Coupon Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have coupon input field', () => {
    render(<CheckoutPage />);

    const couponInput = screen.getByPlaceholderText(/coupon/i);
    expect(couponInput).toBeInTheDocument();
  });

  it('should allow entering coupon code', () => {
    render(<CheckoutPage />);

    const couponInput = screen.getByPlaceholderText(/coupon/i);
    fireEvent.change(couponInput, { target: { value: 'SAVE10' } });

    expect(couponInput).toHaveValue('SAVE10');
  });

  it('should apply valid coupon', async () => {
    mockApolloQuery.mockResolvedValue({
      data: {
        validateCoupon: {
          valid: true,
          discount: 20,
          discountValue: 10,
          discountType: 'percentage',
          code: 'SAVE10',
          message: 'Coupon applied',
        },
      },
    });

    render(<CheckoutPage />);

    const couponInput = screen.getByPlaceholderText(/coupon/i);
    fireEvent.change(couponInput, { target: { value: 'SAVE10' } });

    const applyBtn = screen.getByRole('button', { name: /Apply/i });
    fireEvent.click(applyBtn);

    await waitFor(() => {
      expect(mockApolloQuery).toHaveBeenCalled();
    });
  });

  it('should handle invalid coupon', async () => {
    mockApolloQuery.mockResolvedValue({
      data: {
        validateCoupon: {
          valid: false,
          message: 'Invalid coupon code',
        },
      },
    });

    render(<CheckoutPage />);

    const couponInput = screen.getByPlaceholderText(/coupon/i);
    fireEvent.change(couponInput, { target: { value: 'INVALID' } });

    const applyBtn = screen.getByRole('button', { name: /Apply/i });
    fireEvent.click(applyBtn);

    await waitFor(() => {
      expect(mockApolloQuery).toHaveBeenCalled();
    });
  });

  it('should handle coupon validation error', async () => {
    mockApolloQuery.mockRejectedValue(new Error('Network error'));

    render(<CheckoutPage />);

    const couponInput = screen.getByPlaceholderText(/coupon/i);
    fireEvent.change(couponInput, { target: { value: 'TEST' } });

    const applyBtn = screen.getByRole('button', { name: /Apply/i });
    fireEvent.click(applyBtn);

    await waitFor(() => {
      expect(mockApolloQuery).toHaveBeenCalled();
    });
  });
});

describe('CheckoutPage - Order Notes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have order notes section', () => {
    render(<CheckoutPage />);

    expect(screen.getByText('Order Notes')).toBeInTheDocument();
  });

  it('should allow entering order notes', () => {
    render(<CheckoutPage />);

    const notesTextarea = screen.getByPlaceholderText(/instructions|notes/i);
    fireEvent.change(notesTextarea, { target: { value: 'Please leave at door' } });

    expect(notesTextarea).toHaveValue('Please leave at door');
  });
});
