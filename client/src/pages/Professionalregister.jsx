import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProRegister() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mob: "",
    profession: "",
    experience: "",
    qualification: "",
    service_area: "",
    bio: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = () => {
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    alert("OTP Verified!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending:", formData);

    const res = await fetch("http://localhost:5000/api/pro_signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Registered successfully!");
      setTimeout(() => {
        navigate("/");
      }, 1500); // 1.5 sec delay
    }
    console.log(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white m-6 rounded-2xl shadow-xl w-full max-w-5xl p-10">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Register as a Professional
        </h2>
        <p className="text-center text-gray-600 mt-2">
          Create your profile and start getting clients today.
        </p>

        <form
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={handleSubmit}
        >
          {/* Full Name */}
          <div>
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="example@email.com"
            />
          </div>

          {/* Mobile Number + OTP */}
          <div className="">
            <label className="block text-gray-700">Mobile Number</label>
            <div className="flex gap-3 mt-1">
              <input
                type="tel"
                name="mob"
                value={formData.mob}
                onChange={handleChange}
                className="w-full  border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="+91 9876543210"
              />
              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Send OTP
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Verify OTP
                </button>
              )}
            </div>
            {otpSent && (
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full mt-3 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter OTP"
              />
            )}
          </div>

          {/* Profession */}
          <div>
            <label className="block text-gray-700">Profession</label>
            <select
              className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-green-500"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
            >
              <option>Select Profession</option>
              <option>Doctor</option>
              <option>Lawyer</option>
              <option>Plumber</option>
              <option>Tutor</option>
              <option>Electrician</option>
              <option>Other</option>
            </select>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-gray-700">Experience (Years)</label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g. 5"
            />
          </div>

          {/* Qualification */}
          <div>
            <label className="block text-gray-700">Qualification</label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g. MBBS, ITI, B.Tech"
            />
          </div>

          {/* Service Area */}
          <div>
            <label className="block text-gray-700">
              Service Area / Pincode
            </label>
            <input
              type="text"
              name="service_area"
              value={formData.service_area}
              onChange={handleChange}
              className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g. 560001"
            />
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <label className="block text-gray-700">Short Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-green-500"
              rows="3"
              placeholder="Tell clients about your experience and services..."
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700"
            >
              Register Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
