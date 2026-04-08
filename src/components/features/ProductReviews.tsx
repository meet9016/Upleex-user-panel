"use client";

import { useState, useEffect } from "react";
import { Star, User, Send, ShoppingBag } from "lucide-react";
import { reviewService } from "@/services/reviewService";
import { toast } from "react-hot-toast";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";

interface Review {
  _id: string;
  id?: string;
  rating: number;
  review: string;
  createdAt: string;
  user_id: {
    _id?: string;
    id?: string;
    name: string;
    email?: string;
  };
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

interface ProductReviewsProps {
  productId: string;
  onAuthRequired: () => void;
}

export function ProductReviews({ productId, onAuthRequired }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  // Review form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const isLoggedIn = () => !!localStorage.getItem("token");

  const fetchReviews = async () => {
    try {
      setLoading(true);

      // Get all reviews + stats in one call
      const reviewsRes = await reviewService.getProductReviews(productId);

      if (reviewsRes.success) {
        setReviews(reviewsRes.data.reviews || []);
        if (reviewsRes.data.stats) {
          setStats(reviewsRes.data.stats);
        }
      }

      // If logged in, check purchase status and existing review
      if (isLoggedIn()) {
        try {
          const userReviewRes = await reviewService.checkUserReview(productId);
          if (userReviewRes?.success) {
            const hasReviewedAlready = userReviewRes.data?.hasReviewed || false;
            const purchasedStatus = userReviewRes.data?.hasPurchased || false;
            // If user already reviewed, mark as purchased too (they must have bought it)
            setHasPurchased(purchasedStatus || hasReviewedAlready);
            setHasReviewed(hasReviewedAlready);
          }
        } catch {
          // silently ignore
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  const handleSubmit = async () => {
    if (!isLoggedIn()) {
      onAuthRequired();
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (reviewText.trim().length < 3) {
      toast.error("Review must be at least 3 characters");
      return;
    }

    setSubmitting(true);
    try {
      const response = await reviewService.addReview({
        product_id: productId,
        rating,
        review: reviewText.trim(),
      });

      if (response.success) {
        toast.success("Review submitted successfully!");
        setRating(0);
        setReviewText("");
        await fetchReviews();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (value: number, interactive = false) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && setRating(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={clsx(
            "transition-all duration-200",
            interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
          )}
        >
          <Star
            size={interactive ? 28 : 16}
            className={clsx(
              "transition-colors duration-200",
              star <= (interactive ? hoverRating || rating : value)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-100 text-gray-300"
            )}
          />
        </button>
      ))}
    </div>
  );

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      {stats && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mt-2">
                {renderStars(Math.round(stats.averageRating))}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {stats.totalReviews} review{stats.totalReviews !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="flex-1 w-full sm:w-auto space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count =
                  stats.ratingBreakdown[star as keyof typeof stats.ratingBreakdown] || 0;
                const percentage =
                  stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600 w-3">{star}</span>
                    <Star size={14} className="text-gray-400" />
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Write Review Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-3">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Write a Review</h3>

        {/* Not logged in */}
        {!isLoggedIn() && (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-3">Please login to write a review</p>
            <Button onClick={onAuthRequired}>Login to Review</Button>
          </div>
        )}

        {/* Logged in but not purchased */}
        {isLoggedIn() && !hasPurchased && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-2">
            <ShoppingBag size={20} className="text-amber-500 flex-shrink-0" />
            <p className="text-amber-700 text-sm">
              You can only review products you have purchased and received.
            </p>
          </div>
        )}

        {/* Logged in, purchased, already reviewed */}
        {isLoggedIn() && hasPurchased && hasReviewed && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-2">
            <p className="text-green-700 text-sm font-medium">
              ✓ You have already submitted a review for this product.
            </p>
          </div>
        )}

        {/* Logged in, purchased, not reviewed yet → Show form */}
        {isLoggedIn() && hasPurchased && !hasReviewed && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Your Rating
              </label>
              {renderStars(rating, true)}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Your Review
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this product..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                rows={4}
                maxLength={500}
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {reviewText.length}/500
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={submitting || rating === 0 || reviewText.trim().length < 3}
              className="w-full sm:w-auto"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send size={18} />
                  Submit Review
                </span>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* All Customer Reviews */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-gray-900">
          Customer Reviews ({reviews.length})
        </h3>

       {reviews.length === 0 ? (
  <div className="text-center py-6 bg-gray-50 rounded-xl">
    <User size={36} className="mx-auto text-gray-300 mb-2" />
    <p className="text-sm text-gray-500">
      No reviews yet. Be the first to review!
    </p>
  </div>
) : (
  <div className="space-y-3">
    {reviews.map((review) => (
      <div
        key={review._id || review.id}
        className="bg-white border border-gray-100 rounded-lg p-3 hover:shadow-sm transition"
      >
        <div className="flex items-start gap-2">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
            {review.user_id?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-1 text-xs mb-1">
              <span className="font-semibold text-gray-800">
                {review.user_id?.name || "Anonymous"}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-400">
                {formatDate(review.createdAt)}
              </span>
            </div>

            {/* Stars */}
            <div className="mb-1 scale-90 origin-left">
              {renderStars(review.rating)}
            </div>

            {/* Review Text (short) */}
            <p className="text-xs text-gray-600 line-clamp-2">
              {review.review}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
)}
      </div>
    </div>
  );
}
