import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";


const ProfessionalDetail = () => {
  const { id } = useParams();
  const [pro, setPro] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const handleBookNow = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      return toast.error("Please do login first");
    }

    navigate(`/checkout/${pro._id}`, {
      state: { backgroundLocation: location },
    });
  };
  useEffect(() => {
    fetch(`http://localhost:5000/api/professionals/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPro(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!pro) return <p className="text-center mt-10">Not Found</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* TOP SECTION */}
      <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row gap-6">
        <img
          src={pro.profileImage?.url}
          alt={pro.name}
          className="w-40 h-40 rounded-xl object-cover"
        />

        <div className="flex-1">
          <h1 className="text-2xl font-bold">{pro.name}</h1>
          <p className="text-gray-600">{pro.profession}</p>

          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Star size={16} /> {pro.rating}
            </span>

            <span className="flex items-center gap-1">
              <MapPin size={16} /> {pro.address?.city}
            </span>
          </div>

          <p className="mt-4 text-gray-700">{pro.bio}</p>

          <div className="mt-4 flex gap-6 text-sm">
            <p>
              <b>Experience:</b> {pro.experience} years
            </p>
            <p>
              <b>Price:</b> ₹{pro.pricePerHour}/hr
            </p>
          </div>

          <button
            onClick={handleBookNow}
            className="mt-6 bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-800"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* WORK IMAGES */}
      {pro.workImages?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Work Gallery</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {pro.workImages.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt=""
                className="rounded-xl h-40 w-full object-cover"
              />
            ))}
          </div>
        </div>
      )}

      {/* DETAILS */}
      <div className="mt-10 bg-gray-50 p-6 rounded-2xl">
        <h2 className="text-xl font-semibold mb-4">Details</h2>

        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <p>
            <b>Qualification:</b> {pro.qualification}
          </p>
          <p>
            <b>Service Area:</b> {pro.service_area}
          </p>
          <p>
            <b>Total Reviews:</b> {pro.totalReviews}
          </p>
          <p>
            <b>Available:</b> {pro.isAvailable ? "Yes" : "No"}
          </p>
          <p>
            <b>Working Hours:</b> {pro.workingHours?.start} -{" "}
            {pro.workingHours?.end}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDetail;
