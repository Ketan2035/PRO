import React from "react";
import { X, MapPin, Clock, Calendar, CheckCircle2, User, CreditCard, Tag } from "lucide-react";
import { Link } from "react-router-dom";

export default function BookingDetailsModal({ booking, onClose, viewerRole }) {
  if (!booking) return null;

  const statusColors = {
    pending: "text-yellow-700 bg-yellow-100",
    accepted: "text-blue-700 bg-blue-100",
    on_the_way: "text-blue-700 bg-blue-100",
    in_progress: "text-orange-700 bg-orange-100",
    completed: "text-green-700 bg-green-100",
    cancelled: "text-red-700 bg-red-100",
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
              <Tag size={20} className="text-[#2874f0]" /> Booking Details
            </h2>
            <p className="text-xs text-gray-500 font-mono mt-1">ID: {booking._id}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition p-1">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Section: Status & Price */}
          <div className="flex flex-wrap justify-between items-start gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Status</p>
              <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${statusColors[booking.status] || "bg-gray-100 text-gray-800"}`}>
                {(booking.status || "").replace("_", " ")}
                {booking.status === "cancelled" && booking.cancelledBy ? ` (by ${booking.cancelledBy === viewerRole ? 'you' : booking.cancelledBy})` : ""}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Total Price</p>
              <p className="text-xl font-bold text-gray-900">₹{booking.price || booking.professional?.pricePerHour || "TBD"}</p>
              {booking.status === "completed" && (
                <p className={`text-xs font-semibold mt-1 uppercase ${booking.paymentStatus === "paid" ? "text-green-600" : "text-red-500"}`}>
                  {booking.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                </p>
              )}
            </div>
          </div>

          {/* Service & Professional Info */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 border-b pb-2 mb-3">Service Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded text-[#2874f0]"><Tag size={18} /></div>
                <div>
                  <p className="text-xs text-gray-500">Service Required</p>
                  <p className="font-medium text-gray-900">{booking.service}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded text-[#2874f0]"><User size={18} /></div>
                <div>
                  <p className="text-xs text-gray-500">Professional</p>
                  {booking.professional ? (
                    <Link to={`/profile/${booking.professional._id}`} className="font-medium text-[#2874f0] hover:underline">
                      {booking.professional.name}
                    </Link>
                  ) : (
                    <p className="font-medium text-gray-900">Unassigned</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Schedule & Location */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 border-b pb-2 mb-3">Schedule & Location</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-gray-100 p-2 rounded text-gray-600"><Calendar size={18} /></div>
                <div>
                  <p className="text-xs text-gray-500">Scheduled Date</p>
                  <p className="font-medium text-gray-900">{new Date(booking.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-gray-100 p-2 rounded text-gray-600"><Clock size={18} /></div>
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="font-medium text-gray-900">{booking.time}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:col-span-2">
                <div className="bg-gray-100 p-2 rounded text-gray-600"><MapPin size={18} /></div>
                <div>
                  <p className="text-xs text-gray-500">Service Address</p>
                  <p className="font-medium text-gray-900 leading-relaxed">{booking.address}</p>
                  {booking.city && <p className="text-sm text-gray-600">{booking.city} {booking.pincode && `- ${booking.pincode}`}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          {(booking.description || booking.cancelReason) && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 border-b pb-2 mb-3">Additional Notes</h3>
              {booking.description && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Issue Description</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded border border-gray-100">{booking.description}</p>
                </div>
              )}
              {booking.cancelReason && (
                <div>
                  <p className="text-xs text-red-500 mb-1 font-semibold">Cancellation Reason</p>
                  <p className="text-sm text-gray-700 bg-red-50 p-3 rounded border border-red-100">{booking.cancelReason}</p>
                </div>
              )}
            </div>
          )}

        </div>
        
        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition shadow-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
