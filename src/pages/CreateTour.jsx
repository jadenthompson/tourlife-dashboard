// src/pages/CreateTour.jsx
import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';

export default function CreateTour() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    start_date: '',
    end_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateTour = async () => {
    setLoading(true);
    setError(null);

    // Step 1: Get the current logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('❌ User not authenticated');
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    // Step 2: Fetch artist ID linked to this user
    const { data: artistData, error: artistError } = await supabase
      .from('artists')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (artistError || !artistData) {
      console.error('❌ Artist profile not found');
      setError('Artist profile not found for this user');
      setLoading(false);
      return;
    }

    // Step 3: Create new tour
    const newTour = {
      name: form.name,
      start_date: form.start_date,
      end_date: form.end_date,
      artist_id: artistData.id,
      public_id: nanoid(8),
    };

    const { data, error } = await supabase.from('tours').insert([newTour]).select('*');

    if (error) {
      console.error('❌ Error creating tour:', error.message);
      setError('Could not create tour');
    } else if (data && data.length > 0) {
      const createdTour = data[0];
      console.log('✅ Tour created with public_id:', createdTour.public_id);
      navigate(`/public/${createdTour.public_id}`);
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Create a New Tour</h1>

      <input
        name="name"
        placeholder="Tour Name"
        value={form.name}
        onChange={handleChange}
        className="block w-full mb-3 p-2 border rounded"
      />
      <input
        name="start_date"
        type="date"
        value={form.start_date}
        onChange={handleChange}
        className="block w-full mb-3 p-2 border rounded"
      />
      <input
        name="end_date"
        type="date"
        value={form.end_date}
        onChange={handleChange}
        className="block w-full mb-3 p-2 border rounded"
      />

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <button
        onClick={handleCreateTour}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Creating...' : 'Create Tour'}
      </button>
    </div>
  );
}
