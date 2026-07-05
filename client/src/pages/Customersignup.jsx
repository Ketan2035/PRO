import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function CustomerRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    city: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/customer_signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Registration successful");
        localStorage.setItem("user", JSON.stringify(data.user));
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 1000);
      } else {
        const errorMsg = data.errors?.[0]?.message || data.message || "Registration failed";
        toast.error(errorMsg);
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-lg">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Customer Account</h2>
        <p className="text-gray-600 mb-8">Join and start hiring professionals near you.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="relative">
            <input
              type="text"
              name="name"
              id="name"
              placeholder=" "
              value={formData.name}
              onChange={handleChange}
              required
              className="block px-4 pb-2.5 pt-5 w-full text-base text-gray-900 bg-gray-50 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
            />
            <label htmlFor="name" className="absolute text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">
              Full Name
            </label>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              id="email"
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
              required
              className="block px-4 pb-2.5 pt-5 w-full text-base text-gray-900 bg-gray-50 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
            />
            <label htmlFor="email" className="absolute text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">
              Email Address
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              name="password"
              id="password"
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
              required
              className="block px-4 pb-2.5 pt-5 w-full text-base text-gray-900 bg-gray-50 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
            />
            <label htmlFor="password" className="absolute text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">
              Password
            </label>
          </div>

          {/* Mobile */}
          <div className="relative">
            <input
              type="tel"
              name="mobile"
              id="mobile"
              placeholder=" "
              value={formData.mobile}
              onChange={handleChange}
              required
              className="block px-4 pb-2.5 pt-5 w-full text-base text-gray-900 bg-gray-50 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
            />
            <label htmlFor="mobile" className="absolute text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">
              Mobile Number
            </label>
          </div>

          {/* City */}
          <div className="relative">
            <input
              type="text"
              name="city"
              id="city"
              placeholder=" "
              value={formData.city}
              onChange={handleChange}
              required
              className="block px-4 pb-2.5 pt-5 w-full text-base text-gray-900 bg-gray-50 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
            />
            <label htmlFor="city" className="absolute text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">
              City
            </label>
          </div>

          {/* Address */}
          <div className="relative">
            <textarea
              name="address"
              id="address"
              placeholder=" "
              value={formData.address}
              onChange={handleChange}
              required
              rows="3"
              className="block px-4 pb-2.5 pt-5 w-full text-base text-gray-900 bg-gray-50 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-black peer resize-none"
            ></textarea>
            <label htmlFor="address" className="absolute text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">
              Full Address
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-lg font-medium text-lg hover:bg-gray-800 transition disabled:opacity-50 mt-4"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
          Already have an account?{" "}
          <Link to="/login" className="text-black font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
