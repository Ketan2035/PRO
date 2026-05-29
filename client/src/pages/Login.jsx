import React, { useState } from "react";
import "boxicons/css/boxicons.min.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [step, setStep] = useState("mobile");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  const sendmail = async () => {
    try {
      const res = await fetch(
        "https://pro-backend-gray.vercel.app/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Error sending OTP");
        return;
      }

      toast.success("OTP sent successfully");
      setStep("otp");
    } catch (err) {
      console.log(err);
      toast.error("Server Error");
    }
  };

  const verifyOTP = async () => {
    try {
      const res = await fetch(
        "https://pro-backend-gray.vercel.app/api/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("OTP verified");

        localStorage.setItem("user", JSON.stringify(data.user));

        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 1000);
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (err) {
      console.log(err);
      toast.error("Server Error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-5 sm:p-6 relative border border-gray-200">
        
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-black hover:text-gray-600"
          onClick={() => navigate("/")}
        >
          <i className="bx bx-x text-3xl"></i>
        </button>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-2 text-black">
          <i className="bx bx-log-in-circle"></i>
          Login
        </h2>

        {/* Email Step */}
        {step === "mobile" && (
          <div className="flex flex-col gap-4">
            <label className="flex items-center bg-gray-100 rounded-lg px-3 py-3 border border-gray-300">
              <i className="bx bx-envelope text-xl text-gray-500"></i>

              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent flex-1 outline-none px-2 text-black placeholder-gray-500 text-sm sm:text-base"
              />
            </label>

            <button
              onClick={sendmail}
              className="bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition text-sm sm:text-base"
            >
              Get OTP
            </button>

            <div className="text-sm flex justify-end">
              <span className="text-gray-700">
                Don’t have an account?{" "}
                <button
                  onClick={() => navigate("/role")}
                  className="font-semibold underline text-black"
                >
                  Register
                </button>
              </span>
            </div>
          </div>
        )}

        {/* OTP Step */}
        {step === "otp" && (
          <div className="flex flex-col gap-4">
            <label className="flex items-center bg-gray-100 rounded-lg px-3 py-3 border border-gray-300">
              <i className="bx bx-key text-xl text-gray-500"></i>

              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="bg-transparent flex-1 outline-none px-2 text-black placeholder-gray-500 text-sm sm:text-base"
              />
            </label>

            <button
              onClick={verifyOTP}
              className="bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition text-sm sm:text-base"
            >
              Verify & Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}