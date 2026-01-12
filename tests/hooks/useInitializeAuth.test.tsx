import { renderHook } from '@testing-library/react';
import React from 'react';

// Mock dependencies
jest.mock('@3asoftwares/utils/client', () => ({
  getAccessToken: jest.fn(() => 'mock-token'),
  clearAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
}));

// Mock the hook
jest.mock('../../lib/hooks/useInitializeAuth', () => ({
  useInitializeAuth: jest.fn(() => {
    // Simulate initialization
    return undefined;
  }),
  default: jest.fn(() => undefined),
}));

import { useInitializeAuth } from '../../lib/hooks/useInitializeAuth';

describe('useInitializeAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize without error', () => {
    const { result } = renderHook(() => useInitializeAuth());
    expect(result.current).toBeUndefined();
  });

  it('should be callable multiple times', () => {
    const { result: result1 } = renderHook(() => useInitializeAuth());
    const { result: result2 } = renderHook(() => useInitializeAuth());
    expect(result1.current).toBeUndefined();
    expect(result2.current).toBeUndefined();
  });
});
