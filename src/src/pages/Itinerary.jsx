import React from 'react';
import { useEffect, useState } from "react";
import supabase from "../supabaseClient";

export default function Itinerary() {
  const [events, setEvents] = useState([]);
  const tourId = "00000000-0000-0000-0000-000000000003";

  useEffect(() => {
    const fetchData = async () => {
      const { data: eventsData, error } = await supabase
        .from("events")
        .select("*")
        .eq("tour_id", tourId)
        .order("date", { ascending: true });

      if (error) console.error("Error loading events:", error.message);
      else setEvents(eventsData || []);
    };

    fetchData();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date)) return "Invalid Date";
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">🗓️ Tour Itinerary</h1>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

function EventCard({ event }) {
  const [travel, setTravel] = useState([]);
  const [hotel, setHotel] = useState(null);
  const [guests, setGuests] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!event.id) return;

      const { data: travelData } = await supabase
        .from("travel_segments")
        .select("*")
        .eq("event_id", event.id)
        .order("departure_time", { ascending: true });
      setTravel(travelData || []);

      const { data: hotelData, error: hotelError } = await supabase
        .from("accommodations")
        .select("*")
        .eq("event_id", event.id)
        .limit(1);

      if (!hotelError && hotelData && hotelData.length > 0) {
        setHotel(hotelData[0]);
      } else {
        setHotel(null);
      }

      const { data: guestData } = await supabase
        .from("guestlist")
        .select("*")
        .eq("event_id", event.id);
      setGuests(guestData || []);
    };

    fetchDetails();
  }, [event.id]);

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date)) return "";
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-3">
      <div>
        <h2 className="text-lg font-semibold">{event.city} – {event.venue}</h2>
        <p className="text-sm text-gray-500">
          {new Date(event.date).toDateString()} @ {formatTime(event.set_time)}
        </p>
      </div>

      {travel.length > 0 && (
        <div>
          <h3 className="font-semibold">Travel</h3>
          {travel.map((t) => (
            <div key={t.id} className="text-sm text-gray-600 dark:text-gray-300">
              ✈️ {t.dep_city} → {t.arr_city} | {formatTime(t.departure_time)} → {formatTime(t.arrival_time)}
              {t.airline && <div className="text-xs text-gray-400">Airline: {t.airline}</div>}
            </div>
          ))}
        </div>
      )}

      {hotel && (
        <div>
          <h3 className="font-semibold">Hotel</h3>
          <p className="text-sm">{hotel.hotel_name}</p>
          <p className="text-xs text-gray-500">{hotel.address}</p>
          <p className="text-xs text-gray-400">
            Check-in: {new Date(hotel.check_in).toDateString()} – Check-out: {new Date(hotel.check_out).toDateString()}
          </p>
        </div>
      )}

      <div>
        <h3 className="font-semibold">Guestlist</h3>
        {guests.length > 0 ? (
          <ul className="text-sm space-y-1">
            {guests.map((g) => (
              <li key={g.id} className="flex items-center gap-2">
                👤 <span className="font-medium">{g.name}</span>
                {g.note && <span className="text-gray-500 text-xs">{g.note}</span>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">No guests added.</p>
        )}
      </div>
    </div>
  );
}
