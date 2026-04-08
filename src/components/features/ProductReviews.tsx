"use client";

import { useState, useEffect } from "react";
import { Star, User, Send, Edit2, Trash2 } from "lucide-react";
import { reviewService } from "@/services/reviewService";
import { toast } from "react-hot-toast";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";

interface Review {
  id: string;
  _id?: string;
  rating: number;
  review: string;
  createdAt: string;
  user_id: {
    id?: string;
    _id?: string;
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

// Get current user ID from localStorage
const getCurrentUserId = (): string | null => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.id || user._id || null;
    }
  } catch {
    return null;
  }
  return null;
};

export function ProductReviews({ productId, onAuthRequired }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Review form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    setCurrentUserId(getCurrentUserId());
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      // Get product reviews with stats (single API call)
      const reviewsRes = await reviewService.getProductReviews(productId);
      
      if (reviewsRes.success) {
        setReviews(reviewsRes.data.reviews || []);
        // Stats now included in product-reviews response
        if (reviewsRes.data.stats) {
          setStats(reviewsRes.data.stats);
        }
      }
      
      // Only check user review if logged in
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userReviewRes = await reviewService.checkUserReview(productId);
          if (userReviewRes?.success && userReviewRes.data?.hasReviewed) {
            setUserReview(userReviewRes.data.review);
            setRating(userReviewRes.data.review.rating);
            setReviewText(userReviewRes.data.review.review);
          }
        } catch (err) {
          // Silently fail if user review check fails
          console.log('User review check failed:', err);
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
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
      let response;
      if (isEditing && userReview) {
        response = await reviewService.updateReview({
          review_id: userReview.id,
          rating,
          review: reviewText.trim()
        });
      } else {
        response = await reviewService.addReview({
          product_id: productId,
          rating,
          review: reviewText.trim()
        });
      }

      if (response.success) {
        toast.success(isEditing ? "Review updated!" : "Review submitted!");
        setIsEditing(false);
        await fetchReviews();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!userReview) return;
    
    if (!confirm("Are you sure you want to delete your review?")) return;

    try {
      const response = await reviewService.deleteReview(userReview.id);
      if (response.success) {
        toast.success("Review deleted!");
        setUserReview(null);
        setRating(0);
        setReviewText("");
        await fetchReviews();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete review");
    }
  };

  const renderStars = (value: number, interactive = false) => {
    return (
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
                star <= (interactive ? (hoverRating || rating) : value)
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-100 text-gray-300"
              )}
            />
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

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
                const count = stats.ratingBreakdown[star as keyof typeof stats.ratingBreakdown] || 0;
                const percentage = stats.totalReviews > 0 
                  ? (count / stats.totalReviews) * 100 
                  : 0;
                
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

      {/* Review Form */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {userReview && !isEditing 
            ? "Your Review" 
            : isEditing 
              ? "Edit Your Review" 
              : "Write a Review"}
        </h3>

        {userReview && !isEditing ? (
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {renderStars(userReview.rating)}
                  <span className="text-sm text-gray-500">
                    {formatDate(userReview.createdAt)}
                  </span>
                </div>
                <p className="text-gray-700">{userReview.review}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Your Rating
              </label>
              {renderStars(rating, true)}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
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

            <div className="flex gap-3">
              <Button
                onClick={handleSubmit}
                disabled={submitting || rating === 0 || reviewText.trim().length < 3}
                className="flex-1"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send size={18} />
                    {isEditing ? "Update Review" : "Submit Review"}
                  </span>
                )}
              </Button>
              
              {isEditing && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setRating(userReview?.rating || 0);
                    setReviewText(userReview?.review || "");
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">
          Customer Reviews ({reviews.length})
        </h3>

        {reviews.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-2xl">
            <User size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews
              .filter((review) => {
                // Get review's user ID (handle both id and _id)
                const reviewUserId = review.user_id?.id || review.user_id?._id;
                return reviewUserId !== currentUserId; // Don't show current user's review in list
              })
              .map((review) => (
                <div
                  key={review.id}
                  className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {review.user_id?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">
                          {review.user_id?.name || "Anonymous"}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-500">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-gray-700">{review.review}</p>
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
