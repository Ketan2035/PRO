import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ProRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mob_no: "",
    profession: "",
    experience: "",
    bio: "",
    pricePerHour: "",
    service_area: "",
    qualification: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setProfileImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (profileImage) data.append("profileImage", profileImage);

      const res = await fetch("http://localhost:3000/api/pro_signup", {
        method: "POST",
        body: data, // No Content-Type header for FormData!
      });

      const resData = await res.json();
      if (res.ok) {
        toast.success("Professional account created successfully!");
        navigate("/login");
      } else {
        toast.error(resData.message || "Failed to register");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-8 font-sans px-4 pb-16">
      
      {/* Header */}
      <Link to="/" className="mb-4 flex flex-col items-center">
        <span className="text-3xl font-bold tracking-tight text-[#2874f0] italic">
          Urban<span className="text-yellow-500">Saathi</span>
        </span>
        <span className="text-sm font-semibold text-gray-700 tracking-widest uppercase mt-1">Professional Hub</span>
      </Link>

      <div className="w-full max-w-[600px] bg-white border border-gray-300 rounded-[4px] p-6 shadow-sm">
        <h1 className="text-[28px] font-normal mb-1 text-[#111]">Register as a Professional</h1>
        <p className="text-[13px] text-gray-600 mb-6 border-b pb-4">Join thousands of professionals earning on Urban Saathi.</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-[#111] mb-1">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-1.5 border border-[#a6a6a6] rounded-[3px] focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] transition text-sm" required />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#111] mb-1">Mobile Number</label>
              <input type="tel" name="mob_no" value={formData.mob_no} onChange={handleChange} className="w-full px-3 py-1.5 border border-[#a6a6a6] rounded-[3px] focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] transition text-sm" required />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-[#111] mb-1">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-1.5 border border-[#a6a6a6] rounded-[3px] focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] transition text-sm" required />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#111] mb-1">Password</label>
              <input type="password" name="password" placeholder="At least 6 characters" value={formData.password} onChange={handleChange} className="w-full px-3 py-1.5 border border-[#a6a6a6] rounded-[3px] focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] transition text-sm" required />
            </div>
          </div>

          <div className="border-t border-gray-200 mt-2 pt-4">
             <h3 className="font-bold text-[15px] mb-3 text-[#111]">Professional Details</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-[#111] mb-1">Profession (e.g. Plumber)</label>
              <input type="text" name="profession" value={formData.profession} onChange={handleChange} className="w-full px-3 py-1.5 border border-[#a6a6a6] rounded-[3px] focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] transition text-sm" required />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#111] mb-1">Experience (Years)</label>
              <input type="number" name="experience" value={formData.experience} onChange={handleChange} className="w-full px-3 py-1.5 border border-[#a6a6a6] rounded-[3px] focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] transition text-sm" required />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-[#111] mb-1">Base Price / Hour (₹)</label>
              <input type="number" name="pricePerHour" value={formData.pricePerHour} onChange={handleChange} className="w-full px-3 py-1.5 border border-[#a6a6a6] rounded-[3px] focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] transition text-sm" required />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#111] mb-1">Service Area / City</label>
              <input type="text" name="service_area" value={formData.service_area} onChange={handleChange} className="w-full px-3 py-1.5 border border-[#a6a6a6] rounded-[3px] focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] transition text-sm" required />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#111] mb-1">Short Bio / About You</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" className="w-full px-3 py-1.5 border border-[#a6a6a6] rounded-[3px] focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] transition text-sm" required></textarea>
          </div>
          
          <div>
            <label className="block text-[13px] font-bold text-[#111] mb-1">Profile Photo (Optional)</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full px-3 py-1.5 border border-[#a6a6a6] rounded-[3px] bg-gray-50 text-sm" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f0c14b] border border-[#a88734_#9c7e31_#846a29] text-[#111] py-2 rounded-[3px] hover:bg-[#f4d078] active:bg-[#f0c14b] shadow-[0_1px_0_rgba(255,255,255,0.4)_inset] font-normal text-sm transition mt-4"
          >
            {loading ? "Registering..." : "Create your Professional account"}
          </button>
        </form>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
           <p className="text-[13px] text-[#111] text-center">
             Already have an account? <Link to="/login" className="text-[#0066c0] hover:text-[#c45500] hover:underline">Sign in</Link>
           </p>
        </div>
      </div>
      
    </div>
  );
};

export default ProRegister;
