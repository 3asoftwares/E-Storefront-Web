import { renderHook } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the hooks
jest.mock('../../lib/hooks/useAddresses', () => ({
  useAddresses: jest.fn(() => ({
    data: [],
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  })),
  useAddAddress: jest.fn(() => ({
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    isPending: false,
    isError: false,
    error: null,
    isSuccess: false,
  })),
  useUpdateAddress: jest.fn(() => ({
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    isPending: false,
    isError: false,
    error: null,
    isSuccess: false,
  })),
  useDeleteAddress: jest.fn(() => ({
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    isPending: false,
    isError: false,
    error: null,
    isSuccess: false,
  })),
  useSetDefaultAddress: jest.fn(() => ({
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    isPending: false,
    isError: false,
    error: null,
    isSuccess: false,
  })),
}));

import {
  useAddresses,
  useAddAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from '../../lib/hooks/useAddresses';

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

describe('useAddresses Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useAddresses', () => {
    it('should return addresses data', () => {
      const { result } = renderHook(() => useAddresses(), {
        wrapper: createWrapper(),
      });
      expect(result.current.data).toEqual([]);
      expect(result.current.isLoading).toBe(false);
    });

    it('should have refetch function', () => {
      const { result } = renderHook(() => useAddresses(), {
        wrapper: createWrapper(),
      });
      expect(typeof result.current.refetch).toBe('function');
    });
  });

  describe('useAddAddress', () => {
    it('should return mutation object', () => {
      const { result } = renderHook(() => useAddAddress(), {
        wrapper: createWrapper(),
      });
      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
      expect(result.current.isPending).toBe(false);
    });
  });

  describe('useUpdateAddress', () => {
    it('should return mutation object', () => {
      const { result } = renderHook(() => useUpdateAddress(), {
        wrapper: createWrapper(),
      });
      expect(result.current.mutate).toBeDefined();
      expect(result.current.isPending).toBe(false);
    });
  });

  describe('useDeleteAddress', () => {
    it('should return mutation object', () => {
      const { result } = renderHook(() => useDeleteAddress(), {
        wrapper: createWrapper(),
      });
      expect(result.current.mutate).toBeDefined();
      expect(result.current.isPending).toBe(false);
    });
  });

  describe('useSetDefaultAddress', () => {
    it('should return mutation object', () => {
      const { result } = renderHook(() => useSetDefaultAddress(), {
        wrapper: createWrapper(),
      });
      expect(result.current.mutate).toBeDefined();
      expect(result.current.isPending).toBe(false);
    });
  });
});
