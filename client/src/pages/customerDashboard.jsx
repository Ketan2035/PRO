import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CustomerProfile() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [edit, setEdit] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const navigate = useNavigate();

  //  Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/customer/me", {
          credentials: "include",
        });
        const data = await res.json();

        if (data.success) {
          setUser(data.user);
          setAddresses(data.user.address || []);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  //  Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/booking/my", {
          credentials: "include",
        });

        const data = await res.json();

        if (data.success) {
          setBookings(data.bookings);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(user));
    toast.success("Profile updated!");
    setEdit(false);
  };

  const handleDelete = async (index) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/user/address/${index}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Address deleted");
        setAddresses((prev) => prev.filter((_, i) => i !== index));
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };
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

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* SIDEBAR */}
      <div className="w-64 bg-white shadow p-4">
        <h2 className="text-xl font-bold mb-6">My Account</h2>

        <ul className="space-y-3">
          <li
            onClick={() => setActiveTab("profile")}
            className="cursor-pointer hover:text-blue-500"
          >
            Profile
          </li>
          <li
            onClick={() => setActiveTab("orders")}
            className="cursor-pointer hover:text-blue-500"
          >
            My Bookings
          </li>
          <li
            onClick={() => setActiveTab("address")}
            className="cursor-pointer hover:text-blue-500"
          >
            Address
          </li>
          <li
            onClick={() => setActiveTab("settings")}
            className="cursor-pointer hover:text-blue-500"
          >
            Settings
          </li>
        </ul>

        <button onClick={logout} className="mt-10 text-red-500">
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">
        {/* PROFILE */}
        {activeTab === "profile" && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Profile</h2>

            <input
              name="name"
              value={user.name}
              disabled={!edit}
              onChange={handleChange}
              className="w-full border p-2 mb-3 rounded"
            />

            <input
              value={user.email}
              disabled
              className="w-full border p-2 mb-3 rounded bg-gray-100"
            />

            <input
              name="mob"
              value={user.mob}
              disabled={!edit}
              onChange={handleChange}
              className="w-full border p-2 mb-3 rounded"
            />

            {!edit ? (
              <button
                onClick={() => setEdit(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Edit
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            )}
          </div>
        )}

        {/* BOOKINGS */}
        {activeTab === "orders" && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">My Bookings</h2>

            {loadingBookings ? (
              <p>Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <p className="text-gray-500">No bookings yet</p>
            ) : (
              bookings.map((b) => (
                <div
                  key={b._id}
                  className="border p-4 rounded mb-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">
                      {b.professional?.name} ({b.service})
                    </p>

                    <p className="text-sm text-gray-500">
                      {new Date(b.date).toLocaleDateString()} | {b.time}
                    </p>

                    <p className="text-sm text-gray-400">{b.address}</p>
                  </div>

                  <span
                    className={`font-semibold ${
                      b.status === "pending"
                        ? "text-yellow-500"
                        : b.status === "completed"
                          ? "text-green-500"
                          : "text-red-500"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* ADDRESS */}
        {activeTab === "address" && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Saved Addresses</h2>

            {addresses.length === 0 ? (
              <p>No address saved</p>
            ) : (
              addresses.map((addr, index) => (
                <div
                  key={index}
                  className="border p-3 rounded mb-3 flex justify-between"
                >
                  <p>{addr}</p>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}

            <button
              onClick={() => navigate("/profile/address/add_address")}
              className="mt-3 bg-blue-500 text-white px-4 py-2 rounded"
            >
              + Add Address
            </button>
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === "settings" && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Settings</h2>

            <button className="bg-gray-200 px-4 py-2 rounded mb-3 w-full">
              Change Password
            </button>

            <button className="bg-red-500 text-white px-4 py-2 rounded w-full">
              Delete Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
