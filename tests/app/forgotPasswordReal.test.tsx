import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

// Mock FontAwesome
jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: ({ icon, ...props }: any) => <svg data-testid="fa-icon" {...props} />,
}));

// Mock next/link
jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}));

// Mock useForgotPassword hook
const mockForgotPassword = jest.fn();
jest.mock('@/lib/hooks/usePasswordReset', () => ({
    useForgotPassword: () => ({
        forgotPassword: mockForgotPassword,
        isLoading: false,
    }),
}));

// Mock UI components
jest.mock('@3asoftwares/ui', () => ({
    Button: ({ children, onClick, type, disabled, className, ...props }: any) => (
        <button onClick={onClick} type={type} disabled={disabled} className={className} {...props}>
            {children}
        </button>
    ),
    Input: ({ label, value, onChange, placeholder, type, ...props }: any) => (
        <div>
            {label && <label htmlFor={props.name || 'input'}>{label}</label>}
            <input
                id={props.name || 'input'}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                {...props}
            />
        </div>
    ),
}));

import ForgotPasswordPage from '../../app/forgot-password/page';

describe('ForgotPasswordPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the page title', () => {
        render(<ForgotPasswordPage />);
        expect(screen.getByText('3A Softwares')).toBeInTheDocument();
    });

    it('should render forgot password heading', () => {
        render(<ForgotPasswordPage />);
        expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
    });

    it('should render description text', () => {
        render(<ForgotPasswordPage />);
        expect(screen.getByText(/Enter your email address and we'll send you a link/)).toBeInTheDocument();
    });

    it('should render email input', () => {
        render(<ForgotPasswordPage />);
        expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
    });

    it('should render submit button', () => {
        render(<ForgotPasswordPage />);
        expect(screen.getByRole('button', { name: 'Send Reset Link' })).toBeInTheDocument();
    });

    it('should render back to login link', () => {
        render(<ForgotPasswordPage />);
        expect(screen.getByText(/Sign in/)).toBeInTheDocument();
    });

    it('should update email on change', () => {
        render(<ForgotPasswordPage />);
        const emailInput = screen.getByPlaceholderText('your@email.com');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

        expect(emailInput).toHaveValue('test@example.com');
    });

    it('should show error when submitting without email', async () => {
        render(<ForgotPasswordPage />);

        const submitButton = screen.getByRole('button', { name: 'Send Reset Link' });
        const form = submitButton.closest('form');

        await act(async () => {
            fireEvent.submit(form!);
        });

        expect(screen.getByText('Please enter your email address')).toBeInTheDocument();
    });

    it('should call forgotPassword on submit', async () => {
        mockForgotPassword.mockResolvedValue({ success: true });

        render(<ForgotPasswordPage />);

        const emailInput = screen.getByPlaceholderText('your@email.com');
        const submitButton = screen.getByRole('button', { name: 'Send Reset Link' });
        const form = submitButton.closest('form');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

        await act(async () => {
            fireEvent.submit(form!);
        });

        expect(mockForgotPassword).toHaveBeenCalledWith({
            email: 'test@example.com',
            domain: expect.any(String),
        });
    });

    it('should show success message after successful submission', async () => {
        mockForgotPassword.mockResolvedValue({ success: true });

        render(<ForgotPasswordPage />);

        const emailInput = screen.getByPlaceholderText('your@email.com');
        const submitButton = screen.getByRole('button', { name: 'Send Reset Link' });
        const form = submitButton.closest('form');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

        await act(async () => {
            fireEvent.submit(form!);
        });

        await waitFor(() => {
            expect(screen.getByText('Check Your Email')).toBeInTheDocument();
        });
    });

    it('should show error message on failed submission', async () => {
        mockForgotPassword.mockResolvedValue({ success: false, message: 'User not found' });

        render(<ForgotPasswordPage />);

        const emailInput = screen.getByPlaceholderText('your@email.com');
        const form = screen.getByRole('button', { name: 'Send Reset Link' }).closest('form');

        fireEvent.change(emailInput, { target: { value: 'notfound@example.com' } });

        await act(async () => {
            fireEvent.submit(form!);
        });

        await waitFor(() => {
            expect(screen.getByText('User not found')).toBeInTheDocument();
        });
    });

    it('should render FontAwesome icons', () => {
        render(<ForgotPasswordPage />);
        const icons = screen.getAllByTestId('fa-icon');
        expect(icons.length).toBeGreaterThan(0);
    });

    it('should handle GraphQL errors', async () => {
        mockForgotPassword.mockRejectedValue({
            graphQLErrors: [{ message: 'GraphQL error occurred' }],
        });

        render(<ForgotPasswordPage />);

        const emailInput = screen.getByPlaceholderText('your@email.com');
        const form = screen.getByRole('button', { name: 'Send Reset Link' }).closest('form');

        fireEvent.change(emailInput, { target: { value: 'error@example.com' } });

        await act(async () => {
            fireEvent.submit(form!);
        });

        await waitFor(() => {
            expect(screen.getByText('GraphQL error occurred')).toBeInTheDocument();
        });
    });

    it('should handle network errors', async () => {
        mockForgotPassword.mockRejectedValue({
            networkError: { result: { errors: [{ message: 'Network error' }] } },
        });

        render(<ForgotPasswordPage />);

        const emailInput = screen.getByPlaceholderText('your@email.com');
        const form = screen.getByRole('button', { name: 'Send Reset Link' }).closest('form');

        fireEvent.change(emailInput, { target: { value: 'error@example.com' } });

        await act(async () => {
            fireEvent.submit(form!);
        });

        await waitFor(() => {
            expect(screen.getByText('Network error')).toBeInTheDocument();
        });
    });
});
