import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import { CalendarDays, PlaneTakeoff, BedDouble, Users } from 'lucide-react';

export default function PublicCalendar() {
  const { id } = useParams(); // public_id
  const [tour, setTour] = useState(null);
  const [events, setEvents] = useState([]);
  const [travel, setTravel] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [guestlist, setGuestlist] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const { data: tourData, error: tourError } = await supabase
        .from('tours')
        .select('*')
        .eq('public_id', id)
        .maybeSingle();

      if (tourError || !tourData) {
        console.error('❌ Failed to fetch tour:', tourError || 'Not found');
        setError('Public tour not found or no longer available.');
        setLoading(false);
        return;
      }

      setTour(tourData);

      try {
        const [{ data: eventsData }, { data: travelData }, { data: hotelData }, { data: guestData }] = await Promise.all([
          supabase.from('events').select('*').eq('tour_id', tourData.id).order('start_time', { ascending: true }),
          supabase.from('travel_segments').select('*').eq('tour_id', tourData.id),
          supabase.from('accommodations').select('*').eq('tour_id', tourData.id),
          supabase.from('guests').select('*').eq('tour_id', tourData.id),
        ]);

        setEvents(eventsData || []);
        setTravel(travelData || []);
        setHotels(hotelData || []);
        setGuestlist(guestData || []);
      } catch (e) {
        console.error('❌ Failed to fetch related data:', e);
        setError('Error loading tour data.');
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date) ? 'Invalid Time' : date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
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

  if (loading) {
    return <div className="p-4 text-gray-500 dark:text-gray-400">Loading public calendar...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center text-gray-600 dark:text-gray-300">
        <h2 className="text-2xl font-bold text-red-500 dark:text-red-400 mb-4">404 – Tour Not Found</h2>
        <p className="mb-6 text-sm">The public tour you're looking for doesn't exist or is no longer available.</p>
        <Link
          to="/"
          className="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full shadow hover:bg-blue-700"
        >
          Back to Home
        </Link>
      </div>
    );
  }
  

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white pb-24">
      <h1 className="text-2xl font-bold mb-1">{tour.name}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {tour.start_date} → {tour.end_date}
      </p>

      <section className="space-y-6">
        {events.map((event) => {
          const eventTravel = travel.find(t => t.event_id === event.id);
          const eventHotel = hotels.find(h => h.event_id === event.id);
          const eventGuests = guestlist.filter(g => g.event_id === event.id);

          return (
            <div key={event.id} className="bg-white dark:bg-zinc-800 rounded-2xl shadow-md p-4">
              <Link to={`/public-event/${event.id}`} className="text-lg font-semibold text-blue-600 dark:text-blue-400 underline block mb-1">
                {event.city} – {event.venue}
              </Link>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <CalendarDays size={16} />
                <span>{formatDate(event.date)} @ {formatTime(event.set_time)}</span>
              </div>

              {eventTravel && (
                <div className="mb-3 text-sm">
                  <div className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
                    <PlaneTakeoff size={16} />
                    <span>{eventTravel.departure_city} → {eventTravel.arrival_city}</span>
                  </div>
                  <div className="ml-6 text-gray-500 dark:text-gray-400 space-y-1">
                    {eventTravel.flight_number && <div>Flight: {eventTravel.flight_number}</div>}
                    <div>{formatTime(eventTravel.departure_time)} → {formatTime(eventTravel.arrival_time)}</div>
                    {eventTravel.terminal && <div>Terminal: {eventTravel.terminal}</div>}
                    {eventTravel.gate && <div>Gate: {eventTravel.gate}</div>}
                  </div>
                </div>
              )}

              {eventHotel && (
                <div className="mb-3 text-sm">
                  <div className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
                    <BedDouble size={16} />
                    <span>{eventHotel.name}</span>
                  </div>
                  <div className="ml-6 text-gray-500 dark:text-gray-400 space-y-1">
                    <div>{eventHotel.address}</div>
                    <div>
                      Check-in: {formatDate(eventHotel.check_in)} | Check-out: {formatDate(eventHotel.check_out)}
                    </div>
                    {eventHotel.reservation_number && (
                      <div>Reservation #: {eventHotel.reservation_number}</div>
                    )}
                  </div>
                </div>
              )}

              {eventGuests.length > 0 && (
                <div className="mt-3 border-t border-gray-100 dark:border-zinc-700 pt-2 space-y-2">
                  <div className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
                    <Users size={16} />
                    <span>Guest List</span>
                  </div>
                  {eventGuests.map(guest => (
                    <div key={guest.id} className="flex gap-2 items-start ml-6">
                      <span>{getIconForNote(guest.notes)}</span>
                      <div>
                        <p className="font-medium">{guest.name}</p>
                        {guest.notes && <p className="text-sm text-gray-500 dark:text-gray-400">{guest.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
