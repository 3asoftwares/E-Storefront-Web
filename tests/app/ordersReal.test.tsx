import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock useRouter
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
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

// Mock useOrders hook
const mockUseOrders = jest.fn();
jest.mock('@/lib/hooks', () => ({
  useOrders: () => mockUseOrders(),
}));

// Mock useCartStore
const mockUserProfile = { id: 'user-1', name: 'Test User' };
jest.mock('@/store/cartStore', () => ({
  useCartStore: () => ({
    userProfile: mockUserProfile,
  }),
}));

// Mock components
jest.mock('@/components', () => ({
  PageHeader: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div data-testid="page-header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  ),
  EmptyState: ({
    title,
    description,
    actionText,
    actionHref,
  }: {
    title: string;
    description: string;
    actionText?: string;
    actionHref?: string;
  }) => (
    <div data-testid="empty-state">
      <h2>{title}</h2>
      <p>{description}</p>
      {actionText && <a href={actionHref}>{actionText}</a>}
    </div>
  ),
}));

// Mock UI components
jest.mock('@3asoftwares/ui', () => ({
  Button: ({ children, onClick, disabled, variant, size, className, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} className={className} {...props}>
      {children}
    </button>
  ),
}));

import OrdersPage from '../../app/orders/page';

describe('OrdersPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state', () => {
    mockUseOrders.mockReturnValue({
      isLoading: true,
      data: null,
      error: null,
    });

    render(<OrdersPage />);
    expect(document.querySelector('.animate-spin')).toBeTruthy();
  });

  it('should render error state', () => {
    mockUseOrders.mockReturnValue({
      isLoading: false,
      data: null,
      error: new Error('Failed to load'),
    });

    render(<OrdersPage />);
    expect(screen.getByText('Error Loading Orders')).toBeInTheDocument();
    expect(screen.getByText(/Failed to load your orders/)).toBeInTheDocument();
  });

  it('should navigate home on error button click', () => {
    mockUseOrders.mockReturnValue({
      isLoading: false,
      data: null,
      error: new Error('Failed to load'),
    });

    render(<OrdersPage />);
    fireEvent.click(screen.getByText('Go Home'));
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('should render empty state when no orders', () => {
    mockUseOrders.mockReturnValue({
      isLoading: false,
      data: { orders: [], pagination: { pages: 1 } },
      error: null,
    });

    render(<OrdersPage />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('No Orders Yet')).toBeInTheDocument();
    expect(screen.getByText(/Start shopping to create your first order/)).toBeInTheDocument();
  });

  it('should render orders list', () => {
    const mockOrders = [
      {
        id: '1',
        orderNumber: 'ORD-001',
        status: 'delivered',
        total: 99.99,
        createdAt: '2024-01-15T10:00:00Z',
        items: [
          { productName: 'Product 1', quantity: 2 },
          { productName: 'Product 2', quantity: 1 },
        ],
      },
      {
        id: '2',
        orderNumber: 'ORD-002',
        status: 'pending',
        total: 49.99,
        createdAt: '2024-01-16T10:00:00Z',
        items: [{ productName: 'Product 3', quantity: 1 }],
      },
    ];

    mockUseOrders.mockReturnValue({
      isLoading: false,
      data: { orders: mockOrders, pagination: { pages: 1 } },
      error: null,
    });

    render(<OrdersPage />);
    expect(screen.getByText('Order #ORD-001')).toBeInTheDocument();
    expect(screen.getByText('Order #ORD-002')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('$49.99')).toBeInTheDocument();
  });

  it('should show order status badges', () => {
    const mockOrders = [
      {
        id: '1',
        orderNumber: 'ORD-001',
        status: 'delivered',
        total: 99.99,
        createdAt: '2024-01-15T10:00:00Z',
        items: [{ productName: 'Product 1', quantity: 1 }],
      },
    ];

    mockUseOrders.mockReturnValue({
      isLoading: false,
      data: { orders: mockOrders, pagination: { pages: 1 } },
      error: null,
    });

    render(<OrdersPage />);
    expect(screen.getByText('Delivered')).toBeInTheDocument();
  });

  it('should navigate to order details on button click', () => {
    const mockOrders = [
      {
        id: '123',
        orderNumber: 'ORD-001',
        status: 'pending',
        total: 99.99,
        createdAt: '2024-01-15T10:00:00Z',
        items: [{ productName: 'Product 1', quantity: 1 }],
      },
    ];

    mockUseOrders.mockReturnValue({
      isLoading: false,
      data: { orders: mockOrders, pagination: { pages: 1 } },
      error: null,
    });

    render(<OrdersPage />);
    fireEvent.click(screen.getByText('View Details'));
    expect(mockPush).toHaveBeenCalledWith('/orders/123');
  });

  it('should show Track Package button for shipped orders', () => {
    const mockOrders = [
      {
        id: '123',
        orderNumber: 'ORD-001',
        status: 'shipped',
        total: 99.99,
        createdAt: '2024-01-15T10:00:00Z',
        items: [{ productName: 'Product 1', quantity: 1 }],
      },
    ];

    mockUseOrders.mockReturnValue({
      isLoading: false,
      data: { orders: mockOrders, pagination: { pages: 1 } },
      error: null,
    });

    render(<OrdersPage />);
    expect(screen.getByText('Track Package')).toBeInTheDocument();
  });

  it('should show Reorder button for delivered orders', () => {
    const mockOrders = [
      {
        id: '123',
        orderNumber: 'ORD-001',
        status: 'delivered',
        total: 99.99,
        createdAt: '2024-01-15T10:00:00Z',
        items: [{ productName: 'Product 1', quantity: 1 }],
      },
    ];

    mockUseOrders.mockReturnValue({
      isLoading: false,
      data: { orders: mockOrders, pagination: { pages: 1 } },
      error: null,
    });

    render(<OrdersPage />);
    expect(screen.getByText('Reorder')).toBeInTheDocument();
  });

  it('should render pagination when multiple pages', () => {
    const mockOrders = [
      {
        id: '1',
        orderNumber: 'ORD-001',
        status: 'pending',
        total: 99.99,
        createdAt: '2024-01-15T10:00:00Z',
        items: [{ productName: 'Product 1', quantity: 1 }],
      },
    ];

    mockUseOrders.mockReturnValue({
      isLoading: false,
      data: { orders: mockOrders, pagination: { pages: 3 } },
      error: null,
    });

    render(<OrdersPage />);
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('2').length).toBeGreaterThan(0);
    expect(screen.getAllByText('3').length).toBeGreaterThan(0);
  });

  it('should navigate to next page on Next click', () => {
    const mockOrders = [
      {
        id: '1',
        orderNumber: 'ORD-001',
        status: 'pending',
        total: 99.99,
        createdAt: '2024-01-15T10:00:00Z',
        items: [{ productName: 'Product 1', quantity: 1 }],
      },
    ];

    mockUseOrders.mockReturnValue({
      isLoading: false,
      data: { orders: mockOrders, pagination: { pages: 3 } },
      error: null,
    });

    render(<OrdersPage />);
    fireEvent.click(screen.getByText('Next'));
    // Component should re-render with page 2 - we can verify by checking the button 2 is now active
  });

  it('should show more items indicator when order has many items', () => {
    const mockOrders = [
      {
        id: '1',
        orderNumber: 'ORD-001',
        status: 'pending',
        total: 99.99,
        createdAt: '2024-01-15T10:00:00Z',
        items: [
          { productName: 'Product 1', quantity: 1 },
          { productName: 'Product 2', quantity: 1 },
          { productName: 'Product 3', quantity: 1 },
          { productName: 'Product 4', quantity: 1 },
          { productName: 'Product 5', quantity: 1 },
        ],
      },
    ];

    mockUseOrders.mockReturnValue({
      isLoading: false,
      data: { orders: mockOrders, pagination: { pages: 1 } },
      error: null,
    });

    render(<OrdersPage />);
    expect(screen.getByText('+2 more')).toBeInTheDocument();
  });

  it('should render page header with correct count', () => {
    const mockOrders = [
      {
        id: '1',
        orderNumber: 'ORD-001',
        status: 'pending',
        total: 99.99,
        createdAt: '2024-01-15T10:00:00Z',
        items: [{ productName: 'Product 1', quantity: 1 }],
      },
      {
        id: '2',
        orderNumber: 'ORD-002',
        status: 'delivered',
        total: 49.99,
        createdAt: '2024-01-16T10:00:00Z',
        items: [{ productName: 'Product 2', quantity: 1 }],
      },
    ];

    mockUseOrders.mockReturnValue({
      isLoading: false,
      data: { orders: mockOrders, pagination: { pages: 1 } },
      error: null,
    });

    render(<OrdersPage />);
    expect(screen.getByText('My Orders')).toBeInTheDocument();
    expect(screen.getByText('2 order(s) found')).toBeInTheDocument();
  });

  it('should track order for processing status', () => {
    const mockOrders = [
      {
        id: '123',
        orderNumber: 'ORD-001',
        status: 'processing',
        total: 99.99,
        createdAt: '2024-01-15T10:00:00Z',
        items: [{ productName: 'Product 1', quantity: 1 }],
      },
    ];

    mockUseOrders.mockReturnValue({
      isLoading: false,
      data: { orders: mockOrders, pagination: { pages: 1 } },
      error: null,
    });

    render(<OrdersPage />);
    fireEvent.click(screen.getByText('Track Package'));
    expect(mockPush).toHaveBeenCalledWith('/orders/123/track');
  });

  it('should reorder delivered order', () => {
    const mockOrders = [
      {
        id: '123',
        orderNumber: 'ORD-001',
        status: 'delivered',
        total: 99.99,
        createdAt: '2024-01-15T10:00:00Z',
        items: [{ productName: 'Product 1', quantity: 1 }],
      },
    ];

    mockUseOrders.mockReturnValue({
      isLoading: false,
      data: { orders: mockOrders, pagination: { pages: 1 } },
      error: null,
    });

    render(<OrdersPage />);
    fireEvent.click(screen.getByText('Reorder'));
    expect(mockPush).toHaveBeenCalledWith('/products?reorder=123');
  });
});
