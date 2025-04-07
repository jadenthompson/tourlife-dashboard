import React, { useEffect, useState } from "react";
import { Plane, Hotel, CalendarDays, AlertTriangle } from "lucide-react";
import supabase from "../supabaseClient";

export default function TravelSummaryWidget() {
  const [flight, setFlight] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Upcoming flight (travel_segments)
        const { data: flightData } = await supabase
          .from("travel_segments")
          .select("*")
          .order("departure_time", { ascending: true })
          .limit(1)
          .maybeSingle();

        // Upcoming hotel (accommodations)
        const { data: hotelData } = await supabase
          .from("accommodations")
          .select("*")
          .order("check_in", { ascending: true })
          .limit(1)
          .maybeSingle();

        setFlight(flightData);
        setHotel(hotelData);
      } catch (err) {
        console.error("Travel summary error:", err.message);
        setError("Could not load travel summary");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="text-sm text-gray-800 dark:text-gray-100 space-y-3">
      {loading ? (
        <p className="text-gray-400">Loading travel summary...</p>
      ) : error ? (
        <div className="text-red-500 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> {error}
        </div>
      ) : (
        <>
          {/* Flight Summary */}
          {flight ? (
            <div className="flex items-start gap-3">
              <Plane className="w-4 h-4 mt-1" />
              <div>
                <p className="font-medium">
                  {flight.airline} {flight.flight_number}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {flight.departure_city} → {flight.arrival_city}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(flight.departure_time)} @{" "}
                  {new Date(flight.departure_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              <Plane className="w-4 h-4 inline mr-1" />
              No flights scheduled
            </p>
          )}

          {/* Hotel Summary */}
          {hotel ? (
            <div className="flex items-start gap-3">
              <Hotel className="w-4 h-4 mt-1" />
              <div>
                <p className="font-medium">{hotel.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {hotel.address}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(hotel.check_in)} → {formatDate(hotel.check_out)}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              <Hotel className="w-4 h-4 inline mr-1" />
              No hotels booked
            </p>
          )}
        </>
      )}
    </div>
  );
}
