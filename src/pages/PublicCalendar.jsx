import React from 'react';

import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';



export default function PublicCalendar() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [events, setEvents] = useState([]);
  const [travel, setTravel] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [guestlist, setGuestlist] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: tourData } = await supabase.from('tours').select('*').eq('id', id).single();
      const { data: eventsData } = await supabase.from('events').select('*').eq('tour_id', id);
      const { data: travelData } = await supabase.from('travel_segments').select('*').eq('tour_id', id);
      const { data: hotelData } = await supabase.from('accommodations').select('*').eq('tour_id', id);
      const { data: guestData } = await supabase.from('guests').select('*').eq('tour_id', id);

      setTour(tourData);
      setEvents(eventsData || []);
      setTravel(travelData || []);
      setHotels(hotelData || []);
      setGuestlist(guestData || []);
    };

    fetchData();
  }, [id]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const getIconForNote = (note) => {
    if (!note) return '👤';
    const lower = note.toLowerCase();
    if (lower.includes('photo')) return '📸';
    if (lower.includes('video')) return '🎥';
    if (lower.includes('crew')) return '🧑‍🚀';
    return '👤';
  };

  if (!tour) {
    return <div className="p-4 text-gray-500 dark:text-gray-400">Loading public calendar...</div>;
  }

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white pb-24">
      <h1 className="text-2xl font-bold mb-1">{tour.name}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {tour.start_date} → {tour.end_date}
      </p>

      {/* Events */}
      <section className="space-y-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <Link to={`/public-event/${event.id}`} className="text-lg font-semibold text-blue-600 dark:text-blue-400 underline block mb-1">
              {event.city} – {event.venue}
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(event.date)} @ {event.set_time}</p>

            {/* Guestlist under each event */}
            <div className="mt-3 border-t border-gray-100 dark:border-gray-700 pt-2 space-y-2">
              {guestlist.filter(g => g.event_id === event.id).map(guest => (
                <div key={guest.id} className="flex gap-2 items-start">
                  <span>{getIconForNote(guest.notes)}</span>
                  <div>
                    <p className="font-medium">{guest.name}</p>
                    {guest.notes && <p className="text-sm text-gray-500 dark:text-gray-400">{guest.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
