import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Empty cart mock
jest.mock('@/store/cartStore', () => ({
  useCartStore: () => ({
    items: [],
    userProfile: null,
    clearCart: jest.fn(),
  }),
}));

// Mock hooks
jest.mock('@/lib/hooks', () => ({
  useCreateOrder: () => ({
    mutateAsync: jest.fn(),
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

describe('CheckoutPage with empty cart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show empty cart message', () => {
    render(<CheckoutPage />);

    expect(screen.getByText('Cart is Empty')).toBeInTheDocument();
    expect(screen.getByText(/Add items to your cart before checking out/i)).toBeInTheDocument();
  });

  it('should show continue shopping button', () => {
    render(<CheckoutPage />);

    const continueButton = screen.getByRole('button', { name: /continue shopping/i });
    expect(continueButton).toBeInTheDocument();
  });

  it('should navigate to products page when continue shopping is clicked', () => {
    render(<CheckoutPage />);

    const continueButton = screen.getByRole('button', { name: /continue shopping/i });
    fireEvent.click(continueButton);

    expect(mockPush).toHaveBeenCalledWith('/products');
  });
});
