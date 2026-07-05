import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Info } from "lucide-react";

const CustomerRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mob_no: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/customer_signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Account created successfully!");
        navigate("/login");
      } else {
        toast.error(data.message || "Failed to register");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-8 font-sans px-4">
      
      {/* Logo */}
      <Link to="/" className="mb-4 flex flex-col items-center">
        <span className="text-3xl font-bold italic tracking-tight text-[#2874f0]">
          Urban<span className="text-yellow-500">Saathi</span>
        </span>
      </Link>

      {/* Register Card (Amazon Style) */}
      <div className="w-full max-w-[350px] bg-white border border-gray-300 rounded-[4px] p-6 shadow-sm">
        <h1 className="text-[28px] font-normal mb-4 text-[#111]">Create account</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-[13px] font-bold text-[#111] mb-1">Your name</label>
            <input
              type="text"
              name="name"
              placeholder="First and last name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border border-[#a6a6a6] rounded-[3px] focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] transition text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#111] mb-1">Mobile number</label>
            <div className="flex">
               <span className="bg-gray-100 border border-r-0 border-[#a6a6a6] rounded-l-[3px] px-3 py-1.5 text-[13px] text-gray-700 flex items-center shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]">
                 IN +91
               </span>
               <input
                 type="tel"
                 name="mob_no"
                 placeholder="Mobile number"
                 value={formData.mob_no}
                 onChange={handleChange}
                 className="flex-1 px-3 py-1.5 border border-[#a6a6a6] rounded-r-[3px] focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] transition text-sm"
                 required
               />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#111] mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border border-[#a6a6a6] rounded-[3px] focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] transition text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#111] mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border border-[#a6a6a6] rounded-[3px] focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] transition text-sm"
              required
            />
            <div className="flex gap-1.5 mt-1 items-start text-xs text-gray-600">
               <Info size={14} className="mt-0.5 flex-shrink-0 text-[#007185]"/>
               <span>Passwords must be at least 6 characters.</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f0c14b] border border-[#a88734_#9c7e31_#846a29] text-[#111] py-[5px] rounded-[3px] hover:bg-[#f4d078] active:bg-[#f0c14b] shadow-[0_1px_0_rgba(255,255,255,0.4)_inset] font-normal text-sm transition mt-3"
          >
            {loading ? "Creating..." : "Continue"}
          </button>
        </form>

        <p className="text-[12px] text-[#111] mt-4 leading-relaxed">
          By creating an account, you agree to Urban Saathi's <Link to="/terms" className="text-[#0066c0] hover:text-[#c45500] hover:underline">Conditions of Use</Link> and <Link to="/privacy" className="text-[#0066c0] hover:text-[#c45500] hover:underline">Privacy Notice</Link>.
        </p>

        <div className="mt-6 pt-4 border-t border-gray-100 border-b border-b-gray-100 pb-4">
           <p className="text-[13px] text-[#111]">
             Already have an account? <Link to="/login" className="text-[#0066c0] hover:text-[#c45500] hover:underline flex items-center group">Sign in <span className="ml-1 text-[10px] group-hover:text-[#c45500]">&#9654;</span></Link>
           </p>
        </div>
      </div>
      
      {/* Footer Links */}
      <div className="mt-10 border-t border-gray-200 w-full max-w-4xl mx-auto pt-8 pb-10 flex flex-col items-center bg-transparent">
         <div className="flex gap-6 text-xs text-[#0066c0] mb-2">
           <Link to="/terms" className="hover:underline hover:text-[#c45500]">Conditions of Use</Link>
           <Link to="/privacy" className="hover:underline hover:text-[#c45500]">Privacy Notice</Link>
           <Link to="/help" className="hover:underline hover:text-[#c45500]">Help</Link>
         </div>
         <p className="text-[11px] text-[#555]">© 2024-2026, Urban Saathi.com, Inc. or its affiliates</p>
      </div>
    </div>
  );
};

export default CustomerRegister;
