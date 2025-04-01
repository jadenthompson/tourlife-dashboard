import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../supabaseClient";

export default function ShareTour() {
  const { id } = useParams(); // public_id like "echo-world-tour"
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTourAndEvent = async () => {
      setLoading(true);

      // 🔎 1. Get the UUID of the tour from public_id
      const { data: tourData, error: tourError } = await supabase
        .from("tours")
        .select("id")
        .eq("public_id", id)
        .single();

      if (tourError || !tourData) {
        console.error("Tour fetch failed", tourError);
        setLoading(false);
        return;
      }

      const tourId = tourData.id;

      // 🗓️ 2. Fetch event using actual tour UUID
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("*")
        .eq("tour_id", tourId)
        .order("start_time", { ascending: true })
        .limit(1)
        .single();

      if (eventError || !eventData) {
        console.error("Event fetch failed", eventError);
        setLoading(false);
        return;
      }

      setEvent(eventData);
      setLoading(false);
    };

    if (id) fetchTourAndEvent();
  }, [id]);

  return (
    <div className="p-4 text-white bg-black min-h-screen text-center">
      <h1 className="text-xl font-semibold mb-4">🪄 Share Your Tour</h1>

      <div className="bg-white text-black rounded-xl p-6 max-w-md mx-auto">
        {loading ? (
          <p className="text-gray-500">Loading show card...</p>
        ) : event ? (
          <>
            <h2 className="text-lg font-bold">{event.city}</h2>
            <p>{event.venue}</p>
            <p>{new Date(event.start_time).toLocaleString()}</p>
          </>
        ) : (
          <p>No events found.</p>
        )}
      </div>

      <p className="text-xs mt-4 text-blue-400 underline">
        Public Share Link: https://tourlife.app/share/{id}
      </p>

      <button className="mt-4 bg-white text-black rounded-full px-4 py-2 text-sm">
        ⬇️ Download for Instagram Story
      </button>
    </div>
  );
}
