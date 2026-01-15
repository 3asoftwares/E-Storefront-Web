import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

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

// Mock useRegister hook
const mockRegister = jest.fn();
jest.mock('@/lib/hooks/useAuth', () => ({
    useRegister: () => ({
        register: mockRegister,
        isLoading: false,
        error: null,
    }),
}));

// Mock GoogleSignInButton
jest.mock('@/components/GoogleSignInButton', () => ({
    __esModule: true,
    default: () => <div data-testid="google-signin-button">Google Sign Up</div>,
}));

// Mock UI components
jest.mock('@3asoftwares/ui', () => ({
    Button: ({ children, onClick, type, disabled, className, ...props }: any) => (
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

import SignupPage from '../../app/signup/page';

describe('SignupPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        process.env.NEXT_PUBLIC_LOGO_URL = '/test-logo.png';
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should render the page title', () => {
        render(<SignupPage />);
        expect(screen.getByText('3A Softwares')).toBeInTheDocument();
    });

    it('should render Create Account heading', () => {
        render(<SignupPage />);
        expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
    });

    it('should render all form inputs', () => {
        render(<SignupPage />);
        expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
        // Password fields use bullet placeholders
        expect(screen.getAllByPlaceholderText('••••••••')).toHaveLength(2);
    });

    it('should render sign up button', () => {
        render(<SignupPage />);
        expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
    });

    it('should render Google Sign Up button', () => {
        render(<SignupPage />);
        expect(screen.getByTestId('google-signin-button')).toBeInTheDocument();
    });

    it('should render sign in link', () => {
        render(<SignupPage />);
        expect(screen.getByText(/Already have an account/)).toBeInTheDocument();
        expect(screen.getByText('Sign in')).toBeInTheDocument();
    });

    it('should update form fields on change', () => {
        render(<SignupPage />);

        const nameInput = screen.getByPlaceholderText('John Doe');
        const emailInput = screen.getByPlaceholderText('your@email.com');
        const passwordInputs = screen.getAllByPlaceholderText('••••••••');
        const passwordInput = passwordInputs[0];
        const confirmInput = passwordInputs[1];

        fireEvent.change(nameInput, { target: { value: 'Test User', name: 'name' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com', name: 'email' } });
        fireEvent.change(passwordInput, { target: { value: 'Password123', name: 'password' } });
        fireEvent.change(confirmInput, { target: { value: 'Password123', name: 'confirmPassword' } });

        expect(nameInput).toHaveValue('Test User');
        expect(emailInput).toHaveValue('test@example.com');
        expect(passwordInput).toHaveValue('Password123');
        expect(confirmInput).toHaveValue('Password123');
    });

    it('should show validation error for empty name', async () => {
        render(<SignupPage />);

        const submitButton = screen.getByRole('button', { name: 'Create Account' });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Full name is required')).toBeInTheDocument();
        });
    });

    it('should show validation error for invalid email', async () => {
        render(<SignupPage />);

        const nameInput = screen.getByPlaceholderText('John Doe');
        const emailInput = screen.getByPlaceholderText('your@email.com');
        const submitButton = screen.getByRole('button', { name: 'Create Account' });

        fireEvent.change(nameInput, { target: { value: 'Test User', name: 'name' } });
        fireEvent.change(emailInput, { target: { value: 'invalidemail', name: 'email' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
        });
    });

    it('should show validation error for weak password', async () => {
        render(<SignupPage />);

        const nameInput = screen.getByPlaceholderText('John Doe');
        const emailInput = screen.getByPlaceholderText('your@email.com');
        const passwordInput = screen.getAllByPlaceholderText('••••••••')[0];
        const submitButton = screen.getByRole('button', { name: 'Create Account' });

        fireEvent.change(nameInput, { target: { value: 'Test User', name: 'name' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com', name: 'email' } });
        fireEvent.change(passwordInput, { target: { value: 'weak', name: 'password' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
        });
    });

    it('should show validation error for password mismatch', async () => {
        render(<SignupPage />);

        const nameInput = screen.getByPlaceholderText('John Doe');
        const emailInput = screen.getByPlaceholderText('your@email.com');
        const passwordInputs = screen.getAllByPlaceholderText('••••••••');
        const passwordInput = passwordInputs[0];
        const confirmInput = passwordInputs[1];
        const submitButton = screen.getByRole('button', { name: 'Create Account' });

        fireEvent.change(nameInput, { target: { value: 'Test User', name: 'name' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com', name: 'email' } });
        fireEvent.change(passwordInput, { target: { value: 'Password123', name: 'password' } });
        fireEvent.change(confirmInput, { target: { value: 'Different123', name: 'confirmPassword' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
        });
    });

    it('should call register on valid form submission', async () => {
        mockRegister.mockResolvedValue({ success: true });

        render(<SignupPage />);

        const nameInput = screen.getByPlaceholderText('John Doe');
        const emailInput = screen.getByPlaceholderText('your@email.com');
        const passwordInputs = screen.getAllByPlaceholderText('••••••••');
        const passwordInput = passwordInputs[0];
        const confirmInput = passwordInputs[1];
        const submitButton = screen.getByRole('button', { name: 'Create Account' });

        fireEvent.change(nameInput, { target: { value: 'Test User', name: 'name' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com', name: 'email' } });
        fireEvent.change(passwordInput, { target: { value: 'Password123', name: 'password' } });
        fireEvent.change(confirmInput, { target: { value: 'Password123', name: 'confirmPassword' } });

        await act(async () => {
            fireEvent.click(submitButton);
        });

        expect(mockRegister).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'Password123',
            name: 'Test User',
        });
    });

    it('should show success message and redirect after successful signup', async () => {
        mockRegister.mockResolvedValue({ success: true });

        render(<SignupPage />);

        const nameInput = screen.getByPlaceholderText('John Doe');
        const emailInput = screen.getByPlaceholderText('your@email.com');
        const passwordInputs = screen.getAllByPlaceholderText('••••••••');
        const passwordInput = passwordInputs[0];
        const confirmInput = passwordInputs[1];
        const submitButton = screen.getByRole('button', { name: 'Create Account' });

        fireEvent.change(nameInput, { target: { value: 'Test User', name: 'name' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com', name: 'email' } });
        fireEvent.change(passwordInput, { target: { value: 'Password123', name: 'password' } });
        fireEvent.change(confirmInput, { target: { value: 'Password123', name: 'confirmPassword' } });

        await act(async () => {
            fireEvent.click(submitButton);
        });

        await waitFor(() => {
            expect(screen.getByText(/Account created/)).toBeInTheDocument();
        });

        act(() => {
            jest.advanceTimersByTime(2000);
        });

        expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('should show error message on failed signup', async () => {
        mockRegister.mockRejectedValue({
            graphQLErrors: [{ message: 'Email already exists' }],
        });

        render(<SignupPage />);

        const nameInput = screen.getByPlaceholderText('John Doe');
        const emailInput = screen.getByPlaceholderText('your@email.com');
        const passwordInputs = screen.getAllByPlaceholderText('••••••••');
        const passwordInput = passwordInputs[0];
        const confirmInput = passwordInputs[1];
        const submitButton = screen.getByRole('button', { name: 'Create Account' });

        fireEvent.change(nameInput, { target: { value: 'Test User', name: 'name' } });
        fireEvent.change(emailInput, { target: { value: 'existing@example.com', name: 'email' } });
        fireEvent.change(passwordInput, { target: { value: 'Password123', name: 'password' } });
        fireEvent.change(confirmInput, { target: { value: 'Password123', name: 'confirmPassword' } });

        await act(async () => {
            fireEvent.click(submitButton);
        });

        await waitFor(() => {
            expect(screen.getByText('Email already exists')).toBeInTheDocument();
        });
    });

    it('should render welcome message', () => {
        render(<SignupPage />);
        expect(screen.getByText('Create your account to get started')).toBeInTheDocument();
    });

    it('should render feature list', () => {
        render(<SignupPage />);
        expect(screen.getByText(/exclusive deals/i)).toBeInTheDocument();
        expect(screen.getByText(/Save items to your wishlist/i)).toBeInTheDocument();
        expect(screen.getByText(/Fast checkout/i)).toBeInTheDocument();
    });
});
