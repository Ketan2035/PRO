import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import PaymentModal from "../components/PaymentModal";
import ReviewModal from "../components/ReviewModal";
import { Package, User, MapPin, LogOut, ChevronRight, CheckCircle2, Clock, XCircle, CreditCard, Star } from "lucide-react";

export default function CustomerProfile() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("orders"); // "orders", "profile", "addresses"
  const [edit, setEdit] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [paymentBooking, setPaymentBooking] = useState(null); 
  const [reviewBooking, setReviewBooking] = useState(null); 

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/me", { credentials: "include" });
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

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/booking/my", { credentials: "include" });
        const data = await res.json();
        if (data.success) setBookings(data.bookings);
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
      const res = await fetch(`http://localhost:3000/api/booking/${bookingId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status, cancelReason }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Booking ${status}`);
        setBookings((prev) => prev.map((b) => (b._id === bookingId ? { ...b, status } : b)));
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  const handlePaymentSuccess = (bookingId) => {
    setBookings((prev) => prev.map((b) => (b._id === bookingId ? { ...b, paymentStatus: "paid" } : b)));
  };

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(user));
    toast.success("Profile updated!");
    setEdit(false);
  };

  const handleDelete = async (index) => {
    try {
      const res = await fetch(`http://localhost:3000/api/user/address/${index}`, {
        method: "DELETE",
        credentials: "include",
      });
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
    await fetch("http://localhost:3000/api/logout", { method: "POST", credentials: "include" });
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (!user) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2874f0]"></div>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen font-sans pb-16">
      {paymentBooking && (
        <PaymentModal booking={paymentBooking} onClose={() => setPaymentBooking(null)} onPaymentSuccess={handlePaymentSuccess} />
      )}
      {reviewBooking && (
        <ReviewModal booking={reviewBooking} onClose={() => setReviewBooking(null)} />
      )}

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 py-4 text-sm text-gray-600">
        <Link to="/" className="hover:underline hover:text-[#2874f0]">Home</Link> &rsaquo; 
        <span className="mx-1 text-[#2874f0] font-medium">Your Account</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-6">
        
        {/* SIDEBAR */}
        <div className="w-full md:w-1/4">
          <div className="bg-white p-4 rounded-sm shadow-sm flex items-center gap-4 mb-4 border border-gray-200">
            <img
              src={user.profileImage?.url || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
              alt="user"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-xs text-gray-500">Hello,</p>
              <h2 className="font-bold text-gray-900">{user.name}</h2>
            </div>
          </div>

          <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
            <button 
              onClick={() => setActiveTab("orders")}
              className={`w-full text-left px-4 py-3 flex items-center justify-between border-b border-gray-100 transition ${activeTab === "orders" ? "bg-blue-50 text-[#2874f0] font-semibold border-l-4 border-l-[#2874f0]" : "text-gray-700 hover:bg-gray-50 hover:text-[#2874f0]"}`}
            >
              <span className="flex items-center gap-3"><Package size={18} /> Your Bookings</span>
              <ChevronRight size={16} />
            </button>
            <button 
              onClick={() => setActiveTab("profile")}
              className={`w-full text-left px-4 py-3 flex items-center justify-between border-b border-gray-100 transition ${activeTab === "profile" ? "bg-blue-50 text-[#2874f0] font-semibold border-l-4 border-l-[#2874f0]" : "text-gray-700 hover:bg-gray-50 hover:text-[#2874f0]"}`}
            >
              <span className="flex items-center gap-3"><User size={18} /> Profile Settings</span>
              <ChevronRight size={16} />
            </button>
            <button 
              onClick={() => setActiveTab("addresses")}
              className={`w-full text-left px-4 py-3 flex items-center justify-between border-b border-gray-100 transition ${activeTab === "addresses" ? "bg-blue-50 text-[#2874f0] font-semibold border-l-4 border-l-[#2874f0]" : "text-gray-700 hover:bg-gray-50 hover:text-[#2874f0]"}`}
            >
              <span className="flex items-center gap-3"><MapPin size={18} /> Saved Addresses</span>
              <ChevronRight size={16} />
            </button>
            <button 
              onClick={logout}
              className="w-full text-left px-4 py-3 flex items-center justify-between text-red-500 hover:bg-gray-50 transition"
            >
              <span className="flex items-center gap-3"><LogOut size={18} /> Logout</span>
            </button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="w-full md:w-3/4">
          
          {/* BOOKINGS TAB */}
          {activeTab === "orders" && (
            <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
              <h2 className="text-2xl font-normal text-gray-900 mb-6 border-b pb-4">Your Bookings</h2>
              
              {loadingBookings ? (
                <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2874f0]"></div></div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-10">
                  <Package size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600 font-medium">You have no booking history.</p>
                  <button onClick={() => navigate("/")} className="mt-4 bg-[#FFD814] hover:bg-[#F7CA00] text-black px-6 py-2 rounded-md font-medium border border-[#FCD200] shadow-sm">
                    Explore Services
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                      {/* Booking Header */}
                      <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex flex-wrap justify-between items-center text-sm">
                        <div className="flex gap-8">
                          <div>
                            <p className="text-gray-500 uppercase text-xs font-semibold mb-1">Booking Date</p>
                            <p className="text-gray-900">{new Date(booking.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 uppercase text-xs font-semibold mb-1">Total</p>
                            <p className="text-gray-900 font-medium">₹{booking.price || booking.professional?.pricePerHour || "TBD"}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500 uppercase text-xs font-semibold mb-1">Booking #</p>
                          <p className="text-gray-900 font-mono text-xs">{(booking._id || "").toUpperCase()}</p>
                        </div>
                      </div>

                      {/* Booking Body */}
                      <div className="p-4 flex flex-col md:flex-row gap-4 justify-between bg-white">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-sm flex items-center justify-center flex-shrink-0 border border-gray-200">
                             <img src={`https://ui-avatars.com/api/?name=${booking.professional?.name || "Pro"}&background=random`} alt="Pro" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-[#007185] hover:underline cursor-pointer hover:text-orange-600 text-lg">
                              {booking.service} Service
                            </h3>
                            <p className="text-sm text-gray-700 mt-1">Professional: <span className="font-medium">{booking.professional?.name}</span></p>
                            <p className="text-sm text-gray-500 mt-0.5">Scheduled for: {new Date(booking.date).toLocaleDateString()} at {booking.time}</p>
                            
                            {/* Status Pill */}
                            <div className="mt-3 flex items-center gap-2">
                              {booking.status === "completed" && <CheckCircle2 className="text-green-600" size={16}/>}
                              {booking.status === "pending" && <Clock className="text-yellow-600" size={16}/>}
                              {booking.status === "cancelled" && <XCircle className="text-red-600" size={16}/>}
                              <span className={`text-sm font-bold capitalize
                                ${booking.status === "completed" ? "text-green-700" : 
                                  booking.status === "cancelled" ? "text-red-700" : 
                                  "text-yellow-700"}`
                              }>
                                {(booking.status || "").replace("_", " ")}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 min-w-[200px]">
                          {booking.status === "pending" && (
                            <button onClick={() => updateStatus(booking._id, "cancelled", "Changed my mind")} className="w-full bg-white border border-gray-300 shadow-sm text-sm font-medium py-1.5 rounded-md hover:bg-gray-50">
                              Cancel Booking
                            </button>
                          )}
                          
                          {booking.status === "completed" && booking.paymentStatus !== "paid" && (
                            <button onClick={() => setPaymentBooking(booking)} className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black border border-[#FCD200] shadow-sm text-sm font-medium py-1.5 rounded-md flex justify-center items-center gap-1">
                              <CreditCard size={16} /> Pay Now (₹{booking.price})
                            </button>
                          )}

                          {booking.status === "completed" && booking.paymentStatus === "paid" && (
                            <button onClick={() => setReviewBooking(booking)} className="w-full bg-white border border-gray-300 shadow-sm text-sm font-medium py-1.5 rounded-md hover:bg-gray-50 flex justify-center items-center gap-1">
                              <Star size={16} className="text-yellow-500" /> Write a review
                            </button>
                          )}
                          <button className="w-full bg-white border border-gray-300 shadow-sm text-sm font-medium py-1.5 rounded-md hover:bg-gray-50 text-gray-700">
                            View Booking Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === "profile" && (
             <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
                <h2 className="text-2xl font-normal text-gray-900 mb-6 border-b pb-4">Profile Settings</h2>
                <div className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" name="name" value={user.name} onChange={handleChange} disabled={!edit} className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#2874f0] focus:border-[#2874f0] disabled:bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" name="email" value={user.email} onChange={handleChange} disabled={!edit} className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#2874f0] focus:border-[#2874f0] disabled:bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                    <input type="text" name="mob_no" value={user.mob_no} onChange={handleChange} disabled={!edit} className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#2874f0] focus:border-[#2874f0] disabled:bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input type="text" name="city" value={user.city} onChange={handleChange} disabled={!edit} className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#2874f0] focus:border-[#2874f0] disabled:bg-gray-50" />
                  </div>
                  <div className="pt-4 flex gap-3">
                    {edit ? (
                      <>
                        <button onClick={handleSave} className="bg-[#FFD814] text-black px-6 py-2 rounded-md font-medium border border-[#FCD200] shadow-sm">Save Changes</button>
                        <button onClick={() => setEdit(false)} className="bg-white border border-gray-300 px-6 py-2 rounded-md font-medium hover:bg-gray-50">Cancel</button>
                      </>
                    ) : (
                      <button onClick={() => setEdit(true)} className="bg-white border border-gray-300 shadow-sm px-6 py-2 rounded-md font-medium hover:bg-gray-50">Edit Profile</button>
                    )}
                  </div>
                </div>
             </div>
          )}

          {/* ADDRESS TAB */}
          {activeTab === "addresses" && (
            <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
               <div className="flex justify-between items-center mb-6 border-b pb-4">
                  <h2 className="text-2xl font-normal text-gray-900">Your Addresses</h2>
                  <Link to="/profile/address/add_address">
                    <button className="bg-white border border-gray-300 shadow-sm px-4 py-2 text-sm rounded-md font-medium hover:bg-gray-50">Add Address</button>
                  </Link>
               </div>

               <div className="grid md:grid-cols-2 gap-4">
                 {addresses.length === 0 ? (
                    <p className="text-gray-500">No saved addresses.</p>
                 ) : (
                   addresses.map((addr, i) => (
                     <div key={i} className="border border-gray-300 rounded-lg p-4 bg-white relative">
                       <p className="font-bold text-gray-900 mb-1">{user.name}</p>
                       <p className="text-gray-700 text-sm leading-relaxed mb-3">{addr}</p>
                       <div className="flex gap-4 text-sm text-[#007185]">
                         <button className="hover:underline hover:text-orange-600">Edit</button>
                         <button onClick={() => handleDelete(i)} className="hover:underline hover:text-orange-600">Remove</button>
                       </div>
                     </div>
                   ))
                 )}
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
