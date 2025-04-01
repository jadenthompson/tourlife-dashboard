import { useEffect, useState } from "react";
import supabase from "../supabaseClient";

export default function ShareStoryCard({ tourId }) {
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchNextEvent = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("tour_id", tourId)
        .order("start_time", { ascending: true })
        .limit(1);

      if (!error && data?.length > 0) {
        setEvent(data[0]);
      }
    };

    fetchNextEvent();
  }, [tourId]);

  if (!event) {
    return (
      <div className="flex items-center justify-center h-[600px] w-[360px] bg-white text-gray-400 border rounded-xl shadow">
        Loading show card...
      </div>
    );
  }

  const formattedDate = new Date(event.start_time).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className="w-[360px] h-[640px] bg-gradient-to-b from-black to-gray-900 text-white flex flex-col justify-between p-6 rounded-3xl shadow-2xl border border-gray-700"
      style={{ fontFamily: "sans-serif" }}
    >
      <div className="text-sm uppercase tracking-widest text-gray-400">
        TourLife Presents
      </div>

      <div className="mt-4 text-center">
        <h1 className="text-3xl font-bold">{event.city}</h1>
        <p className="text-sm text-gray-300 mt-1">{event.venue}</p>
        <p className="text-base mt-2">{formattedDate}</p>
      </div>

      <div className="mt-6 flex flex-col items-center">
        <div className="text-2xl font-semibold">Jaden Thompson</div>
        <p className="text-sm text-gray-400">Echo World Tour</p>
      </div>

      <div className="mt-auto pt-4 flex flex-col items-center">
        <p className="text-xs text-gray-500">📲 Scan or share</p>
        <div className="w-24 h-24 bg-white text-black text-xs flex items-center justify-center rounded-lg mt-2">
          QR
        </div>
      </div>
    </div>
  );
}
