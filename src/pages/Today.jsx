import { useEffect, useState } from "react";
import supabase from '../supabaseClient';
import FlightWidget from "../components/FlightWidget";
import { sendNotification } from "../utils/sendNotification";

// Example: call this when flight status is delayed or app loads
sendNotification("Flight delayed", "Your flight LH401 is now departing at 21:30");


export default function Today() {
  const [tour, setTour] = useState(null);
  const [travel, setTravel] = useState([]);
  const [events, setEvents] = useState([]);
  const [greeting, setGreeting] = useState("Hello");
  const [aiResponse, setAiResponse] = useState("");

  const tourId = "00000000-0000-0000-0000-000000000003";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: tourData, error: tourError } = await supabase
          .from("tours")
          .select("*")
          .eq("id", tourId)
          .single();
        if (tourError) throw tourError;

        const { data: travelData, error: travelError } = await supabase
          .from("travel_segments")
          .select("*")
          .eq("tour_id", tourId);
        if (travelError) throw travelError;

        const { data: eventData, error: eventError } = await supabase
          .from("events")
          .select("*")
          .eq("tour_id", tourId)
          .order("date", { ascending: true });
        if (eventError) throw eventError;

        setTour(tourData);
        setTravel(travelData || []);
        setEvents(eventData || []);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    const now = new Date();
    const hour = now.getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning");
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }

    fetchData();
  }, []);

  const getNextFlight = () => {
    const upcoming = travel
      .filter((t) => t.flight_number && new Date(t.departure_time) > new Date())
      .sort((a, b) => new Date(a.departure_time) - new Date(b.departure_time));
    return upcoming[0];
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return isNaN(date) ? "Invalid" : date.toLocaleString();
  };

  const handleAssistantClick = async (prompt) => {
    setAiResponse("🤖 Thinking...");
    try {
      const res = await fetch("https://jorantgixpsjetsyujkl.functions.supabase.co/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setAiResponse(`🤖 ${data.reply}`);
    } catch (error) {
      setAiResponse("❌ Error getting response.");
      console.error("AI error:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{greeting}, Jaden</h1>
          <a href="/settings" className="text-xl">⚙️</a>
        </div>

        {tour && <p className="text-gray-600 dark:text-gray-300">{tour.name}</p>}

        {/* Upcoming Events */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-2">Upcoming Events</h2>
          {events.length > 0 ? (
            events.slice(0, 2).map((event) => (
              <div key={event.id} className="mb-3">
                <p className="font-medium">{event.city} – {event.venue}</p>
                <p className="text-sm text-gray-500">{formatDateTime(event.date)}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No events found.</p>
          )}
        </div>

        {/* Next Travel Segment (Flight Widget) */}
        {getNextFlight() && (
          <FlightWidget
            flightNumber={getNextFlight().flight_number}
            departureTime={getNextFlight().departure_time}
            arrivalTime={getNextFlight().arrival_time}
            depCity={getNextFlight().dep_city}
            arrCity={getNextFlight().arr_city}
          />
        )}

        {/* AI Assistant */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 space-y-3">
          <h2 className="text-lg font-semibold">AI Assistant</h2>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => handleAssistantClick("When should I sleep?")} className="text-sm px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
              🛏️ When should I sleep?
            </button>
            <button onClick={() => handleAssistantClick("Optimize my travel")} className="text-sm px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
              ✈️ Optimize my travel
            </button>
            <button onClick={() => handleAssistantClick("Summarize today")} className="text-sm px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
              📋 Summarize today
            </button>
          </div>
          {aiResponse && (
            <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 rounded p-3 text-sm text-gray-700 dark:text-white">
              {aiResponse}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="h-16 border-t bg-white dark:bg-gray-800 flex items-center justify-around shadow-sm fixed bottom-0 left-0 right-0">
        <a href="/" className="text-sm">🏠 Home</a>
        <a href="/itinerary" className="text-sm">📅 Itinerary</a>
        <a href="/assistant" className="text-sm">🤖 Assistant</a>
      </nav>
    </div>
  );
}
