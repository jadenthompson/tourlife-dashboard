import { useEffect, useState } from "react";
import axios from "axios";
import { CloudSun, Thermometer, RefreshCw, AlertTriangle } from "lucide-react";
import { Player } from "@lottiefiles/react-lottie-player";
import supabase from "../supabaseClient";

// 🌦 Lottie animations
import clearDay from "../animations/clear-day.json";
import cloudy from "../animations/cloudy.json";
import rain from "../animations/rain.json";
import thunder from "../animations/thunder.json";
import snow from "../animations/snow.json";
import fog from "../animations/fog.json";

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState("metric");
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const { data: userResult } = await supabase.auth.getUser();
        const userId = userResult?.user?.id;
        if (!userId) return;

        const { data } = await supabase
          .from("users")
          .select("temp_unit")
          .eq("id", userId)
          .single();

        setUnit(data?.temp_unit === "F" ? "imperial" : "metric");
      } catch (err) {
        console.warn("Could not load user temp unit:", err.message);
      }
    };

    fetchUnit();
  }, []);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!import.meta.env.VITE_OWM_KEY) {
        throw new Error("Weather API key not configured");
      }

      let city = "London";
      try {
        const { data: artistData } = await supabase
          .from("artists")
          .select("city")
          .limit(1)
          .maybeSingle();

        if (artistData?.city) {
          city = artistData.city;
        } else {
          const { data: eventData } = await supabase
            .from("events")
            .select("city")
            .order("start_time", { ascending: true })
            .limit(1)
            .maybeSingle();

          if (eventData?.city) city = eventData.city;
        }
      } catch (fallbackErr) {
        console.warn("City fallback error:", fallbackErr.message);
      }

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_OWM_KEY}&units=${unit}`
      );

      const data = response.data;

      setWeather({
        city: data.name,
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        high: data.main.temp_max,
        low: data.main.temp_min,
        condition: data.weather[0].main,
        description: data.weather[0].description,
      });

      setLastUpdated(new Date());
    } catch (err) {
      console.error("Weather fetch error:", err.message);
      setError(err.response?.data?.message || err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [unit]);

  const formatTemp = (temp) =>
    temp ? `${Math.round(temp)}°${unit === "metric" ? "C" : "F"}` : "--";

  const getWeatherAnimation = (condition) => {
    const lower = condition?.toLowerCase();
    if (!lower) return cloudy;
    if (lower.includes("clear")) return clearDay;
    if (lower.includes("sky")) return clearDay;
    if (lower.includes("cloud")) return cloudy;
    if (lower.includes("rain") || lower.includes("drizzle")) return rain;
    if (lower.includes("thunder")) return thunder;
    if (lower.includes("snow")) return snow;
    if (lower.includes("fog") || lower.includes("mist") || lower.includes("haze")) return fog;
    return cloudy;
  };

  return (
    <div className="bg-gradient-to-br from-sky-100 via-white to-blue-50 dark:from-zinc-800 dark:to-zinc-900 rounded-xl shadow-lg p-5 transition-all duration-300 hover:shadow-xl">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
          <CloudSun className="w-5 h-5" />
          Weather
        </h2>
        <button
          onClick={fetchWeather}
          disabled={loading}
          className={`text-xs flex items-center gap-1 ${
            loading
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-600 dark:text-blue-400 hover:underline"
          }`}
        >
          {loading ? "Refreshing..." : <RefreshCw className="w-4 h-4" />}
        </button>
      </div>

      {error ? (
        <div className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      ) : loading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-6 w-1/2 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-600 rounded"></div>
        </div>
      ) : weather ? (
        <>
          <div className="flex items-center gap-4">
            <Player
              autoplay
              loop
              src={getWeatherAnimation(weather.condition)}
              style={{ height: "64px", width: "64px" }}
            />
            <div>
              <p className="text-lg font-medium">{weather.city}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {weather.description || weather.condition}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-1 text-gray-700 dark:text-gray-200">
            <p className="text-3xl font-bold">{formatTemp(weather.temp)}</p>
            <p className="text-sm flex items-center gap-1">
              <Thermometer className="w-4 h-4" />
              Feels like: {formatTemp(weather.feels_like)}
            </p>
            <p className="text-sm">
              H: {formatTemp(weather.high)} / L: {formatTemp(weather.low)}
            </p>
          </div>
        </>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No weather data available
        </p>
      )}

      {lastUpdated && (
        <p className="text-xs text-gray-400 mt-3">
          Updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
