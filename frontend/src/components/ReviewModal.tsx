import React, { useState } from 'react';
import { X, Star, Heart } from 'lucide-react';
import api from '../services/api';

interface ReviewModalProps {
  bookingId: string;
  caregiverName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  bookingId,
  caregiverName,
  onClose,
  onSuccess,
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [punctualityRating, setPunctualityRating] = useState(5);
  const [careQualityRating, setCareQualityRating] = useState(5);
  const [communicationRating, setCommunicationRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please write a brief comment regarding your care experience.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await api.post('/reviews', {
        bookingId,
        rating,
        punctualityRating,
        careQualityRating,
        communicationRating,
        comment,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 mx-auto flex items-center justify-center mb-3">
            <Star className="w-8 h-8 fill-amber-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Rate Your Care Experience</h3>
          <p className="text-xs text-slate-500 mt-1">
            Care provided by <span className="font-bold text-teal-700">{caregiverName}</span>
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Main Star Rating */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Overall Rating</span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-slate-300 hover:scale-125 transition-transform"
                >
                  <Star
                    className={`w-9 h-9 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Sub-criteria sliders/ratings */}
          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
            <div>
              <span className="text-[10px] font-bold text-slate-500">Punctuality</span>
              <div className="text-xs font-extrabold text-teal-700 mt-1">{punctualityRating} / 5</div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500">Care Quality</span>
              <div className="text-xs font-extrabold text-teal-700 mt-1">{careQualityRating} / 5</div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500">Communication</span>
              <div className="text-xs font-extrabold text-teal-700 mt-1">{communicationRating} / 5</div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Your Review / Feedback <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell other families about your experience with this caregiver..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Post Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
