import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { socket } from "./../socket";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function NotificationDropdown({ user, role }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await fetch("http://localhost:3000/api/notifications", {
        credentials: "include"
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter(n => !n.read).length);
      }
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  // Fetch initial notifications
  useEffect(() => {
    fetchNotifications();
  }, [user]);

  // Listen for refresh events from SocketListener
  useEffect(() => {
    window.addEventListener("refresh-notifications", fetchNotifications);
    return () => {
      window.removeEventListener("refresh-notifications", fetchNotifications);
    };
  }, [user]);



  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = async () => {
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await fetch("http://localhost:3000/api/notifications/read", {
        method: "PUT",
        credentials: "include"
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const toggleReadStatus = async (e, notif) => {
    e.stopPropagation();
    const isNowRead = !notif.read;
    
    // Optimistic UI update
    setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, read: isNowRead } : n));
    setUnreadCount(prev => isNowRead ? Math.max(0, prev - 1) : prev + 1);

    try {
      await fetch(`http://localhost:3000/api/notifications/${notif._id}/${isNowRead ? 'read' : 'unread'}`, {
        method: "PUT",
        credentials: "include"
      });
    } catch (err) {
      console.error(err);
      fetchNotifications(); // revert on error
    }
  };

  const deleteNotification = async (e, id) => {
    e.stopPropagation();
    
    const notifToDelete = notifications.find(n => n._id === id);
    if (!notifToDelete) return;
    
    // Optimistic UI update
    setNotifications(prev => prev.filter(n => n._id !== id));
    if (!notifToDelete.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }

    try {
      await fetch(`http://localhost:3000/api/notifications/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
    } catch (err) {
      console.error(err);
      fetchNotifications(); // revert on error
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={handleToggle}
        className="relative p-2 text-white hover:bg-blue-600 rounded-full transition"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-[-80px] md:right-0 mt-4 w-80 bg-white text-black shadow-xl rounded-md border border-gray-100 overflow-hidden z-[100]">
          <div className="p-3 border-b bg-gray-50 flex items-center justify-between">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={(e) => { e.stopPropagation(); markAllAsRead(); }} className="text-xs text-blue-600 hover:underline">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell size={32} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif, idx) => (
                <div 
                  key={notif._id || idx} 
                  onClick={(e) => {
                    deleteNotification(e, notif._id);
                    setIsOpen(false);
                    if (role === "customer") {
                      navigate("/profile/customer");
                    } else if (role === "professional") {
                      navigate("/profile/pro");
                    } else if (notif.link) {
                      navigate(notif.link);
                    }
                  }}
                  className={`p-3 border-b hover:bg-gray-50 transition cursor-pointer ${notif.read ? 'opacity-70' : 'bg-blue-50/50'}`}
                >
                  <p className={`text-sm text-gray-900 ${notif.read ? 'font-medium' : 'font-bold'}`}>
                    {!notif.read && <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mr-2"></span>}
                    {notif.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                </div>
              ))
            )}
          </div>
          <div className="p-2 border-t text-center bg-gray-50">
            <Link to={role === "professional" ? "/profile/pro" : "/profile/customer"} onClick={() => setIsOpen(false)} className="text-xs text-[#2874f0] font-medium hover:underline">
              Go to Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
