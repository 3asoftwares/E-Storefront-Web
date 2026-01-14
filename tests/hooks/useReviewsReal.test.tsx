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
        GET_PRODUCT_REVIEWS_QUERY: 'GET_PRODUCT_REVIEWS_QUERY',
        CREATE_REVIEW_MUTATION: 'CREATE_REVIEW_MUTATION',
        MARK_REVIEW_HELPFUL_MUTATION: 'MARK_REVIEW_HELPFUL_MUTATION',
    },
}));

import { useProductReviews, useCreateReview, useMarkReviewHelpful } from '../../lib/hooks/useReviews';

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

describe('useReviews Hooks - Real Implementation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('useProductReviews', () => {
        it('should fetch product reviews', async () => {
            const mockReviews = {
                data: [
                    { id: 'rev1', rating: 5, comment: 'Great product!', userId: 'user1' },
                    { id: 'rev2', rating: 4, comment: 'Good value', userId: 'user2' },
                ],
                total: 2,
                page: 1,
                hasMore: false,
            };

            mockQuery.mockResolvedValueOnce({
                data: { productReviews: mockReviews },
            });

            const { result } = renderHook(() => useProductReviews('prod1'), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.data).toEqual(mockReviews);
        });

        it('should not fetch if productId is empty', () => {
            const { result } = renderHook(() => useProductReviews(''), {
                wrapper: createWrapper(),
            });

            expect(result.current.isLoading).toBe(false);
            expect(mockQuery).not.toHaveBeenCalled();
        });

        it('should fetch with pagination', async () => {
            mockQuery.mockResolvedValueOnce({
                data: { productReviews: { data: [], total: 0, page: 2, hasMore: false } },
            });

            const { result } = renderHook(() => useProductReviews('prod1', 2, 20), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(mockQuery).toHaveBeenCalledWith(
                expect.objectContaining({
                    variables: { productId: 'prod1', page: 2, limit: 20 },
                })
            );
        });
    });

    describe('useCreateReview', () => {
        it('should create review successfully', async () => {
            const newReview = {
                productId: 'prod1',
                rating: 5,
                comment: 'Excellent product!',
            };

            mockMutate.mockResolvedValueOnce({
                data: {
                    createReview: {
                        success: true,
                        message: 'Review created',
                        review: { id: 'rev3', ...newReview },
                    },
                },
            });

            const { result } = renderHook(() => useCreateReview(), { wrapper: createWrapper() });

            await act(async () => {
                await result.current.mutateAsync(newReview);
            });

            expect(mockMutate).toHaveBeenCalledWith(
                expect.objectContaining({
                    variables: {
                        productId: 'prod1',
                        input: { rating: 5, comment: 'Excellent product!' },
                    },
                })
            );
        });

        it('should handle create review error', async () => {
            mockMutate.mockRejectedValueOnce(new Error('Already reviewed this product'));

            const { result } = renderHook(() => useCreateReview(), { wrapper: createWrapper() });

            await expect(
                result.current.mutateAsync({
                    productId: 'prod1',
                    rating: 5,
                    comment: 'Test',
                })
            ).rejects.toThrow('Already reviewed this product');
        });

        it('should create review without comment', async () => {
            mockMutate.mockResolvedValueOnce({
                data: {
                    createReview: {
                        success: true,
                        message: 'Review created',
                        review: { id: 'rev4', productId: 'prod1', rating: 4 },
                    },
                },
            });

            const { result } = renderHook(() => useCreateReview(), { wrapper: createWrapper() });

            await act(async () => {
                await result.current.mutateAsync({
                    productId: 'prod1',
                    rating: 4,
                    comment: '',
                });
            });

            expect(mockMutate).toHaveBeenCalled();
        });
    });

    describe('useMarkReviewHelpful', () => {
        it('should mark review as helpful', async () => {
            mockMutate.mockResolvedValueOnce({
                data: {
                    markReviewHelpful: { success: true, helpfulCount: 5 },
                },
            });

            const { result } = renderHook(() => useMarkReviewHelpful(), { wrapper: createWrapper() });

            await act(async () => {
                await result.current.mutateAsync({ reviewId: 'rev1', productId: 'prod1' });
            });

            expect(mockMutate).toHaveBeenCalledWith(
                expect.objectContaining({
                    variables: { reviewId: 'rev1' },
                })
            );
        });

        it('should handle already marked helpful', async () => {
            mockMutate.mockRejectedValueOnce(new Error('Already marked as helpful'));

            const { result } = renderHook(() => useMarkReviewHelpful(), { wrapper: createWrapper() });

            await expect(
                result.current.mutateAsync({ reviewId: 'rev1', productId: 'prod1' })
            ).rejects.toThrow('Already marked as helpful');
        });
    });
});
