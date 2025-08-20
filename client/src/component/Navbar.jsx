import React, { useState } from "react";
import "boxicons/css/boxicons.min.css"; // Import Boxicons CSS




export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const handelclick=()=>{
    setIsOpen((prev)=>(!prev))
  }
  return (
    <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold">ProConnect</h1>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 text-lg">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Contact</a>
        </nav>

        {/* Auth Buttons (Desktop) */}
        <div className="hidden md:flex gap-4">
          <button variant="outline" className="bg-white text-indigo-600 font-semibold rounded-2xl px-3 flex items-center">Login</button>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl px-3 flex items-start">Sign Up</button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg bg-white/20 hover:bg-white/30"
          onClick={handelclick}
        >
          <i className={isOpen ? "bx bx-x" : "bx bx-menu"}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-4 space-y-4">
          <a href="#" className="block text-lg hover:underline" onclick={handelclick}>Home</a>
          <a href="#" className="block text-lg hover:underline" onClick={handelclick}>About</a>
          <a href="#" className="block text-lg hover:underline" onClick={handelclick}>Contact</a>
          <div className="flex flex-col gap-3 pt-4">
            <button variant="outline" className="bg-white text-indigo-600 font-semibold w-full" onClick={handelclick}>Login</button>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold w-full" onClick={handelclick}>Sign Up</button>
          </div>
        </div>
      )}
    </header>
  );
}
