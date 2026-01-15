import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock apollo client
jest.mock('@/lib/apollo/client', () => ({
    apolloClient: {
        mutate: jest.fn(),
        query: jest.fn(),
    },
}));

// Mock GQL_QUERIES
jest.mock('@/lib/apollo/queries/queries', () => ({
    GQL_QUERIES: {
        FORGOT_PASSWORD_MUTATION: 'FORGOT_PASSWORD_MUTATION',
        RESET_PASSWORD_MUTATION: 'RESET_PASSWORD_MUTATION',
        VALIDATE_RESET_TOKEN_QUERY: 'VALIDATE_RESET_TOKEN_QUERY',
    },
}));

const mockApolloClient = jest.requireMock('@/lib/apollo/client').apolloClient;

// Import after mocking
import { useForgotPassword, useResetPassword, useValidateResetToken } from '@/lib/hooks/usePasswordReset';

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

describe('usePasswordReset hooks', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('useForgotPassword', () => {
        it('should call forgotPassword mutation successfully', async () => {
            mockApolloClient.mutate.mockResolvedValue({
                data: {
                    forgotPassword: {
                        success: true,
                        message: 'Email sent successfully',
                    },
                },
            });

            const { result } = renderHook(() => useForgotPassword(), {
                wrapper: createWrapper(),
            });

            expect(result.current.isLoading).toBe(false);

            const response = await result.current.forgotPassword({
                email: 'test@example.com',
                domain: 'storefront',
            });

            expect(mockApolloClient.mutate).toHaveBeenCalled();
            expect(response).toEqual({
                success: true,
                message: 'Email sent successfully',
            });
        });

        it('should handle error when mutation fails', async () => {
            mockApolloClient.mutate.mockResolvedValue({
                data: {
                    forgotPassword: null,
                },
            });

            const { result } = renderHook(() => useForgotPassword(), {
                wrapper: createWrapper(),
            });

            await expect(
                result.current.forgotPassword({ email: 'test@example.com', domain: 'storefront' })
            ).rejects.toThrow('Failed to process password reset request');
        });

        it('should set error state on exception', async () => {
            mockApolloClient.mutate.mockRejectedValue(new Error('Network error'));

            const { result } = renderHook(() => useForgotPassword(), {
                wrapper: createWrapper(),
            });

            await expect(
                result.current.forgotPassword({ email: 'test@example.com', domain: 'storefront' })
            ).rejects.toThrow('Network error');

            await waitFor(() => {
                expect(result.current.error).toBeTruthy();
            });
        });
    });

    describe('useResetPassword', () => {
        it('should call resetPassword mutation successfully', async () => {
            mockApolloClient.mutate.mockResolvedValue({
                data: {
                    resetPassword: {
                        success: true,
                        message: 'Password reset successfully',
                    },
                },
            });

            const { result } = renderHook(() => useResetPassword(), {
                wrapper: createWrapper(),
            });

            const response = await result.current.resetPassword({
                token: 'valid-token',
                password: 'newpassword123',
                confirmPassword: 'newpassword123',
            });

            expect(mockApolloClient.mutate).toHaveBeenCalled();
            expect(response).toEqual({
                success: true,
                message: 'Password reset successfully',
            });
        });

        it('should handle error when mutation returns null', async () => {
            mockApolloClient.mutate.mockResolvedValue({
                data: { resetPassword: null },
            });

            const { result } = renderHook(() => useResetPassword(), {
                wrapper: createWrapper(),
            });

            await expect(
                result.current.resetPassword({
                    token: 'valid-token',
                    password: 'newpassword123',
                    confirmPassword: 'newpassword123',
                })
            ).rejects.toThrow('Failed to reset password');
        });

        it('should handle network error', async () => {
            mockApolloClient.mutate.mockRejectedValue(new Error('Network error'));

            const { result } = renderHook(() => useResetPassword(), {
                wrapper: createWrapper(),
            });

            await expect(
                result.current.resetPassword({
                    token: 'valid-token',
                    password: 'newpassword123',
                    confirmPassword: 'newpassword123',
                })
            ).rejects.toThrow('Network error');
        });
    });

    describe('useValidateResetToken', () => {
        it('should return invalid state when no token is provided', async () => {
            const { result } = renderHook(() => useValidateResetToken(null), {
                wrapper: createWrapper(),
            });

            expect(result.current.isValid).toBe(false);
            expect(result.current.email).toBe(null);
        });

        it('should validate token successfully', async () => {
            mockApolloClient.query.mockResolvedValue({
                data: {
                    validateResetToken: {
                        success: true,
                        message: 'Token is valid',
                        email: 'test@example.com',
                    },
                },
            });

            const { result } = renderHook(() => useValidateResetToken('valid-token'), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(mockApolloClient.query).toHaveBeenCalled();
            expect(result.current.isValid).toBe(true);
            expect(result.current.email).toBe('test@example.com');
        });

        it('should handle invalid token', async () => {
            mockApolloClient.query.mockResolvedValue({
                data: {
                    validateResetToken: {
                        success: false,
                        message: 'Token is invalid or expired',
                        email: null,
                    },
                },
            });

            const { result } = renderHook(() => useValidateResetToken('invalid-token'), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.isValid).toBe(false);
            expect(result.current.email).toBe(null);
        });

        it('should handle query error', async () => {
            mockApolloClient.query.mockRejectedValue(new Error('Network error'));

            const { result } = renderHook(() => useValidateResetToken('valid-token'), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.error).toBeTruthy();
            expect(result.current.isValid).toBe(false);
        });
    });
});
