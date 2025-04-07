// src/components/CalendarSummaryWidget.jsx
import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

export default function CalendarSummaryWidget() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const now = dayjs().startOf("day").toISOString();

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .gte("start_time", now)
      .order("start_time", { ascending: true })
      .limit(5);

    if (error) {
      console.error("Error loading events:", error.message);
    } else {
      setEvents(data);
    }

    setLoading(false);
  };

  const renderEvent = (event) => {
    const localTime = dayjs.utc(event.start_time).tz(dayjs.tz.guess());
    return (
      <div
        key={event.id}
        className="mb-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-2 text-sm shadow-sm"
      >
        <div className="font-medium">{event.name || "Untitled Event"}</div>
        <div className="text-gray-500 text-xs">
          {localTime.format("ddd, MMM D")} • {localTime.format("h:mm A")}
        </div>
        {event.city && (
          <div className="text-xs text-blue-500 font-semibold">
            {event.city}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="text-sm">
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : events.length === 0 ? (
        <p className="text-gray-400 italic">No upcoming events</p>
      ) : (
        <div>{events.map(renderEvent)}</div>
      )}
    </div>
  );
}
