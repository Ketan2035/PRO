import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Lock, MapPin, CalendarDays, Clock, CheckCircle2, ChevronRight, ShieldCheck } from "lucide-react";
import { socket } from "../socket";

const Checkout = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [pro, setPro] = useState(null);
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  
  const [selectedAddress, setSelectedAddress] = useState("");
  const [bookingType, setBookingType] = useState("scheduled"); // "instant" or "scheduled"
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("online");
  
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(1); // 1: Address, 2: Slot, 3: Review
  
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeLeft, setSearchTimeLeft] = useState(30);
  const [currentReqId, setCurrentReqId] = useState(null);

  useEffect(() => {
    let timer;
    if (isSearching && searchTimeLeft > 0) {
      timer = setInterval(() => setSearchTimeLeft(prev => prev - 1), 1000);
    } else if (searchTimeLeft === 0 && isSearching) {
      setIsSearching(false);
    }
    return () => clearInterval(timer);
  }, [isSearching, searchTimeLeft]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/me", { credentials: "include" });
        const data = await res.json();
        if (!data.success) {
          toast.error("Please login first");
          navigate("/login");
        } else {
          setUser(data.user);
          setAddresses(data.user?.address || []);
          if (data.user?.address?.length > 0) setSelectedAddress(data.user.address[0]);
        }
        if (data.role === "professional") {
          toast.error("Only customers can book services");
          navigate("/");
        }
      } catch (err) {
        toast.error("User fetch failed");
      }
    };
    checkUser();
  }, [navigate]);

  useEffect(() => {
    const fetchPro = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/professionals/${id}`);
        const data = await res.json();
        setPro(data.user || data.professional || null);
      } catch (err) {
        toast.error("Failed to load professional");
      } finally {
        setLoading(false);
      }
    };
    fetchPro();
  }, [id]);

  const handleBooking = async () => {
    if (bookingType === "scheduled" && (!selectedAddress || !selectedDate || !selectedTime)) {
      return toast.error("Please complete all steps before booking");
    } else if (bookingType === "instant" && !selectedAddress) {
      return toast.error("Please provide a service location");
    }
    
    if (bookingType === "instant") {
       if (!socket.connected) socket.connect();
       
       const reqId = Date.now().toString();
       setCurrentReqId(reqId);
       const bookingReq = { 
          _id: reqId, customerId: user._id, customerName: user.name, 
          professionalId: pro._id, service: pro.profession, 
          address: selectedAddress, price: Math.round(pro.pricePerHour + (pro.pricePerHour * 0.1) + (pro.pricePerHour * 0.05))
       };
       
       socket.emit("initiate_instant_booking", { professionalId: pro._id, bookingRequest: bookingReq });
       
       setIsSearching(true);
       setSearchTimeLeft(30);
       
       // listen for result
       socket.once(`instant_booking_result_${reqId}`, async (result) => {
          setIsSearching(false);
          if (result.status === "accepted") {
            toast.success("Professional Accepted! Confirming booking...");
            // now do the actual POST to save the booking
            executeBookingCall();
          } else {
            toast.error(result.reason === "timeout" ? "Professional unavailable. Please try someone else." : "Professional rejected the request.");
          }
       });
       return;
    }

    executeBookingCall();
  };

  const executeBookingCall = async () => {
    // Using a toast promise for a premium feel
    const bookingPromise = fetch("http://localhost:3000/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        professionalId: pro?._id,
        service: pro?.profession,
        address: selectedAddress,
        date: bookingType === "instant" ? new Date().toISOString().split("T")[0] : selectedDate,
        time: bookingType === "instant" ? "Instant" : selectedTime,
        bookingType: bookingType,
        paymentMethod: paymentMethod,
      }),
    }).then(async (res) => {
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data;
    });

    toast.promise(bookingPromise, {
      loading: 'Processing your booking...',
      success: 'Booking Confirmed successfully! 🎉',
      error: (err) => `Booking failed: ${err.message}`,
    });

    try {
      await bookingPromise;
      setTimeout(() => navigate("/profile/customer"), 1500);
    } catch (e) {
      // handled by toast
    }
  };

  if (loading || !pro) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2874f0] mb-4"></div>
        <p className="text-gray-600 font-medium text-lg">Preparing secure checkout...</p>
      </div>
    );
  }

  // Helper for step progression
  const proceedToSlot = () => {
    if (!selectedAddress) return toast.error("Please select a service location");
    setActiveStep(2);
  };

  const proceedToReview = () => {
    if (bookingType === "scheduled" && (!selectedDate || !selectedTime)) {
       return toast.error("Please select a date and time slot");
    }
    setActiveStep(3);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-16">
      
      {/* Searching Overlay */}
      {isSearching && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex flex-col items-center justify-center p-4 backdrop-blur-sm">
           <div className="relative w-40 h-40 flex items-center justify-center mb-8">
             <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-ping opacity-75"></div>
             <div className="absolute inset-4 border-4 border-blue-400 rounded-full animate-ping opacity-50 animation-delay-300"></div>
             <img src={pro.profileImage?.url || `https://ui-avatars.com/api/?name=${pro.name}&background=random`} alt="Pro" className="w-24 h-24 rounded-full object-cover border-4 border-white z-10" />
           </div>
           
           <h2 className="text-2xl font-bold text-white mb-2 text-center">Contacting {pro.name}...</h2>
           <p className="text-blue-200 mb-8 text-center max-w-sm">Please wait while we confirm availability with the professional for your instant request.</p>
           
           <div className="w-full max-w-xs bg-gray-800 rounded-full h-2 mb-4 overflow-hidden">
             <div 
               className="bg-blue-500 h-full transition-all duration-1000 ease-linear" 
               style={{ width: `${(searchTimeLeft / 30) * 100}%` }}
             ></div>
           </div>
           <p className="text-gray-400 font-mono font-medium">{searchTimeLeft} seconds remaining</p>
           
           <button 
             onClick={() => {
               if (currentReqId) {
                 socket.emit("cancel_instant_booking", { reqId: currentReqId, professionalId: pro._id });
               }
               setIsSearching(false);
             }} 
             className="mt-12 text-gray-400 hover:text-white transition underline text-sm"
           >
             Cancel Request
           </button>
        </div>
      )}

      {/* Checkout Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 md:px-12 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <Link to="/" className="text-2xl font-bold italic tracking-tight text-[#2874f0]">
          Urban<span className="text-yellow-500">Saathi</span>
        </Link>
        <h1 className="text-xl font-medium text-gray-800 hidden md:block text-center flex-1">Secure Checkout</h1>
        <div className="flex items-center text-gray-600 gap-1">
          <Lock size={20} />
          <span className="text-sm font-medium">Secure</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-6">
        
        {/* LEFT COLUMN: Steps */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          
          {/* STEP 1: ADDRESS */}
          <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
             <div 
               className={`px-6 py-4 flex items-center gap-4 ${activeStep === 1 ? "bg-[#2874f0] text-white" : "bg-white text-gray-900 border-b"}`}
             >
               <span className={`w-6 h-6 flex items-center justify-center rounded-sm text-sm font-bold ${activeStep === 1 ? "bg-white text-[#2874f0]" : "bg-gray-200 text-gray-600"}`}>1</span>
               <h2 className="text-lg font-semibold flex-1 uppercase">Service Location</h2>
               {activeStep > 1 && <CheckCircle2 className="text-green-500" size={20}/>}
             </div>
             
             {activeStep === 1 && (
               <div className="p-6">
                 {addresses.length === 0 ? (
                   <div className="text-center py-6">
                     <p className="text-gray-500 mb-4">You don't have any saved addresses.</p>
                     <button onClick={() => navigate("/profile/address/add_address")} className="bg-white border border-[#2874f0] text-[#2874f0] px-6 py-2 rounded-sm font-medium hover:bg-blue-50 transition">
                       + Add a new address
                     </button>
                   </div>
                 ) : (
                   <div className="space-y-3">
                     {addresses.map((addr, i) => (
                       <label key={i} className={`flex items-start gap-4 p-4 border rounded-sm cursor-pointer transition
                         ${selectedAddress === addr ? "border-[#2874f0] bg-blue-50/30 shadow-sm" : "border-gray-200 hover:bg-gray-50"}
                       `}>
                         <input
                           type="radio"
                           name="address"
                           value={addr}
                           checked={selectedAddress === addr}
                           onChange={() => setSelectedAddress(addr)}
                           className="mt-1 w-4 h-4 text-[#2874f0] focus:ring-[#2874f0]"
                         />
                         <div>
                           <p className="font-bold text-gray-900 mb-1">{user?.name}</p>
                           <p className="text-sm text-gray-700">{addr}</p>
                         </div>
                       </label>
                     ))}
                     
                     <div className="pt-4 flex justify-between items-center border-t border-gray-100 mt-4">
                       <button onClick={() => navigate("/profile/address/add_address")} className="text-[#2874f0] text-sm font-medium hover:underline flex items-center gap-1">
                         + Add new address
                       </button>
                       <button onClick={proceedToSlot} className="bg-[#fb641b] text-white px-8 py-3 rounded-sm font-medium shadow-sm hover:bg-[#f35200] transition uppercase text-sm tracking-wider">
                         Provide Service Here
                       </button>
                     </div>
                   </div>
                 )}
               </div>
             )}
             
             {activeStep > 1 && (
                <div className="px-6 py-4 flex justify-between items-center text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} /> <span className="font-medium text-gray-900 truncate max-w-[200px] md:max-w-md">{selectedAddress}</span>
                  </div>
                  <button onClick={() => setActiveStep(1)} className="text-[#2874f0] font-medium hover:underline uppercase">Change</button>
                </div>
             )}
          </div>

          {/* STEP 2: SLOT */}
          <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
             <div 
               className={`px-6 py-4 flex items-center gap-4 ${activeStep === 2 ? "bg-[#2874f0] text-white" : "bg-white text-gray-900 border-b"}`}
             >
               <span className={`w-6 h-6 flex items-center justify-center rounded-sm text-sm font-bold ${activeStep === 2 ? "bg-white text-[#2874f0]" : "bg-gray-200 text-gray-600"}`}>2</span>
               <h2 className="text-lg font-semibold flex-1 uppercase">Schedule Service Slot</h2>
               {activeStep > 2 && <CheckCircle2 className="text-green-500" size={20}/>}
             </div>
             
             {activeStep === 2 && (
               <div className="p-6">
                 
                 <div className="flex gap-4 mb-6">
                   <label className={`flex-1 border p-4 rounded-sm cursor-pointer transition ${bookingType === 'instant' ? 'border-[#2874f0] bg-blue-50' : 'border-gray-200'}`}>
                     <div className="flex items-center gap-2 mb-2">
                       <input type="radio" name="bookingType" value="instant" checked={bookingType === 'instant'} onChange={() => setBookingType('instant')} className="text-[#2874f0]" />
                       <span className="font-bold text-gray-900">Instant Request (Right Now)</span>
                     </div>
                     <p className="text-xs text-gray-500 ml-6">The professional will be notified immediately. Requires them to be online.</p>
                     {!pro.isAvailable && (
                       <p className="text-xs text-red-500 ml-6 mt-2 font-medium">Currently Offline. Cannot book instantly.</p>
                     )}
                   </label>
                   
                   <label className={`flex-1 border p-4 rounded-sm cursor-pointer transition ${bookingType === 'scheduled' ? 'border-[#2874f0] bg-blue-50' : 'border-gray-200'}`}>
                     <div className="flex items-center gap-2 mb-2">
                       <input type="radio" name="bookingType" value="scheduled" checked={bookingType === 'scheduled'} onChange={() => setBookingType('scheduled')} className="text-[#2874f0]" />
                       <span className="font-bold text-gray-900">Schedule for Later</span>
                     </div>
                     <p className="text-xs text-gray-500 ml-6">Pick a specific date and time for the service.</p>
                   </label>
                 </div>

                 {bookingType === "scheduled" && (
                   <div className="grid md:grid-cols-2 gap-6 p-4 bg-gray-50 border border-gray-100 rounded-sm">
                     <div>
                       <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                         <CalendarDays size={16} className="text-[#2874f0]" /> Select Date
                       </label>
                       <input
                         type="date"
                         value={selectedDate}
                         onChange={(e) => setSelectedDate(e.target.value)}
                         min={new Date().toISOString().split("T")[0]}
                         className="w-full border border-gray-300 rounded-sm p-2.5 text-sm focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] outline-none transition"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                         <Clock size={16} className="text-[#2874f0]" /> Select Time
                       </label>
                       <input
                         type="time"
                         value={selectedTime}
                         onChange={(e) => setSelectedTime(e.target.value)}
                         className="w-full border border-gray-300 rounded-sm p-2.5 text-sm focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] outline-none transition"
                       />
                     </div>
                   </div>
                 )}

                 <div className="pt-4 flex justify-end items-center border-t border-gray-100 mt-6">
                   <button 
                     onClick={proceedToReview} 
                     disabled={bookingType === "instant" && !pro.isAvailable}
                     className={`px-8 py-3 rounded-sm font-medium shadow-sm transition uppercase text-sm tracking-wider
                       ${(bookingType === "instant" && !pro.isAvailable) ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#fb641b] text-white hover:bg-[#f35200]"}
                     `}
                   >
                     Continue
                   </button>
                 </div>
               </div>
             )}

             {activeStep > 2 && (
                <div className="px-6 py-4 flex justify-between items-center text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock size={16} /> 
                    <span className="font-medium text-gray-900">
                      {bookingType === "instant" ? "Instant (Right Now)" : `${new Date(selectedDate).toLocaleDateString()} at ${selectedTime}`}
                    </span>
                  </div>
                  <button onClick={() => setActiveStep(2)} className="text-[#2874f0] font-medium hover:underline uppercase">Change</button>
                </div>
             )}
          </div>

          {/* STEP 3: BOOKING SUMMARY */}
          <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
             <div 
               className={`px-6 py-4 flex items-center gap-4 ${activeStep === 3 ? "bg-[#2874f0] text-white" : "bg-white text-gray-400"}`}
             >
               <span className={`w-6 h-6 flex items-center justify-center rounded-sm text-sm font-bold ${activeStep === 3 ? "bg-white text-[#2874f0]" : "bg-gray-200 text-gray-600"}`}>3</span>
               <h2 className="text-lg font-semibold flex-1 uppercase">Booking Summary</h2>
             </div>
             
             {activeStep === 3 && (
               <div className="p-6">
                 <div className="flex flex-col md:flex-row gap-6">
                   <img 
                     src={pro.profileImage?.url || `https://ui-avatars.com/api/?name=${pro.name}&background=random`} 
                     alt="Pro" 
                     className="w-24 h-24 object-cover rounded-sm border border-gray-200"
                   />
                   <div>
                     <h3 className="font-medium text-lg text-gray-900">{pro.name} - {pro.profession} Service</h3>
                     <p className="text-sm text-gray-500 mt-1">Service provided directly by verified professional.</p>
                     
                     <div className="flex items-center gap-4 mt-4 text-sm text-gray-700">
                       <span className="font-bold text-[#b12704] text-xl">₹{pro.pricePerHour}</span>
                       <span>/ hour base rate</span>
                     </div>
                   </div>
                 </div>
                 
                 <div className="bg-[#f0f2f5] p-4 rounded-sm mt-6 text-sm text-gray-700">
                    <p className="flex items-center gap-2 font-medium">
                      <ShieldCheck size={16} className="text-green-600"/> 
                      Payment will be collected after service completion. No upfront charges.
                    </p>
                 </div>
               </div>
             )}
          </div>
        </div>

        {/* RIGHT COLUMN: Buy Box Sidebar */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-sm shadow-sm border border-gray-200 p-6 sticky top-24">
            
            <h2 className="text-gray-500 uppercase text-xs font-bold tracking-wider mb-4 border-b pb-2">Price Details</h2>
            
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Base Service Rate</span>
                <span>₹{pro.pricePerHour}</span>
              </div>
              <div className="flex justify-between">
                <span>Visiting Charge</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee (10%)</span>
                <span>₹{Math.round(pro.pricePerHour * 0.1)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes (5%)</span>
                <span>₹{Math.round(pro.pricePerHour * 0.05)}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-300 my-4 pt-4 flex justify-between font-bold text-lg text-gray-900">
              <span>Amount Payable</span>
              <span>₹{Math.round(pro.pricePerHour + (pro.pricePerHour * 0.1) + (pro.pricePerHour * 0.05))}</span>
            </div>
            
            <div className="mb-6">
              <h3 className="text-gray-500 uppercase text-xs font-bold tracking-wider mb-2">Payment Method</h3>
              <div className="flex gap-2">
                <label className={`flex-1 border p-3 rounded text-center cursor-pointer font-medium text-sm transition ${paymentMethod === 'online' ? 'border-[#2874f0] bg-blue-50 text-[#2874f0]' : 'border-gray-200 text-gray-600'}`}>
                  <input type="radio" name="paymentMethod" value="online" checked={paymentMethod === 'online'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                  Pay Online
                </label>
                <label className={`flex-1 border p-3 rounded text-center cursor-pointer font-medium text-sm transition ${paymentMethod === 'cash' ? 'border-[#2874f0] bg-blue-50 text-[#2874f0]' : 'border-gray-200 text-gray-600'}`}>
                  <input type="radio" name="paymentMethod" value="cash" checked={paymentMethod === 'cash'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                  Pay via Cash
                </label>
              </div>
            </div>

            <p className="text-xs text-green-600 font-medium mb-6">Final price may vary based on actual work required.</p>

            <button 
              onClick={handleBooking}
              disabled={activeStep !== 3}
              className={`w-full py-3.5 rounded-sm font-semibold shadow-sm transition uppercase text-sm tracking-wider
                ${activeStep === 3 
                  ? "bg-[#fb641b] text-white hover:bg-[#f35200]" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"}
              `}
            >
              Confirm Booking
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
               <ShieldCheck size={16} /> 100% Safe and Secure Payments
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
