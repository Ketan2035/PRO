import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ProfessionalProfile() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [edit, setEdit] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);

  const navigate = useNavigate();

  // Fetch professional data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/pro/me", {
          credentials: "include",
        });

        const data = await res.json();

        if (data.success) {
          setUser(data.user);
          setIsAvailable(data.user.isAvailable ?? true);
          
          // Fetch reviews for professional
          fetchReviews(data.user._id);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  const fetchReviews = async (proId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/reviews/professional/${proId}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error("Error fetching reviews", err);
    }
  };

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
        console.error(err);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, []);

  const handleToggleAvailability = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/pro/availability", {
        method: "PUT",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setIsAvailable(data.isAvailable);
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to update availability");
      }
    } catch (err) {
      toast.error("Error toggling availability");
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    toast.success("Profile updated!");
    setEdit(false);
  };

  const updateStatus = async (id, status, cancelReason = "") => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/booking/${id}/status`,
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
          prev.map((b) => (b._id === id ? { ...b, status, cancelReason } : b))
        );
      } else {
        toast.error(data.message || "Error updating status");
      }
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  const logout = async () => {
    await fetch("http://localhost:3000/api/logout", {
      method: "POST",
      credentials: "include",
    });

    localStorage.removeItem("user");
    toast.success("Logged out");
    setTimeout(() => {
      navigate("/");
      window.location.reload();
    }, 1000);
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  // Analytics
  const completedBookings = bookings.filter((b) => b.status === "completed");
  const paidBookings = bookings.filter((b) => b.status === "completed" && b.paymentStatus === "paid");
  const totalEarnings = paidBookings.reduce((sum, b) => sum + (b.price || 100), 0);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* SIDEBAR */}
      <div className="w-64 bg-white shadow p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b">
            <img
              src={user.profileImage?.url || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
              alt="profile"
              className="w-12 h-12 rounded-full object-cover border"
            />
            <div>
              <h2 className="font-bold text-gray-900 leading-tight">{user.name}</h2>
              <p className="text-xs text-gray-500">{user.profession}</p>
            </div>
          </div>

          <ul className="space-y-3 text-sm font-medium">
            <li
              onClick={() => setActiveTab("dashboard")}
              className={`cursor-pointer p-2 rounded-lg transition ${activeTab === "dashboard" ? "bg-black text-white" : "hover:bg-gray-100 text-gray-700"}`}
            >
              📊 Dashboard
            </li>
            <li
              onClick={() => setActiveTab("bookings")}
              className={`cursor-pointer p-2 rounded-lg transition ${activeTab === "bookings" ? "bg-black text-white" : "hover:bg-gray-100 text-gray-700"}`}
            >
              📅 Bookings ({bookings.length})
            </li>
            <li
              onClick={() => setActiveTab("reviews")}
              className={`cursor-pointer p-2 rounded-lg transition ${activeTab === "reviews" ? "bg-black text-white" : "hover:bg-gray-100 text-gray-700"}`}
            >
              ⭐ Reviews ({reviews.length})
            </li>
            <li
              onClick={() => setActiveTab("profile")}
              className={`cursor-pointer p-2 rounded-lg transition ${activeTab === "profile" ? "bg-black text-white" : "hover:bg-gray-100 text-gray-700"}`}
            >
              👤 Profile
            </li>
            <li
              onClick={() => setActiveTab("settings")}
              className={`cursor-pointer p-2 rounded-lg transition ${activeTab === "settings" ? "bg-black text-white" : "hover:bg-gray-100 text-gray-700"}`}
            >
              ⚙️ Settings
            </li>
          </ul>
        </div>

        {/* AVAILABILITY TOGGLE & LOGOUT */}
        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border">
            <div>
              <p className="text-xs font-semibold text-gray-700">Status</p>
              <p className={`text-xs font-bold ${isAvailable ? "text-green-600" : "text-gray-400"}`}>
                {isAvailable ? "🟢 Online" : "⚪ Offline"}
              </p>
            </div>
            <button
              onClick={handleToggleAvailability}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                isAvailable ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Toggle
            </button>
          </div>

          <button onClick={logout} className="w-full text-left text-sm text-red-500 font-medium p-2 hover:bg-red-50 rounded-lg transition">
            🚪 Logout
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-8">
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${isAvailable ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                {isAvailable ? "Available for New Bookings" : "Currently Offline"}
              </span>
            </div>

            {/* ANALYTICS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Earnings</p>
                <h2 className="text-2xl font-black text-gray-900 mt-1">₹{totalEarnings}</h2>
                <p className="text-xs text-gray-400 mt-1">{paidBookings.length} paid orders</p>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Completed Jobs</p>
                <h2 className="text-2xl font-black text-green-600 mt-1">{completedBookings.length}</h2>
                <p className="text-xs text-gray-400 mt-1">out of {bookings.length} total</p>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pending Requests</p>
                <h2 className="text-2xl font-black text-yellow-600 mt-1">
                  {bookings.filter((b) => b.status === "pending").length}
                </h2>
                <p className="text-xs text-gray-400 mt-1">needs response</p>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Rating Score</p>
                <h2 className="text-2xl font-black text-yellow-500 mt-1">★ {user.rating || "0.0"}</h2>
                <p className="text-xs text-gray-400 mt-1">{user.totalReviews || 0} customer reviews</p>
              </div>
            </div>

            {/* RECENT BOOKINGS SUMMARY */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Job Requests</h2>
              {bookings.length === 0 ? (
                <p className="text-gray-500 text-sm">No job requests received yet.</p>
              ) : (
                <div className="space-y-3">
                  {bookings.slice(0, 5).map((b) => (
                    <div key={b._id} className="flex justify-between items-center p-3.5 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{b.customer?.name || "Customer"} ({b.service})</p>
                        <p className="text-xs text-gray-500">{new Date(b.date).toLocaleDateString()} at {b.time}</p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                        b.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                        b.status === "completed" ? "bg-green-100 text-green-700" :
                        b.status === "cancelled" ? "bg-red-100 text-red-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {b.status.replace("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* BOOKINGS */}
        {activeTab === "bookings" && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6">Manage Bookings</h2>

            {loadingBookings ? (
              <p>Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <p className="text-gray-500">No bookings found.</p>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <div key={b._id} className="border p-5 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white hover:border-gray-300 transition">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-bold text-lg text-gray-900">{b.customer?.name || "Customer"}</p>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase ${
                          b.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                          b.status === "completed" ? "bg-green-100 text-green-700" :
                          b.status === "cancelled" ? "bg-red-100 text-red-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {b.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-800">{b.service}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(b.date).toLocaleDateString()} at {b.time}</p>
                      <p className="text-xs text-gray-400">{b.address}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {b.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateStatus(b._id, "accepted")}
                            className="bg-black text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-gray-800 transition"
                          >
                            Accept Request
                          </button>
                          <button
                            onClick={() => updateStatus(b._id, "cancelled", "Rejected by professional")}
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-gray-200 transition"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {b.status === "accepted" && (
                        <>
                          <button
                            onClick={() => updateStatus(b._id, "on_the_way")}
                            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-blue-700 transition"
                          >
                            🚗 On the way
                          </button>
                          <button
                            onClick={() => updateStatus(b._id, "cancelled", "Cancelled by professional")}
                            className="text-red-500 text-xs font-semibold hover:underline px-2"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {b.status === "on_the_way" && (
                        <button
                          onClick={() => updateStatus(b._id, "in_progress")}
                          className="bg-purple-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-purple-700 transition"
                        >
                          🛠️ Start Work
                        </button>
                      )}

                      {b.status === "in_progress" && (
                        <button
                          onClick={() => updateStatus(b._id, "completed")}
                          className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-green-700 transition"
                        >
                          ✓ Mark Completed
                        </button>
                      )}

                      {b.status === "completed" && (
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${b.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {b.paymentStatus === "paid" ? "✓ Paid" : "Payment Pending"}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* REVIEWS */}
        {activeTab === "reviews" && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6">Customer Reviews</h2>

            {reviews.length === 0 ? (
              <p className="text-gray-500 text-sm">No reviews received yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev._id} className="border p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.customer?.profileImage?.url || `https://ui-avatars.com/api/?name=${rev.customer?.name || "User"}&background=random`}
                          alt="user"
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">{rev.customer?.name || "Customer"}</h4>
                          <p className="text-xs text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className="text-yellow-500 font-bold text-sm bg-yellow-50 px-2.5 py-1 rounded-lg">
                        ★ {rev.rating}.0
                      </span>
                    </div>
                    {rev.comment && <p className="text-sm text-gray-600 mt-2">{rev.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROFILE */}
        {activeTab === "profile" && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

            <label className="block text-xs font-semibold text-gray-400 mb-1">Full Name</label>
            <input name="name" value={user.name || ""} disabled={!edit} onChange={handleChange} className="w-full border p-2.5 mb-3 rounded-xl text-sm" />

            <label className="block text-xs font-semibold text-gray-400 mb-1">Email</label>
            <input value={user.email || ""} disabled className="w-full border p-2.5 mb-3 rounded-xl text-sm bg-gray-100" />

            <label className="block text-xs font-semibold text-gray-400 mb-1">Mobile</label>
            <input name="mob" value={user.mob || ""} disabled={!edit} onChange={handleChange} className="w-full border p-2.5 mb-3 rounded-xl text-sm" />

            <label className="block text-xs font-semibold text-gray-400 mb-1">Bio</label>
            <textarea name="bio" value={user.bio || ""} disabled={!edit} onChange={handleChange} rows={3} className="w-full border p-2.5 mb-4 rounded-xl text-sm" />

            {!edit ? (
              <button onClick={() => setEdit(true)} className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800">
                Edit Profile
              </button>
            ) : (
              <button onClick={handleSave} className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700">
                Save Changes
              </button>
            )}
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === "settings" && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-md">
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2.5 rounded-xl mb-3 w-full text-sm font-medium text-left">
              🔒 Change Password
            </button>
            <button className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-4 py-2.5 rounded-xl w-full text-sm font-medium text-left">
              ⚠️ Delete Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
