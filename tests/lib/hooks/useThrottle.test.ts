import { renderHook, act } from '@testing-library/react';
import { useThrottle } from '../../../lib/hooks/useThrottle';

describe('useThrottle', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should execute callback immediately on first call', () => {
    const mockCallback = jest.fn();
    const { result } = renderHook(() => useThrottle(mockCallback, 300));

    act(() => {
      result.current();
    });

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should throttle subsequent calls within the limit', () => {
    const mockCallback = jest.fn();
    const { result } = renderHook(() => useThrottle(mockCallback, 300));

    act(() => {
      result.current();
      result.current();
      result.current();
    });

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should allow execution after the throttle period', () => {
    const mockCallback = jest.fn();
    const { result } = renderHook(() => useThrottle(mockCallback, 300));

    act(() => {
      result.current();
    });
    expect(mockCallback).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    act(() => {
      result.current();
    });
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });

  it('should pass arguments to the callback', () => {
    const mockCallback = jest.fn();
    const { result } = renderHook(() => useThrottle(mockCallback, 300));

    act(() => {
      result.current('arg1', 'arg2');
    });

    expect(mockCallback).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should use default limit of 300ms', () => {
    const mockCallback = jest.fn();
    const { result } = renderHook(() => useThrottle(mockCallback));

    act(() => {
      result.current();
    });
    expect(mockCallback).toHaveBeenCalledTimes(1);

    act(() => {
      result.current();
    });
    expect(mockCallback).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    act(() => {
      result.current();
    });
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });

  it('should maintain callback reference stability', () => {
    const mockCallback = jest.fn();
    const { result, rerender } = renderHook(({ callback, limit }) => useThrottle(callback, limit), {
      initialProps: { callback: mockCallback, limit: 300 },
    });

    const firstThrottledFn = result.current;
    rerender({ callback: mockCallback, limit: 300 });
    const secondThrottledFn = result.current;

    expect(firstThrottledFn).toBe(secondThrottledFn);
  });
});
