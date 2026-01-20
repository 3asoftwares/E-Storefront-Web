import { useRef, useCallback } from 'react';

/**
 * React hook for throttling function calls
 * Ensures the function is called at most once per specified interval
 *
 * @param callback - The function to throttle
 * @param limit - The minimum time between executions in milliseconds (default: 300ms)
 * @returns A throttled version of the callback
 *
 * @example
 * const handleScroll = useThrottle(() => {
 *   console.log('Scrolled!');
 * }, 300);
 *
 * useEffect(() => {
 *   window.addEventListener('scroll', handleScroll);
 *   return () => window.removeEventListener('scroll', handleScroll);
 * }, [handleScroll]);
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  limit: number = 300
): (...args: Parameters<T>) => void {
  const inThrottle = useRef(false);
  const lastRan = useRef(Date.now());

  return useCallback(
    (...args: Parameters<T>) => {
      if (!inThrottle.current) {
        callback(...args);
        lastRan.current = Date.now();
        inThrottle.current = true;
        setTimeout(() => {
          inThrottle.current = false;
        }, limit);
      }
    },
    [callback, limit]
  );
}
