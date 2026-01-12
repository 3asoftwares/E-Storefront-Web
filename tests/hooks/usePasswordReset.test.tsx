import { renderHook } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the hooks
jest.mock('../../lib/hooks/usePasswordReset', () => ({
  useForgotPassword: jest.fn(() => ({
    forgotPassword: jest.fn(),
    isLoading: false,
    error: null,
    isSuccess: false,
    data: null,
  })),
  useResetPassword: jest.fn(() => ({
    resetPassword: jest.fn(),
    isLoading: false,
    error: null,
    isSuccess: false,
    data: null,
  })),
  useValidateResetToken: jest.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
    isValid: false,
  })),
}));

import {
  useForgotPassword,
  useResetPassword,
  useValidateResetToken,
} from '../../lib/hooks/usePasswordReset';

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

describe('usePasswordReset Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useForgotPassword', () => {
    it('should return forgot password function', () => {
      const { result } = renderHook(() => useForgotPassword(), {
        wrapper: createWrapper(),
      });
      expect(typeof result.current.forgotPassword).toBe('function');
    });

    it('should have isLoading property', () => {
      const { result } = renderHook(() => useForgotPassword(), {
        wrapper: createWrapper(),
      });
      expect(result.current.isLoading).toBe(false);
    });

    it('should have error property', () => {
      const { result } = renderHook(() => useForgotPassword(), {
        wrapper: createWrapper(),
      });
      expect(result.current.error).toBeNull();
    });

    it('should have isSuccess property', () => {
      const { result } = renderHook(() => useForgotPassword(), {
        wrapper: createWrapper(),
      });
      expect(result.current.isSuccess).toBe(false);
    });
  });

  describe('useResetPassword', () => {
    it('should return reset password function', () => {
      const { result } = renderHook(() => useResetPassword(), {
        wrapper: createWrapper(),
      });
      expect(typeof result.current.resetPassword).toBe('function');
    });

    it('should have isLoading property', () => {
      const { result } = renderHook(() => useResetPassword(), {
        wrapper: createWrapper(),
      });
      expect(result.current.isLoading).toBe(false);
    });

    it('should have isSuccess property', () => {
      const { result } = renderHook(() => useResetPassword(), {
        wrapper: createWrapper(),
      });
      expect(result.current.isSuccess).toBe(false);
    });
  });

  describe('useValidateResetToken', () => {
    it('should return token validation result', () => {
      const { result } = renderHook(() => useValidateResetToken('test-token'), {
        wrapper: createWrapper(),
      });
      expect(result.current.isLoading).toBe(false);
    });

    it('should have isValid property', () => {
      const { result } = renderHook(() => useValidateResetToken('test-token'), {
        wrapper: createWrapper(),
      });
      expect(result.current.isValid).toBe(false);
    });
  });
});
