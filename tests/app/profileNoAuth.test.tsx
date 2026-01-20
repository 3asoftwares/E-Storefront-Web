import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

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

// Mock cart store - with no user profile to test redirect logic
const mockSetUserProfile = jest.fn();
const mockLoadUserFromStorage = jest.fn();

jest.mock('@/store/cartStore', () => ({
  useCartStore: () => ({
    userProfile: null,
    setUserProfile: mockSetUserProfile,
    wishlist: [],
    removeFromWishlist: jest.fn(),
    addItem: jest.fn(),
    loadUserFromStorage: mockLoadUserFromStorage,
  }),
}));

// Mock toast
jest.mock('@/lib/hooks/useToast', () => ({
  useToast: () => ({
    showToast: jest.fn(),
  }),
}));

// Mock auth hooks - return null user to test redirect
const mockRefetchUser = jest.fn();
jest.mock('@/lib/hooks/useAuth', () => ({
  useCurrentUser: () => ({
    data: null,
    refetch: mockRefetchUser,
    isLoading: false,
    isFetched: true,
  }),
}));

// Mock email verification
jest.mock('@/lib/hooks/useEmailVerification', () => ({
  useSendVerificationEmail: () => ({
    sendVerificationEmail: jest.fn(),
    isLoading: false,
    data: null,
  }),
  useVerifyEmail: () => {},
}));

// Mock update profile
jest.mock('@/lib/hooks/useUpdateProfile', () => ({
  useUpdateProfile: () => ({
    updateProfile: jest.fn(),
    isLoading: false,
  }),
}));

// Mock addresses hooks
jest.mock('@/lib/hooks/useAddresses', () => ({
  useAddresses: () => ({
    data: [],
    isLoading: false,
  }),
  useAddAddress: () => ({
    mutateAsync: jest.fn(),
    isPending: false,
  }),
  useDeleteAddress: () => ({
    mutateAsync: jest.fn(),
    isPending: false,
  }),
  useSetDefaultAddress: () => ({
    mutateAsync: jest.fn(),
    isPending: false,
  }),
}));

// Mock tickets hooks
jest.mock('@/lib/hooks/useTickets', () => ({
  useMyTickets: () => ({
    data: { tickets: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } },
    isLoading: false,
  }),
  useCreateTicket: () => ({
    mutateAsync: jest.fn(),
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

import ProfilePage from '@/app/profile/page';

describe('ProfilePage - Not Authenticated', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should try to load user from storage on mount', async () => {
    render(<ProfilePage />);

    await waitFor(() => {
      expect(mockLoadUserFromStorage).toHaveBeenCalled();
    });
  });

  it('should redirect to login when not authenticated', async () => {
    render(<ProfilePage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login?redirect=/profile');
    });
  });

  it('should show loading spinner while checking auth', () => {
    render(<ProfilePage />);

    // Loading spinner should be visible during auth check
    const spinners = document.querySelectorAll('.animate-spin');
    expect(spinners.length).toBeGreaterThan(0);
  });
});
