import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, Star, Navigation, Zap, Droplets, Paintbrush, Scissors, Wind, PenTool, ShieldCheck, Clock, Award } from "lucide-react";
import MapModal from "../components/MapModal";

const CATEGORIES = [
  { name: "Cleaning", icon: <SprayCanIcon className="text-[#2874f0]" />, query: "clean" },
  { name: "Electrician", icon: <Zap className="text-yellow-500" />, query: "electric" },
  { name: "Plumbing", icon: <Droplets className="text-blue-500" />, query: "plumb" },
  { name: "Salon", icon: <Scissors className="text-pink-500" />, query: "salon" },
  { name: "Painting", icon: <Paintbrush className="text-orange-500" />, query: "paint" },
  { name: "AC Repair", icon: <Wind className="text-teal-500" />, query: "ac" },
  { name: "Carpentry", icon: <PenTool className="text-amber-700" />, query: "carpent" },
];

function SprayCanIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3h.01"/><path d="M7 3h.01"/><path d="M11 3h.01"/><path d="M3 7h.01"/><path d="M7 7h.01"/><path d="M11 7h.01"/><rect width="4" height="4" x="15" y="5" rx="1"/><path d="m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2"/><path d="m13 14-3-3"/><path d="M11 16 6 11"/>
    </svg>
  );
}

const Home = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState(null); // { lat, lng }
  const [locationName, setLocationName] = useState("");
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const banners = ["/banners/banner1.png", "/banners/banner2.png"];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async (lat, lng, query) => {
    setLoading(true);
    try {
      let url = "http://localhost:3000/api/professionals";
      if (lat && lng) {
        url = `http://localhost:3000/api/search/nearby?lat=${lat}&lng=${lng}`;
        if (query) url += `&profession=${query}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setProfessionals(data.data || data.professionals || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (location) {
      fetchProfessionals(location.lat, location.lng, search);
    } else {
      const filtered = professionals.filter((pro) =>
        pro.profession.toLowerCase().includes(search.toLowerCase())
      );
      setProfessionals(filtered);
    }
  };

  const handleLocationSelect = async (loc) => {
    setLocation(loc);
    setIsMapOpen(false);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${loc.lat}&lon=${loc.lng}`);
      const data = await res.json();
      setLocationName(data.address?.city || data.address?.town || data.address?.suburb || "Selected Location");
    } catch (err) {
      setLocationName("Selected Location");
    }
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => handleLocationSelect({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => alert("Location access denied. Please select manually.")
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans pb-10">
      {/* 1. Category Quick Links (Flipkart mobile style) */}
      <div className="bg-white shadow-sm mb-2 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between min-w-max gap-8">
          {CATEGORIES.map((cat, i) => (
            <div key={i} className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => { setSearch(cat.query); handleSearch(); }}>
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition shadow-sm border border-gray-100">
                {React.cloneElement(cat.icon, { size: 28 })}
              </div>
              <span className="text-xs font-medium text-gray-700 group-hover:text-[#2874f0]">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Location & Search Bar (Visible clearly on mobile, extra search on desktop) */}
      <div className="max-w-7xl mx-auto px-2 md:px-4 mb-4">
        <div className="bg-white p-3 rounded-sm shadow-sm flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center bg-gray-100 rounded-sm px-3 py-2 border border-transparent focus-within:border-[#2874f0] transition">
            <Search size={18} className="text-gray-500 mr-2" />
            <input 
              type="text" 
              placeholder="Search for 'Plumber' or 'Cleaner'..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none w-full text-sm text-gray-800"
            />
          </div>
          <div className="flex-1 flex items-center bg-gray-100 rounded-sm px-3 py-2 border border-transparent focus-within:border-[#2874f0] transition relative">
            <MapPin size={18} className="text-gray-500 mr-2" />
            <input 
              type="text" 
              placeholder="Select your location" 
              value={locationName}
              readOnly
              onClick={() => setIsMapOpen(true)}
              className="bg-transparent outline-none w-full text-sm text-gray-800 cursor-pointer"
            />
            <button onClick={getCurrentLocation} className="absolute right-3 text-[#2874f0] hover:text-blue-700" title="Use GPS">
              <Navigation size={18} />
            </button>
          </div>
          <button onClick={handleSearch} className="bg-[#2874f0] text-white px-8 py-2 font-medium rounded-sm hover:bg-blue-700 transition shadow-sm">
            Find Experts
          </button>
        </div>
      </div>

      <MapModal isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} onSelectLocation={handleLocationSelect} />

      {/* 3. Hero Carousel Banner */}
      <div className="max-w-7xl mx-auto px-2 md:px-4 mb-6">
        <div className="relative w-full h-[180px] md:h-[350px] overflow-hidden rounded-sm shadow-sm bg-gray-200 group">
          {banners.map((img, idx) => (
            <img 
              key={idx} 
              src={img} 
              alt={`Banner ${idx}`} 
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${idx === currentSlide ? "opacity-100" : "opacity-0"}`} 
            />
          ))}
          {/* Navigation Dots */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
            {banners.map((_, idx) => (
              <div key={idx} className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? "bg-white w-4" : "bg-white/50"}`} />
            ))}
          </div>
        </div>
      </div>

      {/* 4. Trust Badges (Like Flipkart/Amazon promises) */}
      <div className="max-w-7xl mx-auto px-2 md:px-4 mb-6">
        <div className="bg-white p-4 rounded-sm shadow-sm flex flex-wrap items-center justify-between gap-4 text-sm font-medium text-gray-700">
          <div className="flex items-center gap-2"><ShieldCheck className="text-green-500" size={20} /> Verified Professionals</div>
          <div className="flex items-center gap-2"><Clock className="text-blue-500" size={20} /> On-Time Service Guarantee</div>
          <div className="flex items-center gap-2"><Award className="text-yellow-500" size={20} /> Premium Quality Work</div>
        </div>
      </div>

      {/* 5. Recommended Professionals (Product Grid) */}
      <div className="max-w-7xl mx-auto px-2 md:px-4">
        <div className="bg-white rounded-sm shadow-sm p-4 md:p-6 border-t-[3px] border-[#2874f0]">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Top Rated Professionals Near You</h2>
            <button className="bg-[#2874f0] text-white px-4 py-2 text-sm font-medium rounded-sm hover:bg-blue-700 shadow-sm transition">
              View All
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2874f0]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {professionals.length > 0 ? shuffleArray(professionals).slice(0, 8).map((pro) => (
                <div key={pro._id} onClick={() => navigate(`/profile/${pro._id}`)} className="group cursor-pointer border border-gray-200 rounded-sm hover:shadow-lg transition bg-white flex flex-col h-full">
                  {/* Card Header / Image */}
                  <div className="relative w-full h-48 bg-gray-100 overflow-hidden flex items-center justify-center p-4">
                    <img
                      src={pro.profileImage?.url || `https://ui-avatars.com/api/?name=${pro.name}&background=random&size=200`}
                      alt={pro.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 transition duration-300"
                    />
                    {/* Badge */}
                    <div className="absolute top-2 right-2 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-sm flex items-center gap-1">
                      <ShieldCheck size={12} /> Verified
                    </div>
                  </div>
                  
                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-lg text-gray-900 truncate group-hover:text-[#2874f0] transition">{pro.name}</h3>
                    <p className="text-sm text-gray-500 font-medium truncate mb-2">{pro.profession}</p>
                    
                    <div className="flex items-center gap-2 mb-3 text-xs">
                      <div className="bg-green-600 text-white px-1.5 py-0.5 rounded-sm font-bold flex items-center gap-1">
                        {pro.rating || "4.5"} <Star size={10} fill="currentColor" />
                      </div>
                      <span className="text-gray-500">({Math.floor(Math.random() * 200) + 15} reviews)</span>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-4 truncate">
                      <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">{pro.address?.city || "Local"}</span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-end justify-between">
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Starting at</p>
                        <p className="text-xl font-bold text-gray-900">₹{pro.pricePerHour || 499}</p>
                      </div>
                      <button className="bg-yellow-400 text-black px-4 py-2 font-medium rounded-sm hover:bg-yellow-500 transition shadow-sm text-sm">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-16 text-center">
                  <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Search size={40} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">No professionals found</h3>
                  <p className="text-gray-500 mt-2">Try searching for a different service or selecting a broader location.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
