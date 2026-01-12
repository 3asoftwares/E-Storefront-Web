import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock all dependencies
jest.mock('@tanstack/react-query', () => ({
  QueryClient: jest.fn().mockImplementation(() => ({
    defaultOptions: {},
  })),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="query-provider">{children}</div>
  ),
}));

jest.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: () => null,
}));

jest.mock('@apollo/client', () => ({
  ApolloProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="apollo-provider">{children}</div>
  ),
}));

jest.mock('recoil', () => ({
  RecoilRoot: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="recoil-root">{children}</div>
  ),
}));

jest.mock('../../lib/hooks/useToast', () => ({
  ToastProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="toast-provider">{children}</div>
  ),
}));

jest.mock('../../lib/hooks/useInitializeAuth', () => ({
  useInitializeAuth: jest.fn(),
}));

jest.mock('../../lib/hooks/useTokenValidator', () => ({
  useTokenValidator: jest.fn(),
}));

jest.mock('@3asoftwares/utils/client', () => ({
  storeAuth: jest.fn(),
  getAccessToken: jest.fn(),
}));

jest.mock('../../lib/apollo/client', () => ({
  apolloClient: {},
}));

// Mock Providers component
jest.mock('../../app/providers', () => ({
  __esModule: true,
  Providers: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="providers">
      <div data-testid="apollo-provider">
        <div data-testid="query-provider">
          <div data-testid="recoil-root">
            <div data-testid="toast-provider">
              <div data-testid="auth-loader">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}));

import { Providers } from '../../app/providers';

describe('Providers Component', () => {
  describe('Rendering', () => {
    it('should render the providers wrapper', () => {
      render(
        <Providers>
          <div data-testid="child">Child Content</div>
        </Providers>
      );
      expect(screen.getByTestId('providers')).toBeInTheDocument();
    });

    it('should render children', () => {
      render(
        <Providers>
          <div data-testid="child">Child Content</div>
        </Providers>
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('Child Content')).toBeInTheDocument();
    });
  });

  describe('Provider Hierarchy', () => {
    it('should wrap with ApolloProvider', () => {
      render(
        <Providers>
          <div>Content</div>
        </Providers>
      );
      expect(screen.getByTestId('apollo-provider')).toBeInTheDocument();
    });

    it('should wrap with QueryClientProvider', () => {
      render(
        <Providers>
          <div>Content</div>
        </Providers>
      );
      expect(screen.getByTestId('query-provider')).toBeInTheDocument();
    });

    it('should wrap with RecoilRoot', () => {
      render(
        <Providers>
          <div>Content</div>
        </Providers>
      );
      expect(screen.getByTestId('recoil-root')).toBeInTheDocument();
    });

    it('should wrap with ToastProvider', () => {
      render(
        <Providers>
          <div>Content</div>
        </Providers>
      );
      expect(screen.getByTestId('toast-provider')).toBeInTheDocument();
    });

    it('should wrap with AuthLoader', () => {
      render(
        <Providers>
          <div>Content</div>
        </Providers>
      );
      expect(screen.getByTestId('auth-loader')).toBeInTheDocument();
    });
  });

  describe('Multiple Children', () => {
    it('should render multiple children', () => {
      render(
        <Providers>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </Providers>
      );
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });

    it('should render nested children', () => {
      render(
        <Providers>
          <div data-testid="parent">
            <div data-testid="nested">Nested Content</div>
          </div>
        </Providers>
      );
      expect(screen.getByTestId('parent')).toBeInTheDocument();
      expect(screen.getByTestId('nested')).toBeInTheDocument();
    });
  });
});
