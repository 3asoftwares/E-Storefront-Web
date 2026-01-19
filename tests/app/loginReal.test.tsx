import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

// Mock useRouter and useSearchParams
const mockPush = jest.fn();
const mockGet = jest.fn().mockReturnValue('/');
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
    useSearchParams: () => ({
        get: mockGet,
    }),
}));

// Mock next/link
jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}));

// Mock useLogin hook
const mockLogin = jest.fn();
jest.mock('@/lib/hooks/useAuth', () => ({
    useLogin: () => ({
        login: mockLogin,
        isLoading: false,
        error: null,
    }),
}));

// Mock useCartStore
const mockSetUserProfile = jest.fn();
jest.mock('@/store/cartStore', () => ({
    useCartStore: () => ({
        userProfile: null,
        setUserProfile: mockSetUserProfile,
    }),
}));

// Mock GoogleSignInButton
jest.mock('@/components/GoogleSignInButton', () => ({
    __esModule: true,
    default: () => <div data-testid="google-signin-button">Google Sign In</div>,
}));

// Mock UI components
jest.mock('@3asoftwares/ui', () => ({
    Button: ({ children, onClick, type, disabled, className, ...props }: any) => (
        <button onClick={onClick} type={type} disabled={disabled} className={className} {...props}>
            {children}
        </button>
    ),
    Input: ({ label, value, onChange, placeholder, type, error, ...props }: any) => (
        <div>
            {label && <label htmlFor={props.name || label}>{label}</label>}
            <input
                id={props.name || label}
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

import LoginPage from '../../app/login/page';

describe('LoginPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.NEXT_PUBLIC_LOGO_URL = '/test-logo.png';
    });

    it('should render the page title', () => {
        render(<LoginPage />);
        expect(screen.getByText('3A Softwares')).toBeInTheDocument();
    });

    it('should render Sign In heading', () => {
        render(<LoginPage />);
        expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
    });

    it('should render email input', () => {
        render(<LoginPage />);
        expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
    });

    it('should render password input', () => {
        render(<LoginPage />);
        expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    });

    it('should render Sign In button', () => {
        render(<LoginPage />);
        expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    });

    it('should render Google Sign In button', () => {
        render(<LoginPage />);
        expect(screen.getByTestId('google-signin-button')).toBeInTheDocument();
    });

    it('should render forgot password link', () => {
        render(<LoginPage />);
        expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    });

    it('should render sign up link', () => {
        render(<LoginPage />);
        expect(screen.getByText(/Don't have an account/)).toBeInTheDocument();
    });

    it('should update email on change', () => {
        render(<LoginPage />);
        const emailInput = screen.getByPlaceholderText('your@email.com');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

        expect(emailInput).toHaveValue('test@example.com');
    });

    it('should update password on change', () => {
        render(<LoginPage />);
        const passwordInput = screen.getByPlaceholderText('Enter your password');

        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(passwordInput).toHaveValue('password123');
    });

    it('should show validation error for empty email', async () => {
        render(<LoginPage />);

        const passwordInput = screen.getByPlaceholderText('Enter your password');
        const signInButton = screen.getByRole('button', { name: 'Sign In' });

        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(signInButton);

        await waitFor(() => {
            expect(screen.getByText('Email is required')).toBeInTheDocument();
        });
    });

    it('should show validation error for invalid email', async () => {
        render(<LoginPage />);

        const emailInput = screen.getByPlaceholderText('your@email.com');
        const passwordInput = screen.getByPlaceholderText('Enter your password');
        const signInButton = screen.getByRole('button', { name: 'Sign In' });

        fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(signInButton);

        await waitFor(() => {
            expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
        });
    });

    it('should show validation error for short password', async () => {
        render(<LoginPage />);

        const emailInput = screen.getByPlaceholderText('your@email.com');
        const passwordInput = screen.getByPlaceholderText('Enter your password');
        const signInButton = screen.getByRole('button', { name: 'Sign In' });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: '123' } });
        fireEvent.click(signInButton);

        await waitFor(() => {
            expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
        });
    });

    it('should call login on valid form submission', async () => {
        mockLogin.mockResolvedValue({ user: { id: '1', email: 'test@example.com', name: 'Test' } });

        render(<LoginPage />);

        const emailInput = screen.getByPlaceholderText('your@email.com');
        const passwordInput = screen.getByPlaceholderText('Enter your password');
        const signInButton = screen.getByRole('button', { name: 'Sign In' });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        await act(async () => {
            fireEvent.click(signInButton);
        });

        expect(mockLogin).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'password123',
        });
    });

    it('should redirect after successful login', async () => {
        mockLogin.mockResolvedValue({ user: { id: '1', email: 'test@example.com', name: 'Test' } });

        render(<LoginPage />);

        const emailInput = screen.getByPlaceholderText('your@email.com');
        const passwordInput = screen.getByPlaceholderText('Enter your password');
        const signInButton = screen.getByRole('button', { name: 'Sign In' });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        await act(async () => {
            fireEvent.click(signInButton);
        });

        expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('should show error for non-customer role', async () => {
        mockLogin.mockResolvedValue({ user: { id: '1', email: 'admin@example.com', role: 'admin' } });

        render(<LoginPage />);

        const emailInput = screen.getByPlaceholderText('your@email.com');
        const passwordInput = screen.getByPlaceholderText('Enter your password');
        const signInButton = screen.getByRole('button', { name: 'Sign In' });

        fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        await act(async () => {
            fireEvent.click(signInButton);
        });

        await waitFor(() => {
            expect(screen.getByText(/Access denied/)).toBeInTheDocument();
        });
    });

    it('should render welcome message', () => {
        render(<LoginPage />);
        expect(screen.getByText('Welcome back to your favorite store')).toBeInTheDocument();
    });

    it('should render feature list', () => {
        render(<LoginPage />);
        expect(screen.getByText('Shop from thousands of products')).toBeInTheDocument();
        expect(screen.getByText('Fast & secure checkout')).toBeInTheDocument();
        expect(screen.getByText('Track your orders easily')).toBeInTheDocument();
    });
});
