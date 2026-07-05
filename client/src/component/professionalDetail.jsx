import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Star, MapPin, ShieldCheck, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const ProfessionalDetail = () => {
  const { id } = useParams();
  const [pro, setPro] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/api/professionals/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPro(data.user);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });

    fetch(`http://localhost:3000/api/reviews/professional/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setReviews(data.reviews);
        }
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleBookNow = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.error("Please login to book a service");
      navigate("/login", { state: { backgroundLocation: location } });
      return;
    }
    navigate(`/checkout/${pro._id}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2874f0]"></div>
    </div>
  );

  if (!pro) return <div className="text-center mt-20 text-2xl font-bold">Professional Not Found</div>;

  return (
    <div className="min-h-screen bg-white font-sans pb-16">
      
      {/* Breadcrumbs (Amazon Style) */}
      <div className="max-w-7xl mx-auto px-4 py-3 text-xs text-gray-500">
        <Link to="/" className="hover:underline hover:text-[#2874f0]">Home</Link> &rsaquo; 
        <span className="mx-1">Professionals</span> &rsaquo; 
        <span className="mx-1 text-[#2874f0] capitalize">{pro.profession}</span> &rsaquo; 
        <span className="mx-1 font-semibold text-gray-700">{pro.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-8 mt-2">
        
        {/* LEFT COLUMN: Image Gallery (Product View) */}
        <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-4">
          <div className="border border-gray-200 rounded-sm overflow-hidden bg-white p-2 flex justify-center items-center h-80 sticky top-24">
            <img
              src={pro.profileImage?.url || `https://ui-avatars.com/api/?name=${pro.name}&background=random&size=400`}
              alt={pro.name}
              className="w-full h-full object-cover rounded-sm shadow-sm"
            />
          </div>
          {pro.workImages?.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {pro.workImages.map((img, i) => (
                <img key={i} src={img.url} alt="" className="w-16 h-16 border border-gray-200 rounded-sm object-cover cursor-pointer hover:border-[#2874f0]" />
              ))}
            </div>
          )}
        </div>

        {/* MIDDLE COLUMN: Details & Description */}
        <div className="md:col-span-5 lg:col-span-6">
          <h1 className="text-2xl md:text-3xl font-normal text-black leading-tight mb-1">{pro.name}</h1>
          
          {/* Ratings */}
          <div className="flex items-center gap-4 mt-2 border-b border-gray-200 pb-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className={i < Math.floor(pro.rating || 4.5) ? "text-[#FFA41C] fill-[#FFA41C]" : "text-gray-300"} />
              ))}
              <span className="text-sm text-[#007185] ml-2 hover:underline cursor-pointer">{pro.totalReviews || reviews.length || 24} ratings</span>
            </div>
          </div>

          {/* Key Features (Amazon style bullets) */}
          <div className="py-4 border-b border-gray-200">
             <div className="flex items-center gap-2 mb-2 text-sm text-gray-800 font-medium">
               <ShieldCheck className="text-green-600" size={18} /> Verified & Background Checked
             </div>
             <ul className="list-disc pl-5 text-sm text-gray-800 space-y-1.5 mt-3">
                <li><span className="font-semibold">Specialization:</span> Expert {pro.profession} with extensive training.</li>
                <li><span className="font-semibold">Experience:</span> Over {pro.experience} years of hands-on experience in the field.</li>
                <li><span className="font-semibold">Qualification:</span> {pro.qualification || "Professionally certified and licensed."}</li>
                <li><span className="font-semibold">Service Area:</span> Covers {pro.address?.city || pro.service_area} and surrounding regions.</li>
             </ul>
          </div>

          {/* About / Bio */}
          <div className="py-4">
             <h3 className="font-bold text-gray-900 mb-2">About this professional</h3>
             <p className="text-sm text-gray-700 leading-relaxed">{pro.bio || "Dedicated professional providing top-notch services. Customer satisfaction and quality work are the highest priorities. Equipped with modern tools and adhering to safety standards."}</p>
          </div>

        </div>

        {/* RIGHT COLUMN: The "Buy Box" */}
        <div className="md:col-span-3 lg:col-span-3">
           <div className="border border-gray-300 rounded-lg p-4 shadow-sm sticky top-24">
              <h2 className="text-3xl font-medium text-black">
                <span className="text-sm align-top">₹</span>{pro.pricePerHour}
                <span className="text-sm font-normal text-gray-500"> / hour</span>
              </h2>
              
              <div className="mt-4 mb-4">
                <div className="flex items-start gap-2 text-sm text-[#007185] mb-2">
                  <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                  <span>Serving in {pro.address?.city || pro.service_area}</span>
                </div>
                {pro.isAvailable !== false ? (
                  <h4 className="text-[#007600] font-medium text-lg">In Stock (Available)</h4>
                ) : (
                  <h4 className="text-[#B12704] font-medium text-lg">Currently Unavailable</h4>
                )}
                
                <p className="text-sm text-gray-700 mt-2">
                  Working Hours: <b>{pro.workingHours?.start || "09:00 AM"} - {pro.workingHours?.end || "07:00 PM"}</b>
                </p>
              </div>

              <button
                onClick={handleBookNow}
                disabled={pro.isAvailable === false}
                className={`w-full py-2.5 rounded-full font-medium text-sm shadow-sm transition mt-2
                  ${pro.isAvailable !== false 
                    ? "bg-[#FFD814] hover:bg-[#F7CA00] text-black border border-[#FCD200]" 
                    : "bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300"
                  }`}
              >
                {pro.isAvailable !== false ? "Book Now" : "Out of schedule"}
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-1 text-xs text-gray-500">
                <ShieldCheck size={14} /> Secure transaction
              </div>
              
              <div className="mt-4 text-xs text-gray-600">
                <div className="flex justify-between py-1"><span>Platform</span><span>Urban Saathi</span></div>
                <div className="flex justify-between py-1"><span>Provided by</span><span className="text-[#007185]">{pro.name}</span></div>
              </div>
           </div>
        </div>
      </div>

      <hr className="my-10 border-gray-200" />

      {/* CUSTOMER REVIEWS (Amazon Style Layout) */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Review Summary */}
        <div className="md:col-span-4 lg:col-span-3">
          <h2 className="text-xl font-bold mb-2">Customer reviews</h2>
          <div className="flex items-center gap-2 mb-2">
             <div className="flex">
               {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className={i < Math.floor(pro.rating || 4.5) ? "text-[#FFA41C] fill-[#FFA41C]" : "text-gray-300"} />
                ))}
             </div>
             <span className="text-lg font-medium">{pro.rating || "4.5"} out of 5</span>
          </div>
          <p className="text-sm text-gray-500 mb-6">{pro.totalReviews || reviews.length || 24} global ratings</p>
          
          {/* Progress Bars */}
          {[5,4,3,2,1].map(star => (
            <div key={star} className="flex items-center gap-3 text-sm text-[#007185] hover:underline cursor-pointer mb-2">
              <span className="w-12 text-right">{star} star</span>
              <div className="flex-1 h-4 bg-gray-200 rounded-sm border border-gray-300 overflow-hidden">
                <div className="h-full bg-[#FFA41C]" style={{ width: star === 5 ? '60%' : star === 4 ? '25%' : star === 3 ? '10%' : '5%' }}></div>
              </div>
              <span className="w-8">{star === 5 ? '60%' : star === 4 ? '25%' : star === 3 ? '10%' : '5%'}</span>
            </div>
          ))}
        </div>

        {/* Review List */}
        <div className="md:col-span-8 lg:col-span-9">
          <h3 className="font-bold text-lg mb-4">Top reviews from India</h3>
          
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-sm italic">Be the first to review this professional.</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((rev) => (
                <div key={rev._id} className="pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <img
                      src={rev.customer?.profileImage?.url || `https://ui-avatars.com/api/?name=${rev.customer?.name || "User"}&background=random`}
                      alt="user"
                      className="w-8 h-8 rounded-full border border-gray-200"
                    />
                    <span className="text-sm font-medium text-gray-900">{rev.customer?.name || "Amazon Customer"}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < (rev.rating || 5) ? "text-[#FFA41C] fill-[#FFA41C]" : "text-gray-300"} />
                      ))}
                    </div>
                    <span className="font-bold text-sm text-gray-900">Excellent Service</span>
                  </div>
                  
                  <p className="text-xs text-gray-500 mb-2">Reviewed in India on {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  <p className="text-xs font-bold text-[#c45500] mb-2 flex items-center gap-1"><CheckCircle2 size={12}/> Verified Booking</p>
                  
                  {rev.comment && <p className="text-sm text-gray-800 leading-normal mb-3">{rev.comment}</p>}
                  
                  <p className="text-xs text-gray-500">12 people found this helpful</p>
                  <div className="flex gap-3 mt-2">
                    <button className="border border-gray-300 rounded-sm px-4 py-1 text-sm font-medium hover:bg-gray-50">Helpful</button>
                    <button className="text-sm text-gray-500 hover:underline border-l pl-3">Report abuse</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDetail;
