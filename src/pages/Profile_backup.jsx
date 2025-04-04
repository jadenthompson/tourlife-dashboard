import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import { Loader } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [artist, setArtist] = useState(null);
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
        fetchArtistAndStats(session.user.id);
      } else {
        setLoading(false);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          fetchArtistAndStats(session.user.id);
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

  const fetchArtistAndStats = async (userId) => {
    try {
      const { data: artistData, error: artistError } = await supabase
        .from('artists')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (artistError || !artistData) {
        console.error('Artist fetch error:', artistError);
        setLoading(false);
        return;
      }

      setArtist(artistData);

      const { data: events, error: eventError } = await supabase
        .from('events')
        .select('id, city, tour_id')
        .eq('tour_id', artistData.tour_id);

      const { data: travelSegments, error: travelError } = await supabase
        .from('travel_segments')
        .select('id')
        .eq('tour_id', artistData.tour_id);

      if (eventError || travelError) {
        console.error('Data fetch error:', eventError || travelError);
        setLoading(false);
        return;
      }

      const uniqueCities = new Set(events.map((e) => e.city));
      setTourStats({
        cities: uniqueCities.size,
        shows: events.length,
        flights: travelSegments.length,
      });

      setLoading(false);
    } catch (error) {
      console.error('Unexpected error:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin h-6 w-6 text-gray-500" />
      </div>
    );
  }

  if (!user || !artist) {
    return (
      <div className="text-center mt-20 text-gray-600">
        You must be signed in to view your Tour Pass.
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-2xl shadow-xl border border-gray-200">
      <h1 className="text-2xl font-bold text-center mb-4">🎟️ Tour Pass</h1>
      <div className="text-center">
        <p className="text-xl font-semibold">{artist.name}</p>
        <p className="text-gray-500 text-sm mt-1">Powered by TourLife</p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center mt-6">
        <div>
          <p className="text-lg font-bold">{tourStats.cities}</p>
          <p className="text-sm text-gray-500">Cities</p>
        </div>
        <div>
          <p className="text-lg font-bold">{tourStats.shows}</p>
          <p className="text-sm text-gray-500">Shows</p>
        </div>
        <div>
          <p className="text-lg font-bold">{tourStats.flights}</p>
          <p className="text-sm text-gray-500">Flights</p>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-400">
        More badges and stats coming soon...
      </div>
    </div>
  );
};

export default Profile;
