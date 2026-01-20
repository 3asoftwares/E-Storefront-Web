/**
 * Tests for useToast hook and ToastProvider
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock FontAwesome
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, className }: any) => (
    <span data-testid="fa-icon" className={className}>
      {icon?.iconName || 'icon'}
    </span>
  ),
}));

import { ToastProvider, useToast } from '../../lib/hooks/useToast';

// Test component that uses the hook
const TestComponent = () => {
  const { showToast } = useToast();

  return (
    <div>
      <button onClick={() => showToast('Success message', 'success')}>Show Success</button>
      <button onClick={() => showToast('Error message', 'error')}>Show Error</button>
      <button onClick={() => showToast('Warning message', 'warning')}>Show Warning</button>
      <button onClick={() => showToast('Info message', 'info')}>Show Info</button>
      <button onClick={() => showToast('Default message')}>Show Default</button>
    </div>
  );
};

describe('ToastProvider', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render children', () => {
    render(
      <ToastProvider>
        <div data-testid="child">Child Content</div>
      </ToastProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('should provide showToast function to children', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    expect(screen.getByText('Show Success')).toBeInTheDocument();
  });
});

describe('useToast hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should show success toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Success'));

    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('should show error toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Error'));

    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('should show warning toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Warning'));

    expect(screen.getByText('Warning message')).toBeInTheDocument();
  });

  it('should show info toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Info'));

    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('should default to info type when no type specified', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Default'));

    expect(screen.getByText('Default message')).toBeInTheDocument();
  });

  it('should auto-remove toast after 4 seconds', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Success'));
    expect(screen.getByText('Success message')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    await waitFor(() => {
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    });
  });

  it('should allow manual removal of toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Success'));
    expect(screen.getByText('Success message')).toBeInTheDocument();

    // Click the close button (×)
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    expect(screen.queryByText('Success message')).not.toBeInTheDocument();
  });

  it('should show multiple toasts simultaneously', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Success'));
    fireEvent.click(screen.getByText('Show Error'));

    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('should apply correct styles for success toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Success'));

    const toast = screen.getByText('Success message').closest('div');
    expect(toast).toHaveClass('bg-green-500');
  });

  it('should apply correct styles for error toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Error'));

    const toast = screen.getByText('Error message').closest('div');
    expect(toast).toHaveClass('bg-red-500');
  });

  it('should apply correct styles for warning toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Warning'));

    const toast = screen.getByText('Warning message').closest('div');
    expect(toast).toHaveClass('bg-yellow-500');
  });

  it('should apply correct styles for info toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Info'));

    const toast = screen.getByText('Info message').closest('div');
    expect(toast).toHaveClass('bg-blue-500');
  });

  it('should render toast icons', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Success'));

    expect(screen.getByTestId('fa-icon')).toBeInTheDocument();
  });
});

describe('useToast - Error Handling', () => {
  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow();

    consoleSpy.mockRestore();
  });
});

describe('Toast removal', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should remove correct toast when multiple exist', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Success'));
    fireEvent.click(screen.getByText('Show Error'));

    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();

    // Close the first toast
    const closeButtons = screen.getAllByText('×');
    fireEvent.click(closeButtons[0]);

    // First toast should be removed, second should remain
    expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('should handle rapid toast additions', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    // Rapidly add toasts
    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByText('Show Success'));
    }

    // All should be visible
    const successMessages = screen.getAllByText('Success message');
    expect(successMessages.length).toBe(5);
  });
});
