// src/pages/ShareTour.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../supabaseClient";

export default function ShareTour() {
  const { id: public_id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTourAndEvent = async () => {
      try {
        setLoading(true);

        // 1. Look up tour by public_id
        const { data: tourMatch, error: tourError } = await supabase
          .from("tours")
          .select("id")
          .eq("public_id", public_id)
          .limit(1)
          .maybeSingle();

        if (!tourMatch || tourError) {
          console.warn("No tour found with public_id:", public_id);
          return;
        }

        const tourId = tourMatch.id;

        // 2. Fetch earliest event in the tour
        const { data: eventData, error: eventError } = await supabase
          .from("events")
          .select("*")
          .eq("tour_id", tourId)
          .order("start_time", { ascending: true })
          .limit(1)
          .maybeSingle();

        if (!eventData || eventError) {
          console.warn("No event found for this tour");
          return;
        }

        setEvent(eventData);
      } catch (err) {
        console.error("Error loading shared tour card:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (public_id) fetchTourAndEvent();
  }, [public_id]);

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
            <p>
              {new Date(event.start_time).toLocaleString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </>
        ) : (
          <p>No events found.</p>
        )}
      </div>

      <p className="text-xs mt-4 text-blue-400 underline">
        Public Share Link: https://tourlife.app/share/{public_id}
      </p>

      <button className="mt-4 bg-white text-black rounded-full px-4 py-2 text-sm">
        ⬇️ Download for Instagram Story
      </button>
    </div>
  );
}
