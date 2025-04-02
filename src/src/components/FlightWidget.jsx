import React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import supabase from "../supabaseClient"; // ✅ FIXED PATH
import getIataFromCity from "../utils/getIataFromCity";


export default function FlightWidget() {
  const [flightInfo, setFlightInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFlightData = async () => {
    try {
      const { data: segments, error: travelError } = await supabase
        .from("travel_segments")
        .select("*")
        .order("departure_time", { ascending: true })
        .limit(1);

      if (travelError) throw travelError;
      if (!segments || segments.length === 0) throw new Error("No upcoming flights.");

      const segment = segments[0];
      const { flight_number, departure_city, arrival_city, departure_time, arrival_time } = segment;

      const depIATA = getIataFromCity(departure_city);
      const arrIATA = getIataFromCity(arrival_city);

      const fallback = {
        flight_number,
        departure_city,
        arrival_city,
        departure_time,
        arrival_time,
        depIATA,
        arrIATA,
        fallback: true,
      };

      if (!flight_number || !depIATA || !arrIATA) {
        setFlightInfo(fallback);
        return;
      }

      const res = await axios.get(
        `http://api.aviationstack.com/v1/flights?access_key=43c3f963a4e81c270ff7735395a8bb24&flight_iata=${flight_number}`
      );

      if (res.data?.data?.length > 0) {
        const live = res.data.data[0];
        const info = {
          flight_number,
          departure_city,
          arrival_city,
          departure_time: live.departure?.scheduled || departure_time,
          arrival_time: live.arrival?.scheduled || arrival_time,
          depIATA,
          arrIATA,
          airline: live.airline?.name || "Unknown Airline",
          fallback: false,
        };
        setFlightInfo(info);
      } else {
        setFlightInfo(fallback);
      }
    } catch (err) {
      console.error("FlightWidget error:", err.message);
      setError("Using cached flight status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlightData();
  }, []);

  const formatTime = (time) => {
    const date = new Date(time);
    return isNaN(date) ? "–" : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (loading) return <div className="text-sm text-gray-500">Loading flight...</div>;
  if (error) return <div className="text-sm text-yellow-600">⚠️ {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-1">✈️ {flightInfo.flight_number || "Unknown flight"}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {flightInfo.departure_city} → {flightInfo.arrival_city}{" "}
        <span className="ml-1 text-xs text-gray-400">
          ({flightInfo.depIATA} → {flightInfo.arrIATA})
        </span>
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {formatTime(flightInfo.departure_time)} → {formatTime(flightInfo.arrival_time)}
      </p>
      {flightInfo.fallback && (
        <p className="text-xs text-yellow-600 mt-1">Using fallback flight info (API limit reached).</p>
      )}
    </div>
  );
}
