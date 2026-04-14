import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ProfessionalProfile() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [edit, setEdit] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const navigate = useNavigate();

  // Fetch professional data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/pro/me", {
          credentials: "include",
        });

        const data = await res.json();

        if (data.success) {
          setUser(data.user);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/booking/professional",
          {
            credentials: "include",
          }
        );

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
    toast.success("Profile updated!");
    setEdit(false);
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/booking/status/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Status updated");
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status } : b))
        );
      }
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  const logout = async () => {
    await fetch("http://localhost:5000/api/logout", {
      method: "POST",
      credentials: "include",
    });

    localStorage.removeItem("user");
    toast.success("Logged out");
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
        <h2 className="text-xl font-bold mb-6">Professional Panel</h2>

        <ul className="space-y-3">
          <li onClick={() => setActiveTab("dashboard")} className="cursor-pointer hover:text-blue-500">Dashboard</li>
          <li onClick={() => setActiveTab("profile")} className="cursor-pointer hover:text-blue-500">Profile</li>
          <li onClick={() => setActiveTab("services")} className="cursor-pointer hover:text-blue-500">Services</li>
          <li onClick={() => setActiveTab("bookings")} className="cursor-pointer hover:text-blue-500">Bookings</li>
          <li onClick={() => setActiveTab("availability")} className="cursor-pointer hover:text-blue-500">Availability</li>
          <li onClick={() => setActiveTab("reviews")} className="cursor-pointer hover:text-blue-500">Reviews</li>
          <li onClick={() => setActiveTab("settings")} className="cursor-pointer hover:text-blue-500">Settings</li>
        </ul>

        <button onClick={logout} className="mt-10 text-red-500">
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-500">Total Jobs</p>
              <h2 className="text-xl font-bold">{bookings.length}</h2>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-500">Completed</p>
              <h2 className="text-xl font-bold">
                {bookings.filter((b) => b.status === "completed").length}
              </h2>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-500">Pending</p>
              <h2 className="text-xl font-bold">
                {bookings.filter((b) => b.status === "pending").length}
              </h2>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {activeTab === "profile" && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="mb-4 font-semibold">Profile</h2>

            <input name="name" value={user.name} disabled={!edit} onChange={handleChange} className="w-full border p-2 mb-3 rounded" />
            <input value={user.email} disabled className="w-full border p-2 mb-3 rounded bg-gray-100" />
            <input name="phone" value={user.phone} disabled={!edit} onChange={handleChange} className="w-full border p-2 mb-3 rounded" />

            <textarea name="bio" value={user.bio || ""} disabled={!edit} onChange={handleChange} className="w-full border p-2 mb-3 rounded" placeholder="Write about yourself..." />

            {!edit ? (
              <button onClick={() => setEdit(true)} className="bg-blue-500 text-white px-4 py-2 rounded">Edit</button>
            ) : (
              <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
            )}
          </div>
        )}

        {/* SERVICES */}
        {activeTab === "services" && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="mb-4 font-semibold">My Services</h2>

            {user.services?.length ? (
              user.services.map((s, i) => (
                <div key={i} className="border p-3 mb-2 rounded flex justify-between">
                  <p>{s}</p>
                </div>
              ))
            ) : (
              <p>No services added</p>
            )}

            <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded">
              + Add Service
            </button>
          </div>
        )}

        {/* BOOKINGS */}
        {activeTab === "bookings" && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="mb-4 font-semibold">Bookings</h2>

            {loadingBookings ? (
              <p>Loading...</p>
            ) : bookings.length === 0 ? (
              <p>No bookings</p>
            ) : (
              bookings.map((b) => (
                <div key={b._id} className="border p-4 mb-3 rounded">
                  <p className="font-medium">{b.customer?.name}</p>
                  <p className="text-sm text-gray-500">{b.service}</p>
                  <p className="text-sm">{b.address}</p>

                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => updateStatus(b._id, "accepted")}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => updateStatus(b._id, "rejected")}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => updateStatus(b._id, "completed")}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Complete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* AVAILABILITY */}
        {activeTab === "availability" && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="mb-4 font-semibold">Availability</h2>

            <p className="text-gray-500 mb-3">
              Set your working hours (coming soon feature)
            </p>

            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Set Availability
            </button>
          </div>
        )}

        {/* REVIEWS */}
        {activeTab === "reviews" && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="mb-4 font-semibold">Reviews</h2>

            <p className="text-gray-500">
              Customer reviews will appear here
            </p>
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === "settings" && (
          <div className="bg-white p-6 rounded shadow">
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