import { useEffect, useState } from "react";
import supabase from "../supabaseClient";

export default function HotelWidget() {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHotel = async () => {
    const { data, error } = await supabase
      .from("accommodations")
      .select("*")
      .order("check_in", { ascending: true })
      .limit(1);

    if (error) {
      console.error("Error fetching hotel:", error.message);
      setHotel(null);
    } else {
      setHotel(data[0]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchHotel();
  }, []);

  if (loading) return <div className="text-sm text-gray-500">Loading hotel info...</div>;
  if (!hotel) return <div className="text-sm text-gray-500">🏨 No hotel booked yet.</div>;

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-1">🏨 Hotel Info</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">{hotel.name}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{hotel.address}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Reservation #: <span className="font-medium">{hotel.reservation_number || "—"}</span>
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Check-in: {new Date(hotel.check_in).toLocaleDateString()} | Check-out:{" "}
        {new Date(hotel.check_out).toLocaleDateString()}
      </p>
    </div>
  );
}
