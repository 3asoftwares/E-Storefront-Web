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
    GET_MY_ADDRESSES_QUERY: 'GET_MY_ADDRESSES_QUERY',
    ADD_ADDRESS_MUTATION: 'ADD_ADDRESS_MUTATION',
    UPDATE_ADDRESS_MUTATION: 'UPDATE_ADDRESS_MUTATION',
    DELETE_ADDRESS_MUTATION: 'DELETE_ADDRESS_MUTATION',
    SET_DEFAULT_ADDRESS_MUTATION: 'SET_DEFAULT_ADDRESS_MUTATION',
  },
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

describe('useAddresses Hooks - Real Implementation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useAddresses', () => {
    it('should fetch addresses successfully', async () => {
      const mockAddresses = [
        { id: 'addr1', street: '123 Main St', city: 'Test City', state: 'TS', zipCode: '12345' },
        { id: 'addr2', street: '456 Oak Ave', city: 'Other City', state: 'OS', zipCode: '67890' },
      ];

      mockQuery.mockResolvedValueOnce({
        data: { myAddresses: { addresses: mockAddresses } },
      });

      const { result } = renderHook(() => useAddresses(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockAddresses);
    });

    it('should return empty array when no addresses', async () => {
      mockQuery.mockResolvedValueOnce({
        data: { myAddresses: { addresses: [] } },
      });

      const { result } = renderHook(() => useAddresses(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual([]);
    });

    it('should handle null response', async () => {
      mockQuery.mockResolvedValueOnce({
        data: { myAddresses: null },
      });

      const { result } = renderHook(() => useAddresses(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual([]);
    });
  });

  describe('useAddAddress', () => {
    it('should add address successfully', async () => {
      const newAddress = {
        street: '789 New St',
        city: 'New City',
        state: 'NC',
        zipCode: '11111',
        country: 'USA',
        isDefault: false,
      };

      mockMutate.mockResolvedValueOnce({
        data: { addAddress: { id: 'addr3', ...newAddress } },
      });

      const { result } = renderHook(() => useAddAddress(), { wrapper: createWrapper() });

      await act(async () => {
        await result.current.mutateAsync(newAddress);
      });

      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: { input: newAddress },
        })
      );
    });

    it('should handle add address error', async () => {
      mockMutate.mockRejectedValueOnce(new Error('Failed to add address'));

      const { result } = renderHook(() => useAddAddress(), { wrapper: createWrapper() });

      await expect(
        result.current.mutateAsync({
          street: '123 St',
          city: 'City',
          state: 'ST',
          zipCode: '12345',
          country: 'USA',
          isDefault: false,
        })
      ).rejects.toThrow('Failed to add address');
    });
  });

  describe('useUpdateAddress', () => {
    it('should update address successfully', async () => {
      mockMutate.mockResolvedValueOnce({
        data: { updateAddress: { id: 'addr1', street: 'Updated St' } },
      });

      const { result } = renderHook(() => useUpdateAddress(), { wrapper: createWrapper() });

      await act(async () => {
        await result.current.mutateAsync({
          id: 'addr1',
          input: { street: 'Updated St' },
        });
      });

      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: { id: 'addr1', input: { street: 'Updated St' } },
        })
      );
    });
  });

  describe('useDeleteAddress', () => {
    it('should delete address successfully', async () => {
      mockMutate.mockResolvedValueOnce({
        data: { deleteAddress: { success: true } },
      });

      const { result } = renderHook(() => useDeleteAddress(), { wrapper: createWrapper() });

      await act(async () => {
        await result.current.mutateAsync('addr1');
      });

      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: { id: 'addr1' },
        })
      );
    });

    it('should handle delete error', async () => {
      mockMutate.mockRejectedValueOnce(new Error('Cannot delete default address'));

      const { result } = renderHook(() => useDeleteAddress(), { wrapper: createWrapper() });

      await expect(result.current.mutateAsync('addr1')).rejects.toThrow(
        'Cannot delete default address'
      );
    });
  });

  describe('useSetDefaultAddress', () => {
    it('should set default address successfully', async () => {
      mockMutate.mockResolvedValueOnce({
        data: { setDefaultAddress: { success: true } },
      });

      const { result } = renderHook(() => useSetDefaultAddress(), { wrapper: createWrapper() });

      await act(async () => {
        await result.current.mutateAsync('addr2');
      });

      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: { id: 'addr2' },
        })
      );
    });
  });
});
