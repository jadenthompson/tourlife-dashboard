import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

export default function EventLogistics() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [artist, setArtist] = useState(null);
  const [travel, setTravel] = useState([]);
  const [hotel, setHotel] = useState(null);
  const [guestlist, setGuestlist] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: eventData } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();
      setEvent(eventData);

      if (eventData) {
        if (eventData.artist_id) {
          const { data: artistData } = await supabase
            .from('artists')
            .select('*')
            .eq('id', eventData.artist_id)
            .single();
          setArtist(artistData || null);
        }

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

        const { data: guestData } = await supabase
          .from('guestlist')
          .select('*')
          .eq('event_id', eventData.id);
        setGuestlist(guestData || []);
      }
    };

    fetchData();
  }, [id]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date)) return 'Invalid Date';
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date)) return '';
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
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
    return <div className="p-6">Loading event...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">{event.city} – {event.venue}</h1>
      <p className="text-gray-600">{formatDate(event.date)} @ {formatTime(event.set_time)}</p>

      {/* Artist Contact */}
      {artist && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Artist Contact</h2>
          <p className="font-medium">{artist.name}</p>
          <p className="text-sm text-gray-500">Timezone: {artist.timezone}</p>
        </div>
      )}

      {/* Travel Info */}
      {travel.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Travel</h2>
          {travel.map((t) => (
            <div key={t.id} className="mb-3">
              <p className="font-medium">
                FLIGHT: {t.dep_city} → {t.arr_city}
              </p>
              <p className="text-sm text-gray-500">
                {formatDate(t.departure_time)} – {formatTime(t.departure_time)} → {formatTime(t.arrival_time)}
              </p>
              {t.airline && (
                <p className="text-sm text-gray-400">Airline: {t.airline}</p>
              )}
              {t.flight_number && (
                <p className="text-sm text-gray-400">Flight: {t.flight_number}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Hotel */}
      {hotel && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Hotel</h2>
          <p className="font-medium">{hotel.hotel_name}</p>
          <p className="text-sm text-gray-500">{hotel.address}</p>
          <p className="text-sm text-gray-400">
            Check-in: {formatDate(hotel.check_in)} – Check-out: {formatDate(hotel.check_out)}
          </p>
        </div>
      )}

      {/* Guestlist */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Guestlist</h2>
        {guestlist.length > 0 ? (
          <ul className="space-y-2">
            {guestlist.map((g) => (
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

      {/* Itinerary PDF */}
      {event.itinerary_pdf_url && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
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
