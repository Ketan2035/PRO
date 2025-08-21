import React, { useState } from "react";
import "boxicons/css/boxicons.min.css";


export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-500 text-white">

      {/* Hero + Search Section */}
      <section className="flex flex-col items-center text-center py-16 px-4">
        <h2 className="text-4xl font-bold mb-6">Find the Right Professional</h2>
        <p className="max-w-xl mb-8 text-lg">
          Connect with trusted professionals near you and book services in just a few clicks.
        </p>
        <div className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-lg w-full max-w-2xl">
          <input
            type="text"
            placeholder="What Service?"
            className="flex-1 p-3 text-gray-800 outline-none"
          />
          <input
            type="text"
            placeholder="Location"
            className="flex-1 p-3 text-gray-800 outline-none border-t md:border-t-0 md:border-l"
          />
          <button className="bg-pink-600 px-6 py-3 font-semibold hover:bg-pink-700 text-white flex items-center gap-2">
            <i className="bx bx-search"></i> Search
          </button>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="px-6 py-12 text-center">
        <h3 className="text-3xl font-semibold mb-8">Popular Categories</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { name: "Doctor", icon: "bx bx-plus-medical" },
            { name: "Lawyer", icon: "bx bx-gavel" },
            { name: "Plumber", icon: "bx bx-wrench" },
            { name: "Tutor", icon: "bx bx-book-open" },
            { name: "More...", icon: "bx bx-dots-horizontal-rounded" },
          ].map((cat) => (
            <div
              key={cat.name}
              className="bg-white text-pink-600 px-6 py-3 rounded-full shadow-md font-medium cursor-pointer hover:bg-gray-100 flex items-center gap-2"
            >
              <i className={`${cat.icon} text-xl`}></i> {cat.name}
            </div>
          ))}
        </div>
      </section>

      {/* Featured Professionals */}
      <section className="px-6 py-12 text-center">
        <h3 className="text-3xl font-semibold mb-8">Featured Professionals</h3>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto">
          {[1, 2, 3].map((id) => (
            <div
              key={id}
              className="bg-white text-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h4 className="text-xl font-semibold flex items-center gap-2">
                <i className="bx bx-user"></i> Professional {id}
              </h4>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <i className="bx bx-star text-yellow-500"></i> 4.{id} Rating
              </p>
              <button className="mt-4 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center gap-1">
                <i className="bx bx-calendar-check"></i> Book Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-12 text-center">
        <h3 className="text-3xl font-semibold mb-6">How It Works</h3>
        <p className="max-w-2xl mx-auto text-lg flex items-center justify-center gap-2">
          <i className="bx bx-search-alt"></i> Search →
          <i className="bx bx-git-compare"></i> Compare →
          <i className="bx bx-calendar-check"></i> Book
        </p>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-12 text-center bg-white/10 backdrop-blur-md">
        <h3 className="text-3xl font-semibold mb-6">What Our Users Say</h3>
        <p className="max-w-2xl mx-auto italic">
          “ProConnect made it super easy to find the right professional in just
          a few clicks!”
        </p>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 text-center bg-white/10 backdrop-blur-md mt-8">
        <p>© {new Date().getFullYear()} ProConnect. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="#" className="hover:text-pink-300 flex items-center gap-1">
            <i className="bx bxl-facebook"></i> Facebook
          </a>
          <a href="#" className="hover:text-pink-300 flex items-center gap-1">
            <i className="bx bxl-twitter"></i> Twitter
          </a>
          <a href="#" className="hover:text-pink-300 flex items-center gap-1">
            <i className="bx bxl-linkedin"></i> LinkedIn
          </a>
        </div>
      </footer>
    </div>
  );
}
