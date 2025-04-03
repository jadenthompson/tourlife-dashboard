import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plane, Clock, RefreshCw, AlertTriangle } from "lucide-react";
import supabase from "../supabaseClient";

export default function FlightWidget() {
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFlightData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: dbError } = await supabase
        .from("travel_segments")
        .select("flight_number, departure_city, arrival_city, departure_time, arrival_time, airline")
        .order("departure_time", { ascending: true })
        .limit(1)
        .single();

      if (dbError) throw dbError;
      if (!data) throw new Error("No upcoming flights found");

      setFlight({
        flight_number: data.flight_number || "",
        departure_city: data.departure_city || "Unknown",
        arrival_city: data.arrival_city || "Unknown",
        departure_time: data.departure_time,
        arrival_time: data.arrival_time,
        airline: data.airline || "Unknown",
        status: "Scheduled",
      });
    } catch (err) {
      console.error("Flight fetch error:", err.message);
      setError(err.message);
      setFlight(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlightData();
    const interval = setInterval(fetchFlightData, 600000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (time) => {
    if (!time) return "--:--";
    const date = new Date(time);
    return isNaN(date) ? "--:--" : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active": return "text-green-500";
      case "landed": return "text-blue-500";
      case "cancelled": return "text-red-500";
      case "delayed": return "text-yellow-500";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Plane className="w-4 h-4" /> Flight
        </h2>
        <div className="flex items-center gap-2">
          {error && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
          <button 
            onClick={fetchFlightData}
            disabled={loading}
            className={`text-xs ${loading ? 'text-gray-400' : 'text-blue-600 hover:underline'} flex items-center gap-1`}
          >
            {loading ? 'Refreshing...' : <RefreshCw className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-5 w-3/4 bg-gray-200 rounded dark:bg-gray-700"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded dark:bg-gray-700"></div>
        </div>
      ) : error ? (
        <div className="text-sm text-red-500 py-2">{error}</div>
      ) : flight ? (
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">
                {flight.airline} {flight.flight_number}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {flight.departure_city} → {flight.arrival_city}
              </p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(flight.status)}`}>
              {flight.status}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm mt-2">
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
              <Clock className="w-3 h-3" />
              <span>{formatTime(flight.departure_time)}</span>
            </div>
            <span className="text-gray-400">→</span>
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
              <Clock className="w-3 h-3" />
              <span>{formatTime(flight.arrival_time)}</span>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No flight information available
        </p>
      )}
    </div>
  );
}
