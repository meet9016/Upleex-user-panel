"use client";

import { useState, useEffect } from "react";
import { Star, X, Send } from "lucide-react";
import { api } from "@/utils/axiosInstance";
import { reviewService } from "@/services/reviewService";
import { toast } from "react-hot-toast";
import clsx from "clsx";

interface PendingReviewProduct {
  productId: string;
  productName: string;
  productImage: string;
}

export function ReviewReminderPopup() {
  const [pendingProduct, setPendingProduct] = useState<PendingReviewProduct | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      checkPendingReviews();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const checkPendingReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await api.get("/quote/getall");
      if (!response.data.success) return;

      const quotes = response.data.data || [];
      console.log("🚀 ~ checkPendingReviews ~ quotes:", quotes)

      for (const quote of quotes) {
        // Show reminder if payment is confirmed
        const isPaid = quote.payment_status?.toLowerCase() === 'paid' && quote.status?.toLowerCase() === 'complete';

        if (!isPaid) continue;

        const productId = quote.product_id._id || quote.product_id;

        // Skip if permanently dismissed
        if (localStorage.getItem(`review_dismissed_${productId}`) === 'true') continue;

        try {
          const reviewCheck = await reviewService.checkUserReview(productId);
          if (reviewCheck?.success && !reviewCheck.data?.hasReviewed) {
            setPendingProduct({
              productId,
              productName: quote.product_id.product_name || "Product",
              productImage: quote.product_id.product_main_image || "",
            });
            break;
          }
        } catch {
          // silently ignore
        }
      }
    } catch {
      // silently ignore
    }
  };

  const handleClose = () => {
    if (pendingProduct) {
      localStorage.setItem(`review_dismissed_${pendingProduct.productId}`, 'true');
    }
    setPendingProduct(null);
    setRating(0);
    setReviewText("");
  };

  const handleSubmit = async () => {
    if (!pendingProduct) return;
    if (rating === 0) { toast.error("Please select a rating"); return; }
    if (reviewText.trim().length < 3) { toast.error("Review must be at least 3 characters"); return; }

    setSubmitting(true);
    try {
      const response = await reviewService.addReview({
        product_id: pendingProduct.productId,
        rating,
        review: reviewText.trim(),
      });
      if (response.success) {
        toast.success("Review submitted! Thank you 🎉");
        setPendingProduct(null);
        setRating(0);
        setReviewText("");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => (
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

  if (!pendingProduct) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">Write a Review</h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Product Info */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            {pendingProduct.productImage ? (
              <img
                src={pendingProduct.productImage}
                alt={pendingProduct.productName}
                className="w-16 h-16 object-contain rounded-lg bg-white border border-gray-200 flex-shrink-0"
                onError={(e: any) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0" />
            )}
            <div>
              <p className="text-xs text-gray-500 font-medium">You rented this product</p>
              <p className="font-semibold text-gray-900 line-clamp-2">{pendingProduct.productName}</p>
            </div>
          </div>

          {/* Stars */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block text-center">
              How would you rate this product?
            </label>
            {renderStars()}
            <p className="text-center text-sm text-gray-500 mt-2 h-5">
              {rating === 1 && "Poor"}{rating === 2 && "Fair"}{rating === 3 && "Good"}
              {rating === 4 && "Very Good"}{rating === 5 && "Excellent"}
            </p>
          </div>

          {/* Text */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Your Review</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell us what you liked or didn't like about this product..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
              rows={4}
              maxLength={500}
            />
            <div className="text-right text-xs text-gray-400 mt-1">{reviewText.length}/500</div>
          </div>

          {/* Buttons */}
       <div className="flex gap-3">
  <button
    onClick={handleSubmit}
    disabled={submitting || rating === 0 || reviewText.trim().length < 3}
    className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
  >
    {submitting ? (
      <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
    ) : (
      <><Send size={16} /> Submit Review</>
    )}
  </button>

  <button
    onClick={handleClose}
    className="w-1/2 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center"
  >
    Cancel
  </button>
</div>
        </div>
      </div>
    </div>
  );
}
