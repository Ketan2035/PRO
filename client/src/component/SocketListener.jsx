import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { socket } from "../socket";

export default function SocketListener() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

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

    // Listen for real-time booking updates
    const handleBookingUpdate = (booking) => {
      const statusText = booking.status ? booking.status.replace("_", " ").toUpperCase() : "UPDATED";
      const message = `Booking Update: Service "${booking.service || 'Request'}" status is now ${statusText}`;

      // Toast notification
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4 border-l-4 border-blue-600`}
        >
          <div className="flex-1 w-0">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <span className="text-2xl">🔔</span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  Urban Saathi Alert
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  {message}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200 pl-3 ml-3">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="text-xs text-gray-400 hover:text-black font-medium"
            >
              Close
            </button>
          </div>
        </div>
      ), { duration: 5000 });

      setNotifications((prev) => [
        {
          id: Date.now(),
          message,
          status: booking.status,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
        },
        ...prev,
      ]);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("bookingUpdated", handleBookingUpdate);

    return () => {
      socket.off("bookingUpdated", handleBookingUpdate);
      socket.disconnect();
    };
  }, []);

  return null;
}
