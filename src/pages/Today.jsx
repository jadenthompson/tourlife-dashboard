// src/pages/Today.jsx
import React, { useEffect, useState } from "react";
import { Settings, Plane, Hotel, Cloud, Landmark } from "lucide-react";

import FlightWidget from "../components/FlightWidget";
import HotelWidget from "../components/HotelWidget";
import WeatherWidget from "../components/WeatherWidget";
import CityPhotoWidget from "../components/CityPhotoWidget";

export default function Today() {
  const [timeOfDay, setTimeOfDay] = useState("morning");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDay("morning");
    else if (hour >= 12 && hour < 18) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");
  }, []);

  const greetingText = {
    morning: "Good morning",
    afternoon: "Good afternoon",
    evening: "Good evening",
  }[timeOfDay];

  const widgets = [
    {
      name: "Flight",
      icon: <Plane className="w-4 h-4 inline-block mr-1" />,
      component: <FlightWidget />,
    },
    {
      name: "Hotel",
      icon: <Hotel className="w-4 h-4 inline-block mr-1" />,
      component: <HotelWidget />,
    },
    {
      name: "Weather",
      icon: <Cloud className="w-4 h-4 inline-block mr-1" />,
      component: <WeatherWidget />,
    },
    {
      name: "Next City",
      icon: <Landmark className="w-4 h-4 inline-block mr-1" />,
      component: <CityPhotoWidget />,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center px-4 pt-6 pb-2">
        <h1 className="text-2xl font-bold">{greetingText},</h1>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Swipeable widgets container */}
      <div className="overflow-x-auto no-scrollbar px-4">
        <div className="flex w-max gap-4 pb-4">
          {widgets.map((widget, index) => (
            <div
              key={index}
              className="min-w-[300px] max-w-[300px] bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-md p-4 flex-shrink-0 snap-center"
            >
              <h2 className="text-lg font-semibold mb-2">
                {widget.icon}
                {widget.name}
              </h2>
              {widget.component}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom nav placeholder */}
      <div className="text-center text-sm text-gray-400 mt-10">
        BottomNav coming soon...
      </div>
    </div>
  );
}