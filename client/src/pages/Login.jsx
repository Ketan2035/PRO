import React, { useState } from "react";
import "boxicons/css/boxicons.min.css";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login({ isOpen, onClose }) {
  const [step, setStep] = useState("mobile");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const sendmail = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Error sending OTP");
        return;
      }

      toast.success("OTP sent successfully");
      setStep("otp");
    } catch (err) {
      console.log(err);
      alert("Server error ketan");
    }
  };

  const verifyOTP = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("OTP verified");
        localStorage.setItem("user", JSON.stringify(data.user));
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 1000);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-[90%] max-w-md text-black relative border border-gray-200">
        <button
          className="absolute top-3 right-3 text-black hover:text-gray-600"
          onClick={() => navigate("/")}
        >
          <i className="bx bx-x text-2xl"></i>
        </button>

        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <i className="bx bx-log-in-circle"></i> Login
        </h2>

        {step === "mobile" && (
          <div className="flex flex-col gap-4">
            <label className="flex items-center bg-gray-100 rounded-lg px-3 py-2 border border-gray-300">
              <i className="bx bx-envelope text-xl text-gray-500"></i>
              <input
                type="email"
                placeholder="Enter Email here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent flex-1 outline-none px-2 text-black placeholder-gray-500"
              />
            </label>

            <button
              onClick={sendmail}
              className="bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Get OTP
            </button>

            <div className="flex justify-end text-sm">
              <span>
                Don’t have an account?{" "}
                <button
                  onClick={() => navigate("/role")}
                  className="text-black font-semibold underline"
                >
                  Register
                </button>
              </span>
            </div>
          </div>
        )}

        {step === "otp" && (
          <div className="flex flex-col gap-4">
            <label className="flex items-center bg-gray-100 rounded-lg px-3 py-2 border border-gray-300">
              <i className="bx bx-key text-xl text-gray-500"></i>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="bg-transparent flex-1 outline-none px-2 text-black placeholder-gray-500"
              />
            </label>

            <button
              onClick={verifyOTP}
              className="bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Verify & Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
