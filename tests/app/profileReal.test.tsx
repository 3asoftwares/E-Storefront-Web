import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilePage from '@/app/profile/page';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>;
});

// Mock cart store
const mockUserProfile = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  phone: '1234567890',
  addresses: [],
};

const mockWishlist = [
  {
    id: '1',
    name: 'Test Product 1',
    price: 99.99,
    image: '/product1.jpg',
    description: 'Test description',
  },
  {
    id: '2',
    name: 'Test Product 2',
    price: 149.99,
    image: '/product2.jpg',
    description: 'Another test description',
  },
];

const mockRemoveFromWishlist = jest.fn();
const mockAddItem = jest.fn();
const mockSetUserProfile = jest.fn();
const mockLoadUserFromStorage = jest.fn();

jest.mock('@/store/cartStore', () => ({
  useCartStore: () => ({
    userProfile: mockUserProfile,
    setUserProfile: mockSetUserProfile,
    wishlist: mockWishlist,
    removeFromWishlist: mockRemoveFromWishlist,
    addItem: mockAddItem,
    loadUserFromStorage: mockLoadUserFromStorage,
  }),
}));

// Mock toast
const mockShowToast = jest.fn();
jest.mock('@/lib/hooks/useToast', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

// Mock auth hooks
const mockRefetchUser = jest.fn();
jest.mock('@/lib/hooks/useAuth', () => ({
  useCurrentUser: () => ({
    data: {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      emailVerified: true,
    },
    refetch: mockRefetchUser,
    isLoading: false,
    isFetched: true,
  }),
}));

// Mock email verification
const mockSendVerificationEmail = jest.fn();
jest.mock('@/lib/hooks/useEmailVerification', () => ({
  useSendVerificationEmail: () => ({
    sendVerificationEmail: mockSendVerificationEmail,
    isLoading: false,
    data: null,
  }),
  useVerifyEmail: () => {},
}));

// Mock update profile
const mockUpdateProfile = jest.fn();
jest.mock('@/lib/hooks/useUpdateProfile', () => ({
  useUpdateProfile: () => ({
    updateProfile: mockUpdateProfile,
    isLoading: false,
  }),
}));

// Mock addresses hooks
const mockAddresses = [
  {
    id: 'addr-1',
    name: 'Home Address',
    mobile: '9876543210',
    email: 'home@example.com',
    street: '123 Main St',
    city: 'Test City',
    state: 'Test State',
    zip: '12345',
    country: 'India',
    isDefault: true,
  },
];

const mockAddAddressMutation = jest.fn();
const mockDeleteAddressMutation = jest.fn();
const mockSetDefaultAddressMutation = jest.fn();

jest.mock('@/lib/hooks/useAddresses', () => ({
  useAddresses: () => ({
    data: mockAddresses,
    isLoading: false,
  }),
  useAddAddress: () => ({
    mutateAsync: mockAddAddressMutation,
    isPending: false,
  }),
  useDeleteAddress: () => ({
    mutateAsync: mockDeleteAddressMutation,
    isPending: false,
  }),
  useSetDefaultAddress: () => ({
    mutateAsync: mockSetDefaultAddressMutation,
    isPending: false,
  }),
}));

// Mock tickets hooks
const mockCreateTicketMutation = jest.fn();
jest.mock('@/lib/hooks/useTickets', () => ({
  useMyTickets: () => ({
    data: { tickets: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } },
    isLoading: false,
  }),
  useCreateTicket: () => ({
    mutateAsync: mockCreateTicketMutation,
    isPending: false,
  }),
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

describe('ProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the page header', async () => {
    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByTestId('page-header')).toBeInTheDocument();
    });
  });

  it('should render tab navigation', async () => {
    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /Profile/i }).length).toBeGreaterThan(0);
      expect(screen.getByRole('button', { name: /Addresses/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Wishlist/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Support Tickets/i })).toBeInTheDocument();
    });
  });

  it('should display user profile information', async () => {
    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getAllByText('Test User').length).toBeGreaterThan(0);
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  });

  it('should switch to addresses tab', async () => {
    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Addresses/i })).toBeInTheDocument();
    });

    const addressesTab = screen.getByRole('button', { name: /Addresses/i });
    fireEvent.click(addressesTab);

    await waitFor(() => {
      expect(screen.getByText('Saved Addresses')).toBeInTheDocument();
    });
  });

  it('should switch to wishlist tab', async () => {
    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Wishlist/i })).toBeInTheDocument();
    });

    const wishlistTab = screen.getByRole('button', { name: /Wishlist/i });
    fireEvent.click(wishlistTab);

    await waitFor(() => {
      expect(screen.getByText('My Wishlist')).toBeInTheDocument();
    });
  });

  it('should switch to tickets tab', async () => {
    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Support Tickets/i })).toBeInTheDocument();
    });

    const ticketsTab = screen.getByRole('button', { name: /Support Tickets/i });
    fireEvent.click(ticketsTab);

    await waitFor(() => {
      expect(screen.getAllByText('Support Tickets').length).toBeGreaterThan(0);
    });
  });

  it('should show edit profile button', async () => {
    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Edit Profile/i })).toBeInTheDocument();
    });
  });

  it('should switch to edit mode when edit button is clicked', async () => {
    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Edit Profile/i })).toBeInTheDocument();
    });

    const editButton = screen.getByRole('button', { name: /Edit Profile/i });
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    });
  });

  it('should cancel editing when cancel button is clicked', async () => {
    render(<ProfilePage />);

    // Enter edit mode
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Edit Profile/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Edit Profile/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    });

    // Cancel editing
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Edit Profile/i })).toBeInTheDocument();
    });
  });

  it('should display verified email badge when email is verified', async () => {
    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Verified')).toBeInTheDocument();
    });
  });

  it('should display addresses list', async () => {
    render(<ProfilePage />);

    const addressesTab = screen.getByRole('button', { name: /Addresses/i });
    fireEvent.click(addressesTab);

    await waitFor(() => {
      expect(screen.getByText('Home Address')).toBeInTheDocument();
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
    });
  });

  it('should show Add Address button', async () => {
    render(<ProfilePage />);

    const addressesTab = screen.getByRole('button', { name: /Addresses/i });
    fireEvent.click(addressesTab);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Add Address/i })).toBeInTheDocument();
    });
  });

  it('should display wishlist items', async () => {
    render(<ProfilePage />);

    const wishlistTab = screen.getByRole('button', { name: /Wishlist/i });
    fireEvent.click(wishlistTab);

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });
  });
});
