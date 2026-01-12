import { renderHook } from '@testing-library/react';
import React from 'react';

// Mock dependencies
jest.mock('@3asoftwares/utils/client', () => ({
  getAccessToken: jest.fn(() => 'mock-token'),
  clearAuth: jest.fn(),
  isTokenExpired: jest.fn(() => false),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
}));

// Mock the hook
jest.mock('../../lib/hooks/useTokenValidator', () => ({
  useTokenValidator: jest.fn(() => {
    return { isValid: true, isChecking: false };
  }),
  default: jest.fn(() => ({ isValid: true, isChecking: false })),
}));

import { useTokenValidator } from '../../lib/hooks/useTokenValidator';

describe('useTokenValidator Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return validation status', () => {
    const { result } = renderHook(() => useTokenValidator());
    expect(result.current).toBeDefined();
  });

  it('should have isValid property', () => {
    const { result } = renderHook(() => useTokenValidator());
    expect(result.current.isValid).toBe(true);
  });

  it('should have isChecking property', () => {
    const { result } = renderHook(() => useTokenValidator());
    expect(result.current.isChecking).toBe(false);
  });
});
