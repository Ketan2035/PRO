import React, { useState } from "react";
import "boxicons/css/boxicons.min.css";
import {Link} from "react-router-dom"


export default function Login({ isOpen, onClose }) {
  const [step, setStep] = useState("mobile"); // mobile → otp
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl w-[90%] max-w-md text-white relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-white hover:text-red-400"
          onClick={onClose}
        >
          <i className="bx bx-x text-2xl"></i>
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <i className="bx bx-log-in-circle"></i> Login
        </h2>

        {/* Step 1: Mobile */}
        {step === "mobile" && (
          <div className="flex flex-col gap-4">
            <label className="flex items-center bg-white/20 rounded-lg px-3 py-2">
              <i className="bx bx-phone text-xl text-gray-200"></i>
              <input
                type="tel"
                placeholder="Enter Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="bg-transparent flex-1 outline-none px-2 text-white placeholder-gray-300"
              />
            </label>
            <button
              onClick={() => setStep("otp")}
              className="bg-gradient-to-r from-purple-500 to-pink-500 py-2 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Get OTP
            </button>
            <div className="flex justify-end ">
                <span>
                    don't you have an account?  <Link to="/signup" classNmae="text-black">Do register</Link>
                </span>
            </div>
          </div>
        )}

        {/* Step 2: OTP */}
        {step === "otp" && (
          <div className="flex flex-col gap-4">
            <label className="flex items-center bg-white/20 rounded-lg px-3 py-2">
              <i className="bx bx-key text-xl text-gray-200"></i>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="bg-transparent flex-1 outline-none px-2 text-white placeholder-gray-300"
              />
            </label>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-green-500 to-teal-500 py-2 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Verify & Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
