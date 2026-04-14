import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Checkout = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [pro, setPro] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(true);

  //  Check login get addresses
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/me", {
          credentials: "include",
        });

        const data = await res.json();

        if (!data.success) {
          toast.error("Please login first");
          navigate("/login");
        } else {
          setAddresses(data.user?.address || []);
        }
        if(data.role=="professional"){
          toast.error("Only customer are allowed");
          navigate("/");
        }
      } catch (err) {
        console.error(err);
        toast.error("User fetch failed");
      }
    };

    checkUser();
  }, [navigate]);

  // Fetch professional
  useEffect(() => {
    const fetchPro = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/professionals/${id}`,
        );
        const data = await res.json();

        console.log("PRO DATA:", data); // debug

        // adjust if backend key is different
        setPro(data.user || data.professional || null);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load professional");
      } finally {
        setLoading(false);
      }
    };

    fetchPro();
  }, [id]);

  const handleBooking = async () => {
    if (!selectedAddress || !selectedDate || !selectedTime) {
      return toast.error("Fill all fields");
    }

    try {
      const res = await fetch("http://localhost:5000/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          professionalId: pro?._id,
          service: pro?.profession,
          address: selectedAddress,
          date: selectedDate,
          time: selectedTime,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Booking Confirmed 🎉");
        navigate("/");
      } else {
        toast.error(data.message || "Booking failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  //  Safe loading (prevents crash)
  if (loading || !pro) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p className="text-sm text-gray-500">Home / Checkout</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="md:col-span-2 space-y-4">
          {/* ADDRESS */}
          <div className="bg-white p-5 rounded-xl shadow">
            <div className="flex justify-between mb-3">
              <h3 className="font-semibold">Select Address</h3>
              <button
                onClick={() => navigate("/profile/address/add_address")}
                className="text-blue-500 text-sm"
              >
                + Add New
              </button>
            </div>

            {addresses.length === 0 ? (
              <p className="text-gray-500 text-sm">No address found</p>
            ) : (
              addresses.map((addr, i) => (
                <label
                  key={i}
                  className={`block border p-3 mb-2 rounded-lg cursor-pointer ${
                    selectedAddress === addr
                      ? "border-black bg-gray-100"
                      : "hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    value={addr}
                    checked={selectedAddress === addr}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                    className="mr-2"
                  />
                  {addr}
                </label>
              ))
            )}
          </div>

          {/* DATE & TIME */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="font-semibold mb-3">Select Date & Time</h3>

            <input
              type="date"
              value={selectedDate}
              className="w-full border p-2 rounded mb-4"
              onChange={(e) => setSelectedDate(e.target.value)}
            />

            <div className="flex gap-2 flex-wrap">
              {["10AM", "12PM", "3PM", "6PM"].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTime(t)}
                  className={`px-4 py-2 border rounded-lg ${
                    selectedTime === t
                      ? "bg-black text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT (SUMMARY) */}
        <div>
          <div className="bg-white p-5 rounded-xl shadow sticky top-6">
            <h3 className="font-semibold mb-3">Order Summary</h3>

            <div className="border-b pb-3 mb-3">
              <p className="font-medium">{pro?.name}</p>
              <p className="text-sm text-gray-500">{pro?.profession}</p>
            </div>

            <div className="text-sm space-y-2">
              <p>
                <b>Address:</b> {selectedAddress || "Not selected"}
              </p>
              <p>
                <b>Date:</b> {selectedDate || "Not selected"}
              </p>
              <p>
                <b>Time:</b> {selectedTime || "Not selected"}
              </p>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-sm">
              <span>Service Fee</span>
              <span>₹{pro?.pricePerHour || 0}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Platform Fee</span>
              <span>₹20</span>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{(pro?.pricePerHour || 0) + 20}</span>
            </div>

            <button
              onClick={handleBooking}
              disabled={!selectedAddress || !selectedDate || !selectedTime}
              className={`w-full mt-5 py-3 rounded-lg font-semibold ${
                selectedAddress && selectedDate && selectedTime
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
