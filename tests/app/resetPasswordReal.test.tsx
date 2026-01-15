import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock useRouter and useSearchParams
const mockPush = jest.fn();
const mockSearchParamsGet = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
    useSearchParams: () => ({
        get: mockSearchParamsGet,
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
    FontAwesomeIcon: ({ icon }: { icon: any }) => <span data-testid="fa-icon">{icon?.iconName || 'icon'}</span>,
}));

// Mock useResetPassword and useValidateResetToken
const mockResetPassword = jest.fn();
jest.mock('@/lib/hooks/usePasswordReset', () => ({
    useResetPassword: () => ({
        resetPassword: mockResetPassword,
        isLoading: false,
    }),
    useValidateResetToken: (token: string | null) => ({
        isValid: token === 'valid-token',
        email: token === 'valid-token' ? 'test@example.com' : null,
        isLoading: false,
    }),
}));

// Mock UI components
jest.mock('@3asoftwares/ui', () => ({
    Button: ({ children, onClick, type, disabled, className, variant, ...props }: any) => (
        <button onClick={onClick} type={type} disabled={disabled} className={className} {...props}>
            {children}
        </button>
    ),
    Input: ({ label, value, onChange, placeholder, type, name, error, ...props }: any) => (
        <div>
            {label && <label htmlFor={name || label}>{label}</label>}
            <input
                id={name || label}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                {...props}
            />
            {error && <span className="error">{error}</span>}
        </div>
    ),
}));

import ResetPasswordPage from '../../app/reset-password/page';

describe('ResetPasswordPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render invalid token state when no token provided', () => {
        mockSearchParamsGet.mockReturnValue(null);

        render(<ResetPasswordPage />);
        expect(screen.getByText('Invalid Reset Link')).toBeInTheDocument();
    });

    it('should render invalid token message', () => {
        mockSearchParamsGet.mockReturnValue('invalid-token');

        render(<ResetPasswordPage />);
        expect(screen.getByText('Invalid Reset Link')).toBeInTheDocument();
        expect(screen.getByText(/password reset link is invalid or expired/i)).toBeInTheDocument();
    });

    it('should show reasons for invalid link', () => {
        mockSearchParamsGet.mockReturnValue('invalid-token');

        render(<ResetPasswordPage />);
        expect(screen.getByText(/links are valid for 1 hour/i)).toBeInTheDocument();
        expect(screen.getByText(/link has already been used/i)).toBeInTheDocument();
    });

    it('should render request new reset link button', () => {
        mockSearchParamsGet.mockReturnValue('invalid-token');

        render(<ResetPasswordPage />);
        expect(screen.getByText('Request New Reset Link')).toBeInTheDocument();
    });

    it('should render password reset form with valid token', () => {
        mockSearchParamsGet.mockReturnValue('valid-token');

        render(<ResetPasswordPage />);
        expect(screen.getAllByText(/Reset Password/i).length).toBeGreaterThan(0);
    });

    it('should render password input fields with valid token', () => {
        mockSearchParamsGet.mockReturnValue('valid-token');

        render(<ResetPasswordPage />);
        expect(screen.getAllByPlaceholderText('••••••••')).toHaveLength(2);
    });

    it('should show error when passwords do not match', async () => {
        mockSearchParamsGet.mockReturnValue('valid-token');
        mockResetPassword.mockResolvedValue({ success: false, message: 'Passwords do not match' });

        render(<ResetPasswordPage />);

        const passwordInputs = screen.getAllByPlaceholderText('••••••••');
        fireEvent.change(passwordInputs[0], { target: { value: 'Password123' } });
        fireEvent.change(passwordInputs[1], { target: { value: 'Different123' } });

        const form = document.querySelector('form');
        if (form) {
            fireEvent.submit(form);
        }

        await waitFor(() => {
            expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
        });
    });

    it('should show error when password is too short', async () => {
        mockSearchParamsGet.mockReturnValue('valid-token');

        render(<ResetPasswordPage />);

        const passwordInputs = screen.getAllByPlaceholderText('••••••••');
        fireEvent.change(passwordInputs[0], { target: { value: 'short' } });
        fireEvent.change(passwordInputs[1], { target: { value: 'short' } });

        const form = document.querySelector('form');
        if (form) {
            fireEvent.submit(form);
        }

        await waitFor(() => {
            expect(screen.getByText(/Password must be at least 6 characters/i)).toBeInTheDocument();
        });
    });

    it('should call resetPassword on valid submission', async () => {
        mockSearchParamsGet.mockReturnValue('valid-token');
        mockResetPassword.mockResolvedValue({ success: true });

        render(<ResetPasswordPage />);

        const passwordInputs = screen.getAllByPlaceholderText('••••••••');
        fireEvent.change(passwordInputs[0], { target: { value: 'Password123' } });
        fireEvent.change(passwordInputs[1], { target: { value: 'Password123' } });

        const form = document.querySelector('form');
        if (form) {
            fireEvent.submit(form);
        }

        await waitFor(() => {
            expect(mockResetPassword).toHaveBeenCalledWith({
                token: 'valid-token',
                password: 'Password123',
                confirmPassword: 'Password123',
            });
        });
    });

    it('should show success state after password reset', async () => {
        mockSearchParamsGet.mockReturnValue('valid-token');
        mockResetPassword.mockResolvedValue({ success: true });

        render(<ResetPasswordPage />);

        const passwordInputs = screen.getAllByPlaceholderText('••••••••');
        fireEvent.change(passwordInputs[0], { target: { value: 'Password123' } });
        fireEvent.change(passwordInputs[1], { target: { value: 'Password123' } });

        const form = document.querySelector('form');
        if (form) {
            fireEvent.submit(form);
        }

        await waitFor(() => {
            expect(screen.getByText(/Password Reset!/i) || screen.getByText(/password has been successfully changed/i)).toBeTruthy();
        });
    });

    it('should render back to login link', () => {
        mockSearchParamsGet.mockReturnValue('invalid-token');

        render(<ResetPasswordPage />);
        expect(screen.getByText(/Back to Login/i) || screen.getByText(/Sign In/i)).toBeTruthy();
    });

    it('should show error for empty fields', async () => {
        mockSearchParamsGet.mockReturnValue('valid-token');

        render(<ResetPasswordPage />);

        const form = document.querySelector('form');
        if (form) {
            fireEvent.submit(form);
        }

        await waitFor(() => {
            expect(screen.getByText(/Please fill in all fields/i)).toBeInTheDocument();
        });
    });

    it('should handle API error on reset', async () => {
        mockSearchParamsGet.mockReturnValue('valid-token');
        mockResetPassword.mockRejectedValue({
            graphQLErrors: [{ message: 'Token expired' }],
        });

        render(<ResetPasswordPage />);

        const passwordInputs = screen.getAllByPlaceholderText('••••••••');
        fireEvent.change(passwordInputs[0], { target: { value: 'Password123' } });
        fireEvent.change(passwordInputs[1], { target: { value: 'Password123' } });

        const form = document.querySelector('form');
        if (form) {
            fireEvent.submit(form);
        }

        await waitFor(() => {
            expect(screen.getByText('Token expired')).toBeInTheDocument();
        });
    });
});
