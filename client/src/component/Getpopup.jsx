import React, { useState } from "react";
import { Briefcase, User } from "lucide-react";
import {Link} from "react-router-dom"

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState(null);

  return (
    <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50 backdrop-blur-md">
      <div className="bg-white/20 rounded-2xl shadow-xl w-full max-w-md p-6">
        
        <h2 className="text-2xl font-bold text-center text-white">
          Join as a Customer or Professional
        </h2>

        {/* Options */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => setSelectedRole("client")}
            className={`cursor-pointer border rounded-xl p-5 flex flex-col items-center text-center transition ${
              selectedRole === "client"
                ? "border-green-600 bg-gray-700"
                : "border-gray-300 hover:border-green-800"
            }`}
          >
            <Briefcase className="w-8 h-8 text-green-600 mb-3" />
            <p className="font-medium text-white">I'm a Customer</p>
            <p className="text-sm text-white">Hiring for a work</p>
          </div>

          <div
            onClick={() => setSelectedRole("pro")}
            className={`cursor-pointer border rounded-xl p-5 flex flex-col items-center text-center transition ${
              selectedRole === "pro"
                ? "border-green-600 bg-gray-700"
                : "border-gray-300 hover:border-green-800"
            }`}
          >
            <User className="w-8 h-8 text-green-600 mb-3" />
            <p className="font-medium text-white">I'm a Professional</p>
            <p className="text-sm text-white">Looking for work</p>
          </div>
        </div>

        {/* Button */}
        <button
          disabled={!selectedRole}
          className={`mt-6 w-full py-3 rounded-xl font-semibold ${
            selectedRole
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:bg-green-700"
              : "bg-gradient-to-r from-purple-400 to-pink-400 text-white cursor-not-allowed"
          }`}
        >
          Create Account
        </button>
        <p className="mt-4 text-center text-sm text-white">
          Already have an account?{" "}
          <Link to="/login" className="text-black font-bold underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
