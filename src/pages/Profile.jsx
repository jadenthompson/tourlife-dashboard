import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import { Loader } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [tourStats, setTourStats] = useState({
    cities: 0,
    shows: 0,
    flights: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSessionAndData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        fetchArtists(session.user.id);
      } else {
        setLoading(false);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          fetchArtists(session.user.id);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    getSessionAndData();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchArtists = async (userId) => {
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .eq('user_id', userId);

    if (error || !data || data.length === 0) {
      console.error('Artist fetch error:', error);
      setLoading(false);
      return;
    }

    setArtists(data);
    setSelectedArtist(data[0]); // default to first artist
    fetchTourStats(data[0]);
  };

  const fetchTourStats = async (artist) => {
    if (!artist || !artist.id) return;

    const { data: tourData, error: tourError } = await supabase
      .from('tours')
      .select('id')
      .eq('artist_id', artist.id)
      .limit(1)
      .maybeSingle();

    if (tourError || !tourData) {
      console.warn('No tour found for artist.');
      setTourStats({ cities: 0, shows: 0, flights: 0 });
      setLoading(false);
      return;
    }

    const tourId = tourData.id;

    const { data: events, error: eventError } = await supabase
      .from('events')
      .select('id, city')
      .eq('tour_id', tourId);

    const { data: travelSegments, error: travelError } = await supabase
      .from('travel_segments')
      .select('id')
      .eq('tour_id', tourId);

    if (eventError || travelError) {
      console.error('Data fetch error:', eventError || travelError);
      setTourStats({ cities: 0, shows: 0, flights: 0 });
      setLoading(false);
      return;
    }

    const uniqueCities = new Set(events.map(e => e.city));
    setTourStats({
      cities: uniqueCities.size,
      shows: events.length,
      flights: travelSegments.length,
    });

    setLoading(false);
  };

  const handleArtistChange = (e) => {
    const selected = artists.find((a) => a.id === e.target.value);
    setSelectedArtist(selected);
    setTourStats({ cities: 0, shows: 0, flights: 0 });
    setLoading(true);
    fetchTourStats(selected);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin h-6 w-6 text-gray-500" />
      </div>
    );
  }

  if (!user || !selectedArtist) {
    return (
      <div className="text-center mt-20 text-gray-600">
        You must be signed in to view your Tour Pass.
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
      <h1 className="text-2xl font-bold text-center mb-4">🎟️ Tour Pass</h1>

      {/* Artist Dropdown */}
      {artists.length > 1 && (
        <div className="mb-4 text-sm text-gray-700 dark:text-gray-300">
          <label htmlFor="artist-select" className="block mb-1">Select Artist:</label>
          <select
            id="artist-select"
            value={selectedArtist.id}
            onChange={handleArtistChange}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 text-sm"
          >
            {artists.map((artist) => (
              <option key={artist.id} value={artist.id}>
                {artist.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="text-center">
        <p className="text-xl font-semibold text-gray-900 dark:text-white">
          {selectedArtist.name}
        </p>
        <p className="text-gray-500 text-sm mt-1">Powered by TourLife</p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center mt-6">
        <div>
          <p className="text-lg font-bold text-gray-800 dark:text-white">{tourStats.cities}</p>
          <p className="text-sm text-gray-500">Cities</p>
        </div>
        <div>
          <p className="text-lg font-bold text-gray-800 dark:text-white">{tourStats.shows}</p>
          <p className="text-sm text-gray-500">Shows</p>
        </div>
        <div>
          <p className="text-lg font-bold text-gray-800 dark:text-white">{tourStats.flights}</p>
          <p className="text-sm text-gray-500">Flights</p>
        </div>
      </div>

      {/* Badges */}
      {(tourStats.shows >= 25 || tourStats.flights >= 10 || tourStats.cities >= 5) && (
        <div className="mt-6 text-center">
          <h2 className="text-md font-semibold text-gray-700 dark:text-white mb-2">🏅 Achievements</h2>
          <div className="flex justify-center gap-2 flex-wrap">
            {tourStats.shows >= 25 && (
              <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full">🎤 25 Shows Club</span>
            )}
            {tourStats.flights >= 10 && (
              <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">🛫 10 Flights Club</span>
            )}
            {tourStats.cities >= 5 && (
              <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">🌍 Globetrotter</span>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 text-center text-sm text-gray-400">
        More badges and stats coming soon...
      </div>
    </div>
  );
};

export default Profile;
