import React, { useState } from "react";
import "boxicons/css/boxicons.min.css";
import {Link} from "react-router-dom"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handelclick=()=>{
    setIsOpen((prev)=>(!prev))
  }

  return (
    <header className="sticky top-0 z-50">
      <nav className="flex justify-between items-center px-6 py-4 bg-white/10 backdrop-blur-md shadow-md">
        {/* Logo */}
        <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
          <i className="bx bx-user-circle text-3xl"></i> ProConnect
        </h1>

        <div className=" md:flex items-center gap-3 w-1/2">
          {/* Search Bar */}
          <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 w-full">
            <i className="bx bx-search text-gray-200 text-xl"></i>
            <input
              type="text"
              placeholder="What service?"
              className="flex-1 bg-transparent outline-none px-2 text-white  placeholder-gray-300"
            />
          </div>
          <div className="items-center hidden md:flex bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[160px]">
            <i className="bx bx-map text-gray-200 text-xl"></i>
            <input
              type="text"
              placeholder="Location"
              className="flex-1 bg-transparent outline-none px-2 text-white placeholder-gray-300"
            />
          </div>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex gap-6 font-medium text-white">
          <li className="hover:text-purple-900 cursor-pointer flex items-center gap-1">
            <Link to="/" className="bx bx-home">Home</Link>
          </li>
          <li className="hover:text-purple-900 cursor-pointer flex items-center gap-1">
            <Link to="/about" className="bx bx-info-circle">About</Link>
          </li>
          <li className="hover:text-purple-900 cursor-pointer flex items-center gap-1">
            <Link to="/contact" className="bx bx-phone">Contact</Link> 
          </li>
          <li className="hover:text-purple-900 cursor-pointer flex items-center gap-1">
            <Link to="/login" className="bx bx-log-in">Login/Signup</Link> 
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <div className="lg:hidden" 
          onClick={handelclick}
        >
          <i  className={isOpen ? "bx bx-x" : "bx bx-menu"}></i>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {isOpen && (
        <ul className="lg:hidden bg-white/20 backdrop-blur-md p-4 flex flex-col gap-4 font-medium text-white">
          <li className="hover:text-purple-900 cursor-pointer flex items-center gap-1">
            <Link to="/" className="bx bx-home" onClick={handelclick}>Home</Link> 
          </li>
          <li  className="hover:text-purple-900 cursor-pointer flex items-center gap-1">
            <Link  to="/about"className="bx bx-info-circle" onClick={handelclick}>About</Link> 
          </li>
          <li className="hover:text-purple-900 cursor-pointer flex items-center gap-1">
            <Link to="/contact" className="bx bx-phone" onClick={handelclick}>Contact</Link> 
          </li>
          <li className="hover:text-purple-900 cursor-pointer flex items-center gap-1">
            <Link to="/login" className="bx bx-log-in" onClick={handelclick}>Login/Signup</Link> 
          </li>
        </ul>
      )}
    </header>
  );
}
