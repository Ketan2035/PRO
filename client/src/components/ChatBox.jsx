import React, { useState, useEffect, useRef } from "react";
import { socket } from "../socket";
import { X, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function ChatBox({ bookingId, senderId, senderModel, partnerName, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/chat/${bookingId}`, {
          credentials: "include"
        });
        const data = await res.json();
        if (data.success) {
          setMessages(data.messages);
        }
      } catch (err) {
        console.error("Failed to fetch chat history");
      }
    };
    fetchHistory();
  }, [bookingId]);

  useEffect(() => {
    if (!socket.connected) socket.connect();
    socket.emit("joinBooking", bookingId);

    const handleReceiveMessage = (newMessage) => {
      setMessages((prev) => {
        // Prevent duplicate messages if sender is also receiving
        if (prev.some(m => m._id === newMessage._id)) return prev;
        return [...prev, newMessage];
      });
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [bookingId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    socket.emit("sendMessage", {
      bookingId,
      senderId,
      senderModel,
      text: text.trim()
    });

    setText("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-[60] w-80 bg-white rounded-t-xl rounded-bl-xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden h-[400px]">
      <div className="bg-[#2874f0] text-white p-3 flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-sm">Chat with {partnerName}</h3>
          <p className="text-xs text-blue-100">Live Support</p>
        </div>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
        {messages.length === 0 ? (
          <p className="text-center text-xs text-gray-400 mt-4">Start the conversation...</p>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.senderId === senderId;
            return (
              <div key={i} className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${isMe ? "bg-[#2874f0] text-white self-end rounded-br-none" : "bg-white border border-gray-200 text-gray-800 self-start rounded-bl-none"}`}>
                {msg.text}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 border-t border-gray-200 bg-white flex gap-2">
        <input 
          type="text" 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:border-[#2874f0]"
        />
        <button type="submit" className="bg-[#2874f0] text-white p-2 rounded-full hover:bg-blue-600 transition">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
