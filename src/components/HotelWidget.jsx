import React, { useEffect, useState } from "react";
import { Hotel, Calendar, MapPin, Phone, RefreshCw, AlertTriangle } from "lucide-react";
import supabase from "../supabaseClient";

export default function HotelWidget() {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHotel = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: dbError } = await supabase
        .from("accommodations")
        .select("name, address, reservation_number, check_in, check_out, contact_phone")
        .order("check_in", { ascending: true })
        .limit(1)
        .single();

      if (dbError) throw dbError;
      if (!data) throw new Error("No upcoming hotel bookings");

      setHotel({
        name: data.name || "Unnamed Hotel",
        address: data.address || "",
        reservation_number: data.reservation_number || "",
        check_in: data.check_in,
        check_out: data.check_out,
        contact_phone: data.contact_phone || ""
      });
    } catch (err) {
      console.error("Hotel fetch error:", err.message);
      setError(err.message);
      setHotel(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotel();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      weekday: "short"
    });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Hotel className="w-4 h-4" /> Hotel
        </h2>
        <div className="flex items-center gap-2">
          {error && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
          <button 
            onClick={fetchHotel}
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
      ) : hotel ? (
        <div className="space-y-2">
          <h3 className="font-medium">{hotel.name}</h3>

          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <p>{hotel.address || "Address not provided"}</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="w-3 h-3" />
            <p>
              {formatDate(hotel.check_in)} → {formatDate(hotel.check_out)}
            </p>
          </div>

          {hotel.reservation_number && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">Confirmation #:</span>
              <span>{hotel.reservation_number}</span>
            </div>
          )}

          {hotel.contact_phone && (
            <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 mt-1">
              <Phone className="w-3 h-3" />
              <a href={`tel:${hotel.contact_phone}`} className="hover:underline">
                {hotel.contact_phone}
              </a>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No hotel information available
        </p>
      )}
    </div>
  );
}
