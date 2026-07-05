import React, { useState } from "react";
import toast from "react-hot-toast";

export default function ReviewModal({ booking, onClose, onReviewSuccess }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          bookingId: booking._id,
          rating,
          comment,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Thank you for your rating! ⭐");
        if (onReviewSuccess) onReviewSuccess(booking._id);
        onClose();
      } else {
        toast.error(data.message || "Failed to submit review");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Rate Professional</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          How was your experience with <span className="font-semibold text-gray-800">{booking.professional?.name || "the service"}</span>?
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* STAR RATING */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">Rating</label>
            <div className="flex gap-2 justify-center py-2 bg-gray-50 rounded-xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-transform hover:scale-110 ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* COMMENT */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">Review / Feedback</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}
