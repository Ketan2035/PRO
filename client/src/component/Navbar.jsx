import React, { useState, useEffect } from "react";
import "boxicons/css/boxicons.min.css";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdown, setDropdown] = useState(false);

  const navigate = useNavigate();

  const handelclick = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const logout = async () => {
    await fetch("http://localhost:5000/api/logout", {
      method: "POST",
      credentials: "include",
    });

    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    setUser(null);
    setTimeout(() => {
      navigate("/");
      window.location.reload();
    }, 1000);
  };

  return (
    <header className="z-50 sticky top-0">
      <nav className="flex justify-between items-center px-6 py-4 bg-blue-200 shadow-md">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-black">
          <i className="bx bx-user-circle text-3xl"></i> ProConnect
        </h1>

        <ul className="hidden lg:flex gap-6 font-medium text-black items-center">
          <li>
            <Link to="/" className="bx bx-home">
              {" "}
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="bx bx-info-circle">
              {" "}
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className="bx bx-phone">
              {" "}
              Contact
            </Link>
          </li>

          <li className="relative">
            {user ? (
              <>
                <img
                  src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                  alt="profile"
                  className="w-10 h-10 rounded-full cursor-pointer"
                  onClick={() => setDropdown(!dropdown)}
                />

                {dropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border text-black">
                    <button
                      onClick={() => navigate("/profile")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Profile
                    </button>

                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login" className="bx bx-log-in">
                Login/Signup
              </Link>
            )}
          </li>
        </ul>

        <div className="lg:hidden" onClick={handelclick}>
          <i className={isOpen ? "bx bx-x" : "bx bx-menu"}></i>
        </div>
      </nav>

      {isOpen && (
        <ul className="lg:hidden bg-black p-4 flex flex-col gap-4 font-medium text-white">
          <li>
            <Link to="/" onClick={handelclick}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={handelclick}>
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={handelclick}>
              Contact
            </Link>
          </li>

          <li>
            {user ? (
              <>
                <button onClick={() => navigate("/profile")}>Profile</button>
                <button onClick={logout} className="text-red-400">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={handelclick}>
                Login/Signup
              </Link>
            )}
          </li>
        </ul>
      )}
    </header>
  );
}
