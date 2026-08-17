"use client";

import { useState, useEffect } from "react";
import { Star, User, Send, CheckCircle } from "lucide-react";
import { reviewService } from "@/services/reviewService";
import { toast } from "react-hot-toast";
import clsx from "clsx";
import { useAppSelector } from '@/redux/hooks';

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

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const fetchReviews = async () => {
    if (!productId) return;
    try {
      setLoading(true);
      const reviewsRes = await reviewService.getProductReviews(productId);
      if (reviewsRes.success) {
        setReviews(reviewsRes.data.reviews || []);
        if (reviewsRes.data.stats) setStats(reviewsRes.data.stats);
      }
      if (isAuthenticated) {
        try {
          const userReviewRes = await reviewService.checkUserReview(productId);
          if (userReviewRes?.success) {
            const hasReviewedAlready = userReviewRes.data?.hasReviewed || false;
            const purchasedStatus = userReviewRes.data?.hasPurchased || false;
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
    if (!isAuthenticated) { onAuthRequired(); return; }
    if (rating === 0) { toast.error("Please select a rating"); return; }
    if (reviewText.trim().length < 3) { toast.error("Review must be at least 3 characters"); return; }

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

  const renderStars = (value: number, interactive = false, size = 14) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && setRating(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={clsx(
            "transition-transform duration-150",
            interactive ? "cursor-pointer hover:scale-110" : "cursor-default pointer-events-none"
          )}
        >
          <Star
            size={size}
            className={clsx(
              "transition-colors duration-150",
              star <= (interactive ? hoverRating || rating : value)
                ? "fill-amber-400 text-amber-400"
                : "fill-slate-100 text-slate-200"
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
      <div className="py-10 flex justify-center">
        <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Only show the form if: logged in AND purchased AND not yet reviewed
  const showWriteReview = isAuthenticated && hasPurchased && !hasReviewed;

  return (
    <div className="space-y-6">

      {/* ── Two-column: Rating Summary (left) + Reviews list (right) ── */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* LEFT — Rating summary */}
        {stats && (
          <div className="w-full lg:w-64 flex-shrink-0 bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-100 rounded-2xl p-5">
            {/* Big score */}
            <div className="flex flex-col items-center mb-4 pb-4 border-b border-slate-100">
              <span className="text-5xl font-extrabold text-slate-800 leading-none">
                {stats.averageRating.toFixed(1)}
              </span>
              <div className="mt-2">{renderStars(Math.round(stats.averageRating), false, 18)}</div>
              <span className="text-[11px] text-slate-400 mt-1.5 font-medium">
                {stats.totalReviews} review{stats.totalReviews !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Breakdown bars */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats.ratingBreakdown[star as keyof typeof stats.ratingBreakdown] || 0;
                const pct = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-500 w-3 text-right">{star}</span>
                    <Star size={10} className="fill-amber-300 text-amber-300 flex-shrink-0" />
                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 w-4 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* RIGHT — Reviews list */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-slate-700 mb-3">
            Customer Reviews
            <span className="ml-1.5 text-xs font-normal text-slate-400">({reviews.length})</span>
          </h3>

          {reviews.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 bg-slate-50 rounded-2xl border border-slate-100">
              <User size={30} className="text-slate-200" />
              <p className="text-sm text-slate-400">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <>
              <style dangerouslySetInnerHTML={{__html: `
                .reviews-scrollbar::-webkit-scrollbar {
                  width: 6px;
                }
                .reviews-scrollbar::-webkit-scrollbar-track {
                  background: #f1f5f9; 
                  border-radius: 8px;
                }
                .reviews-scrollbar::-webkit-scrollbar-thumb {
                  background: #cbd5e1; 
                  border-radius: 8px;
                }
                .reviews-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: #94a3b8; 
                }
              `}} />
              <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-2 reviews-scrollbar">
                {reviews.map((review) => (
                  <div
                    key={review._id || review.id}
                    className="group bg-white border border-slate-100 rounded-xl px-4 py-3.5 hover:border-slate-200 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                        {review.user_id?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <span className="text-xs font-semibold text-slate-800">
                            {review.user_id?.name || "Anonymous"}
                          </span>
                          <span className="text-slate-200 text-[10px]">•</span>
                          <span className="text-[11px] text-slate-400">{formatDate(review.createdAt)}</span>
                        </div>
                        <div className="mb-1.5">{renderStars(review.rating, false, 13)}</div>
                        <p className="text-xs text-slate-600 leading-relaxed">{review.review}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Write a Review — only shown when: logged in + purchased + not reviewed ── */}
      {showWriteReview && (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-50 flex items-center gap-2">
            <div className="w-1.5 h-5 bg-blue-500 rounded-full" />
            <h3 className="text-sm font-bold text-slate-800">Write a Review</h3>
          </div>

          <div className="px-5 py-4 space-y-4">
            {/* Star picker */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                Your Rating
              </label>
              <div className="flex items-center gap-1">
                {renderStars(rating, true, 28)}
                {rating > 0 && (
                  <span className="ml-2 text-xs text-slate-400 font-medium">
                    {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                  </span>
                )}
              </div>
            </div>

            {/* Textarea */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                Your Review
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this product..."
                className="w-full px-3.5 py-3 text-sm text-slate-700 placeholder-slate-300 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 resize-none transition-all duration-200"
                rows={3}
                maxLength={500}
              />
              <div className="flex justify-end mt-1">
                <span className="text-[11px] text-slate-300">{reviewText.length}/500</span>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={submitting || rating === 0 || reviewText.trim().length < 3}
              className={clsx(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                submitting || rating === 0 || reviewText.trim().length < 3
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md active:scale-95"
              )}
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={14} />
                  Submit Review
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Already reviewed — tiny inline badge only */}
      {isAuthenticated && hasReviewed && (
        <div className="flex items-center gap-2 text-emerald-600">
          <CheckCircle size={14} className="flex-shrink-0" />
          <span className="text-xs font-medium">You have already reviewed this product.</span>
        </div>
      )}

    </div>
  );
}
