import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock the category store
const mockCategoryStore = {
    categories: [] as any[],
    setCategories: jest.fn(),
    shouldRefetch: jest.fn(() => false),
    isLoaded: false,
};

jest.mock('@/store/categoryStore', () => ({
    useCategoryStore: () => mockCategoryStore,
}));

// Mock Apollo useQuery
const mockUseQuery = jest.fn();
jest.mock('@apollo/client', () => ({
    useQuery: (...args: any[]) => mockUseQuery(...args),
    gql: (strings: any) => strings,
}));

// Mock GQL_QUERIES
jest.mock('@/lib/apollo/queries/queries', () => ({
    GQL_QUERIES: {
        GET_CATEGORIES_QUERY: 'GET_CATEGORIES_QUERY',
    },
}));

// Import after mocking
import { useCategories } from '@/lib/hooks/useCategories';

const mockCategories = [
    { id: '1', name: 'Electronics', slug: 'electronics', isActive: true },
    { id: '2', name: 'Clothing', slug: 'clothing', isActive: true },
    { id: '3', name: 'Books', slug: 'books', isActive: true },
];

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('useCategories', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockCategoryStore.categories = [];
        mockCategoryStore.isLoaded = false;
        mockCategoryStore.shouldRefetch.mockReturnValue(false);
    });

    it('should fetch categories successfully', async () => {
        mockUseQuery.mockReturnValue({
            data: { categories: { data: mockCategories } },
            loading: false,
            error: null,
            refetch: jest.fn(),
        });

        const { result } = renderHook(() => useCategories(), { wrapper: createWrapper() });

        expect(result.current.loading).toBe(false);
        expect(mockCategoryStore.setCategories).toHaveBeenCalledWith(mockCategories);
    });

    it('should skip fetch when skip option is true', async () => {
        mockUseQuery.mockReturnValue({
            data: null,
            loading: false,
            error: null,
            refetch: jest.fn(),
        });

        const { result } = renderHook(() => useCategories({ skip: true }), { wrapper: createWrapper() });

        expect(result.current.loading).toBe(false);
    });

    it('should return stored categories when available', async () => {
        mockCategoryStore.categories = mockCategories;
        mockCategoryStore.isLoaded = true;

        mockUseQuery.mockReturnValue({
            data: null,
            loading: false,
            error: null,
            refetch: jest.fn(),
        });

        const { result } = renderHook(() => useCategories(), { wrapper: createWrapper() });

        expect(result.current.categories).toEqual(mockCategories);
        expect(result.current.isFromCache).toBe(true);
    });

    it('should handle loading state', async () => {
        mockUseQuery.mockReturnValue({
            data: null,
            loading: true,
            error: null,
            refetch: jest.fn(),
        });

        const { result } = renderHook(() => useCategories(), { wrapper: createWrapper() });

        expect(result.current.loading).toBe(true);
        expect(result.current.isLoading).toBe(true);
    });

    it('should handle error', async () => {
        const error = new Error('Failed to fetch categories');
        mockUseQuery.mockReturnValue({
            data: null,
            loading: false,
            error,
            refetch: jest.fn(),
        });

        const { result } = renderHook(() => useCategories(), { wrapper: createWrapper() });

        expect(result.current.error).toBe(error);
    });

    it('should provide refetch function', async () => {
        const mockRefetch = jest.fn();
        mockUseQuery.mockReturnValue({
            data: { categories: { data: mockCategories } },
            loading: false,
            error: null,
            refetch: mockRefetch,
        });

        const { result } = renderHook(() => useCategories(), { wrapper: createWrapper() });

        expect(typeof result.current.refetch).toBe('function');
        expect(result.current.refetch).toBe(mockRefetch);
    });

    it('should return empty categories when no data', async () => {
        mockCategoryStore.categories = [];

        mockUseQuery.mockReturnValue({
            data: { categories: null },
            loading: false,
            error: null,
            refetch: jest.fn(),
        });

        const { result } = renderHook(() => useCategories(), { wrapper: createWrapper() });

        expect(result.current.categories).toEqual([]);
    });

    it('should not show loading when stored categories exist', async () => {
        mockCategoryStore.categories = mockCategories;

        mockUseQuery.mockReturnValue({
            data: null,
            loading: true,
            error: null,
            refetch: jest.fn(),
        });

        const { result } = renderHook(() => useCategories(), { wrapper: createWrapper() });

        // Should not be loading because we have stored categories
        expect(result.current.loading).toBe(false);
        expect(result.current.isLoading).toBe(false);
    });
});
