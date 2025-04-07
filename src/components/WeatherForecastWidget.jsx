// src/components/WeatherForecastWidget.jsx
import React from "react";

const forecastData = [
  { day: "Sat", condition: "Rain", icon: "🌧️", high: 15, low: 10 },
  { day: "Sun", condition: "Clouds", icon: "⛅", high: 17, low: 11 },
  { day: "Mon", condition: "Clear", icon: "☀️", high: 19, low: 12 },
];

export default function WeatherForecastWidget() {
  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        3-Day Forecast
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {forecastData.map((day, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-24 p-3 bg-white dark:bg-zinc-800 rounded-xl shadow text-center"
          >
            <p className="text-sm font-medium text-gray-800 dark:text-white">{day.day}</p>
            <p className="text-2xl mt-1">{day.icon}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{day.condition}</p>
            <p className="text-xs mt-1">
              H: {day.high}° / L: {day.low}°
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
