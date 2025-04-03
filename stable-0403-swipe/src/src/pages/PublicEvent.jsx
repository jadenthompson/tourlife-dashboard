import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

export default function PublicEvent() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [guestlist, setGuestlist] = useState([]);
  const [travel, setTravel] = useState([]);
  const [hotel, setHotel] = useState(null);
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: eventData } = await supabase.from('events').select('*').eq('id', id).single();
      setEvent(eventData);

      if (eventData) {
        const { data: guestData } = await supabase
          .from('guestlist')
          .select('*')
          .eq('event_id', eventData.id);
        setGuestlist(guestData || []);

        const { data: travelData } = await supabase
          .from('travel_segments')
          .select('*')
          .eq('event_id', eventData.id);
        setTravel(travelData || []);

        const { data: hotelData } = await supabase
          .from('accommodations')
          .select('*')
          .eq('event_id', eventData.id)
          .single();
        setHotel(hotelData || null);

        if (eventData.artist_id) {
          const { data: artistData } = await supabase
            .from('artists')
            .select('*')
            .eq('id', eventData.artist_id)
            .single();
          setArtist(artistData || null);
        }
      }
    };

    fetchData();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid Date';
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return '';
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFullFlightTime = (dep, arr) => {
    return `${formatDate(dep)} – ${formatTime(dep)} → ${formatTime(arr)}`;
  };

  const getGuestEmoji = (note) => {
    if (!note) return '👤';
    const lowered = note.toLowerCase();
    if (lowered.includes('photographer')) return '📸';
    if (lowered.includes('videographer')) return '🎥';
    if (lowered.includes('crew')) return '🧑‍🚀';
    return '👤';
  };

  if (!event) {
    return <div className="p-6">Loading event info...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">{event.city} – {event.venue}</h1>
      <p className="text-gray-600">{formatDate(event.date)} @ {formatTime(event.set_time)}</p>

      {artist && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Artist Contact</h2>
          <p className="text-gray-700">{artist.name}</p>
          <p className="text-sm text-gray-500">Timezone: {artist.timezone}</p>
        </div>
      )}

      {travel.length > 0 && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Travel Info</h2>
          {travel.map(t => (
            <div key={t.id} className="mb-3">
              <p className="font-medium">{t.type?.toUpperCase()}: {t.dep_city} → {t.arr_city}</p>
              <p className="text-sm text-gray-500">{formatFullFlightTime(t.departure_time, t.arrival_time)}</p>
              {t.airline && <p className="text-sm text-gray-400">Airline: {t.airline}</p>}
              {t.flight_number && <p className="text-sm text-gray-400">Flight: {t.flight_number}</p>}
            </div>
          ))}
        </div>
      )}

      {hotel && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Hotel</h2>
          <p className="font-medium">{hotel.hotel_name}</p>
          <p className="text-sm text-gray-500">{hotel.address}</p>
          <p className="text-sm text-gray-400">
            Check-in: {formatDate(hotel.check_in)} – Check-out: {formatDate(hotel.check_out)}
          </p>
        </div>
      )}

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Guestlist</h2>
        {guestlist.length > 0 ? (
          <ul className="space-y-2">
            {guestlist.map(g => (
              <li key={g.id} className="flex items-center space-x-2 border-b pb-2">
                <span>{getGuestEmoji(g.note)}</span>
                <span className="font-medium">{g.name}</span>
                <span className="text-sm text-gray-500">{g.note}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No guests added yet.</p>
        )}
      </div>

      {event.itinerary_pdf_url && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Itinerary</h2>
          <iframe
            src={event.itinerary_pdf_url}
            className="w-full h-96 border rounded"
            title="Itinerary PDF"
          />
          <div className="mt-2 text-right">
            <a
              href={event.itinerary_pdf_url}
              download
              className="text-blue-600 underline text-sm"
            >
              Download PDF
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
