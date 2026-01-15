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

// Mock cart store with unverified email user
const mockUserProfile = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    phone: '1234567890',
    addresses: [],
};

const mockWishlist: any[] = [];
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

// Mock auth hooks - unverified email
const mockRefetchUser = jest.fn();
jest.mock('@/lib/hooks/useAuth', () => ({
    useCurrentUser: () => ({
        data: {
            id: 'user-123',
            email: 'test@example.com',
            name: 'Test User',
            emailVerified: false, // Not verified
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
const mockAddresses: any[] = [];
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

describe('ProfilePage - Unverified Email', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should show unverified email warning', async () => {
        render(<ProfilePage />);

        await waitFor(() => {
            expect(screen.getByText('Unverified')).toBeInTheDocument();
        });
    });

    it('should show email not verified section', async () => {
        render(<ProfilePage />);

        await waitFor(() => {
            expect(screen.getByText('Email Not Verified')).toBeInTheDocument();
        });
    });

    it('should show send verification email button', async () => {
        render(<ProfilePage />);

        await waitFor(() => {
            const sendBtn = screen.getByRole('button', { name: /Send Verification Email/i });
            expect(sendBtn).toBeInTheDocument();
        });
    });

    it('should call send verification email when button clicked', async () => {
        mockSendVerificationEmail.mockResolvedValue({ success: true, message: 'Email sent' });

        render(<ProfilePage />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Send Verification Email/i })).toBeInTheDocument();
        });

        const sendBtn = screen.getByRole('button', { name: /Send Verification Email/i });
        fireEvent.click(sendBtn);

        await waitFor(() => {
            expect(mockSendVerificationEmail).toHaveBeenCalledWith('storefront');
        });
    });

    it('should handle send verification email error', async () => {
        mockSendVerificationEmail.mockRejectedValue(new Error('Failed to send'));

        render(<ProfilePage />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Send Verification Email/i })).toBeInTheDocument();
        });

        const sendBtn = screen.getByRole('button', { name: /Send Verification Email/i });
        fireEvent.click(sendBtn);

        await waitFor(() => {
            expect(mockSendVerificationEmail).toHaveBeenCalled();
        });
    });
});

describe('ProfilePage - Profile Update', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should save profile changes', async () => {
        mockUpdateProfile.mockResolvedValue({ success: true, user: { name: 'Updated Name' } });

        render(<ProfilePage />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Edit Profile/i })).toBeInTheDocument();
        });

        // Enter edit mode
        fireEvent.click(screen.getByRole('button', { name: /Edit Profile/i }));

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
        });

        // Save changes
        fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

        await waitFor(() => {
            expect(mockUpdateProfile).toHaveBeenCalled();
        });
    });

    it('should handle profile update error', async () => {
        mockUpdateProfile.mockRejectedValue(new Error('Update failed'));

        render(<ProfilePage />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Edit Profile/i })).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: /Edit Profile/i }));

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

        await waitFor(() => {
            expect(mockUpdateProfile).toHaveBeenCalled();
        });
    });
});

describe('ProfilePage - Empty Wishlist', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should show empty wishlist message when no items', async () => {
        render(<ProfilePage />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Wishlist/i })).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: /Wishlist/i }));

        await waitFor(() => {
            expect(screen.getByText('My Wishlist')).toBeInTheDocument();
            // Empty wishlist shows different message
            expect(screen.getByText(/Your wishlist is empty/i)).toBeInTheDocument();
        });
    });
});

describe('ProfilePage - Empty Addresses', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should show no addresses message', async () => {
        render(<ProfilePage />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Addresses/i })).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: /Addresses/i }));

        await waitFor(() => {
            expect(screen.getByText('Saved Addresses')).toBeInTheDocument();
            expect(screen.getByText(/No addresses saved/i)).toBeInTheDocument();
        });
    });

    it('should show add address form when button clicked', async () => {
        render(<ProfilePage />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Addresses/i })).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: /Addresses/i }));

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Add Address/i })).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: /Add Address/i }));

        await waitFor(() => {
            expect(screen.getByPlaceholderText(/Full Name/i)).toBeInTheDocument();
        });
    });
});
