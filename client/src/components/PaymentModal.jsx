import React, { useState } from "react";
import toast from "react-hot-toast";

export default function PaymentModal({ booking, onClose, onPaymentSuccess }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Step 1: Create Razorpay order
      const res = await fetch(
        `http://localhost:3000/api/payment/create-order/${booking._id}`,
        { method: "POST", credentials: "include" }
      );
      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Could not initiate payment");
        return;
      }

      // Step 2: Open Razorpay Checkout
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Urban Saathi",
        description: `Payment for ${booking.service}`,
        order_id: data.orderId,
        handler: async function (response) {
          // Step 3: Verify payment on backend
          try {
            const verifyRes = await fetch(
              "http://localhost:3000/api/payment/verify",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  bookingId: booking._id,
                }),
              }
            );
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              toast.success("Payment successful! 🎉");
              onPaymentSuccess(booking._id);
              onClose();
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            toast.error("Verification error");
          }
        },
        prefill: {
          name: "",
          email: "",
        },
        theme: {
          color: "#000000",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        toast.error("Payment failed. Please try again.");
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Pay for Service</h2>
            <p className="text-sm text-gray-500 mt-1">{booking.service}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Booking Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Professional</span>
            <span className="font-medium">{booking.professional?.name || "—"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Service</span>
            <span className="font-medium">{booking.service}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Date</span>
            <span className="font-medium">{new Date(booking.date).toLocaleDateString()} at {booking.time}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold">
            <span>Total Amount</span>
            <span>₹{booking.price || 100}</span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition disabled:opacity-60"
        >
          {loading ? "Processing..." : `Pay ₹${booking.price || 100}`}
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          Secured by Razorpay · UPI, Cards, Net Banking accepted
        </p>
      </div>
    </div>
  );
}
