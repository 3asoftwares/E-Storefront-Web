import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProductReviews from '../../components/ProductReviews';
import * as reviewHooks from '../../lib/hooks/useReviews';
import { ToastProvider } from '../../lib/hooks/useToast';

// Mock the review hooks
jest.mock('../../lib/hooks/useReviews', () => ({
  useProductReviews: jest.fn(),
  useCreateReview: jest.fn(),
  useMarkReviewHelpful: jest.fn(),
}));

const mockUseProductReviews = reviewHooks.useProductReviews as jest.Mock;
const mockUseCreateReview = reviewHooks.useCreateReview as jest.Mock;
const mockUseMarkReviewHelpful = reviewHooks.useMarkReviewHelpful as jest.Mock;

describe('ProductReviews Component', () => {
  const mockReviews = [
    {
      id: 'review1',
      userName: 'John Doe',
      rating: 5,
      comment: 'Great product!',
      createdAt: '2024-01-15T00:00:00Z',
      helpful: 10,
    },
    {
      id: 'review2',
      userName: 'Jane Smith',
      rating: 4,
      comment: 'Good quality.',
      createdAt: '2024-01-10T00:00:00Z',
      helpful: 5,
    },
  ];

  const mockCreateReviewMutate = jest.fn();
  const mockMarkHelpfulMutate = jest.fn();

  const createQueryClient = () =>
    new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

  const renderWithQueryClient = (component: React.ReactNode) => {
    return render(
      <QueryClientProvider client={createQueryClient()}>
        <ToastProvider>{component}</ToastProvider>
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseProductReviews.mockReturnValue({
      data: { reviews: mockReviews },
      isLoading: false,
      error: null,
    });

    mockUseCreateReview.mockReturnValue({
      mutateAsync: mockCreateReviewMutate,
      isPending: false,
    });

    mockUseMarkReviewHelpful.mockReturnValue({
      mutateAsync: mockMarkHelpfulMutate,
      isPending: false,
    });
  });

  it('should render Customer Reviews heading', () => {
    renderWithQueryClient(
      <ProductReviews productId="prod123" averageRating={4.5} totalReviews={10} />
    );

    expect(screen.getByText('Customer Reviews')).toBeInTheDocument();
  });

  it('should display average rating', () => {
    renderWithQueryClient(
      <ProductReviews productId="prod123" averageRating={4.5} totalReviews={10} />
    );

    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('should display total reviews count', () => {
    renderWithQueryClient(
      <ProductReviews productId="prod123" averageRating={4.5} totalReviews={10} />
    );

    expect(screen.getByText('(10 reviews)')).toBeInTheDocument();
  });

  it('should display Write a Review button', () => {
    renderWithQueryClient(
      <ProductReviews productId="prod123" averageRating={4.5} totalReviews={10} />
    );

    expect(screen.getByRole('button', { name: /write a review/i })).toBeInTheDocument();
  });

  it('should show review form when Write a Review is clicked', () => {
    renderWithQueryClient(
      <ProductReviews productId="prod123" averageRating={4.5} totalReviews={10} />
    );

    const writeReviewButton = screen.getByRole('button', { name: /write a review/i });
    fireEvent.click(writeReviewButton);

    expect(screen.getByText('Write Your Review')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/share your experience/i)).toBeInTheDocument();
  });

  it('should display reviews list', () => {
    renderWithQueryClient(
      <ProductReviews productId="prod123" averageRating={4.5} totalReviews={10} />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Great product!')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Good quality.')).toBeInTheDocument();
  });

  it('should display helpful count for each review', () => {
    renderWithQueryClient(
      <ProductReviews productId="prod123" averageRating={4.5} totalReviews={10} />
    );

    expect(screen.getByText('Helpful (10)')).toBeInTheDocument();
    expect(screen.getByText('Helpful (5)')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    mockUseProductReviews.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    renderWithQueryClient(
      <ProductReviews productId="prod123" averageRating={4.5} totalReviews={10} />
    );

    expect(screen.getByText(/loading reviews/i)).toBeInTheDocument();
  });

  it('should show error state', () => {
    mockUseProductReviews.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed to load'),
    });

    renderWithQueryClient(
      <ProductReviews productId="prod123" averageRating={4.5} totalReviews={10} />
    );

    expect(screen.getByText(/failed to load reviews/i)).toBeInTheDocument();
  });

  it('should show empty state when no reviews', () => {
    mockUseProductReviews.mockReturnValue({
      data: { reviews: [] },
      isLoading: false,
      error: null,
    });

    renderWithQueryClient(
      <ProductReviews productId="prod123" averageRating={0} totalReviews={0} />
    );

    expect(screen.getByText(/no reviews yet/i)).toBeInTheDocument();
    expect(screen.getByText(/be the first to review/i)).toBeInTheDocument();
  });

  it('should call markHelpful when helpful button is clicked', async () => {
    renderWithQueryClient(
      <ProductReviews productId="prod123" averageRating={4.5} totalReviews={10} />
    );

    const helpfulButtons = screen.getAllByText(/helpful \(\d+\)/i);
    fireEvent.click(helpfulButtons[0]);

    await waitFor(() => {
      expect(mockMarkHelpfulMutate).toHaveBeenCalledWith({
        reviewId: 'review1',
        productId: 'prod123',
      });
    });
  });

  it('should submit review', async () => {
    mockCreateReviewMutate.mockResolvedValue({});

    renderWithQueryClient(
      <ProductReviews productId="prod123" averageRating={4.5} totalReviews={10} />
    );

    // Open review form
    const writeReviewButton = screen.getByRole('button', { name: /write a review/i });
    fireEvent.click(writeReviewButton);

    // Fill in the review
    const textarea = screen.getByPlaceholderText(/share your experience/i);
    fireEvent.change(textarea, { target: { value: 'This is my review' } });

    // Submit
    const submitButton = screen.getByRole('button', { name: /submit review/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateReviewMutate).toHaveBeenCalledWith({
        productId: 'prod123',
        rating: 5,
        comment: 'This is my review',
      });
    });
  });

  it('should have cancel button in review form', () => {
    renderWithQueryClient(
      <ProductReviews productId="prod123" averageRating={4.5} totalReviews={10} />
    );

    const writeReviewButton = screen.getByRole('button', { name: /write a review/i });
    fireEvent.click(writeReviewButton);

    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('should close review form when cancel is clicked', () => {
    renderWithQueryClient(
      <ProductReviews productId="prod123" averageRating={4.5} totalReviews={10} />
    );

    const writeReviewButton = screen.getByRole('button', { name: /write a review/i });
    fireEvent.click(writeReviewButton);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(screen.queryByText('Write Your Review')).not.toBeInTheDocument();
  });

  it('should allow rating selection', () => {
    renderWithQueryClient(
      <ProductReviews productId="prod123" averageRating={4.5} totalReviews={10} />
    );

    const writeReviewButton = screen.getByRole('button', { name: /write a review/i });
    fireEvent.click(writeReviewButton);

    // Rating buttons should be present
    const ratingButtons = screen
      .getAllByRole('button')
      .filter(
        (btn) =>
          btn.classList.contains('text-yellow-400') || btn.classList.contains('text-gray-300')
      );
    expect(ratingButtons.length).toBeGreaterThan(0);
  });
});
