import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import PaymentModal from "../components/PaymentModal";
import ReviewModal from "../components/ReviewModal";

export default function CustomerProfile() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [edit, setEdit] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [paymentBooking, setPaymentBooking] = useState(null); // booking to pay for
  const [reviewBooking, setReviewBooking] = useState(null); // booking to review

  const navigate = useNavigate();

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/me", {
          credentials: "include",
        });

        const data = await res.json();

        if (data.success) {
          setUser(data.user);
          setAddresses(data.user.address || []);
        } else {
          toast.error("Please login first");
          navigate("/login");
        }
      } catch (err) {
        toast.error("Auth check failed");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/booking/my", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setBookings(data.bookings);
        }
      } catch (err) {
        toast.error("Failed to load bookings");
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, []);

  const updateStatus = async (bookingId, status, cancelReason = "") => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/booking/${bookingId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status, cancelReason }),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success(`Booking ${status}`);
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status } : b))
        );
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  const handlePaymentSuccess = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) => (b._id === bookingId ? { ...b, paymentStatus: "paid" } : b))
    );
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(user));
    toast.success("Profile updated!");
    setEdit(false);
  };

  const handleDelete = async (index) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/user/address/${index}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Address deleted");
        setAddresses((prev) => prev.filter((_, i) => i !== index));
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const logout = async () => {
    await fetch("http://localhost:3000/api/logout", {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      {paymentBooking && (
        <PaymentModal
          booking={paymentBooking}
          onClose={() => setPaymentBooking(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {reviewBooking && (
        <ReviewModal
          booking={reviewBooking}
          onClose={() => setReviewBooking(null)}
        />
      )}

      <div className="min-h-screen bg-gray-100 flex">
        {/* SIDEBAR */}
        <div className="w-64 bg-white shadow p-4">
          <h2 className="text-xl font-bold mb-6">My Account</h2>

          <ul className="space-y-3">
            <li onClick={() => setActiveTab("profile")} className="cursor-pointer hover:text-blue-500 font-medium">Profile</li>
            <li onClick={() => setActiveTab("orders")} className="cursor-pointer hover:text-blue-500 font-medium">My Bookings</li>
            <li onClick={() => setActiveTab("address")} className="cursor-pointer hover:text-blue-500 font-medium">Address</li>
            <li onClick={() => setActiveTab("settings")} className="cursor-pointer hover:text-blue-500 font-medium">Settings</li>
          </ul>

          <button onClick={logout} className="mt-10 text-red-500 font-medium hover:underline">Logout</button>
        </div>

        {/* MAIN */}
        <div className="flex-1 p-6">
          {/* PROFILE */}
          {activeTab === "profile" && (
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-lg font-semibold mb-4">Profile</h2>

              <input name="name" value={user.name || ""} disabled={!edit} onChange={handleChange} className="w-full border p-2 mb-3 rounded" />
              <input value={user.email || ""} disabled className="w-full border p-2 mb-3 rounded bg-gray-100" />
              <input name="mob" value={user.mob || ""} disabled={!edit} onChange={handleChange} className="w-full border p-2 mb-3 rounded" />

              {!edit ? (
                <button onClick={() => setEdit(true)} className="bg-blue-500 text-white px-4 py-2 rounded">Edit</button>
              ) : (
                <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
              )}
            </div>
          )}

          {/* BOOKINGS */}
          {activeTab === "orders" && (
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-lg font-semibold mb-4">My Bookings</h2>

              {loadingBookings ? (
                <p>Loading bookings...</p>
              ) : bookings.length === 0 ? (
                <p className="text-gray-500">No bookings yet</p>
              ) : (
                bookings.map((b) => (
                  <div key={b._id} className="border p-4 rounded-xl mb-3 flex justify-between items-center bg-white shadow-sm hover:shadow transition">
                    <div>
                      <p className="font-semibold text-gray-900">{b.professional?.name} ({b.service})</p>
                      <p className="text-sm text-gray-500">{new Date(b.date).toLocaleDateString()} | {b.time}</p>
                      <p className="text-xs text-gray-400 mt-1">{b.address}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className={`font-semibold px-3 py-1 rounded-full text-xs uppercase tracking-wide ${
                        b.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                        b.status === "completed" ? "bg-green-100 text-green-700" :
                        b.status === "cancelled" ? "bg-red-100 text-red-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {b.status.replace("_", " ")}
                      </span>

                      {b.status === "pending" && (
                        <button
                          onClick={() => updateStatus(b._id, "cancelled", "Cancelled by customer")}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Cancel Booking
                        </button>
                      )}

                      {b.status === "completed" && b.paymentStatus !== "paid" && (
                        <button
                          onClick={() => setPaymentBooking(b)}
                          className="bg-black text-white text-xs px-3.5 py-1.5 rounded-lg hover:bg-gray-800 transition font-medium"
                        >
                          Pay Now (₹{b.price || 100})
                        </button>
                      )}

                      {b.status === "completed" && b.paymentStatus === "paid" && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full font-medium">
                            ✓ Paid
                          </span>
                          <button
                            onClick={() => setReviewBooking(b)}
                            className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2.5 py-1 rounded-full font-medium hover:bg-yellow-100 transition"
                          >
                            ★ Rate Service
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ADDRESS */}
          {activeTab === "address" && (
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-lg font-semibold mb-4">Saved Addresses</h2>

              {addresses.length === 0 ? (
                <p className="text-gray-500">No address saved</p>
              ) : (
                addresses.map((addr, index) => (
                  <div key={index} className="border p-3 rounded mb-3 flex justify-between items-center">
                    <p className="text-sm text-gray-700">{addr}</p>
                    <button onClick={() => handleDelete(index)} className="text-sm text-red-500 hover:underline">Delete</button>
                  </div>
                ))
              )}

              <button onClick={() => navigate("/profile/address/add_address")} className="mt-3 bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium">
                + Add Address
              </button>
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === "settings" && (
            <div className="bg-white p-6 rounded-xl shadow max-w-md">
              <h2 className="text-lg font-semibold mb-4">Settings</h2>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2.5 rounded-lg mb-3 w-full text-sm font-medium text-left">
                🔒 Change Password
              </button>
              <button className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-4 py-2.5 rounded-lg w-full text-sm font-medium text-left">
                ⚠️ Delete Account
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
