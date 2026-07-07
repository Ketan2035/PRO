import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { socket } from "../socket";

// Fix leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom icon for professional
const proIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  className: "hue-rotate-180" // Quick CSS hack to make it orange/red
});

export default function LiveTrackingMap({ bookingId, onClose }) {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (!socket.connected) socket.connect();
    socket.emit("joinBooking", bookingId);

    const handleLocationUpdate = (loc) => {
      setPosition(loc);
    };

    socket.on("locationUpdate", handleLocationUpdate);

    return () => {
      socket.off("locationUpdate", handleLocationUpdate);
    };
  }, [bookingId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl overflow-hidden shadow-2xl flex flex-col">
        <div className="p-4 border-b flex justify-between items-center bg-white">
          <h3 className="font-semibold text-lg">Live Tracking</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="h-[450px] w-full bg-gray-100 relative">
          {position ? (
            <MapContainer center={position} zoom={16} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position} icon={proIcon}>
                 <Popup>Professional is here!</Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2874f0] mb-4"></div>
               <p>Waiting for professional's location update...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
