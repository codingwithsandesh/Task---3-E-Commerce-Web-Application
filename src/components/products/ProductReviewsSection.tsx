import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  CheckCircle2,
  MessageSquare,
  Send,
  User,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { ProductReview, ReviewsResponseData } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../context/ToastContext.js';

interface ProductReviewsSectionProps {
  productIdOrSlug: string;
  productName: string;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  productIdOrSlug,
  productName,
}) => {
  const { user, isAuthenticated, quickLoginAs } = useAuth();
  const { success, error: toastError } = useToast();

  const [reviewData, setReviewData] = useState<ReviewsResponseData>({
    reviews: [],
    averageRating: 0,
    reviewCount: 0,
    ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [loading, setLoading] = useState(true);

  // Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const ratingLabels: { [key: number]: string } = {
    1: 'Poor - Not as expected',
    2: 'Fair - Disappointing aspects',
    3: 'Average - Met basic expectations',
    4: 'Good - Very satisfied',
    5: 'Excellent - Highly recommended!',
  };

  const loadReviews = async () => {
    try {
      const res = await api.reviews.getByProduct(productIdOrSlug);
      if (res.data) {
        setReviewData(res.data);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productIdOrSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (comment.trim().length < 3) {
      setFormError('Please enter a review comment of at least 3 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.reviews.create(productIdOrSlug, {
        rating,
        comment: comment.trim(),
      });

      if (res.data) {
        success('Thank you! Your product review has been published.');
        setComment('');
        setRating(5);
        await loadReviews();
      }
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  const userExistingReview = user
    ? reviewData.reviews.find(r => r.user_id === user.id)
    : null;

  return (
    <section className="pt-12 border-t border-zinc-200 space-y-10">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Customer Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-1">
            Ratings & Reviews
          </h2>
        </div>
        <span className="text-xs text-zinc-500 font-medium">
          {reviewData.reviewCount} verified customer {reviewData.reviewCount === 1 ? 'review' : 'reviews'}
        </span>
      </div>

      {/* Overview Analytics Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-zinc-50/70 border border-zinc-200/80 rounded-3xl p-6 sm:p-8">
        {/* Left Score Block */}
        <div className="md:col-span-4 text-center md:text-left space-y-2 md:border-r border-zinc-200 md:pr-8">
          <div className="text-5xl font-black text-zinc-900 tracking-tight">
            {reviewData.averageRating > 0 ? reviewData.averageRating.toFixed(1) : '5.0'}
            <span className="text-lg font-bold text-zinc-400">/5</span>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(reviewData.averageRating || 5)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-zinc-300'
                }`}
              />
            ))}
          </div>

          <p className="text-xs text-zinc-500">
            Based on {reviewData.reviewCount} customer {reviewData.reviewCount === 1 ? 'rating' : 'ratings'}
          </p>
        </div>

        {/* Right Distribution Breakdown */}
        <div className="md:col-span-8 space-y-2">
          {[5, 4, 3, 2, 1].map(stars => {
            const count = reviewData.ratingBreakdown[stars] || 0;
            const percentage =
              reviewData.reviewCount > 0 ? Math.round((count / reviewData.reviewCount) * 100) : 0;

            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 text-zinc-600 font-bold flex items-center gap-1">
                  <span>{stars}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </span>

                <div className="flex-1 h-2.5 bg-zinc-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="w-10 text-right text-zinc-400 font-medium">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Submission Area */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 text-base">
                {userExistingReview ? 'Update Your Review' : 'Write a Customer Review'}
              </h3>
              <p className="text-xs text-zinc-500">
                Share your experience with other buyers about "{productName}"
              </p>
            </div>
          </div>
        </div>

        {isAuthenticated ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Interactive Star Picker */}
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1.5 uppercase tracking-wider">
                Overall Rating *
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => {
                    const activeRating = hoverRating !== null ? hoverRating : rating;
                    const isFilled = star <= activeRating;

                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 rounded-lg hover:scale-110 transition-transform focus:outline-none"
                        aria-label={`Rate ${star} star`}
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            isFilled
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-zinc-300 hover:text-amber-300'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <span className="text-xs font-semibold text-zinc-600">
                  {ratingLabels[hoverRating || rating]}
                </span>
              </div>
            </div>

            {/* Comment Area */}
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1.5 uppercase tracking-wider">
                Review Comments *
              </label>
              <textarea
                required
                rows={4}
                placeholder="What did you like or dislike? How was the performance, comfort, or value?"
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="w-full text-sm bg-zinc-50 border border-zinc-200 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition"
              />
              <div className="flex justify-between items-center text-[11px] text-zinc-400 mt-1 px-1">
                <span>Minimum 3 characters</span>
                <span>{comment.length} / 1000</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-zinc-500">
                Posting as <strong>{user?.name}</strong>
              </span>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{userExistingReview ? 'Update Review' : 'Submit Review'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200/80 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-zinc-900 text-sm">
                Sign in to leave a review
              </h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
                We require an authenticated account to maintain genuine feedback and prevent spam.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <Link
                to="/login"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                Sign In Now
              </Link>
              <button
                onClick={() => quickLoginAs('customer')}
                className="px-4 py-2.5 bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200 font-bold text-xs rounded-xl shadow-xs transition"
              >
                Quick Demo Customer Login
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="font-bold text-zinc-900 text-lg">
          Customer Reviews ({reviewData.reviews.length})
        </h3>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2].map(n => (
              <div key={n} className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-3">
                <div className="h-4 bg-zinc-200 rounded w-1/4" />
                <div className="h-3 bg-zinc-100 rounded w-1/3" />
                <div className="h-12 bg-zinc-100 rounded w-full" />
              </div>
            ))}
          </div>
        ) : reviewData.reviews.length === 0 ? (
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-zinc-900 text-base">No reviews yet</h4>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Be the first to share your impressions and help other shoppers make informed decisions!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-200/80 bg-white rounded-3xl border border-zinc-200/80 overflow-hidden shadow-xs">
            {reviewData.reviews.map(review => (
              <div key={review.id} className="p-6 space-y-3 hover:bg-zinc-50/40 transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-black text-sm flex items-center justify-center">
                      {review.user_name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-zinc-900">
                          {review.user_name}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Verified Buyer
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400">
                        Reviewed on {new Date(review.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-zinc-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-zinc-700 leading-relaxed pl-13 pt-1">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
