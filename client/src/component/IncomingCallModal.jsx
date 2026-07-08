import { useState, useEffect } from "react";
import { socket } from "../socket";
import { Phone, PhoneOff, Clock } from "lucide-react";

export default function IncomingCallModal() {
  const [incomingRequest, setIncomingRequest] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    const handleIncoming = (request) => {
      setIncomingRequest(request);
      setTimeLeft(30);
    };

    const handleTimeout = (data) => {
      if (incomingRequest && incomingRequest._id === data.reqId) {
        setIncomingRequest(null);
      }
    };

    const handleCancel = (data) => {
      if (incomingRequest && incomingRequest._id === data.reqId) {
        setIncomingRequest(null);
      }
    };

    socket.on("incoming_booking_ring", handleIncoming);
    socket.on("instant_booking_timeout", handleTimeout);
    socket.on("cancel_incoming_ring", handleCancel);

    // Audio setup
    const audio = new Audio("https://actions.google.com/sounds/v1/alarms/phone_ringing.ogg");
    audio.loop = true;

    if (incomingRequest) {
      audio.play().catch(e => console.log("Audio play failed due to browser policy:", e));
    }

    return () => {
      socket.off("incoming_booking_ring", handleIncoming);
      socket.off("instant_booking_timeout", handleTimeout);
      socket.off("cancel_incoming_ring", handleCancel);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [incomingRequest]);

  useEffect(() => {
    let timer;
    if (incomingRequest && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Auto-hide when timeout reaches 0
      setIncomingRequest(null);
    }
    return () => clearInterval(timer);
  }, [incomingRequest, timeLeft]);

  const handleAccept = () => {
    if (!incomingRequest) return;
    socket.emit("accept_instant_booking", { reqId: incomingRequest._id });
    setIncomingRequest(null);
    // Booking will be created by customer and appear in the dashboard shortly
  };

  const handleReject = () => {
    if (!incomingRequest) return;
    socket.emit("reject_instant_booking", { reqId: incomingRequest._id });
    setIncomingRequest(null);
  };

  if (!incomingRequest) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header Ringing Animation */}
        <div className="bg-[#172337] text-white p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/20 animate-pulse"></div>
          
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center relative z-10 mb-4 animate-bounce">
            <Phone size={32} className="text-blue-400" />
            <div className="absolute inset-0 border-4 border-blue-400/50 rounded-full animate-ping"></div>
          </div>
          
          <h2 className="text-xl font-bold z-10 text-center">Incoming Job Request</h2>
          <p className="text-blue-200 z-10 text-sm mt-1 text-center">Customer needs you right now!</p>
        </div>

        {/* Request Details */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
            <div>
               <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Customer</p>
               <p className="font-semibold text-gray-900">{incomingRequest.customerName}</p>
            </div>
            <div className="text-right">
               <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Estimated Value</p>
               <p className="font-bold text-green-600 text-lg">₹{incomingRequest.price}</p>
            </div>
          </div>
          
          <div className="mb-4">
             <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Service Requested</p>
             <p className="font-medium text-gray-800 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-sm inline-block">
               {incomingRequest.service}
             </p>
          </div>
          
          <div className="mb-6">
             <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Location</p>
             <p className="text-sm text-gray-700 leading-relaxed">{incomingRequest.address}</p>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-red-500 font-bold mb-6 bg-red-50 py-2 rounded-sm border border-red-100">
            <Clock size={18} className="animate-pulse" />
            <span>Time Remaining: {timeLeft}s</span>
          </div>

          <div className="flex gap-4">
             <button 
               onClick={handleReject}
               className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-md hover:bg-gray-200 transition flex items-center justify-center gap-2"
             >
               <PhoneOff size={18} /> Reject
             </button>
             <button 
               onClick={handleAccept}
               className="flex-1 py-3 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 shadow-[0_0_15px_rgba(34,197,94,0.4)] transition flex items-center justify-center gap-2"
             >
               <Phone size={18} /> Accept Job
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
