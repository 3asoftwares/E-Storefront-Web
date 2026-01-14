/**
 * Tests for useOrders, useOrder, useCreateOrder, and useCancelOrder hooks
 */

import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';

// Mock apollo client
const mockQuery = jest.fn();
const mockMutate = jest.fn();

jest.mock('../../lib/apollo/client', () => ({
    apolloClient: {
        query: (...args: any[]) => mockQuery(...args),
        mutate: (...args: any[]) => mockMutate(...args),
    },
}));

jest.mock('../../lib/apollo/queries/queries', () => ({
    GQL_QUERIES: {
        GET_ORDERS_QUERY: 'GET_ORDERS_QUERY',
        GET_ORDER_QUERY: 'GET_ORDER_QUERY',
        CREATE_ORDER_MUTATION: 'CREATE_ORDER_MUTATION',
        CANCEL_ORDER_MUTATION: 'CANCEL_ORDER_MUTATION',
    },
}));

// Mock getAccessToken
const mockGetAccessToken = jest.fn();
jest.mock('@3asoftwares/utils/client', () => ({
    getAccessToken: () => mockGetAccessToken(),
}));

import { useOrders, useOrder, useCreateOrder, useCancelOrder } from '../../lib/hooks/useOrders';

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                gcTime: 0,
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

describe('useOrders hook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGetAccessToken.mockReturnValue('valid-token');
    });

    it('should fetch orders when authenticated', async () => {
        const mockOrders = [
            { id: 'order1', status: 'pending', total: 100 },
            { id: 'order2', status: 'completed', total: 200 },
        ];

        mockQuery.mockResolvedValue({
            data: { orders: { orders: mockOrders, total: 2 } },
        });

        const { result } = renderHook(() => useOrders(), { wrapper: createWrapper() });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(mockQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                query: 'GET_ORDERS_QUERY',
                variables: { page: 1, limit: 10, customerId: undefined },
            })
        );
    });

    it('should not fetch orders when not authenticated', async () => {
        mockGetAccessToken.mockReturnValue(null);

        const { result } = renderHook(() => useOrders(), { wrapper: createWrapper() });

        expect(result.current.isFetching).toBe(false);
        expect(mockQuery).not.toHaveBeenCalled();
    });

    it('should fetch orders with custom page and limit', async () => {
        mockQuery.mockResolvedValue({
            data: { orders: { orders: [], total: 0 } },
        });

        const { result } = renderHook(() => useOrders(2, 20), { wrapper: createWrapper() });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(mockQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                variables: { page: 2, limit: 20, customerId: undefined },
            })
        );
    });

    it('should fetch orders for specific customer', async () => {
        mockQuery.mockResolvedValue({
            data: { orders: { orders: [], total: 0 } },
        });

        const { result } = renderHook(() => useOrders(1, 10, 'customer123'), { wrapper: createWrapper() });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(mockQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                variables: { page: 1, limit: 10, customerId: 'customer123' },
            })
        );
    });
});

describe('useOrder hook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGetAccessToken.mockReturnValue('valid-token');
    });

    it('should fetch single order by id', async () => {
        const mockOrder = {
            id: 'order123',
            status: 'pending',
            items: [],
            total: 150,
        };

        mockQuery.mockResolvedValue({
            data: { order: mockOrder },
        });

        const { result } = renderHook(() => useOrder('order123'), { wrapper: createWrapper() });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toEqual(mockOrder);
    });

    it('should not fetch when id is empty', async () => {
        const { result } = renderHook(() => useOrder(''), { wrapper: createWrapper() });

        expect(result.current.isFetching).toBe(false);
        expect(mockQuery).not.toHaveBeenCalled();
    });

    it('should not fetch when not authenticated', async () => {
        mockGetAccessToken.mockReturnValue(null);

        const { result } = renderHook(() => useOrder('order123'), { wrapper: createWrapper() });

        expect(result.current.isFetching).toBe(false);
        expect(mockQuery).not.toHaveBeenCalled();
    });
});

describe('useCreateOrder hook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create order successfully', async () => {
        const mockOrderResult = {
            order: { id: 'neworder123', status: 'pending', total: 99.99 },
        };

        mockMutate.mockResolvedValue({
            data: { createOrder: mockOrderResult },
        });

        const { result } = renderHook(() => useCreateOrder(), { wrapper: createWrapper() });

        await act(async () => {
            await result.current.mutateAsync({
                items: [{ productId: 'p1', quantity: 2 }],
                shippingAddressId: 'addr1',
            });
        });

        expect(mockMutate).toHaveBeenCalledWith(
            expect.objectContaining({
                mutation: 'CREATE_ORDER_MUTATION',
            })
        );
    });

    it('should handle create order with order in response', async () => {
        const mockOrder = { id: 'order1', status: 'pending' };

        mockMutate.mockResolvedValue({
            data: { createOrder: { order: mockOrder } },
        });

        const { result } = renderHook(() => useCreateOrder(), { wrapper: createWrapper() });

        let createdOrder;
        await act(async () => {
            createdOrder = await result.current.mutateAsync({
                items: [{ productId: 'p1', quantity: 1 }],
                shippingAddressId: 'addr1',
            });
        });

        expect(createdOrder).toEqual(mockOrder);
    });

    it('should handle create order with orders array in response', async () => {
        const mockOrders = [{ id: 'order1', status: 'pending' }];

        mockMutate.mockResolvedValue({
            data: { createOrder: { orders: mockOrders } },
        });

        const { result } = renderHook(() => useCreateOrder(), { wrapper: createWrapper() });

        let createdOrder;
        await act(async () => {
            createdOrder = await result.current.mutateAsync({
                items: [{ productId: 'p1', quantity: 1 }],
                shippingAddressId: 'addr1',
            });
        });

        expect(createdOrder).toEqual(mockOrders[0]);
    });

    it('should throw error when createOrder fails', async () => {
        mockMutate.mockResolvedValue({
            data: { createOrder: null },
        });

        const { result } = renderHook(() => useCreateOrder(), { wrapper: createWrapper() });

        await expect(async () => {
            await act(async () => {
                await result.current.mutateAsync({
                    items: [{ productId: 'p1', quantity: 1 }],
                    shippingAddressId: 'addr1',
                });
            });
        }).rejects.toThrow('Failed to create order');
    });
});

describe('useCancelOrder hook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should cancel order successfully', async () => {
        mockMutate.mockResolvedValue({
            data: { cancelOrder: { id: 'order123', status: 'cancelled' } },
        });

        const { result } = renderHook(() => useCancelOrder(), { wrapper: createWrapper() });

        await act(async () => {
            await result.current.mutateAsync('order123');
        });

        expect(mockMutate).toHaveBeenCalledWith(
            expect.objectContaining({
                mutation: 'CANCEL_ORDER_MUTATION',
                variables: { id: 'order123' },
            })
        );
    });

    it('should throw error when cancel fails', async () => {
        mockMutate.mockResolvedValue({
            data: { cancelOrder: null },
        });

        const { result } = renderHook(() => useCancelOrder(), { wrapper: createWrapper() });

        await expect(async () => {
            await act(async () => {
                await result.current.mutateAsync('order123');
            });
        }).rejects.toThrow('Failed to cancel order');
    });
});
