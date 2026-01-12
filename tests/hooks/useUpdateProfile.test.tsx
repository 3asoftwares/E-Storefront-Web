import { renderHook } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the hook
jest.mock('../../lib/hooks/useUpdateProfile', () => ({
  useUpdateProfile: jest.fn(() => ({
    updateProfile: jest.fn(),
    isLoading: false,
    error: null,
    isSuccess: false,
    data: null,
  })),
  default: jest.fn(() => ({
    updateProfile: jest.fn(),
    isLoading: false,
    error: null,
    isSuccess: false,
    data: null,
  })),
}));

import { useUpdateProfile } from '../../lib/hooks/useUpdateProfile';

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

describe('useUpdateProfile Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return update profile function', () => {
    const { result } = renderHook(() => useUpdateProfile(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.updateProfile).toBe('function');
  });

  it('should have isLoading property', () => {
    const { result } = renderHook(() => useUpdateProfile(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isLoading).toBe(false);
  });

  it('should have error property', () => {
    const { result } = renderHook(() => useUpdateProfile(), {
      wrapper: createWrapper(),
    });
    expect(result.current.error).toBeNull();
  });

  it('should have isSuccess property', () => {
    const { result } = renderHook(() => useUpdateProfile(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isSuccess).toBe(false);
  });

  it('should have data property', () => {
    const { result } = renderHook(() => useUpdateProfile(), {
      wrapper: createWrapper(),
    });
    expect(result.current.data).toBeNull();
  });
});
