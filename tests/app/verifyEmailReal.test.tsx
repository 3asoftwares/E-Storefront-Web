import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock useSearchParams
const mockSearchParamsGet = jest.fn();
jest.mock('next/navigation', () => ({
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
  FontAwesomeIcon: ({ icon }: { icon: any }) => (
    <span data-testid="fa-icon">{icon?.iconName || 'icon'}</span>
  ),
}));

// Mock storeAuth and getStoredAuth
jest.mock('@3asoftwares/utils/client', () => ({
  storeAuth: jest.fn(),
  getStoredAuth: jest.fn(() => null),
}));

// Mock UI components
jest.mock('@3asoftwares/ui', () => ({
  Button: ({ children, onClick, variant, className, ...props }: any) => (
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>
  ),
}));

import VerifyEmailPage from '../../app/verify-email/page';

describe('VerifyEmailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  it('should render loading state initially', () => {
    mockSearchParamsGet.mockReturnValue('valid-token');
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<VerifyEmailPage />);
    expect(screen.getByText('Verifying Your Email')).toBeInTheDocument();
    expect(screen.getByText(/Please wait while we verify/i)).toBeInTheDocument();
  });

  it('should show error when no token provided', async () => {
    mockSearchParamsGet.mockReturnValue(null);

    render(<VerifyEmailPage />);

    await waitFor(() => {
      expect(screen.getByText(/No verification token provided/i)).toBeInTheDocument();
    });
  });

  it('should render 3A Softwares branding', () => {
    mockSearchParamsGet.mockReturnValue('valid-token');
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<VerifyEmailPage />);
    expect(screen.getByText(/3A Softwares/i)).toBeInTheDocument();
  });

  it('should show success message on successful verification', async () => {
    mockSearchParamsGet.mockReturnValue('valid-token');
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ email: 'test@example.com' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({ success: true, data: { user: { email: 'test@example.com' } } }),
      });

    render(<VerifyEmailPage />);

    await waitFor(() => {
      expect(screen.getByText(/email has been verified successfully/i)).toBeInTheDocument();
    });
  });

  it('should show already verified message', async () => {
    mockSearchParamsGet.mockReturnValue('valid-token');
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'Email already verified' }),
    });

    render(<VerifyEmailPage />);

    await waitFor(() => {
      expect(screen.getAllByText(/already.*verified/i).length).toBeGreaterThan(0);
    });
  });

  it('should show error for invalid token', async () => {
    mockSearchParamsGet.mockReturnValue('invalid-token');
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'Invalid or expired verification link' }),
    });

    render(<VerifyEmailPage />);

    await waitFor(() => {
      expect(screen.getByText(/Invalid or expired verification link/i)).toBeInTheDocument();
    });
  });

  it('should show error on network failure', async () => {
    mockSearchParamsGet.mockReturnValue('valid-token');
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<VerifyEmailPage />);

    await waitFor(() => {
      expect(screen.getByText(/error occurred while verifying|Network error/i)).toBeInTheDocument();
    });
  });

  it('should show verification failed message', async () => {
    mockSearchParamsGet.mockReturnValue('valid-token');
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ email: 'test@example.com' }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ success: false, message: 'Failed to verify email' }),
      });

    render(<VerifyEmailPage />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to verify email/i)).toBeInTheDocument();
    });
  });

  it('should render login link on success', async () => {
    mockSearchParamsGet.mockReturnValue('valid-token');
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ email: 'test@example.com' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({ success: true, data: { user: { email: 'test@example.com' } } }),
      });

    render(<VerifyEmailPage />);

    await waitFor(() => {
      expect(screen.getByText(/Go to Homepage/i)).toBeTruthy();
    });
  });

  it('should render resend verification link on error', async () => {
    mockSearchParamsGet.mockReturnValue('invalid-token');
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'Token expired' }),
    });

    render(<VerifyEmailPage />);

    await waitFor(() => {
      expect(screen.getByText(/Go to Profile to Resend/i)).toBeTruthy();
    });
  });
});
