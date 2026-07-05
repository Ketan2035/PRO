import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, ChevronDown, MapPin, LogOut } from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/me", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          setRole(data.role);
        } else {
          setUser(null);
          setRole(null);
        }
      } catch (err) {
        setUser(null);
        setRole(null);
      }
    };
    checkAuth();
  }, []);

  const logout = async () => {
    await fetch("http://localhost:3000/api/logout", {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    setUser(null);
    setRole(null);
    setTimeout(() => {
      navigate("/");
      window.location.reload();
    }, 1000);
  };

  return (
    <header className="sticky top-0 z-50 w-full font-sans">
      {/* Main Top Nav - Flipkart/Amazon Style (Deep Blue) */}
      <div className="bg-[#2874f0] text-white px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
          
          {/* LOGO */}
          <Link to="/" className="flex flex-col flex-shrink-0">
            <span className="text-2xl font-bold italic tracking-tight">
              Urban<span className="text-yellow-400">Saathi</span>
            </span>
            <span className="text-xs text-gray-200 italic -mt-1 hover:underline">
              Explore Plus+
            </span>
          </Link>

          {/* SEARCH BAR (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-3xl relative items-center bg-white rounded-sm overflow-hidden shadow-sm">
            <input
              type="text"
              placeholder="Search for services, professionals and more"
              className="w-full px-4 py-2.5 text-black outline-none text-sm"
            />
            <button className="px-4 text-[#2874f0] hover:bg-gray-100 transition h-full">
              <Search size={20} />
            </button>
          </div>

          {/* RIGHT MENU ITEMS */}
          <div className="hidden md:flex items-center gap-6">
            
            {!user ? (
              <button 
                onClick={() => navigate("/login")}
                className="bg-white text-[#2874f0] px-8 py-1.5 font-medium rounded-sm border border-transparent hover:border-gray-300 transition"
              >
                Login
              </button>
            ) : (
              <div 
                className="relative group"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <div className="flex items-center gap-1 cursor-pointer font-medium hover:text-gray-200 py-2">
                  <span>{user.name?.split(" ")[0] || "User"}</span>
                  <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </div>

                {/* DROPDOWN MENU */}
                {dropdownOpen && (
                  <div className="absolute top-full right-0 w-64 bg-white text-black shadow-xl rounded-b-md border border-gray-100 overflow-hidden z-50">
                    <div className="p-4 border-b bg-gray-50 flex items-center gap-3">
                       <img
                        src={user.profileImage?.url || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                        alt="profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{role}</p>
                      </div>
                    </div>
                    <ul className="flex flex-col py-2">
                      <li>
                        <button 
                          onClick={() => navigate(role === "professional" ? "/profile/pro" : "/profile/customer")}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 flex items-center gap-3"
                        >
                          <User size={16} className="text-[#2874f0]" /> My Profile / Dashboard
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={logout}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 flex items-center gap-3"
                        >
                          <LogOut size={16} className="text-red-500" /> Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {role !== "professional" ? (
              <Link to="/pro_signup" className="font-medium hover:text-gray-200 flex items-center gap-1">
                Become a Pro
              </Link>
            ) : (
              <Link to="/customer_signup" className="font-medium hover:text-gray-200 flex items-center gap-1">
                Find Professionals
              </Link>
            )}

            <Link to={role === "customer" ? "/profile/customer" : "/"} className="font-medium hover:text-gray-200 flex items-center gap-2">
              <ShoppingCart size={20} />
              <span className="hidden lg:block">Bookings</span>
            </Link>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="md:hidden flex items-center gap-4">
            {user && (
              <button onClick={() => navigate(role === "professional" ? "/profile/pro" : "/profile/customer")}>
                <img
                  src={user.profileImage?.url || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                  alt="profile"
                  className="w-8 h-8 rounded-full border border-white"
                />
              </button>
            )}
            <button onClick={toggleMenu} className="text-white">
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE SEARCH BAR */}
      <div className="md:hidden bg-[#2874f0] px-4 pb-3 border-t border-blue-600/50">
        <div className="flex items-center bg-white rounded-sm overflow-hidden">
          <input
            type="text"
            placeholder="Search for services..."
            className="w-full px-3 py-2 text-black outline-none text-sm"
          />
          <button className="px-3 text-gray-500">
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* SECONDARY NAV (Amazon style categories) */}
      <div className="bg-white border-b shadow-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-8 flex items-center gap-8 py-2 text-sm font-medium text-gray-700">
          <button className="flex items-center gap-1 hover:text-[#2874f0]">
            <Menu size={16} /> All Categories
          </button>
          <Link to="/" className="hover:text-[#2874f0]">Home Cleaning</Link>
          <Link to="/" className="hover:text-[#2874f0]">Appliance Repair</Link>
          <Link to="/" className="hover:text-[#2874f0]">Electrician</Link>
          <Link to="/" className="hover:text-[#2874f0]">Plumber</Link>
          <Link to="/" className="hover:text-[#2874f0]">Beauty & Salon</Link>
        </div>
      </div>

      {/* MOBILE SIDEBAR MENU */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={toggleMenu}>
          <div 
            className="absolute top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#2874f0] p-4 text-white flex items-center gap-3">
              {user ? (
                <>
                   <img
                    src={user.profileImage?.url || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                    alt="profile"
                    className="w-12 h-12 rounded-full border-2 border-white"
                  />
                  <div>
                    <p className="font-semibold">Hello, {user.name?.split(" ")[0]}</p>
                    <p className="text-xs text-blue-200 capitalize">{role}</p>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white text-[#2874f0] flex items-center justify-center">
                    <User size={24} />
                  </div>
                  <button onClick={() => { navigate("/login"); toggleMenu(); }} className="font-semibold text-lg">
                    Login & Signup
                  </button>
                </div>
              )}
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto py-2">
              <ul className="text-gray-700 font-medium text-sm">
                <li>
                  <Link to="/" onClick={toggleMenu} className="flex items-center gap-4 px-6 py-3 border-b hover:bg-gray-50">
                    <MapPin size={20} className="text-gray-400" /> Explore Services
                  </Link>
                </li>
                {user && (
                  <li>
                    <button onClick={() => { navigate(role === "professional" ? "/profile/pro" : "/profile/customer"); toggleMenu(); }} className="w-full flex items-center gap-4 px-6 py-3 border-b hover:bg-gray-50">
                      <User size={20} className="text-gray-400" /> My Account
                    </button>
                  </li>
                )}
                <li>
                  {role !== "professional" ? (
                    <Link to="/pro_signup" onClick={toggleMenu} className="flex items-center gap-4 px-6 py-3 border-b hover:bg-gray-50">
                      <ShoppingCart size={20} className="text-gray-400" /> Become a Professional
                    </Link>
                  ) : (
                    <Link to="/customer_signup" onClick={toggleMenu} className="flex items-center gap-4 px-6 py-3 border-b hover:bg-gray-50">
                      <Search size={20} className="text-gray-400" /> Find Professionals
                    </Link>
                  )}
                </li>
              </ul>
            </div>

            {/* Footer Logout */}
            {user && (
              <div className="p-4 border-t">
                <button onClick={() => { logout(); toggleMenu(); }} className="w-full flex items-center justify-center gap-2 bg-gray-100 text-red-500 py-2.5 rounded-md font-semibold hover:bg-gray-200">
                  <LogOut size={18} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
