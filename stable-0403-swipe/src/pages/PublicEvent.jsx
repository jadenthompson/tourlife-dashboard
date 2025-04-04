// src/pages/PublicEvent.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../supabaseClient';

function PublicEvent() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [flights, setFlights] = useState([]);
  const [hotel, setHotel] = useState(null);
  const [guests, setGuests] = useState([]);
  const [artist, setArtist] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    async function fetchData() {
      // Get event info
      const { data: eventData } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();
      setEvent(eventData);

      // Get travel info
      const { data: travelData } = await supabase
        .from('travel_segments')
        .select('*')
        .eq('event_id', id);
      setFlights(travelData || []);

      // Get accommodation
      const { data: hotelData } = await supabase
        .from('accommodations')
        .select('*')
        .eq('event_id', id)
        .single();
      setHotel(hotelData);

      // Get guestlist
      const { data: guestData } = await supabase
        .from('guests')
        .select('*')
        .eq('event_id', id);
      setGuests(guestData || []);

      // Get artist contact
      if (eventData?.artist_id) {
        const { data: artistData } = await supabase
          .from('artists')
          .select('*')
          .eq('id', eventData.artist_id)
          .single();
        setArtist(artistData);
      }

      // Get itinerary PDF (optional)
      const { data: fileData } = await supabase
        .storage
        .from('itineraries')
        .getPublicUrl(`${id}.pdf`);
      setPdfUrl(fileData?.publicUrl || null);
    }

    fetchData();
  }, [id]);

  if (!event) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{event.name}</h1>

      {/* Flight Info */}
      <div>
        <h2 className="text-lg font-semibold">✈️ Flight Info</h2>
        {flights.length === 0 ? (
          <p>No flights linked.</p>
        ) : (
          flights.map((flight, i) => (
            <div key={i} className="border p-3 rounded mb-2">
              <p>{flight.airline} {flight.flight_number}</p>
              <p>{flight.departure_city} → {flight.arrival_city}</p>
              <p>
                {flight.departure_time?.slice(0, 5)} → {flight.arrival_time?.slice(0, 5)}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Hotel Info */}
      {hotel && (
        <div>
          <h2 className="text-lg font-semibold">🏨 Hotel</h2>
          <p>{hotel.name}</p>
          <p>{hotel.address}</p>
          <p>Reservation #: {hotel.reservation_number}</p>
        </div>
      )}

      {/* Guestlist */}
      <div>
        <h2 className="text-lg font-semibold">🎟️ Guestlist</h2>
        {guests.length === 0 ? (
          <p>No guests added.</p>
        ) : (
          <ul className="list-disc ml-5">
            {guests.map((guest, i) => (
              <li key={i}>
                {guest.name} {guest.note && <span className="text-gray-500">({guest.note})</span>}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Artist Contact */}
      {artist && (
        <div>
          <h2 className="text-lg font-semibold">🎤 Artist Contact</h2>
          <p>{artist.name}</p>
          <p>{artist.email}</p>
        </div>
      )}

      {/* Itinerary PDF */}
      {pdfUrl && (
        <div>
          <h2 className="text-lg font-semibold">📄 Itinerary</h2>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View or Download PDF
          </a>
        </div>
      )}
    </div>
  );
}

export default PublicEvent;
