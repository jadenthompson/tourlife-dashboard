import React from 'react';
// /src/pages/Today.jsx
import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import supabase from "../supabase/supabaseClient";
import FlightWidget from "../components/FlightWidget";
import HotelWidget from "../components/HotelWidget";
import WeatherWidget from "../components/WeatherWidget";
import VenuePhotoWidget from "../components/VenuePhotoWidget";

export default function Today() {
  const [artist, setArtist] = useState(null);
  const [widgetIndex, setWidgetIndex] = useState(0);

  const fetchArtist = async () => {
    const { data } = await supabase.from("artists").select("*").limit(1).single();
    setArtist(data);
  };

  const widgets = [<FlightWidget />, <HotelWidget />, <WeatherWidget />, <VenuePhotoWidget />];

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setWidgetIndex((prev) => (prev + 1) % widgets.length),
    onSwipedRight: () => setWidgetIndex((prev) => (prev - 1 + widgets.length) % widgets.length),
    trackMouse: true,
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning,";
    if (hour < 18) return "Good afternoon,";
    return "Good evening,";
  };

  useEffect(() => {
    fetchArtist();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">{getGreeting()}</h1>
          {artist && <p className="text-sm text-gray-500">{artist.name} – {artist.current_tour}</p>}
        </div>
        <button className="text-gray-400 hover:text-black dark:hover:text-white text-lg">⚙️</button>
      </div>

      <div {...swipeHandlers} className="relative w-full">
        <div className="transition-all duration-300">{widgets[widgetIndex]}</div>
        <div className="flex justify-center mt-2 space-x-1">
          {widgets.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === widgetIndex ? "bg-black dark:bg-white" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-md font-semibold mb-2">AI Assistant</h2>
        <div className="grid grid-cols-3 gap-2">
          <button className="bg-gray-100 dark:bg-gray-800 px-2 py-2 rounded text-sm">🛏 When should I sleep?</button>
          <button className="bg-gray-100 dark:bg-gray-800 px-2 py-2 rounded text-sm">✈️ Optimize my travel</button>
          <button className="bg-gray-100 dark:bg-gray-800 px-2 py-2 rounded text-sm">📝 Summarize today</button>
        </div>
      </div>
    </div>
  );
}
