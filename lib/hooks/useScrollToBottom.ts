import { useEffect, useCallback, useRef } from 'react';
import { useThrottle } from './useThrottle';

/**
 * React hook for detecting when user scrolls near bottom of page
 * Useful for implementing infinite scroll functionality
 *
 * @param callback - Function to call when near bottom
 * @param threshold - Distance from bottom in pixels to trigger (default: 300px)
 * @param throttleMs - Throttle delay in milliseconds (default: 300ms)
 *
 * @example
 * useScrollToBottom(() => {
 *   loadMoreProducts();
 * }, 300, 300);
 */
export function useScrollToBottom(
  callback: () => void,
  threshold: number = 300,
  throttleMs: number = 300
) {
  const callbackRef = useRef(callback);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const handleScroll = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const clientHeight = window.innerHeight;

    if (scrollHeight - (scrollTop + clientHeight) <= threshold) {
      callbackRef.current();
    }
  }, [threshold]);

  const throttledScroll = useThrottle(handleScroll, throttleMs);

  useEffect(() => {
    window.addEventListener('scroll', throttledScroll);
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [throttledScroll]);
}
