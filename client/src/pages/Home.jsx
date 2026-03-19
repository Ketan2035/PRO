import React from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Star } from "lucide-react";

const services = [
  { name: "Doctor", price: "₹299" },
  { name: "Plumber", price: "₹499" },
  { name: "Home Cleaning", price: "₹299" },
  { name: "Electrician", price: "₹199" },
];

const professionals = [
  {
    name: "Jane S.",
    role: "AI Engineer",
    rating: 4.9,
    location: "Delhi",
    img: "https://i.pravatar.cc/150?img=1",
  },
  {
    name: "Rahul K.",
    role: "Web Developer",
    rating: 4.8,
    location: "Mumbai",
    img: "https://i.pravatar.cc/150?img=2",
  },
  {
    name: "Amit P.",
    role: "Electrician",
    rating: 4.7,
    location: "Lucknow",
    img: "https://i.pravatar.cc/150?img=3",
  },
];

const Home = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HERO */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Find Trusted Professionals Near You
          </h1>
          <p className="mt-4 text-lg text-gray-200">
            Book reliable experts for all your needs
          </p>

          {/* SEARCH BAR */}
          <div className="mt-8 flex flex-col md:flex-row items-center gap-3 bg-white p-3 rounded-xl shadow-lg max-w-2xl mx-auto">
            <div className="flex items-center gap-2 w-full">
              <Search className="text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                className="w-full outline-none text-gray-700"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <MapPin className="text-gray-400" />
              <input
                type="text"
                placeholder="Location"
                className="outline-none text-gray-700"
              />
            </div>

            <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 w-full md:w-auto">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          Popular Services
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition cursor-pointer"
            >
              <h3 className="font-semibold text-lg">{service.name}</h3>
              <p className="text-sm text-gray-500 mt-2">Starting from</p>
              <p className="text-green-600 font-bold">{service.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROFESSIONALS */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            Top Professionals
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {professionals.map((pro, i) => (
              <div
                key={i}
                className="border rounded-2xl p-5 hover:shadow-xl transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={pro.img}
                    alt=""
                    className="w-14 h-14 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{pro.name}</h3>
                    <p className="text-sm text-gray-500">{pro.role}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Star size={16} /> {pro.rating}
                  </span>
                  <span>{pro.location}</span>
                </div>

                <Link to={`/profile/${pro.name}`}>
                  <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700">
                    Hire Now
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-10">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Search", desc: "Find services near you" },
              { title: "Choose", desc: "Select professionals" },
              { title: "Connect", desc: "Book & get work done" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-gray-500 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 text-white py-16 text-center">
        <h2 className="text-3xl font-bold">
          Ready to get your work done?
        </h2>
        <Link
          to="/role"
          className="inline-block mt-6 bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200"
        >
          Get Started
        </Link>
      </section>
    </div>
  );
};

export default Home;