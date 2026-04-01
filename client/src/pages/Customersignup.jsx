import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function CustomerRegister() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    city: "",
    address: "",
    otp: "",
  });

  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Simulate sending OTP
  const sendOtp = () => {
    if (!formData.mobile) {
      alert("Please enter mobile number first.");
      return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setOtpSent(true);
    alert(`OTP Sent: ${otp} (demo only)`); // Real app → backend sends SMS/email
  };

  // Verify OTP
  const verifyOtp = () => {
    if (formData.otp === generatedOtp) {
      setOtpVerified(true);
      alert("✅ OTP Verified Successfully");
    } else {
      alert("❌ Invalid OTP");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otpVerified) {
      alert("Please verify OTP before registering.");
      return;
    }
    console.log("Customer Registered:", formData);
    // send to backend
  };

  return (
    <div className="min-h-screen inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white m-5 shadow-2xl rounded-2xl p-8 w-full max-w-5xl">
        {/* Header */}
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Create Account As a Customer
        </h2>
        <p className="text-center text-gray-500 mt-2">
          Join and start hiring professionals for your work
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 font-medium">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="Enter your email"
            />
          </div>

          {/* Mobile with OTP */}
          <div>
            <label className=" block text-gray-700 font-medium">Mobile Number</label>
            <div className="flex h-14 gap-2">
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                className="mt-1 w-full  px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
                placeholder="Enter your mobile number"
              />
              <button
                type="button"
                onClick={sendOtp}
                className="mt-1 text-center px-2 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 shadow-md"
              >
                Send OTP
              </button>
            </div>
          </div>

          {/* OTP */}
          {otpSent && (
            <div>
              <label className="block text-gray-700 font-medium">Enter OTP</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
                  placeholder="Enter 6-digit OTP"
                />
                <button
                  type="button"
                  onClick={verifyOtp}
                  className="mt-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-md"
                >
                  Verify
                </button>
              </div>
              {otpVerified && (
                <p className="text-green-600 text-sm mt-1">✅ OTP Verified</p>
              )}
            </div>
          )}

          {/* City */}
          <div>
            <label className="block text-gray-700 font-medium">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="Enter your city"
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              required
              className="mt-1 w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="Enter full address"
            ></textarea>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="Create a password"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="Re-enter your password"
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={!otpVerified}
              className={`w-full py-3 rounded-xl font-semibold transition shadow-lg ${
                otpVerified
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Register
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-600 font-medium hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
