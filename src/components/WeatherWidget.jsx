import React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import supabase from "../supabaseClient";


const API_KEY = "c4fcfb66c58944867e5e9fd0e32a0dd7";


export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("metric"); // "imperial" for °F

  const fetchWeather = async () => {
    try {
      // Get artist city from Supabase
      const { data: artistData, error: artistError } = await supabase
        .from("artists")
        .select("city")
        .limit(1)
        .single();

      if (artistError) throw artistError;

      const city = artistData?.city || "London"; // fallback city
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`
      );

      if (response.data) {
        setWeather({
          city: response.data.name,
          temp: response.data.main.temp,
          feels_like: response.data.main.feels_like,
          high: response.data.main.temp_max,
          low: response.data.main.temp_min,
          condition: response.data.weather[0].main,
          icon: response.data.weather[0].icon,
        });
      } else {
        throw new Error("No weather data.");
      }
    } catch (err) {
      console.error("Weather fetch error:", err.message);
      setError("Failed to load weather.");
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [unit]);

  const toggleUnit = () => {
    setUnit((prev) => (prev === "metric" ? "imperial" : "metric"));
  };

  const formatTemp = (temp) =>
    temp ? `${Math.round(temp)}°${unit === "metric" ? "C" : "F"}` : "--";

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-1">🌤 Weather Forecast</h2>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {weather && (
        <div className="flex flex-col items-start space-y-1">
          <div className="flex items-center gap-3">
            {/* Weather icon */}
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.condition}
              className="w-12 h-12"
            />

            <div>
              <p className="text-sm font-medium">{weather.city}</p>
              <p className="text-sm text-gray-500">{weather.condition}</p>
            </div>
          </div>

          <p className="text-2xl font-semibold">{formatTemp(weather.temp)}</p>
          <p className="text-sm text-gray-600">
            Feels like: {formatTemp(weather.feels_like)}
          </p>
          <p className="text-sm text-gray-600">
            H: {formatTemp(weather.high)} / L: {formatTemp(weather.low)}
          </p>

          <button
            onClick={toggleUnit}
            className="text-xs mt-2 underline text-blue-600"
          >
            Switch to {unit === "metric" ? "°F" : "°C"}
          </button>
        </div>
      )}
    </div>
  );
}
