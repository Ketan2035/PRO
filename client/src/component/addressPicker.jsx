import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { MapPin, Navigation, Info, Lock } from "lucide-react";

export default function AddressPicker() {
  const navigate = useNavigate();
  const [coords, setCoords] = useState({ lat: 20.5937, lng: 78.9629 }); // Default to India
  const [address, setAddress] = useState("");
  const [loadingLoc, setLoadingLoc] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by your browser");
      setLoadingLoc(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoords({ lat, lng });

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );
          const data = await res.json();
          setAddress(data.display_name || "");
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingLoc(false);
        }
      },
      (error) => {
        console.warn("Unable to fetch location automatically.", error);
        toast("Please enter your address manually.", { icon: "📍" });
        setLoadingLoc(false);
      }
    );
  }, []);

  const sendAddress = async () => {
    if (!address.trim()) return toast.error("Address cannot be empty");
    setSubmitting(true);
    
    try {
      const res = await fetch("http://localhost:3000/api/user/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          address,
          lat: coords.lat,
          lng: coords.lng,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Address saved successfully");
        navigate(-1); // Go back to previous page
      } else {
        toast.error(data.message || "Failed to add address");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-16 pt-8 px-4">
      
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-6">
         <h1 className="text-2xl font-normal text-gray-900">Add a new address</h1>
      </div>

      <div className="max-w-2xl mx-auto bg-white border border-gray-300 rounded-[4px] shadow-sm overflow-hidden">
        
        {/* Amazon-style warning block */}
        <div className="bg-[#f3f9f8] border-b border-[#aed0ce] px-4 py-3 flex items-start gap-3">
           <Info className="text-[#007185] mt-0.5 flex-shrink-0" size={18} />
           <p className="text-[13px] text-gray-800 leading-snug">
             <strong>Save time.</strong> We auto-detect your location to fill in your address. Please verify the map pin and make any necessary corrections to the text box below.
           </p>
        </div>

        <div className="p-6">
          
          <div className="mb-6 border border-gray-200 rounded-sm overflow-hidden relative">
            {loadingLoc && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007185]"></div>
              </div>
            )}
            <div className="bg-gray-100 p-2 border-b border-gray-200 flex justify-between items-center text-sm">
               <span className="font-bold text-gray-700 flex items-center gap-1"><MapPin size={16}/> Service Location</span>
               <span className="text-gray-500 flex items-center gap-1"><Navigation size={14}/> GPS Detected</span>
            </div>
            <iframe
              title="map"
              width="100%"
              height="250"
              style={{ border: 0 }}
              loading="lazy"
              className="bg-gray-50"
              src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=16&output=embed`}
            ></iframe>
          </div>

          <div className="space-y-4">
             <div>
               <label className="block text-[13px] font-bold text-[#111] mb-1">Full Address</label>
               <textarea
                 value={address}
                 onChange={(e) => setAddress(e.target.value)}
                 rows={4}
                 placeholder="Flat, House no., Building, Company, Apartment"
                 className="w-full px-3 py-2 border border-[#a6a6a6] rounded-[3px] focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] transition text-sm leading-relaxed resize-none"
               />
               <p className="text-xs text-gray-500 mt-1">Make sure your address is accurate so our professionals can easily locate you.</p>
             </div>
             
             <div className="pt-4 mt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={sendAddress}
                  disabled={submitting || loadingLoc}
                  className="w-full sm:w-auto bg-[#f0c14b] border border-[#a88734_#9c7e31_#846a29] text-[#111] px-6 py-1.5 rounded-[3px] hover:bg-[#f4d078] active:bg-[#f0c14b] shadow-[0_1px_0_rgba(255,255,255,0.4)_inset] font-normal text-sm transition"
                >
                  {submitting ? "Saving..." : "Use this address"}
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="w-full sm:w-auto bg-transparent text-[#007185] hover:text-[#c45500] hover:underline px-4 py-1.5 font-normal text-sm transition"
                >
                  Cancel
                </button>
             </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 border-t border-gray-200 text-xs text-gray-500 flex items-center justify-center gap-1.5">
           <Lock size={14} /> Secure connection
        </div>
      </div>
    </div>
  );
}
