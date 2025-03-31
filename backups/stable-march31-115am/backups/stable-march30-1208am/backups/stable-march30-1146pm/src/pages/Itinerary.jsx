import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';



export default function Itinerary() {
  const tourId = '00000000-0000-0000-0000-000000000003';
  const [events, setEvents] = useState([]);
  const [guestlist, setGuestlist] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: eventData } = await supabase
        .from('events')
        .select('*')
        .eq('tour_id', tourId)
        .order('date', { ascending: true });

      const { data: guestData } = await supabase
        .from('guests')
        .select('*')
        .eq('tour_id', tourId);

      setEvents(eventData || []);
      setGuestlist(guestData || []);
    };

    fetchData();
  }, []);

  const getIconForNote = (note) => {
    if (!note) return '👤';
    const lower = note.toLowerCase();
    if (lower.includes('photo')) return '📸';
    if (lower.includes('video')) return '🎥';
    if (lower.includes('crew')) return '🧑‍🚀';
    return '👤';
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-4 space-y-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white pb-24">
      <h1 className="text-2xl font-bold">Itinerary</h1>

      {events.map(event => (
        <div key={event.id} className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 space-y-2">
          <div className="mb-2">
            <p className="text-lg font-semibold">{event.city} – {event.venue}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(event.date)} @ {event.set_time}</p>
          </div>

          {/* Guestlist */}
          <div className="space-y-1">
            {guestlist
              .filter(guest => guest.event_id === event.id)
              .map(guest => (
                <div key={guest.id} className="flex items-center gap-2 border-t border-gray-100 dark:border-gray-700 pt-2">
                  <span>{getIconForNote(guest.notes)}</span>
                  <div>
                    <p className="font-medium">{guest.name}</p>
                    {guest.notes && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">{guest.notes}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
