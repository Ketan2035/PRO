import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export default function AvailabilityCalendar({ professionalId }) {
  const [schedule, setSchedule] = useState({
    monday: [], tuesday: [], wednesday: [], thursday: [],
    friday: [], saturday: [], sunday: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!professionalId) return;
    const fetchAvailability = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/availability/${professionalId}`, { credentials: "include" });
        const data = await res.json();
        if (data.success && data.availability) {
          setSchedule(data.availability.schedule || schedule);
        }
      } catch (err) {
        console.error("Error fetching availability", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailability();
  }, [professionalId]);

  const handleAddSlot = (day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), { start: "09:00", end: "17:00" }]
    }));
  };

  const handleRemoveSlot = (day, index) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }));
  };

  const handleSlotChange = (day, index, field, value) => {
    setSchedule(prev => {
      const newDay = [...prev[day]];
      newDay[index] = { ...newDay[index], [field]: value };
      return { ...prev, [day]: newDay };
    });
  };

  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ schedule })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Availability updated successfully");
      } else {
        toast.error("Failed to update availability");
      }
    } catch (err) {
      toast.error("Error updating availability");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl font-bold text-gray-900">Availability Calendar</h2>
        <button 
          onClick={handleSave}
          className="bg-[#2874f0] hover:bg-blue-600 text-white px-4 py-2 rounded-sm text-sm font-medium transition"
        >
          Save Schedule
        </button>
      </div>

      <div className="space-y-6">
        {DAYS.map(day => (
          <div key={day} className="flex flex-col md:flex-row md:items-start gap-4 border-b border-gray-100 pb-4">
            <div className="w-32 pt-2">
              <span className="font-semibold capitalize text-gray-800">{day}</span>
            </div>
            <div className="flex-1 space-y-2">
              {(!schedule[day] || schedule[day].length === 0) ? (
                <div className="text-gray-400 text-sm italic py-2">Unavailable</div>
              ) : (
                schedule[day].map((slot, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input 
                      type="time" 
                      value={slot.start}
                      onChange={(e) => handleSlotChange(day, index, 'start', e.target.value)}
                      className="border border-gray-300 rounded p-1.5 text-sm"
                    />
                    <span className="text-gray-500">to</span>
                    <input 
                      type="time" 
                      value={slot.end}
                      onChange={(e) => handleSlotChange(day, index, 'end', e.target.value)}
                      className="border border-gray-300 rounded p-1.5 text-sm"
                    />
                    <button 
                      onClick={() => handleRemoveSlot(day, index)}
                      className="text-red-500 hover:text-red-700 ml-2"
                      title="Remove slot"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
              <button 
                onClick={() => handleAddSlot(day)}
                className="text-[#2874f0] text-sm font-medium hover:underline flex items-center gap-1 mt-1"
              >
                + Add Slot
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
