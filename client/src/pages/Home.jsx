import React from "react";
import {Link} from "react-router-dom"

const Hero = () => {
  return (
    <section className="relative bg-blue-600 py-20">
      {/* Floating Profiles */}
      <div className=" hidden lg:flex absolute top-10 left-10 bg-white shadow-lg rounded-xl p-3  flex-col items-center">
        <img
          src="https://i.pravatar.cc/80?img=1"
          alt="profile"
          className="w-14 h-14 rounded-full"
        />
        <p className="font-semibold text-sm">Andrea R.</p>
        <p className="text-xs text-gray-500">Lead Engineer</p>
      </div>

      <div className=" hidden lg:flex absolute top-10 right-10 bg-white shadow-lg rounded-xl p-3  flex-col items-center">
        <img
          src="https://i.pravatar.cc/80?img=2"
          alt="profile"
          className="w-14 h-14 rounded-full"
        />
        <p className="font-semibold text-sm">Martin G.</p>
        <p className="text-xs text-gray-500">Data Scientist</p>
      </div>

      <div className=" hidden lg:flex absolute bottom-15 left-30 bg-white shadow-lg rounded-xl p-3  flex-col items-center">
        <img
          src="https://i.pravatar.cc/80?img=3"
          alt="profile"
          className="w-14 h-14 rounded-full"
        />
        <p className="font-semibold text-sm">Jane S.</p>
        <p className="text-xs text-gray-500">AI Engineer</p>
      </div>

      <div className=" hidden lg:flex absolute bottom-15 right-30 bg-white shadow-lg rounded-xl p-3  flex-col items-center">
        <img
          src="https://i.pravatar.cc/80?img=4"
          alt="profile"
          className="w-14 h-14 rounded-full"
        />
        <p className="font-semibold text-sm">Fernando B.</p>
        <p className="text-xs text-gray-500">Product Manager</p>
      </div>
      <div className=" hidden xl:flex absolute bottom-10 left-70 bg-white shadow-lg rounded-xl p-3  flex-col items-center">
        <img
          src="https://i.pravatar.cc/80?img=4"
          alt="profile"
          className="w-14 h-14 rounded-full"
        />
        <p className="font-semibold text-sm">Fernando B.</p>
        <p className="text-xs text-gray-500">Product Manager</p>
      </div>
      <div className=" hidden xl:flex absolute bottom-10 right-70 bg-white shadow-lg rounded-xl p-3  flex-col items-center">
        <img
          src="https://i.pravatar.cc/80?img=4"
          alt="profile"
          className="w-14 h-14 rounded-full"
        />
        <p className="font-semibold text-sm">Fernando B.</p>
        <p className="text-xs text-gray-500">Product Manager</p>
      </div>

      {/* Center Content */}
      <div className="relative text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Complete your Work with{" "}
          <span>experienced professionals</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Connect with trusted experts near you today.
        </p>

        <button className="mt-6 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700">
          <Link to="/role">GET STARTED</Link>
        </button>
      </div>
    </section>
  );
};

export default Hero;
