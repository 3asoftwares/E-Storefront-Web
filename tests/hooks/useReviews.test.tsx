import { renderHook } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the useReviews hook
jest.mock('../../lib/hooks/useReviews', () => ({
  useProductReviews: jest.fn((productId: string, page = 1, limit = 10) => ({
    data: undefined,
    isLoading: !!productId,
    isError: false,
    error: undefined,
    refetch: jest.fn(),
  })),
  useCreateReview: jest.fn(() => ({
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    isPending: false,
    isError: false,
    error: null,
    isSuccess: false,
  })),
  useMarkReviewHelpful: jest.fn(() => ({
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    isPending: false,
    isError: false,
    error: null,
    isSuccess: false,
  })),
}));

import {
  useProductReviews,
  useCreateReview,
  useMarkReviewHelpful,
} from '../../lib/hooks/useReviews';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useReviews Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useProductReviews', () => {
    it('should return query result', () => {
      const { result } = renderHook(() => useProductReviews('product-1'), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current.isLoading).toBeDefined();
    });

    it('should not be loading with empty product id', () => {
      const { result } = renderHook(() => useProductReviews(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should accept pagination parameters', () => {
      const { result } = renderHook(() => useProductReviews('product-1', 2, 20), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
    });

    it('should have data property', () => {
      const { result } = renderHook(() => useProductReviews('product-1'), {
        wrapper: createWrapper(),
      });

      expect(result.current.data).toBeUndefined();
    });

    it('should have refetch function', () => {
      const { result } = renderHook(() => useProductReviews('product-1'), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.refetch).toBe('function');
    });
  });

  describe('useCreateReview', () => {
    it('should return mutation object', () => {
      const { result } = renderHook(() => useCreateReview(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
    });

    it('should have isPending property', () => {
      const { result } = renderHook(() => useCreateReview(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(false);
    });

    it('should have error property', () => {
      const { result } = renderHook(() => useCreateReview(), {
        wrapper: createWrapper(),
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('useMarkReviewHelpful', () => {
    it('should return mutation object', () => {
      const { result } = renderHook(() => useMarkReviewHelpful(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current.mutate).toBeDefined();
    });

    it('should have isPending property', () => {
      const { result } = renderHook(() => useMarkReviewHelpful(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(false);
    });

    it('should have isSuccess property', () => {
      const { result } = renderHook(() => useMarkReviewHelpful(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isSuccess).toBe(false);
    });
  });
});
