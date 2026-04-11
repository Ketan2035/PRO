import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CustomerProfile() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [edit, setEdit] = useState(false);
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/me", {
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

        // update UI instantly
        setAddresses((prev) => prev.filter((_, i) => i !== index));
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* sidebar */}
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

        <button onClick={handleLogout} className="mt-10 text-red-500">
          Logout
        </button>
      </div>

      {/*main part */}
      <div className="flex-1 p-6">
        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-500 text-white flex items-center justify-center rounded-full text-xl">
                {user.name?.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-semibold">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>

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

        {/* bokking tb*/}
        {activeTab === "orders" && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">My Bookings</h2>

            <div className="border p-4 rounded mb-3 flex justify-between">
              <div>
                <p className="font-medium">Electrician Service</p>
                <p className="text-sm text-gray-500">12 Apr | 10:00 AM</p>
              </div>
              <span className="text-yellow-500 font-semibold">Pending</span>
            </div>

            <div className="border p-4 rounded flex justify-between">
              <div>
                <p className="font-medium">Plumber Service</p>
                <p className="text-sm text-gray-500">10 Apr | 2:00 PM</p>
              </div>
              <span className="text-green-500 font-semibold">Completed</span>
            </div>
          </div>
        )}

        {/* address*/}
        {activeTab === "address" && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Saved Addresses</h2>

            {addresses.length === 0 ? (
              <p className="text-gray-500">No address saved</p>
            ) : (
              addresses.map((addr, index) => (
                <div
                  key={index}
                  className="border p-3 rounded mb-3 flex justify-between items-start"
                >
                  <div>
                    <p>{addr}</p>
                  </div>

                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-500 hover:underline"
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

        {/* setting*/}
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
