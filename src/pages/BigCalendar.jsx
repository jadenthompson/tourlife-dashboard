import React, { useEffect, useState } from "react";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  Views,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import supabase from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "../styles/BigCalendarCustom.css";

const localizer = momentLocalizer(moment);

const emojiForType = {
  gig: "🦩",
  press: "📸",
  travel: "✈️",
  studio: "🎧",
  hotel: "🏨",
};

export default function BigCalendarView() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [theme, setTheme] = useState("light"); // 💡 theme state
  const [formData, setFormData] = useState({
    name: "",
    type: "gig",
    start: "",
    end: "",
    city: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
    detectTheme();

    // Optional: listen to system theme changes live
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setTheme(mediaQuery.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const detectTheme = () => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  };

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("id, name, start_time, end_time, city, type");

    if (!error && Array.isArray(data)) {
      const formatted = data
        .filter((event) => event && event.start_time)
        .map((event) => ({
          id: event.id,
          title: `${emojiForType[event.type] || ""} ${event.name || "Untitled Event"}`,
          start: new Date(event.start_time),
          end: event.end_time ? new Date(event.end_time) : new Date(event.start_time),
          city: event.city,
          allDay: false,
          type: event.type,
        }));
      setEvents(formatted);
    } else {
      console.error("Fetch error:", error?.message);
    }
    setLoading(false);
  };

  const handleSelectEvent = (event) => {
    if (event && event.id) navigate(`/event/${event.id}`);
  };

  const handleAddEvent = async () => {
    const { name, type, start, end, city } = formData;
    if (!name || !start) return;

    const { error } = await supabase.from("events").insert([
      {
        name,
        type,
        start_time: new Date(start),
        end_time: end ? new Date(end) : null,
        city,
      },
    ]);

    if (!error) {
      fetchEvents();
      setFormData({ name: "", type: "gig", start: "", end: "", city: "" });
      setShowModal(false);
    } else {
      console.error("Insert error:", error.message);
    }
  };

  return (
    <div className="relative pt-4 px-2 pb-24 bg-gradient-to-br from-white to-zinc-100 dark:from-black dark:to-zinc-900 text-black dark:text-white min-h-screen">
      <h1 className="text-3xl font-semibold mb-4 px-2">📅 Tour Calendar</h1>

      <div className="rounded-2xl overflow-hidden shadow-xl backdrop-blur bg-white/30 dark:bg-zinc-800/30 p-3">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "calc(100vh - 180px)" }}
          onSelectEvent={handleSelectEvent}
          views={Object.values(Views)}
          defaultView="month"
          popup
          eventPropGetter={(event) => {
            const baseColor = {
              gig: "#8b5cf6",
              press: "#f59e0b",
              travel: "#3b82f6",
              studio: "#10b981",
              hotel: "#ef4444",
            }[event.type] || "#6366f1";
          
            const isDarkMode = document.documentElement.classList.contains('dark'); // ✅ More reliable in Tailwind
            const textColor = isDarkMode ? "#ffffff" : "#111827";
          
            return {
              style: {
                backgroundColor: `${baseColor}20`,
                borderLeft: `4px solid ${baseColor}`,
                color: textColor, // ✅ Correct text color now
                borderRadius: "8px",
                paddingLeft: "8px",
                fontWeight: "500",
                fontSize: "0.85rem",
              },
            };
          }}
          
          components={{
            toolbar: CustomToolbar,
          }}
        />
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-24 right-6 bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 text-white rounded-full p-4 shadow-2xl z-50"
      >
        ➕
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 w-11/12 max-w-md shadow-2xl space-y-4">
            <h2 className="text-lg font-semibold dark:text-white">Add New Event</h2>
            <input
              type="text"
              placeholder="Event Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 rounded bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white border"
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full p-2 rounded bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white border"
            >
              <option value="gig">🪩 Gig</option>
              <option value="press">📸 Press</option>
              <option value="travel">✈️ Travel</option>
              <option value="studio">🎧 Studio</option>
              <option value="hotel">🏨 Hotel</option>
            </select>
            <input
              type="datetime-local"
              value={formData.start}
              onChange={(e) => setFormData({ ...formData, start: e.target.value })}
              className="w-full p-2 rounded bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white border"
            />
            <input
              type="datetime-local"
              value={formData.end}
              onChange={(e) => setFormData({ ...formData, end: e.target.value })}
              className="w-full p-2 rounded bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white border"
            />
            <input
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full p-2 rounded bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white border"
            />
            <div className="flex justify-between pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-zinc-300 dark:bg-zinc-700 rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CustomToolbar({ label, onNavigate, onView }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 px-2">
      <div className="flex gap-2">
        <button
          onClick={() => onNavigate("TODAY")}
          className="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
        >
          Today
        </button>
        <button
          onClick={() => onNavigate("PREV")}
          className="px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-800 text-sm"
        >
          ←
        </button>
        <button
          onClick={() => onNavigate("NEXT")}
          className="px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-800 text-sm"
        >
          →
        </button>
      </div>
      <h2 className="text-lg font-semibold py-2">{label}</h2>
      <div className="flex gap-2">
        {["month", "week", "day", "agenda"].map((view) => (
          <button
            key={view}
            onClick={() => onView(view)}
            className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600"
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
