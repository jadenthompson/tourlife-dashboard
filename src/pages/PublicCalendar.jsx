// src/pages/PublicCalendar.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../supabaseClient';

const PublicCalendar = () => {
  const { id: public_id } = useParams();
  const [tourData, setTourData] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        // 1. Get tour by public_id
        const { data: tour, error: tourError } = await supabase
          .from('tours')
          .select('*')
          .eq('public_id', public_id)
          .single();

        if (tourError) throw tourError;

        setTourData(tour);

        // 2. Get events
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .eq('tour_id', tour.id)
          .order('start_time', { ascending: true });

        if (eventsError) throw eventsError;

        setEvents(eventsData);
      } catch (error) {
        console.error('Error loading public calendar:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTourData();
  }, [public_id]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  if (!tourData) return <div className="p-4 text-center text-red-500">Tour not found.</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">{tourData.name} – Public Calendar</h1>
      {events.map(event => (
        <div key={event.id} className="mb-6 border-b pb-4">
          <h2 className="text-xl font-bold">{event.name}</h2>
          <p className="text-gray-600">{new Date(event.start_time).toLocaleString()}</p>
          {/* Add guestlist, travel, hotel info here if needed */}
        </div>
      ))}
    </div>
  );
};

export default PublicCalendar;
