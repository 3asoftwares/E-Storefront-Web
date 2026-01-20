'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useProductReviews, useCreateReview, useMarkReviewHelpful } from '../lib/hooks/useReviews';
import { useToast } from '@/lib/hooks/useToast';
import { Button, Textarea } from '@3asoftwares/ui';
import { Logger } from '@3asoftwares/utils/client';

interface ProductReviewsProps {
  productId: string;
  averageRating: number;
  totalReviews: number;
}

export default function ProductReviews({
  productId,
  averageRating,
  totalReviews,
}: ProductReviewsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
  });

  const { data: reviewsData, isLoading, error } = useProductReviews(productId);
  const createReviewMutation = useCreateReview();
  const markHelpfulMutation = useMarkReviewHelpful();
  const { showToast } = useToast();

  const reviews = reviewsData?.reviews || [];

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createReviewMutation.mutateAsync({
        productId,
        rating: newReview.rating,
        comment: newReview.comment,
      });

      setNewReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
      showToast('Review submitted successfully! It will appear after moderation.', 'success');
    } catch (err) {
      Logger.error('Failed to submit review', err, 'Reviews');
      showToast('Failed to submit review. Please try again.', 'error');
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      await markHelpfulMutation.mutateAsync({ reviewId, productId });
    } catch (err) {
      Logger.error('Failed to mark review as helpful', err, 'Reviews');
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">Customer Reviews</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <div className="mr-2 flex text-xl text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon={faStar}
                    className={i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-600">({totalReviews} reviews)</span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="!w-auto"
          onClick={() => setShowReviewForm(!showReviewForm)}
        >
          Write a Review
        </Button>
      </div>

      {showReviewForm && (
        <form className="mb-6 rounded-lg bg-gray-50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Write Your Review</h3>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  size="lg"
                  variant="ghost"
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  className={`!w-auto !p-1 text-3xl ${
                    star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'
                  } transition-colors hover:text-yellow-400`}
                >
                  <FontAwesomeIcon icon={faStar} />
                </Button>
              ))}
            </div>
          </div>

          <Textarea
            rows={5}
            label="Your Review"
            value={newReview.comment}
            placeholder="Share your experience with this product..."
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
          />
          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={handleSubmitReview}
              disabled={createReviewMutation.isPending}
              className="!w-auto"
            >
              {createReviewMutation.isPending ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </Button>
            <Button variant="outline" className="!w-auto" onClick={() => setShowReviewForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {isLoading ? (
          <div className="py-12 text-center">
            <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-gray-400" />
            <p className="mt-2 text-gray-500">Loading reviews...</p>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-red-500">
            <p>Failed to load reviews. Please try again.</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <p className="mb-2 text-lg">No reviews yet</p>
            <p className="text-sm">Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{review.userName}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FontAwesomeIcon
                          key={i}
                          icon={faStar}
                          className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <p className="mb-3 text-gray-700">{review.comment}</p>
              <button
                onClick={() => handleMarkHelpful(review.id)}
                disabled={markHelpfulMutation.isPending}
                className="text-sm text-gray-600 hover:text-blue-600 disabled:opacity-50"
              >
                Helpful ({review.helpful})
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
