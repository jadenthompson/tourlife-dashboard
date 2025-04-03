import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../supabaseClient';



export default function TourDetails() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [events, setEvents] = useState([]);
  const [travel, setTravel] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [newEvent, setNewEvent] = useState({
    city: '',
    venue: '',
    date: '',
    set_time: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: tourData } = await supabase.from('tours').select('*').eq('id', id).single();
      const { data: eventData } = await supabase.from('events').select('*').eq('tour_id', id);
      const { data: travelData } = await supabase.from('travel_segments').select('*').eq('tour_id', id);
      const { data: hotelData } = await supabase.from('accommodations').select('*').eq('tour_id', id);

      setTour(tourData);
      setEvents(eventData || []);
      setTravel(travelData || []);
      setHotels(hotelData || []);
    };

    fetchData();
  }, [id]);

  const handleAddEvent = async () => {
    if (!newEvent.city || !newEvent.venue || !newEvent.date || !newEvent.set_time) return;

    const { data, error } = await supabase.from('events').insert([
      { ...newEvent, tour_id: id },
    ]);

    if (!error) {
      setEvents(prev => [...prev, ...data]);
      setNewEvent({ city: '', venue: '', date: '', set_time: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 space-y-8 pb-32">
      {tour && (
        <>
          <h1 className="text-2xl font-bold text-gray-900">{tour.name}</h1>
          <p className="text-gray-500">{tour.start_date} → {tour.end_date}</p>
        </>
      )}

      {/* Add Event Form */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
        <h2 className="font-semibold text-gray-800 text-lg">Add Event</h2>
        <input
          className="w-full border rounded px-3 py-2 text-sm"
          type="text"
          placeholder="City"
          value={newEvent.city}
          onChange={(e) => setNewEvent({ ...newEvent, city: e.target.value })}
        />
        <input
          className="w-full border rounded px-3 py-2 text-sm"
          type="text"
          placeholder="Venue"
          value={newEvent.venue}
          onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
        />
        <input
          className="w-full border rounded px-3 py-2 text-sm"
          type="date"
          value={newEvent.date}
          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
        />
        <input
          className="w-full border rounded px-3 py-2 text-sm"
          type="time"
          value={newEvent.set_time}
          onChange={(e) => setNewEvent({ ...newEvent, set_time: e.target.value })}
        />
        <button
          onClick={handleAddEvent}
          className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Event
        </button>
      </div>

      {/* Events */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="font-semibold text-gray-800 text-lg mb-3">Events</h2>
        {events.map((e) => (
          <div key={e.id} className="mb-3 border-b pb-2">
            <p className="font-medium text-gray-900">{e.city} – {e.venue}</p>
            <p className="text-sm text-gray-500">{e.date} @ {e.set_time}</p>
          </div>
        ))}
      </div>

      {/* Travel */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="font-semibold text-gray-800 text-lg mb-3">Travel</h2>
        {travel.map((t) => (
          <div key={t.id} className="mb-3 border-b pb-2 text-sm text-gray-700">
            ✈️ {t.type.toUpperCase()}: {t.dep_city} → {t.arr_city}
            <br />
            {t.dep_time} → {t.arr_time} ({t.airline})
          </div>
        ))}
      </div>

      {/* Hotels */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="font-semibold text-gray-800 text-lg mb-3">Hotels</h2>
        {hotels.map((h) => (
          <div key={h.id} className="mb-3 border-b pb-2 text-sm text-gray-700">
            🛏️ {h.name}
            <br />
            {h.address}
            <br />
            {h.check_in} → {h.check_out}
          </div>
        ))}
      </div>
    </div>
  );
}
