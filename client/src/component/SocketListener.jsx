import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { socket } from "../socket";
import IncomingCallModal from "./IncomingCallModal";

export default function SocketListener() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const processedNotifs = useRef(new Set());

  useEffect(() => {
    // Check authentication
    const checkAndConnect = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/me", {
          credentials: "include",
        });
        const data = await res.json();

        if (data.success && data.user) {
          const userId = data.user._id || data.user.id;
          socket.io.opts.query = { userId };
          
          if (!socket.connected) {
            socket.connect();
          }
        }
      } catch (err) {
        console.error("Socket Auth Check Error:", err);
      }
    };

    checkAndConnect();

    // Listen for real-time notifications globally
    const handleNewNotif = (notif) => {
      // Deduplicate: prevent showing toast if we've already processed this exact notification ID
      const notifId = notif._id || notif.id;
      if (notifId && processedNotifs.current.has(notifId)) return;
      if (notifId) processedNotifs.current.add(notifId);

      // Toast alert
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4 border-l-4 border-[#2874f0]`}>
          <div className="flex-1 w-0">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <span className="text-2xl">🔔</span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-gray-900">{notif.title}</p>
                <p className="mt-1 text-xs text-gray-600">{notif.message}</p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200 pl-3 ml-3">
            <button onClick={() => toast.dismiss(t.id)} className="text-xs text-gray-400 hover:text-black font-medium">
              Close
            </button>
          </div>
        </div>
      ), { id: notif._id || notif.id || Date.now().toString(), duration: 5000 });

      // Tell all dropdowns to refresh their lists
      window.dispatchEvent(new CustomEvent("refresh-notifications"));
    };

    // Remove any ghost listeners from HMR or StrictMode
    socket.off("newNotification");
    socket.on("newNotification", handleNewNotif);

    return () => {
      socket.off("newNotification", handleNewNotif);
      socket.disconnect();
    };
  }, []);

  return <IncomingCallModal />;
}
