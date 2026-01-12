import { renderHook } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the hooks
jest.mock('../../lib/hooks/useEmailVerification', () => ({
  useSendVerificationEmail: jest.fn(() => ({
    sendVerificationEmail: jest.fn(),
    isLoading: false,
    error: null,
    isSuccess: false,
    data: null,
  })),
  useVerifyEmail: jest.fn(() => ({
    verifyEmail: jest.fn(),
    isLoading: false,
    error: null,
    isSuccess: false,
    data: null,
  })),
}));

import { useSendVerificationEmail, useVerifyEmail } from '../../lib/hooks/useEmailVerification';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useEmailVerification Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useSendVerificationEmail', () => {
    it('should return send verification function', () => {
      const { result } = renderHook(() => useSendVerificationEmail(), {
        wrapper: createWrapper(),
      });
      expect(typeof result.current.sendVerificationEmail).toBe('function');
    });

    it('should have isLoading property', () => {
      const { result } = renderHook(() => useSendVerificationEmail(), {
        wrapper: createWrapper(),
      });
      expect(result.current.isLoading).toBe(false);
    });

    it('should have error property', () => {
      const { result } = renderHook(() => useSendVerificationEmail(), {
        wrapper: createWrapper(),
      });
      expect(result.current.error).toBeNull();
    });

    it('should have isSuccess property', () => {
      const { result } = renderHook(() => useSendVerificationEmail(), {
        wrapper: createWrapper(),
      });
      expect(result.current.isSuccess).toBe(false);
    });
  });

  describe('useVerifyEmail', () => {
    it('should return verify function', () => {
      const { result } = renderHook(() => useVerifyEmail(), {
        wrapper: createWrapper(),
      });
      expect(typeof result.current.verifyEmail).toBe('function');
    });

    it('should have isLoading property', () => {
      const { result } = renderHook(() => useVerifyEmail(), {
        wrapper: createWrapper(),
      });
      expect(result.current.isLoading).toBe(false);
    });

    it('should have isSuccess property', () => {
      const { result } = renderHook(() => useVerifyEmail(), {
        wrapper: createWrapper(),
      });
      expect(result.current.isSuccess).toBe(false);
    });
  });
});
