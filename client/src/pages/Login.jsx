import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { ShieldCheck } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Logged in successfully!");
        localStorage.setItem("user", JSON.stringify(data.user));

        setTimeout(() => {
          if (location.state?.backgroundLocation) {
            navigate(location.state.backgroundLocation.pathname);
          } else {
            navigate(data.user.role === "professional" ? "/profile/pro" : "/");
          }
          window.location.reload();
        }, 1000);
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-10 font-sans px-4">
      
      {/* Logo */}
      <Link to="/" className="mb-6 flex flex-col items-center">
        <span className="text-3xl font-bold italic tracking-tight text-[#2874f0]">
          Urban<span className="text-yellow-500">Saathi</span>
        </span>
      </Link>

      {/* Login Card (Amazon Style) */}
      <div className="w-full max-w-[350px] bg-white border border-gray-300 rounded-[4px] p-6 shadow-sm">
        <h1 className="text-[28px] font-normal mb-4 text-[#111]">Sign in</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[13px] font-bold text-[#111] mb-1">Email or mobile phone number</label>
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
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[13px] font-bold text-[#111]">Password</label>
              <button type="button" onClick={() => toast("Password reset link sent to your email!", { icon: "📧" })} className="text-[13px] text-[#0066c0] hover:text-[#c45500] hover:underline">Forgot your password?</button>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border border-[#a6a6a6] rounded-[3px] focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] transition text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f0c14b] border border-[#a88734_#9c7e31_#846a29] text-[#111] py-[5px] rounded-[3px] hover:bg-[#f4d078] active:bg-[#f0c14b] shadow-[0_1px_0_rgba(255,255,255,0.4)_inset] font-normal text-sm transition mt-2"
          >
            {loading ? "Signing in..." : "Continue"}
          </button>
        </form>

        <p className="text-xs text-[#111] mt-4 leading-relaxed">
          By continuing, you agree to Urban Saathi's <Link to="/terms" className="text-[#0066c0] hover:text-[#c45500] hover:underline">Conditions of Use</Link> and <Link to="/privacy" className="text-[#0066c0] hover:text-[#c45500] hover:underline">Privacy Notice</Link>.
        </p>

        <Link to="/help" className="mt-6 flex items-center gap-2 group cursor-pointer">
           <ShieldCheck size={16} className="text-gray-500" />
           <span className="text-xs text-[#0066c0] group-hover:text-[#c45500] group-hover:underline font-medium">Need help?</span>
        </Link>
      </div>

      {/* Divider */}
      <div className="w-full max-w-[350px] mt-6 flex items-center justify-between text-xs text-gray-500">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="px-2 bg-gray-50">New to Urban Saathi?</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Create Account Buttons */}
      <div className="w-full max-w-[350px] mt-4 flex flex-col gap-2.5">
        <button
          onClick={() => navigate("/customer_signup")}
          className="w-full bg-[#e7e9ec] border border-[#adb1b8_#a2a6ac_#8d9096] text-[#111] py-1.5 rounded-[3px] hover:bg-[#dfe3e8] active:bg-[#d5d9df] shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] text-[13px] font-normal transition"
        >
          Create your Customer account
        </button>
        
        <button
          onClick={() => navigate("/pro_signup")}
          className="w-full bg-white border border-[#adb1b8_#a2a6ac_#8d9096] text-[#111] py-1.5 rounded-[3px] hover:bg-gray-50 active:bg-gray-100 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] text-[13px] font-normal transition"
        >
          Register as a Professional
        </button>
      </div>

      {/* Footer Links */}
      <div className="mt-10 border-t border-gray-200 w-full pt-8 pb-10 flex flex-col items-center bg-white shadow-[0_-2px_4px_rgba(0,0,0,0.02)]">
         <div className="flex gap-6 text-xs text-[#0066c0] mb-2">
           <Link to="/terms" className="hover:underline hover:text-[#c45500]">Conditions of Use</Link>
           <Link to="/privacy" className="hover:underline hover:text-[#c45500]">Privacy Notice</Link>
           <Link to="/help" className="hover:underline hover:text-[#c45500]">Help</Link>
         </div>
         <p className="text-[11px] text-[#555]">© 2024-2026, Urban Saathi.com, Inc. or its affiliates</p>
      </div>
    </div>
  );
}