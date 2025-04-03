import { useEffect, useState } from "react";
import axios from "axios";
import { CloudSun, Thermometer, RefreshCw, AlertTriangle } from "lucide-react";
import supabase from "../supabaseClient";

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState("metric");
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Verify API key is configured
      if (!import.meta.env.VITE_OWM_KEY) {
        throw new Error("Weather API key not configured");
      }

      // Get location - try multiple tables with fallbacks
      let city = "London"; // Default fallback
      try {
        // Try tour_locations first
        let { data } = await supabase
          .from("tour_locations")
          .select("current_city")
          .limit(1)
          .single();

        // Fallback to artists table if needed
        if (!data?.current_city) {
          ({ data } = await supabase
            .from("artists")
            .select("city")
            .limit(1)
            .single());
          if (data?.city) city = data.city;
        } else {
          city = data.current_city;
        }
      } catch (dbError) {
        console.warn("Using fallback city:", dbError.message);
      }

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_OWM_KEY}&units=${unit}`,
        { timeout: 5000 }
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
        setLastUpdated(new Date());
      } else {
        throw new Error("No weather data received");
      }
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
    const interval = setInterval(fetchWeather, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, [unit]);

  const formatTemp = (temp) => 
    temp ? `${Math.round(temp)}°${unit === "metric" ? "C" : "F"}` : "--";

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <CloudSun className="w-4 h-4" /> Weather
        </h2>
        <div className="flex items-center gap-2">
          {error && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
          <button 
            onClick={fetchWeather}
            disabled={loading}
            className={`text-xs ${loading ? 'text-gray-400' : 'text-blue-600 hover:underline'} flex items-center gap-1`}
          >
            {loading ? 'Refreshing...' : <RefreshCw className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {error ? (
        <div className="text-sm text-red-500 py-2">{error}</div>
      ) : loading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-6 w-3/4 bg-gray-200 rounded dark:bg-gray-700"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded dark:bg-gray-700"></div>
        </div>
      ) : weather ? (
        <>
          <div className="flex items-center gap-3">
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.condition}
              className="w-12 h-12"
              onError={(e) => {
                e.target.src = '/weather-fallback.svg';
                e.target.className = 'w-8 h-8 opacity-70';
              }}
            />
            <div>
              <p className="font-medium">{weather.city}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {weather.condition}
              </p>
            </div>
          </div>

          <div className="mt-3 space-y-1">
            <p className="text-2xl font-semibold">{formatTemp(weather.temp)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
              <Thermometer className="w-3 h-3" />
              Feels like: {formatTemp(weather.feels_like)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              H: {formatTemp(weather.high)} / L: {formatTemp(weather.low)}
            </p>
          </div>

          <button
            onClick={() => setUnit(prev => prev === "metric" ? "imperial" : "metric")}
            className="text-xs mt-2 text-blue-600 hover:underline dark:text-blue-400"
          >
            Switch to {unit === "metric" ? "°F" : "°C"}
          </button>
        </>
      ) : (
        <p className="text-sm text-gray-500">No weather data available</p>
      )}
      
      {lastUpdated && (
        <p className="text-xs text-gray-400 mt-2">
          Updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}