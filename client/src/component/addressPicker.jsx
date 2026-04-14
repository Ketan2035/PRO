import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
export default function AddressPicker() {
  const navigate = useNavigate();
  const [coords, setCoords] = useState({
    lat: 0,
    lng: 0,
  });
  const sendAddress = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          address,
          lat: coords.lat,
          lng: coords.lng,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Address added successfully");
        navigate(-1);
      } else {
        toast.error(data.message || "Failed to add address");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };
  const [address, setAddress] = useState("");
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setCoords({ lat, lng });

        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        );
        const data = await res.json();

        setAddress(data.display_name || "");
      },
      () => {
        alert("Unable to fetch location");
      },
    );
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="font-semibold text-lg">Select Location</h2>

        <button
          onClick={() => navigate("/profile")}
          className="text-red-500 text-lg font-bold"
        >
          ✕
        </button>
      </div>

      {/* Map */}
      <div className="w-full h-[50vh]">
        <iframe
          title="map"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`}
        ></iframe>
      </div>

      {/* Address Section */}
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-sm text-gray-500 mb-2">Detected Address</p>

        <textarea
          value={address}
          readOnly
          className="w-full border p-3 rounded mb-4 flex-1"
        />

        {/* Confirm */}
        <button
          onClick={sendAddress}
          className="bg-green-500 text-white py-3 rounded text-lg"
        >
          Confirm Location
        </button>
      </div>
    </div>
  );
}
