import { renderHook, act } from '@testing-library/react';
import { useScrollToBottom } from '@/lib/hooks/useScrollToBottom';

describe('useScrollToBottom', () => {
    let addEventListenerSpy: jest.SpyInstance;
    let removeEventListenerSpy: jest.SpyInstance;
    let scrollHandlers: Function[] = [];

    beforeEach(() => {
        jest.useFakeTimers();
        scrollHandlers = [];

        addEventListenerSpy = jest.spyOn(window, 'addEventListener').mockImplementation((event, handler) => {
            if (event === 'scroll' && typeof handler === 'function') {
                scrollHandlers.push(handler);
            }
        });

        removeEventListenerSpy = jest.spyOn(window, 'removeEventListener').mockImplementation((event, handler) => {
            if (event === 'scroll') {
                const index = scrollHandlers.indexOf(handler as Function);
                if (index > -1) {
                    scrollHandlers.splice(index, 1);
                }
            }
        });

        // Mock document properties
        Object.defineProperty(document.documentElement, 'scrollHeight', {
            value: 2000,
            writable: true,
            configurable: true,
        });

        Object.defineProperty(document.documentElement, 'scrollTop', {
            value: 0,
            writable: true,
            configurable: true,
        });

        Object.defineProperty(window, 'innerHeight', {
            value: 800,
            writable: true,
            configurable: true,
        });

        Object.defineProperty(window, 'scrollY', {
            value: 0,
            writable: true,
            configurable: true,
        });
    });

    afterEach(() => {
        jest.useRealTimers();
        addEventListenerSpy.mockRestore();
        removeEventListenerSpy.mockRestore();
    });

    it('should add scroll event listener on mount', () => {
        const callback = jest.fn();
        renderHook(() => useScrollToBottom(callback));

        expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    it('should remove scroll event listener on unmount', () => {
        const callback = jest.fn();
        const { unmount } = renderHook(() => useScrollToBottom(callback));

        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    it('should call callback when scrolled near bottom', () => {
        const callback = jest.fn();
        renderHook(() => useScrollToBottom(callback, 300, 300));

        // Simulate scroll near bottom
        Object.defineProperty(window, 'scrollY', { value: 1000 });
        Object.defineProperty(document.documentElement, 'scrollTop', { value: 1000 });

        // Trigger scroll handler
        if (scrollHandlers.length > 0) {
            act(() => {
                scrollHandlers[0]();
                jest.advanceTimersByTime(300);
            });
        }

        expect(callback).toHaveBeenCalled();
    });

    it('should not call callback when not near bottom', () => {
        const callback = jest.fn();
        renderHook(() => useScrollToBottom(callback, 300, 300));

        // Simulate scroll not near bottom
        Object.defineProperty(window, 'scrollY', { value: 100 });
        Object.defineProperty(document.documentElement, 'scrollTop', { value: 100 });

        if (scrollHandlers.length > 0) {
            act(() => {
                scrollHandlers[0]();
                jest.advanceTimersByTime(300);
            });
        }

        expect(callback).not.toHaveBeenCalled();
    });

    it('should use custom threshold', () => {
        const callback = jest.fn();
        const customThreshold = 500;
        renderHook(() => useScrollToBottom(callback, customThreshold, 300));

        // Just 400px from bottom (within 500px threshold)
        // scrollHeight(2000) - (scrollTop(800) + clientHeight(800)) = 400
        Object.defineProperty(window, 'scrollY', { value: 800 });
        Object.defineProperty(document.documentElement, 'scrollTop', { value: 800 });

        if (scrollHandlers.length > 0) {
            act(() => {
                scrollHandlers[0]();
                jest.advanceTimersByTime(300);
            });
        }

        expect(callback).toHaveBeenCalled();
    });

    it('should update callback when it changes', () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();

        const { rerender } = renderHook(
            ({ cb }) => useScrollToBottom(cb, 300, 300),
            { initialProps: { cb: callback1 } }
        );

        // Update to new callback
        rerender({ cb: callback2 });

        // Simulate scroll near bottom
        Object.defineProperty(window, 'scrollY', { value: 1000 });
        Object.defineProperty(document.documentElement, 'scrollTop', { value: 1000 });

        if (scrollHandlers.length > 0) {
            act(() => {
                scrollHandlers[0]();
                jest.advanceTimersByTime(300);
            });
        }

        // The new callback should be called
        expect(callback2).toHaveBeenCalled();
    });
});
