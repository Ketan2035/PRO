import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const navigate = useNavigate();

  // Fetch admin stats and professionals
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
          navigate("/admin/login");
          return;
        }

        const user = JSON.parse(userStr);
        if (user.role !== "admin") {
          toast.error("Not authorized");
          navigate("/");
          return;
        }

        // Fetch Stats
        const statsRes = await fetch("http://localhost:3000/api/admin/stats", { credentials: "include" });
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats(statsData.stats);
        }

        // Fetch Professionals (Pending Verification by default in UI tab, but let's fetch all here)
        const prosRes = await fetch("http://localhost:3000/api/admin/professionals", { credentials: "include" });
        const prosData = await prosRes.json();
        if (prosData.success) {
          setProfessionals(prosData.professionals);
        }
      } catch (err) {
        toast.error("Error loading admin data");
        navigate("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleVerify = async (proId, status) => {
    try {
      const reason = status === "rejected" ? prompt("Please enter a reason for rejection:") : "";
      
      const res = await fetch(`http://localhost:3000/api/admin/professional/${proId}/verification`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status, reason }),
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setProfessionals((prev) =>
          prev.map((p) => (p._id === proId ? { ...p, verificationStatus: status } : p))
        );
        // Update stats summary manually
        if (status === "verified" || status === "rejected") {
          setStats((prev) => ({
            ...prev,
            pendingVerifications: prev.pendingVerifications - 1
          }));
        }
      }
    } catch (err) {
      toast.error("Verification update failed");
    }
  };

  const logout = async () => {
    await fetch("http://localhost:3000/api/logout", {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem("user");
    toast.success("Admin logged out");
    navigate("/admin/login");
  };

  if (loading) return <p className="text-center mt-20 text-gray-500 font-semibold">Loading Admin Dashboard...</p>;

  const pendingPros = professionals.filter(p => p.verificationStatus === "pending");
  const verifiedPros = professionals.filter(p => p.verificationStatus === "verified");

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* SIDEBAR */}
      <div className="w-64 bg-gray-900 text-white min-h-screen p-5 flex flex-col justify-between shadow-xl">
        <div>
          <div className="flex items-center gap-3 mb-10 mt-2 px-2">
            <span className="text-2xl">🛡️</span>
            <div>
              <h2 className="font-black text-xl tracking-tight">Admin<span className="text-blue-400">Panel</span></h2>
              <p className="text-xs text-gray-400">Urban Saathi Root Access</p>
            </div>
          </div>

          <ul className="space-y-2 text-sm font-medium">
            <li
              onClick={() => setActiveTab("overview")}
              className={`cursor-pointer px-4 py-3 rounded-xl transition ${activeTab === "overview" ? "bg-blue-600 shadow-md" : "hover:bg-gray-800 text-gray-300"}`}
            >
              📊 Overview
            </li>
            <li
              onClick={() => setActiveTab("verifications")}
              className={`cursor-pointer px-4 py-3 rounded-xl transition flex justify-between items-center ${activeTab === "verifications" ? "bg-blue-600 shadow-md" : "hover:bg-gray-800 text-gray-300"}`}
            >
              <span>📋 Verifications</span>
              {stats?.pendingVerifications > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {stats.pendingVerifications}
                </span>
              )}
            </li>
            <li
              onClick={() => setActiveTab("professionals")}
              className={`cursor-pointer px-4 py-3 rounded-xl transition ${activeTab === "professionals" ? "bg-blue-600 shadow-md" : "hover:bg-gray-800 text-gray-300"}`}
            >
              💼 All Professionals
            </li>
          </ul>
        </div>

        <button onClick={logout} className="w-full text-left px-4 py-3 text-sm text-red-400 font-bold hover:bg-gray-800 rounded-xl transition">
          🚪 Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 overflow-y-auto h-screen">
        
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-8 max-w-6xl">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Platform Analytics</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Users</p>
                <h2 className="text-4xl font-black text-gray-900">{stats?.totalCustomers}</h2>
              </div>
              
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Pros</p>
                <h2 className="text-4xl font-black text-blue-600">{stats?.totalProfessionals}</h2>
              </div>
              
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Bookings</p>
                <h2 className="text-4xl font-black text-green-600">{stats?.totalBookings}</h2>
              </div>
              
              <div className="bg-gray-900 text-white p-6 rounded-3xl shadow-lg border border-gray-800 flex flex-col justify-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Gross Booking Value</p>
                <h2 className="text-4xl font-black text-white">₹{stats?.totalGrossRevenue || 0}</h2>
              </div>
              
              <div className="bg-blue-600 text-white p-6 rounded-3xl shadow-lg border border-blue-500 flex flex-col justify-center md:col-span-2">
                <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">Net Platform Revenue (Commission)</p>
                <h2 className="text-4xl font-black text-white">₹{stats?.totalPlatformRevenue || 0}</h2>
              </div>
              
              <div className="bg-red-50 p-6 rounded-3xl shadow-sm border border-red-100 flex flex-col justify-center md:col-span-2">
                <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">Pending Professional Payouts</p>
                <h2 className="text-4xl font-black text-red-600">₹{stats?.totalPendingPayouts || 0}</h2>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Action Required</h3>
              <p className="text-gray-500 mb-6">There are <strong className="text-red-500">{stats?.pendingVerifications}</strong> professional profiles awaiting identity verification.</p>
              
              <button 
                onClick={() => setActiveTab("verifications")}
                className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 transition"
              >
                Review Applications →
              </button>
            </div>
          </div>
        )}

        {/* VERIFICATIONS TAB */}
        {activeTab === "verifications" && (
          <div className="max-w-6xl">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-8">Pending Verifications</h1>

            {pendingPros.length === 0 ? (
              <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center">
                <span className="text-4xl">✅</span>
                <h3 className="text-xl font-bold text-gray-900 mt-4">All Caught Up!</h3>
                <p className="text-gray-500 mt-2">No professionals are currently awaiting KYC verification.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pendingPros.map(p => (
                  <div key={p._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex gap-4">
                      <img 
                        src={p.profileImage?.url || `https://ui-avatars.com/api/?name=${p.name}&background=random`} 
                        alt={p.name} 
                        className="w-16 h-16 rounded-2xl object-cover shadow-sm border"
                      />
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
                        <p className="text-sm font-semibold text-blue-600">{p.profession}</p>
                        <p className="text-xs text-gray-500 mt-1">{p.email} • {p.mob}</p>
                        <p className="text-xs text-gray-500">{p.address?.city}, {p.address?.state}</p>
                      </div>
                    </div>

                    {/* KYC DETAILS */}
                    <div className="flex-1 bg-gray-50 p-4 rounded-2xl border">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Submitted KYC</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">ID Type</p>
                          <p className="font-semibold">{p.idProof?.type || "Not Provided"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">ID Number</p>
                          <p className="font-semibold">{p.idProof?.number || "Not Provided"}</p>
                        </div>
                      </div>
                      {p.idProof?.image?.url && (
                        <a href={p.idProof.image.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 font-bold hover:underline mt-2 inline-block">
                          📄 View Document
                        </a>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 justify-center">
                      <button 
                        onClick={() => handleVerify(p._id, "verified")}
                        className="bg-green-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-green-700 transition w-full"
                      >
                        ✓ Approve KYC
                      </button>
                      <button 
                         onClick={() => handleVerify(p._id, "rejected")}
                        className="bg-red-50 text-red-600 font-bold px-5 py-2.5 rounded-xl hover:bg-red-100 transition w-full border border-red-200"
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ALL PROFESSIONALS TAB */}
        {activeTab === "professionals" && (
          <div className="max-w-6xl">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-8">Verified Professionals Directory</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {verifiedPros.map(p => (
                <div key={p._id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4 mb-4 border-b pb-4">
                    <img 
                      src={p.profileImage?.url || `https://ui-avatars.com/api/?name=${p.name}&background=random`} 
                      alt={p.name} 
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900 leading-tight">{p.name}</h3>
                      <p className="text-xs font-semibold text-blue-600">{p.profession}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between"><span>Rating:</span> <span className="font-bold text-yellow-600">★ {p.rating || "New"}</span></div>
                    <div className="flex justify-between"><span>Jobs Done:</span> <span className="font-bold text-gray-900">{p.totalReviews || 0}</span></div>
                    <div className="flex justify-between"><span>City:</span> <span className="font-semibold text-gray-900">{p.address?.city}</span></div>
                  </div>

                  <button 
                    onClick={() => handleVerify(p._id, "pending")}
                    className="w-full bg-gray-100 text-gray-700 font-bold py-2 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-transparent transition text-sm"
                  >
                    Revoke Verification
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
