import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Star } from "lucide-react";
import {useNavigate } from "react-router-dom";


const Home = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  // fetch the professional from the backend
  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };
  useEffect(() => {
    fetch("http://localhost:5000/api/professionals")
      .then((res) => res.json())
      .then((data) => {
        setProfessionals(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const filtered = professionals.filter((pro) =>
    pro.profession.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-white min-h-screen text-gray-900">
      {/* HERO */}
      <section className="py-5 px-4 border-b">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Find Trusted Professionals Near You
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Book reliable experts for all your needs
          </p>

          {/* SEARCH BAR */}
          <div className="mt-8 flex flex-col md:flex-row items-center gap-3 bg-white border p-3 rounded-2xl shadow-md max-w-2xl mx-auto">
            <div className="flex items-center gap-2 w-full">
              <Search className="text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto border-t md:border-t-0 md:border-l pt-2 md:pt-0 md:pl-3">
              <MapPin className="text-gray-400" />
              <input
                type="text"
                placeholder="Location"
                className="outline-none"
              />
            </div>

            <button className="bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-800 w-full md:w-auto">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* PROFESSIONALS */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            Top Professionals
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {shuffleArray(filtered)
                .slice(0, 6)
                .map((pro) => (
                  <div
                    key={pro._id}
                    className="bg-white border rounded-2xl p-5 hover:shadow-xl transition"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={pro.profileImage?.url}
                        alt={pro.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div>
                        <span
                          onClick={() => navigate(`/profile/${pro._id}`)}
                          className="font-semibold cursor-pointer"
                        >
                          {pro.name}
                        </span>
                        <p className="text-sm text-gray-500">
                          {pro.profession}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Star size={16} /> {pro.rating}
                      </span>
                      <span>{pro.address?.city}</span>
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                      ₹{pro.pricePerHour}/hr
                    </p>

                    <Link to={`/profile/${pro._id}`}>
                      <button className="mt-4 w-full bg-black text-white py-2 rounded-xl hover:bg-gray-800">
                        Hire Now
                      </button>
                    </Link>
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-10">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Search", desc: "Find services near you" },
              { title: "Choose", desc: "Select professionals" },
              { title: "Connect", desc: "Book & get work done" },
            ].map((item, i) => (
              <div
                key={i}
                className="border p-6 rounded-2xl hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-gray-500 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black text-white py-16 text-center">
        <h2 className="text-3xl font-bold">Ready to get your work done?</h2>
        <Link
          to="/role"
          className="inline-block mt-6 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200"
        >
          Get Started
        </Link>
      </section>
    </div>
  );
};

export default Home;
