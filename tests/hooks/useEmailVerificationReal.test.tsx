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
        SEND_VERIFICATION_EMAIL_MUTATION: 'SEND_VERIFICATION_EMAIL_MUTATION',
        VERIFY_EMAIL_MUTATION: 'VERIFY_EMAIL_MUTATION',
    },
}));

jest.mock('@3asoftwares/utils/client', () => ({
    storeAuth: jest.fn(),
    getStoredAuth: jest.fn(() => ({ token: 'mock-token' })),
}));

import { useSendVerificationEmail, useVerifyEmail } from '../../lib/hooks/useEmailVerification';
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

describe('useEmailVerification Hooks - Real Implementation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('useSendVerificationEmail', () => {
        it('should return initial state', () => {
            const { result } = renderHook(() => useSendVerificationEmail(), {
                wrapper: createWrapper(),
            });

            expect(result.current.isLoading).toBe(false);
            expect(result.current.isSuccess).toBe(false);
            expect(result.current.error).toBeNull();
        });

        it('should send verification email successfully', async () => {
            mockMutate.mockResolvedValueOnce({
                data: {
                    sendVerificationEmail: { success: true, message: 'Email sent' },
                },
            });

            const { result } = renderHook(() => useSendVerificationEmail(), {
                wrapper: createWrapper(),
            });

            await act(async () => {
                await result.current.sendVerificationEmail();
            });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(mockMutate).toHaveBeenCalledWith(
                expect.objectContaining({
                    variables: { source: 'storefront' },
                })
            );
        });

        it('should send with custom source', async () => {
            mockMutate.mockResolvedValueOnce({
                data: {
                    sendVerificationEmail: { success: true, message: 'Email sent' },
                },
            });

            const { result } = renderHook(() => useSendVerificationEmail(), {
                wrapper: createWrapper(),
            });

            await act(async () => {
                await result.current.sendVerificationEmail('custom-source');
            });

            expect(mockMutate).toHaveBeenCalledWith(
                expect.objectContaining({
                    variables: { source: 'custom-source' },
                })
            );
        });

        it('should handle error', async () => {
            mockMutate.mockResolvedValueOnce({
                data: { sendVerificationEmail: null },
            });

            const { result } = renderHook(() => useSendVerificationEmail(), {
                wrapper: createWrapper(),
            });

            await expect(result.current.sendVerificationEmail()).rejects.toThrow(
                'Failed to send verification email'
            );
        });
    });

    describe('useVerifyEmail', () => {
        it('should return initial state', () => {
            const { result } = renderHook(() => useVerifyEmail(), { wrapper: createWrapper() });

            expect(result.current.isLoading).toBe(false);
            expect(result.current.isSuccess).toBe(false);
            expect(result.current.error).toBeNull();
        });

        it('should verify email successfully', async () => {
            const mockUser = {
                id: 'user1',
                email: 'test@example.com',
                emailVerified: true,
            };

            mockMutate.mockResolvedValueOnce({
                data: {
                    verifyEmail: { success: true, message: 'Verified', user: mockUser },
                },
            });

            const { result } = renderHook(() => useVerifyEmail(), { wrapper: createWrapper() });

            await act(async () => {
                await result.current.verifyEmail();
            });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(storeAuth).toHaveBeenCalled();
        });

        it('should handle verify email error', async () => {
            mockMutate.mockResolvedValueOnce({
                data: { verifyEmail: null },
            });

            const { result } = renderHook(() => useVerifyEmail(), { wrapper: createWrapper() });

            await expect(result.current.verifyEmail()).rejects.toThrow('Failed to verify email');
        });

        it('should not store auth if verification fails', async () => {
            mockMutate.mockResolvedValueOnce({
                data: {
                    verifyEmail: { success: false, message: 'Failed', user: null },
                },
            });

            const { result } = renderHook(() => useVerifyEmail(), { wrapper: createWrapper() });

            await act(async () => {
                await result.current.verifyEmail();
            });

            expect(storeAuth).not.toHaveBeenCalled();
        });
    });
});
