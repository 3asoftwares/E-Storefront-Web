import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LazyImage } from '../../components/LazyImage';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();

beforeEach(() => {
  mockIntersectionObserver.mockImplementation((callback: IntersectionObserverCallback) => {
    return {
      observe: jest.fn((element: Element) => {
        // Immediately trigger intersection
        callback(
          [{ isIntersecting: true, target: element } as IntersectionObserverEntry],
          {} as IntersectionObserver
        );
      }),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    };
  });
  window.IntersectionObserver = mockIntersectionObserver;
});

describe('LazyImage', () => {
  it('should render the image element', () => {
    render(<LazyImage src="/test.jpg" alt="Test Image" />);
    const img = screen.getByAltText('Test Image');
    expect(img).toBeInTheDocument();
  });

  it('should apply className to the image', () => {
    render(<LazyImage src="/test.jpg" alt="Test Image" className="custom-class" />);
    const img = screen.getByAltText('Test Image');
    expect(img).toHaveClass('custom-class');
  });

  it('should load image when intersection observer triggers', async () => {
    render(<LazyImage src="/test.jpg" alt="Test Image" />);
    const img = screen.getByAltText('Test Image');

    await waitFor(() => {
      expect(img).toHaveAttribute('src', '/test.jpg');
    });
  });

  it('should call onLoad when image loads', async () => {
    render(<LazyImage src="/test.jpg" alt="Test Image" />);
    const img = screen.getByAltText('Test Image');

    fireEvent.load(img);

    await waitFor(() => {
      expect(img).toHaveClass('opacity-100');
    });
  });

  it('should handle image error', async () => {
    const handleError = jest.fn();
    render(<LazyImage src="/broken.jpg" alt="Test Image" onError={handleError} />);
    const img = screen.getByAltText('Test Image');

    fireEvent.error(img);

    expect(handleError).toHaveBeenCalled();
  });

  it('should show fallback on error when provided', async () => {
    const fallback = <div data-testid="fallback">Image not available</div>;
    render(<LazyImage src="/broken.jpg" alt="Test Image" fallback={fallback} />);
    const img = screen.getByAltText('Test Image');

    fireEvent.error(img);

    await waitFor(() => {
      expect(screen.getByTestId('fallback')).toBeInTheDocument();
    });
  });

  it('should use custom threshold', () => {
    render(<LazyImage src="/test.jpg" alt="Test Image" threshold={0.5} />);

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ threshold: 0.5 })
    );
  });

  it('should pass additional props to img element', () => {
    render(
      <LazyImage src="/test.jpg" alt="Test Image" data-testid="lazy-img" width={100} height={100} />
    );
    const img = screen.getByTestId('lazy-img');

    expect(img).toHaveAttribute('width', '100');
    expect(img).toHaveAttribute('height', '100');
  });

  it('should start with opacity-0 class before loading', () => {
    render(<LazyImage src="/test.jpg" alt="Test Image" />);
    const img = screen.getByAltText('Test Image');

    expect(img).toHaveClass('opacity-0');
  });

  it('should disconnect observer on unmount', () => {
    const disconnectMock = jest.fn();
    mockIntersectionObserver.mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: disconnectMock,
    }));

    const { unmount } = render(<LazyImage src="/test.jpg" alt="Test Image" />);
    unmount();

    expect(disconnectMock).toHaveBeenCalled();
  });

  it('should not load image until intersection', async () => {
    mockIntersectionObserver.mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));

    render(<LazyImage src="/test.jpg" alt="Test Image" />);
    const img = screen.getByAltText('Test Image');

    expect(img).not.toHaveAttribute('src', '/test.jpg');
  });
});
