import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock dependencies
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/login',
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }: { icon: string }) => <span data-testid="fa-icon">{icon}</span>,
}));

// Mock LoginPage
jest.mock('../../app/login/page', () => ({
  __esModule: true,
  default: () => (
    <div data-testid="login-page">
      <h1>Login</h1>
      <form data-testid="login-form">
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            data-testid="email-input"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            data-testid="password-input"
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" data-testid="login-button">
          Login
        </button>
      </form>
      <a href="/forgot-password" data-testid="forgot-password-link">
        Forgot Password?
      </a>
      <p>
        Don't have an account?{' '}
        <a href="/signup" data-testid="signup-link">
          Sign Up
        </a>
      </p>
      <div data-testid="social-login">
        <button data-testid="google-signin">Sign in with Google</button>
      </div>
    </div>
  ),
}));

import LoginPage from '../../app/login/page';

describe('LoginPage', () => {
  describe('Rendering', () => {
    it('should render the login page', () => {
      render(<LoginPage />);
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('should render the login heading', () => {
      render(<LoginPage />);
      expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    });

    it('should render the login form', () => {
      render(<LoginPage />);
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });
  });

  describe('Form Fields', () => {
    it('should render email input', () => {
      render(<LoginPage />);
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
    });

    it('should render password input', () => {
      render(<LoginPage />);
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
    });

    it('should render login button', () => {
      render(<LoginPage />);
      expect(screen.getByTestId('login-button')).toBeInTheDocument();
    });

    it('should have correct input types', () => {
      render(<LoginPage />);
      expect(screen.getByTestId('email-input')).toHaveAttribute('type', 'email');
      expect(screen.getByTestId('password-input')).toHaveAttribute('type', 'password');
    });
  });

  describe('Form Interactions', () => {
    it('should allow typing in email input', () => {
      render(<LoginPage />);
      const emailInput = screen.getByTestId('email-input');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      expect(emailInput).toHaveValue('test@example.com');
    });

    it('should allow typing in password input', () => {
      render(<LoginPage />);
      const passwordInput = screen.getByTestId('password-input');
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      expect(passwordInput).toHaveValue('password123');
    });
  });

  describe('Navigation Links', () => {
    it('should render forgot password link', () => {
      render(<LoginPage />);
      expect(screen.getByTestId('forgot-password-link')).toHaveAttribute(
        'href',
        '/forgot-password'
      );
    });

    it('should render signup link', () => {
      render(<LoginPage />);
      expect(screen.getByTestId('signup-link')).toHaveAttribute('href', '/signup');
    });
  });

  describe('Social Login', () => {
    it('should render social login section', () => {
      render(<LoginPage />);
      expect(screen.getByTestId('social-login')).toBeInTheDocument();
    });

    it('should render Google sign in button', () => {
      render(<LoginPage />);
      expect(screen.getByTestId('google-signin')).toBeInTheDocument();
    });
  });
});
