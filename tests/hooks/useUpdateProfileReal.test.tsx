import { renderHook, waitFor, act } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock apollo client
const mockMutate = jest.fn();
const mockQuery = jest.fn();

jest.mock('../../lib/apollo/client', () => ({
  apolloClient: {
    mutate: (...args: any[]) => mockMutate(...args),
    query: (...args: any[]) => mockQuery(...args),
  },
}));

jest.mock('../../lib/apollo/queries/queries', () => ({
  GQL_QUERIES: {
    UPDATE_PROFILE_MUTATION: 'UPDATE_PROFILE_MUTATION',
  },
}));

jest.mock('@3asoftwares/utils/client', () => ({
  storeAuth: jest.fn(),
  getStoredAuth: jest.fn(() => ({ token: 'mock-token' })),
}));

import { useUpdateProfile } from '../../lib/hooks/useUpdateProfile';
import { storeAuth } from '@3asoftwares/utils/client';

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

describe('useUpdateProfile Hook - Real Implementation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useUpdateProfile(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBeUndefined();
  });

  it('should update profile successfully', async () => {
    const mockUser = {
      id: 'user1',
      name: 'Updated Name',
      email: 'test@example.com',
      phone: '1234567890',
      role: 'user',
      isActive: true,
      emailVerified: true,
      createdAt: '2024-01-01',
    };

    mockMutate.mockResolvedValueOnce({
      data: {
        updateProfile: {
          success: true,
          message: 'Profile updated',
          user: mockUser,
        },
      },
    });

    const { result } = renderHook(() => useUpdateProfile(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.updateProfile({ name: 'Updated Name' });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(storeAuth).toHaveBeenCalled();
  });

  it('should handle update profile error', async () => {
    mockMutate.mockResolvedValueOnce({
      data: { updateProfile: null },
    });

    const { result } = renderHook(() => useUpdateProfile(), { wrapper: createWrapper() });

    await expect(result.current.updateProfile({ name: 'Test' })).rejects.toThrow(
      'Failed to update profile'
    );
  });

  it('should handle network error', async () => {
    mockMutate.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useUpdateProfile(), { wrapper: createWrapper() });

    await expect(result.current.updateProfile({ name: 'Test' })).rejects.toThrow('Network error');
  });

  it('should update with phone number', async () => {
    mockMutate.mockResolvedValueOnce({
      data: {
        updateProfile: {
          success: true,
          message: 'Profile updated',
          user: {
            id: 'user1',
            name: 'Test',
            email: 'test@example.com',
            phone: '9876543210',
            role: 'user',
            isActive: true,
            emailVerified: true,
            createdAt: '2024-01-01',
          },
        },
      },
    });

    const { result } = renderHook(() => useUpdateProfile(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.updateProfile({ phone: '9876543210' });
    });

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { input: { phone: '9876543210' } },
      })
    );
  });

  it('should not store auth if update fails', async () => {
    mockMutate.mockResolvedValueOnce({
      data: {
        updateProfile: {
          success: false,
          message: 'Failed',
          user: null,
        },
      },
    });

    const { result } = renderHook(() => useUpdateProfile(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.updateProfile({ name: 'Test' });
    });

    expect(storeAuth).not.toHaveBeenCalled();
  });
});
