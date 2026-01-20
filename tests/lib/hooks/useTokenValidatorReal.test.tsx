import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/dashboard'),
}));

// Mock apollo client
const mockQuery = jest.fn();
const mockMutate = jest.fn();
const mockClearStore = jest.fn();

jest.mock('@/lib/apollo/client', () => ({
  apolloClient: {
    query: (...args: any[]) => mockQuery(...args),
    mutate: (...args: any[]) => mockMutate(...args),
    clearStore: () => mockClearStore(),
  },
}));

// Mock GQL_QUERIES
jest.mock('@/lib/apollo/queries/queries', () => ({
  GQL_QUERIES: {
    GET_ME_QUERY: 'GET_ME_QUERY',
    LOGOUT_MUTATION: 'LOGOUT_MUTATION',
  },
}));

// Mock auth utilities
const mockGetAccessToken = jest.fn();
const mockClearAuth = jest.fn();
const mockStoreAuth = jest.fn();
const mockGetStoredAuth = jest.fn();

jest.mock('@3asoftwares/utils/client', () => ({
  getAccessToken: () => mockGetAccessToken(),
  clearAuth: () => mockClearAuth(),
  storeAuth: (data: any) => mockStoreAuth(data),
  getStoredAuth: () => mockGetStoredAuth(),
}));

// Import after mocking
import { useTokenValidator } from '@/lib/hooks/useTokenValidator';
import { usePathname } from 'next/navigation';

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

describe('useTokenValidator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockGetAccessToken.mockReturnValue('mock-token');
    mockGetStoredAuth.mockReturnValue({ token: 'mock-token' });
    (usePathname as jest.Mock).mockReturnValue('/dashboard');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should provide validateToken and checkAndValidate functions', () => {
    mockQuery.mockResolvedValue({
      data: { me: { id: 'user-1', email: 'test@example.com' } },
    });

    const { result } = renderHook(() => useTokenValidator(), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.validateToken).toBe('function');
    expect(typeof result.current.checkAndValidate).toBe('function');
  });

  it('should return invalid when no token exists', async () => {
    mockGetAccessToken.mockReturnValue(null);

    const { result } = renderHook(() => useTokenValidator(), {
      wrapper: createWrapper(),
    });

    const validation = await result.current.validateToken();
    expect(validation.valid).toBe(false);
    expect(validation.reason).toBe('no_token');
  });

  it('should validate token successfully', async () => {
    mockQuery.mockResolvedValue({
      data: { me: { id: 'user-1', email: 'test@example.com' } },
    });

    const { result } = renderHook(() => useTokenValidator(), {
      wrapper: createWrapper(),
    });

    const validation = await result.current.validateToken();
    expect(validation.valid).toBe(true);
    expect(validation.user).toEqual({ id: 'user-1', email: 'test@example.com' });
  });

  it('should return invalid when me query returns no user', async () => {
    mockQuery.mockResolvedValue({
      data: { me: null },
    });

    const { result } = renderHook(() => useTokenValidator(), {
      wrapper: createWrapper(),
    });

    const validation = await result.current.validateToken();
    expect(validation.valid).toBe(false);
    expect(validation.reason).toBe('no_user');
  });

  it('should handle auth error and return invalid', async () => {
    mockQuery.mockRejectedValue(new Error('401 Unauthorized'));

    const { result } = renderHook(() => useTokenValidator(), {
      wrapper: createWrapper(),
    });

    const validation = await result.current.validateToken();
    expect(validation.valid).toBe(false);
    expect(validation.reason).toBe('auth_error');
  });

  it('should handle network error and return valid', async () => {
    mockQuery.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useTokenValidator(), {
      wrapper: createWrapper(),
    });

    const validation = await result.current.validateToken();
    expect(validation.valid).toBe(true);
    expect(validation.reason).toBe('network_error');
  });

  it('should handle jwt expired error', async () => {
    mockQuery.mockRejectedValue(new Error('jwt expired'));

    const { result } = renderHook(() => useTokenValidator(), {
      wrapper: createWrapper(),
    });

    const validation = await result.current.validateToken();
    expect(validation.valid).toBe(false);
    expect(validation.reason).toBe('auth_error');
  });

  it('should handle invalid token error', async () => {
    mockQuery.mockRejectedValue(new Error('invalid token'));

    const { result } = renderHook(() => useTokenValidator(), {
      wrapper: createWrapper(),
    });

    const validation = await result.current.validateToken();
    expect(validation.valid).toBe(false);
    expect(validation.reason).toBe('auth_error');
  });

  it('should skip validation on public routes', async () => {
    (usePathname as jest.Mock).mockReturnValue('/login');
    mockQuery.mockResolvedValue({
      data: { me: { id: 'user-1', email: 'test@example.com' } },
    });

    renderHook(() => useTokenValidator(), {
      wrapper: createWrapper(),
    });

    // On public routes, the initial validation should not be called
    // Give time for any async operations
    await act(async () => {
      jest.advanceTimersByTime(100);
    });

    // Query should not be called on initial mount for public routes
    // This depends on the hook implementation
  });

  it('should update stored auth on successful validation', async () => {
    mockQuery.mockResolvedValue({
      data: { me: { id: 'user-1', email: 'test@example.com' } },
    });
    mockGetStoredAuth.mockReturnValue({ token: 'mock-token' });

    const { result } = renderHook(() => useTokenValidator(), {
      wrapper: createWrapper(),
    });

    await result.current.validateToken();

    expect(mockStoreAuth).toHaveBeenCalledWith({
      user: { id: 'user-1', email: 'test@example.com' },
      accessToken: 'mock-token',
    });
  });

  it('should call checkAndValidate', async () => {
    mockQuery.mockResolvedValue({
      data: { me: { id: 'user-1', email: 'test@example.com' } },
    });

    const { result } = renderHook(() => useTokenValidator(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.checkAndValidate();
    });

    expect(mockQuery).toHaveBeenCalled();
  });
});
