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

  useEffect(() => {
    fetch(`http://localhost:5000/api/professionals/${id}`)
      .then((res) => res.json())
      .then((data) => setPro(data.data));

    fetch("http://localhost:5000/api/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAddresses(data.user.address || []);
      });
  }, [id]);

  const handleBooking = async () => {
    if (!selectedAddress || !selectedDate || !selectedTime) {
      return toast.error("Fill all fields");
    }

    const res = await fetch("http://localhost:5000/api/booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        professionalId: pro._id,
        service: pro.profession,
        address: selectedAddress,
        date: selectedDate,
        time: selectedTime,
      }),
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Booking Confirmed");
      navigate(-1);
    } else {
      toast.error(data.message);
    }
  };

  if (!pro) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-4xl rounded-xl p-6 relative">
        
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 right-4 text-xl"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">Checkout</h2>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* LEFT */}
          <div>
            <h3 className="mb-2 font-medium">Address</h3>

            {addresses.map((addr, i) => (
              <label
                key={i}
                className={`block border p-2 mb-2 cursor-pointer ${
                  selectedAddress === addr ? "border-black bg-gray-100" : ""
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
            ))}

            <input
              type="date"
              value={selectedDate}
              className="w-full border p-2 mt-3"
              onChange={(e) => setSelectedDate(e.target.value)}
            />

            <div className="grid grid-cols-3 gap-2 mt-2">
              {["10AM", "12PM", "3PM"].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTime(t)}
                  className={`border p-2 ${
                    selectedTime === t ? "bg-black text-white" : ""
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <p className="font-semibold">{pro.name}</p>
            <p>{pro.profession}</p>

            <div className="mt-3 text-sm space-y-1">
              <p><b>Address:</b> {selectedAddress || "Not selected"}</p>
              <p><b>Date:</b> {selectedDate || "Not selected"}</p>
              <p><b>Time:</b> {selectedTime || "Not selected"}</p>
            </div>

            <p className="mt-2 font-semibold">₹{pro.pricePerHour}</p>

            <button
              onClick={handleBooking}
              className="w-full mt-4 bg-green-500 text-white py-2"
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