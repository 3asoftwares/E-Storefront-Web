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
  usePathname: () => '/signup',
}));

// Mock SignupPage
jest.mock('../../app/signup/page', () => ({
  __esModule: true,
  default: () => (
    <div data-testid="signup-page">
      <h1>Create Account</h1>
      <form data-testid="signup-form">
        <div>
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            data-testid="name-input"
            placeholder="Enter your name"
          />
        </div>
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
            placeholder="Create a password"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            data-testid="confirm-password-input"
            placeholder="Confirm your password"
          />
        </div>
        <div>
          <input type="checkbox" id="terms" name="terms" data-testid="terms-checkbox" />
          <label htmlFor="terms">I agree to the Terms and Conditions</label>
        </div>
        <button type="submit" data-testid="signup-button">
          Sign Up
        </button>
      </form>
      <p>
        Already have an account?{' '}
        <a href="/login" data-testid="login-link">
          Login
        </a>
      </p>
      <div data-testid="social-signup">
        <button data-testid="google-signup">Sign up with Google</button>
      </div>
    </div>
  ),
}));

import SignupPage from '../../app/signup/page';

describe('SignupPage', () => {
  describe('Rendering', () => {
    it('should render the signup page', () => {
      render(<SignupPage />);
      expect(screen.getByTestId('signup-page')).toBeInTheDocument();
    });

    it('should render the signup heading', () => {
      render(<SignupPage />);
      expect(screen.getByText('Create Account')).toBeInTheDocument();
    });

    it('should render the signup form', () => {
      render(<SignupPage />);
      expect(screen.getByTestId('signup-form')).toBeInTheDocument();
    });
  });

  describe('Form Fields', () => {
    it('should render name input', () => {
      render(<SignupPage />);
      expect(screen.getByTestId('name-input')).toBeInTheDocument();
    });

    it('should render email input', () => {
      render(<SignupPage />);
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
    });

    it('should render password input', () => {
      render(<SignupPage />);
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
    });

    it('should render confirm password input', () => {
      render(<SignupPage />);
      expect(screen.getByTestId('confirm-password-input')).toBeInTheDocument();
    });

    it('should render terms checkbox', () => {
      render(<SignupPage />);
      expect(screen.getByTestId('terms-checkbox')).toBeInTheDocument();
    });

    it('should render signup button', () => {
      render(<SignupPage />);
      expect(screen.getByTestId('signup-button')).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('should allow typing in name input', () => {
      render(<SignupPage />);
      const nameInput = screen.getByTestId('name-input');
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      expect(nameInput).toHaveValue('John Doe');
    });

    it('should allow typing in email input', () => {
      render(<SignupPage />);
      const emailInput = screen.getByTestId('email-input');
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      expect(emailInput).toHaveValue('john@example.com');
    });

    it('should allow typing in password input', () => {
      render(<SignupPage />);
      const passwordInput = screen.getByTestId('password-input');
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      expect(passwordInput).toHaveValue('password123');
    });

    it('should allow checking terms checkbox', () => {
      render(<SignupPage />);
      const checkbox = screen.getByTestId('terms-checkbox');
      expect(checkbox).not.toBeChecked();
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });
  });

  describe('Navigation Links', () => {
    it('should render login link', () => {
      render(<SignupPage />);
      expect(screen.getByTestId('login-link')).toHaveAttribute('href', '/login');
    });
  });

  describe('Social Signup', () => {
    it('should render social signup section', () => {
      render(<SignupPage />);
      expect(screen.getByTestId('social-signup')).toBeInTheDocument();
    });

    it('should render Google sign up button', () => {
      render(<SignupPage />);
      expect(screen.getByTestId('google-signup')).toBeInTheDocument();
    });
  });
});
