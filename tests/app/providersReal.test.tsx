import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

// Mock dependencies before importing Providers
let mockUseInitializeAuth = jest.fn();
let mockUseTokenValidator = jest.fn();

jest.mock('@/lib/hooks/useInitializeAuth', () => ({
    useInitializeAuth: () => mockUseInitializeAuth(),
}));

jest.mock('@/lib/hooks/useTokenValidator', () => ({
    useTokenValidator: () => mockUseTokenValidator(),
}));

jest.mock('@/lib/hooks/useToast', () => ({
    ToastProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@/lib/apollo/client', () => ({
    apolloClient: {
        query: jest.fn(),
        mutate: jest.fn(),
    },
}));

jest.mock('@3asoftwares/utils/client', () => ({
    storeAuth: jest.fn(),
}));

jest.mock('@tanstack/react-query-devtools', () => ({
    ReactQueryDevtools: () => null,
}));

import { Providers } from '@/app/providers';

describe('Providers', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseInitializeAuth = jest.fn();
        mockUseTokenValidator = jest.fn();
    });

    it('should render children', () => {
        render(
            <Providers>
                <div data-testid="child">Test Child</div>
            </Providers>
        );

        expect(screen.getByTestId('child')).toBeInTheDocument();
        expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it('should call useInitializeAuth', () => {
        render(
            <Providers>
                <div>Child</div>
            </Providers>
        );

        expect(mockUseInitializeAuth).toHaveBeenCalled();
    });

    it('should call useTokenValidator', () => {
        render(
            <Providers>
                <div>Child</div>
            </Providers>
        );

        expect(mockUseTokenValidator).toHaveBeenCalled();
    });

    it('should provide Apollo context', () => {
        const TestConsumer = () => {
            // Simply check if component renders within the provider
            return <div data-testid="apollo-consumer">Apollo Consumer</div>;
        };

        render(
            <Providers>
                <TestConsumer />
            </Providers>
        );

        expect(screen.getByTestId('apollo-consumer')).toBeInTheDocument();
    });

    it('should provide React Query context', () => {
        const TestConsumer = () => {
            return <div data-testid="query-consumer">Query Consumer</div>;
        };

        render(
            <Providers>
                <TestConsumer />
            </Providers>
        );

        expect(screen.getByTestId('query-consumer')).toBeInTheDocument();
    });

    it('should provide Recoil context', () => {
        const TestConsumer = () => {
            return <div data-testid="recoil-consumer">Recoil Consumer</div>;
        };

        render(
            <Providers>
                <TestConsumer />
            </Providers>
        );

        expect(screen.getByTestId('recoil-consumer')).toBeInTheDocument();
    });

    it('should handle URL parameters for OAuth tokens', async () => {
        // Mock window.location.search
        const originalLocation = window.location;
        delete (window as any).location;
        window.location = {
            ...originalLocation,
            search: '?accessToken=test-token&refreshToken=refresh-token&tokenExpiry=3600&user={"id":"123","email":"test@example.com"}',
        };

        const { storeAuth } = require('@3asoftwares/utils/client');

        render(
            <Providers>
                <div data-testid="child">Child</div>
            </Providers>
        );

        await waitFor(() => {
            expect(storeAuth).toHaveBeenCalledWith({
                user: { id: '123', email: 'test@example.com' },
                accessToken: 'test-token',
                refreshToken: 'refresh-token',
                expiresIn: 3600,
            });
        });

        // Restore original location
        window.location = originalLocation;
    });

    it('should render without URL parameters', () => {
        const originalLocation = window.location;
        delete (window as any).location;
        window.location = {
            ...originalLocation,
            search: '',
        };

        render(
            <Providers>
                <div data-testid="child">Child</div>
            </Providers>
        );

        expect(screen.getByTestId('child')).toBeInTheDocument();

        // Restore original location
        window.location = originalLocation;
    });
});
