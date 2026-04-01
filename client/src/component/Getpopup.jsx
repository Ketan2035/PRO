import React, { useState } from "react";
import { Briefcase, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-gray-50  flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Join as a Customer or Professional
        </h2>

        {/* Options */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Customer */}
          <div
            onClick={() => setSelectedRole("client")}
            className={`cursor-pointer border rounded-xl p-5 flex flex-col items-center text-center transition-all duration-200 ${
              selectedRole === "client"
                ? "border-black bg-gray-100"
                : "border-gray-300 hover:border-black hover:bg-gray-50"
            }`}
          >
            <Briefcase className="w-8 h-8 text-black mb-3" />
            <p className="font-semibold text-gray-800">I'm a Customer</p>
            <p className="text-sm text-gray-500">Hiring for work</p>
          </div>

          {/* Professional */}
          <div
            onClick={() => setSelectedRole("pro")}
            className={`cursor-pointer border rounded-xl p-5 flex flex-col items-center text-center transition-all duration-200 ${
              selectedRole === "pro"
                ? "border-black bg-gray-100"
                : "border-gray-300 hover:border-black hover:bg-gray-50"
            }`}
          >
            <User className="w-8 h-8 text-black mb-3" />
            <p className="font-semibold text-gray-800">I'm a Professional</p>
            <p className="text-sm text-gray-500">Looking for work</p>
          </div>
        </div>

        {/* Button */}
        <button
          disabled={!selectedRole}
          className={`mt-6 w-full py-3 rounded-xl font-semibold transition ${
            selectedRole
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={() => {
            if (selectedRole === "pro") {
              navigate("/pro_signup");
            } else {
              navigate("/customer_signup");
            }
          }}
        >
          Create Account
        </button>

        {/* Login */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-black font-semibold underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}