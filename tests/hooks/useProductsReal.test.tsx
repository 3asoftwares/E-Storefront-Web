/**
 * Tests for useProducts and useProduct hooks
 */

import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';

// Mock apollo client
const mockQuery = jest.fn();
jest.mock('../../lib/apollo/client', () => ({
    apolloClient: {
        query: (...args: any[]) => mockQuery(...args),
    },
}));

jest.mock('../../lib/apollo/queries/queries', () => ({
    GQL_QUERIES: {
        GET_PRODUCTS_QUERY: 'GET_PRODUCTS_QUERY',
        GET_PRODUCT_QUERY: 'GET_PRODUCT_QUERY',
        GET_CATEGORIES_QUERY: 'GET_CATEGORIES_QUERY',
    },
}));

import { useProducts, useProduct, useCategories } from '../../lib/hooks/useProducts';

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                gcTime: 0,
            },
        },
    });

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('useProducts hook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch products with default parameters', async () => {
        const mockProducts = [
            { id: 'p1', name: 'Product 1', price: 29.99 },
            { id: 'p2', name: 'Product 2', price: 49.99 },
        ];

        mockQuery.mockResolvedValue({
            data: {
                products: {
                    products: mockProducts,
                    total: 2,
                    page: 1,
                    limit: 20,
                },
            },
        });

        const { result } = renderHook(() => useProducts(), { wrapper: createWrapper() });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(mockQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                query: 'GET_PRODUCTS_QUERY',
                variables: expect.objectContaining({
                    page: 1,
                    limit: 20,
                }),
            })
        );
    });

    it('should fetch products with custom page and limit', async () => {
        mockQuery.mockResolvedValue({
            data: {
                products: { products: [], total: 0, page: 2, limit: 10 },
            },
        });

        const { result } = renderHook(() => useProducts(2, 10), { wrapper: createWrapper() });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(mockQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                variables: expect.objectContaining({
                    page: 2,
                    limit: 10,
                }),
            })
        );
    });

    it('should fetch products with filters', async () => {
        mockQuery.mockResolvedValue({
            data: {
                products: { products: [], total: 0 },
            },
        });

        const filters = { featured: true, categoryId: 'cat1' };
        const { result } = renderHook(() => useProducts(1, 20, filters), { wrapper: createWrapper() });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(mockQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                variables: expect.objectContaining({
                    page: 1,
                    limit: 20,
                    featured: true,
                    categoryId: 'cat1',
                }),
            })
        );
    });

    it('should handle fetch error', async () => {
        mockQuery.mockRejectedValue(new Error('Network error'));

        const { result } = renderHook(() => useProducts(), { wrapper: createWrapper() });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBeDefined();
    });

    it('should use network-only fetch policy', async () => {
        mockQuery.mockResolvedValue({
            data: {
                products: { products: [], total: 0 },
            },
        });

        renderHook(() => useProducts(), { wrapper: createWrapper() });

        await waitFor(() => {
            expect(mockQuery).toHaveBeenCalledWith(
                expect.objectContaining({
                    fetchPolicy: 'network-only',
                })
            );
        });
    });
});

describe('useProduct hook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch single product by id', async () => {
        const mockProduct = {
            id: 'prod123',
            name: 'Single Product',
            price: 99.99,
            description: 'A great product',
        };

        mockQuery.mockResolvedValue({
            data: { product: mockProduct },
        });

        const { result } = renderHook(() => useProduct('prod123'), { wrapper: createWrapper() });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toEqual(mockProduct);
        expect(mockQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                query: 'GET_PRODUCT_QUERY',
                variables: { id: 'prod123' },
            })
        );
    });

    it('should not fetch when id is empty', async () => {
        const { result } = renderHook(() => useProduct(''), { wrapper: createWrapper() });

        expect(result.current.isFetching).toBe(false);
        expect(mockQuery).not.toHaveBeenCalled();
    });

    it('should use cache-first fetch policy', async () => {
        mockQuery.mockResolvedValue({
            data: { product: { id: 'p1', name: 'Product' } },
        });

        renderHook(() => useProduct('p1'), { wrapper: createWrapper() });

        await waitFor(() => {
            expect(mockQuery).toHaveBeenCalledWith(
                expect.objectContaining({
                    fetchPolicy: 'cache-first',
                })
            );
        });
    });

    it('should handle product not found', async () => {
        mockQuery.mockResolvedValue({
            data: { product: null },
        });

        const { result } = renderHook(() => useProduct('nonexistent'), { wrapper: createWrapper() });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toBeNull();
    });
});

describe('useCategories hook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch categories', async () => {
        const mockCategories = [
            { id: 'c1', name: 'Electronics', slug: 'electronics' },
            { id: 'c2', name: 'Clothing', slug: 'clothing' },
        ];

        mockQuery.mockResolvedValue({
            data: { categories: mockCategories },
        });

        const { result } = renderHook(() => useCategories(), { wrapper: createWrapper() });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toEqual(mockCategories);
    });

    it('should use cache-first fetch policy for categories', async () => {
        mockQuery.mockResolvedValue({
            data: { categories: [] },
        });

        renderHook(() => useCategories(), { wrapper: createWrapper() });

        await waitFor(() => {
            expect(mockQuery).toHaveBeenCalledWith(
                expect.objectContaining({
                    fetchPolicy: 'cache-first',
                })
            );
        });
    });

    it('should handle empty categories', async () => {
        mockQuery.mockResolvedValue({
            data: { categories: [] },
        });

        const { result } = renderHook(() => useCategories(), { wrapper: createWrapper() });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toEqual([]);
    });
});
