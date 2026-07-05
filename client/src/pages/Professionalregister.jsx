import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ProRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mob: "",
    profession: "",
    experience: "",
    qualification: "",
    service_area: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/pro_signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Registered successfully!");
        localStorage.setItem("user", JSON.stringify(data.user));
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 1500);
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
      <div className="w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Partner with us</h2>
        <p className="text-gray-600 mb-8">Join the platform and grow your business today.</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name */}
          <div className="relative md:col-span-1">
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
          <div className="relative md:col-span-1">
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
          <div className="relative md:col-span-1">
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
          <div className="relative md:col-span-1">
            <input
              type="tel"
              name="mob"
              id="mob"
              placeholder=" "
              value={formData.mob}
              onChange={handleChange}
              required
              className="block px-4 pb-2.5 pt-5 w-full text-base text-gray-900 bg-gray-50 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
            />
            <label htmlFor="mob" className="absolute text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">
              Mobile Number
            </label>
          </div>

          {/* Profession */}
          <div className="relative md:col-span-1">
            <select
              name="profession"
              id="profession"
              value={formData.profession}
              onChange={handleChange}
              required
              className="block px-4 py-4 w-full text-base text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-black"
            >
              <option value="" disabled>Select Profession</option>
              <option value="Plumber">Plumber</option>
              <option value="Electrician">Electrician</option>
              <option value="Carpenter">Carpenter</option>
              <option value="Painter">Painter</option>
              <option value="Mechanic">Mechanic</option>
              <option value="Cleaner">Cleaner</option>
              <option value="AC Technician">AC Technician</option>
              <option value="RO Technician">RO Technician</option>
              <option value="Tutor">Tutor</option>
              <option value="Driver">Driver</option>
              <option value="Home Maid">Home Maid</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Experience */}
          <div className="relative md:col-span-1">
            <input
              type="number"
              name="experience"
              id="experience"
              placeholder=" "
              value={formData.experience}
              onChange={handleChange}
              required
              min="0"
              className="block px-4 pb-2.5 pt-5 w-full text-base text-gray-900 bg-gray-50 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
            />
            <label htmlFor="experience" className="absolute text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">
              Experience (Years)
            </label>
          </div>

          {/* Qualification */}
          <div className="relative md:col-span-1">
            <input
              type="text"
              name="qualification"
              id="qualification"
              placeholder=" "
              value={formData.qualification}
              onChange={handleChange}
              required
              className="block px-4 pb-2.5 pt-5 w-full text-base text-gray-900 bg-gray-50 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
            />
            <label htmlFor="qualification" className="absolute text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">
              Qualification (e.g. ITI, B.Tech)
            </label>
          </div>

          {/* Service Area */}
          <div className="relative md:col-span-1">
            <input
              type="text"
              name="service_area"
              id="service_area"
              placeholder=" "
              value={formData.service_area}
              onChange={handleChange}
              required
              className="block px-4 pb-2.5 pt-5 w-full text-base text-gray-900 bg-gray-50 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
            />
            <label htmlFor="service_area" className="absolute text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">
              Service Area City / Pincode
            </label>
          </div>

          {/* Bio */}
          <div className="relative md:col-span-2">
            <textarea
              name="bio"
              id="bio"
              placeholder=" "
              value={formData.bio}
              onChange={handleChange}
              required
              rows="3"
              className="block px-4 pb-2.5 pt-5 w-full text-base text-gray-900 bg-gray-50 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-black peer resize-none"
            ></textarea>
            <label htmlFor="bio" className="absolute text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">
              Short Bio
            </label>
          </div>

          <div className="md:col-span-2 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-lg font-medium text-lg hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register Now"}
            </button>
          </div>
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
