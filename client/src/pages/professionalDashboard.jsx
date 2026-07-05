import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { LayoutDashboard, CalendarDays, User, Star, Settings, LogOut, CheckCircle2, XCircle, Clock, CreditCard, ChevronRight, TrendingUp, MapPin } from "lucide-react";

export default function ProfessionalProfile() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [edit, setEdit] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/pro/me", { credentials: "include" });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          setIsAvailable(data.user.isAvailable ?? true);
          fetchReviews(data.user._id);
        }
      } catch (err) { console.error(err); }
    };
    fetchUser();
  }, []);

  const fetchReviews = async (proId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/reviews/professional/${proId}`);
      const data = await res.json();
      if (data.success) setReviews(data.reviews);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/booking/my", { credentials: "include" });
        const data = await res.json();
        if (data.success) setBookings(data.bookings);
      } catch (err) { console.error(err); }
      finally { setLoadingBookings(false); }
    };
    fetchBookings();
  }, []);

  const toggleAvailability = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/pro/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isAvailable: !isAvailable }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAvailable(!isAvailable);
        toast.success(`You are now ${!isAvailable ? "Online" : "Offline"}`);
      }
    } catch (err) { toast.error("Failed to update status"); }
  };

  const updateStatus = async (id, status, cancelReason = "") => {
    try {
      let finalPrice = undefined;
      if (status === "completed") {
        finalPrice = user.pricePerHour || 0;
      }
      
      const res = await fetch(`http://localhost:3000/api/booking/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status, cancelReason, price: finalPrice }),
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success(`Booking ${status}`);
        setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status, price: finalPrice || b.price } : b)));
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (err) { toast.error("Error updating status"); }
  };

  const logout = async () => {
    await fetch("http://localhost:3000/api/logout", { method: "POST", credentials: "include" });
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (!user) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2874f0]"></div>
    </div>
  );

  // Analytics Calculations
  const completedJobs = bookings.filter((b) => b.status === "completed").length;
  const pendingJobs = bookings.filter((b) => b.status === "pending").length;
  const totalEarnings = bookings.filter((b) => b.status === "completed" && b.paymentStatus === "paid").reduce((sum, b) => sum + (b.price || 0), 0);

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-16">
      {/* Professional Dashboard Header */}
      <div className="bg-[#172337] text-white py-3 px-6 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-xl font-bold tracking-tight italic">
            Urban<span className="text-yellow-400">Saathi</span> <span className="text-gray-300 font-normal text-sm ml-2">Professional Hub</span>
          </Link>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
           <div className="flex items-center gap-2">
             <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
             <span>{isAvailable ? "Accepting Jobs" : "Offline"}</span>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6 flex flex-col md:flex-row gap-6">
        
        {/* SIDEBAR */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
            
            {/* Profile Brief */}
            <div className="p-6 border-b border-gray-100 flex flex-col items-center text-center">
               <img src={user.profileImage?.url || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt="user" className="w-20 h-20 rounded-full object-cover border-4 border-gray-50 mb-3" />
               <h2 className="font-bold text-gray-900">{user.name}</h2>
               <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">{user.profession}</p>
            </div>

            <div className="flex flex-col">
              {[
                { id: "dashboard", label: "Performance", icon: <TrendingUp size={18} /> },
                { id: "bookings", label: "Manage Bookings", icon: <CalendarDays size={18} /> },
                { id: "profile", label: "Profile Settings", icon: <Settings size={18} /> },
                { id: "reviews", label: "Customer Feedback", icon: <Star size={18} /> },
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-6 py-3.5 flex items-center gap-3 transition font-medium text-sm
                    ${activeTab === tab.id 
                      ? "bg-blue-50 text-[#2874f0] border-l-4 border-l-[#2874f0]" 
                      : "text-gray-700 hover:bg-gray-50 border-l-4 border-transparent hover:text-[#2874f0]"
                    }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
              <div className="p-4 border-t border-gray-100 mt-2">
                 <button 
                   onClick={toggleAvailability} 
                   className={`w-full py-2 rounded-sm text-sm font-semibold transition border 
                     ${isAvailable ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"}`}
                 >
                   Go {isAvailable ? "Offline" : "Online"}
                 </button>
              </div>
              <button onClick={logout} className="w-full text-left px-6 py-4 flex items-center gap-3 text-red-500 hover:bg-gray-50 transition font-medium text-sm border-t border-gray-100">
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1">
          
          {/* DASHBOARD (Analytics) */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Performance Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200 border-t-4 border-t-blue-500">
                   <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Total Revenue</p>
                   <h3 className="text-3xl font-bold text-gray-900">₹{totalEarnings.toLocaleString()}</h3>
                </div>
                <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200 border-t-4 border-t-green-500">
                   <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Completed Jobs</p>
                   <h3 className="text-3xl font-bold text-gray-900">{completedJobs}</h3>
                </div>
                <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200 border-t-4 border-t-yellow-500">
                   <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Pending Requests</p>
                   <h3 className="text-3xl font-bold text-gray-900">{pendingJobs}</h3>
                </div>
                <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200 border-t-4 border-t-orange-500">
                   <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Avg Rating</p>
                   <div className="flex items-center gap-2">
                     <h3 className="text-3xl font-bold text-gray-900">{user.rating || "0.0"}</h3>
                     <Star size={24} className="text-yellow-500 fill-yellow-500 mt-1" />
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* BOOKINGS (Booking Management) */}
          {activeTab === "bookings" && (
            <div className="bg-white rounded-sm shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-lg font-bold text-gray-900">Manage Service Bookings</h2>
              </div>
              
              <div className="p-6">
                {loadingBookings ? (
                  <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2874f0]"></div></div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-16">
                    <CalendarDays size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">No booking requests found.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking._id} className="border border-gray-200 rounded-lg overflow-hidden">
                        
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex flex-wrap justify-between items-center text-sm">
                          <div className="flex gap-8">
                            <div>
                              <p className="text-gray-500 uppercase text-xs font-semibold mb-1">Customer</p>
                              <p className="text-gray-900 font-medium">{booking.customer?.name}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 uppercase text-xs font-semibold mb-1">Scheduled Date</p>
                              <p className="text-gray-900 font-medium">{new Date(booking.date).toLocaleDateString()} at {booking.time}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-500 uppercase text-xs font-semibold mb-1">Booking #</p>
                            <p className="text-gray-900 font-mono text-xs">{(booking._id || "").toUpperCase()}</p>
                          </div>
                        </div>

                        <div className="p-4 flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                               <MapPin size={16} className="text-gray-400" />
                               <span className="text-sm font-medium text-gray-800">{booking.address}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                               <span className="text-sm font-medium text-gray-800 bg-blue-50 px-2 py-1 rounded text-[#2874f0]">{booking.service}</span>
                               <span className="text-sm text-gray-500">Contact: {booking.customer?.mob_no || "N/A"}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              Status: 
                              <span className={`text-xs font-bold uppercase px-2 py-1 rounded-sm
                                ${booking.status === "completed" ? "bg-green-100 text-green-700" : 
                                  booking.status === "cancelled" ? "bg-red-100 text-red-700" : 
                                  booking.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                  "bg-blue-100 text-blue-700"}`
                              }>
                                {(booking.status || "").replace("_", " ")}
                              </span>
                            </div>
                            {booking.status === "completed" && (
                              <p className="text-sm text-gray-600 mt-2 font-medium">
                                Final Price: <span className="text-green-700 font-bold">₹{booking.price}</span> | Payment: <span className="uppercase">{booking.paymentStatus}</span>
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col gap-2 min-w-[180px] border-l border-gray-100 pl-4">
                            {booking.status === "pending" && (
                              <>
                                <button onClick={() => updateStatus(booking._id, "accepted")} className="bg-green-600 hover:bg-green-700 text-white shadow-sm text-sm font-medium py-2 rounded-sm transition">Accept Booking</button>
                                <button onClick={() => updateStatus(booking._id, "cancelled", "Busy schedule")} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm text-sm font-medium py-2 rounded-sm transition">Reject</button>
                              </>
                            )}
                            {booking.status === "accepted" && (
                              <button onClick={() => updateStatus(booking._id, "on_the_way")} className="bg-[#2874f0] hover:bg-blue-600 text-white shadow-sm text-sm font-medium py-2 rounded-sm transition">Mark On The Way</button>
                            )}
                            {booking.status === "on_the_way" && (
                              <button onClick={() => updateStatus(booking._id, "in_progress")} className="bg-yellow-500 hover:bg-yellow-600 text-white shadow-sm text-sm font-medium py-2 rounded-sm transition">Start Job</button>
                            )}
                            {booking.status === "in_progress" && (
                              <button onClick={() => updateStatus(booking._id, "completed")} className="bg-green-600 hover:bg-green-700 text-white shadow-sm text-sm font-medium py-2 rounded-sm transition">Complete Job</button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PROFILE SETTINGS */}
          {activeTab === "profile" && (
            <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
               <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Profile Settings</h2>
               <div className="max-w-2xl grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" value={user.name} disabled className="w-full border border-gray-300 rounded-sm p-2.5 bg-gray-50 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registered Email</label>
                    <input type="email" value={user.email} disabled className="w-full border border-gray-300 rounded-sm p-2.5 bg-gray-50 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profession / Category</label>
                    <input type="text" value={user.profession} disabled className="w-full border border-gray-300 rounded-sm p-2.5 bg-gray-50 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Base Price per Hour (₹)</label>
                    <input type="text" value={user.pricePerHour} disabled className="w-full border border-gray-300 rounded-sm p-2.5 bg-gray-50 text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Area (City)</label>
                    <input type="text" value={user.service_area} disabled className="w-full border border-gray-300 rounded-sm p-2.5 bg-gray-50 text-sm" />
                  </div>
                  <div className="md:col-span-2 mt-4">
                    <button className="bg-[#2874f0] text-white px-6 py-2.5 text-sm font-medium rounded-sm shadow-sm opacity-50 cursor-not-allowed">Edit Profile (Coming Soon)</button>
                  </div>
               </div>
            </div>
          )}

          {/* REVIEWS */}
          {activeTab === "reviews" && (
            <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
               <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Customer Feedback</h2>
               {reviews.length === 0 ? (
                 <p className="text-gray-500 italic">No reviews received yet.</p>
               ) : (
                 <div className="space-y-6">
                   {reviews.map((rev) => (
                      <div key={rev._id} className="pb-4 border-b border-gray-100 last:border-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-gray-900">{rev.customer?.name || "Customer"}</span>
                          <div className="flex items-center gap-1 text-xs font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-sm">
                             {rev.rating} ★
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">{new Date(rev.createdAt).toLocaleDateString()}</p>
                        {rev.comment && <p className="text-sm text-gray-700">{rev.comment}</p>}
                      </div>
                   ))}
                 </div>
               )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
