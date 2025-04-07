import React, { useEffect, useState } from "react";
import {
  Hotel,
  MapPin,
  Calendar,
  Phone,
  RefreshCw,
  BadgeCheck,
  AlertTriangle,
} from "lucide-react";
import Lottie from "lottie-react";
import supabase from "../supabaseClient";
import hotelLottie from "../assets/lottie/hotel.json";

export default function HotelWidget() {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHotel = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("accommodations")
        .select("*")
        .order("check_in", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setHotel(data);
    } catch (err) {
      console.error("HotelWidget error:", err.message);
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
    const date = new Date(dateString);
    return isNaN(date)
      ? ""
      : date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Hotel className="w-5 h-5" /> Hotel
        </h2>
        <button
          onClick={fetchHotel}
          disabled={loading}
          className={`text-xs ${
            loading ? "text-gray-400" : "text-blue-600 hover:underline"
          } flex items-center gap-1`}
        >
          {loading ? "Refreshing..." : <RefreshCw className="w-3 h-3" />}
        </button>
      </div>

      <div className="rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-zinc-800 dark:to-zinc-900 p-4 shadow-md relative overflow-hidden">
        {/* Lottie Animation */}
        <Lottie
          animationData={hotelLottie}
          loop
          autoplay
          className="absolute bottom-2 right-2 w-24 h-24 opacity-40 pointer-events-none"
        />

        {loading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading hotel...
          </p>
        ) : error ? (
          <div className="flex items-center text-red-500 text-sm gap-2">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        ) : hotel ? (
          <>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              {hotel.name}
            </h3>

            <p className="flex items-center gap-2 text-sm mt-1 text-gray-700 dark:text-gray-300">
              <MapPin className="w-4 h-4" />
              {hotel.address}
            </p>

            <p className="flex items-center gap-2 text-sm mt-1 text-gray-700 dark:text-gray-300">
              <Calendar className="w-4 h-4" />
              {formatDate(hotel.check_in)} → {formatDate(hotel.check_out)}
            </p>

            <p className="flex items-center gap-2 text-sm mt-1 text-gray-700 dark:text-gray-300">
              <BadgeCheck className="w-4 h-4" />
              Confirmation #:{" "}
              <span className="font-semibold">{hotel.reservation_number}</span>
            </p>

            <p className="flex items-center gap-2 text-sm mt-1 text-blue-600 dark:text-blue-400">
              <Phone className="w-4 h-4" />
              <a href={`tel:${hotel.contact_phone}`}>{hotel.contact_phone}</a>
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No hotel data available.
          </p>
        )}
      </div>
    </div>
  );
}
