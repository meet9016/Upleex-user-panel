"use client";

import { useState, useEffect } from "react";
import { Star, X, Send } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { reviewService } from "@/services/reviewService";
import { toast } from "react-hot-toast";
import clsx from "clsx";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  productImage?: string;
  onSuccess?: () => void;
}

export function ReviewModal({ 
  isOpen, 
  onClose, 
  productId, 
  productName, 
  productImage,
  onSuccess 
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [existingReview, setExistingReview] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Check if user already reviewed this product
  useEffect(() => {
    if (isOpen && productId) {
      checkExistingReview();
    }
  }, [isOpen, productId]);

  const checkExistingReview = async () => {
    try {
      setLoading(true);
      const response = await reviewService.checkUserReview(productId);
      if (response.success && response.data?.hasReviewed) {
        setExistingReview(response.data.review);
        setRating(response.data.review.rating);
        setReviewText(response.data.review.review);
      } else {
        setExistingReview(null);
        setRating(0);
        setReviewText("");
      }
    } catch (error) {
      console.error("Error checking review:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
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
      if (existingReview) {
        response = await reviewService.updateReview({
          review_id: existingReview.id,
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
        toast.success(existingReview ? "Review updated!" : "Review submitted!");
        onSuccess?.();
        onClose();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex gap-2 justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="transition-all duration-200 hover:scale-110"
          >
            <Star
              size={36}
              className={clsx(
                "transition-colors duration-200",
                star <= (hoverRating || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-100 text-gray-300"
              )}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-md"
      hideHeader
      noPadding
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {existingReview ? "Edit Review" : "Write a Review"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Product Info */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
          {productImage ? (
            <img
              src={productImage}
              alt={productName}
              className="w-16 h-16 object-contain rounded-lg bg-white border border-gray-200"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-xs">No Image</span>
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900 line-clamp-2">{productName}</p>
            <p className="text-sm text-gray-500">
              {existingReview ? "Update your review" : "Share your experience"}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Rating */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block text-center">
                How would you rate this product?
              </label>
              {renderStars()}
              <p className="text-center text-sm text-gray-500 mt-2">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            </div>

            {/* Review Text */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Your Review
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Tell us what you liked or didn't like about this product..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                rows={4}
                maxLength={500}
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {reviewText.length}/500
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button
                onClick={handleSubmit}
                disabled={submitting || rating === 0 || reviewText.trim().length < 3}
                className="flex-1"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Send size={18} />
                    {existingReview ? "Update Review" : "Submit Review"}
                  </span>
                )}
              </Button>
              
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
