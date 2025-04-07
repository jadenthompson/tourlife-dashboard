// src/components/AddEventModal.jsx
import React, { useState } from 'react';
import supabase from '../supabaseClient';

export default function AddEventModal({ slotInfo, onClose }) {
  const [form, setForm] = useState({
    city: '',
    venue: '',
    start_time: slotInfo?.start || '',
    end_time: slotInfo?.end || '',
    type: 'gig',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);

    const { error } = await supabase.from('events').insert([
      {
        city: form.city,
        venue: form.venue,
        start_time: form.start_time,
        end_time: form.end_time,
        event_type: form.type,
        notes: form.notes,
        date: form.start_time,
      },
    ]);

    if (error) {
      console.error('❌ Error saving event:', error.message);
    } else {
      onClose();
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-xl w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">Add Event</h2>

        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          className="w-full p-2 rounded border bg-white dark:bg-zinc-800 dark:text-white"
        />

        <input
          type="text"
          name="venue"
          placeholder="Venue"
          value={form.venue}
          onChange={handleChange}
          className="w-full p-2 rounded border bg-white dark:bg-zinc-800 dark:text-white"
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full p-2 rounded border bg-white dark:bg-zinc-800 dark:text-white"
        >
          <option value="gig">🎤 Gig</option>
          <option value="studio">🎧 Studio</option>
          <option value="press">📰 Press</option>
          <option value="travel">✈️ Travel</option>
          <option value="rest">🛌 Rest</option>
        </select>

        <label className="text-sm text-gray-600 dark:text-gray-300">Start Time</label>
        <input
          type="datetime-local"
          name="start_time"
          value={new Date(form.start_time).toISOString().slice(0, 16)}
          onChange={(e) => setForm({ ...form, start_time: e.target.value })}
          className="w-full p-2 rounded border bg-white dark:bg-zinc-800 dark:text-white"
        />

        <label className="text-sm text-gray-600 dark:text-gray-300">End Time</label>
        <input
          type="datetime-local"
          name="end_time"
          value={new Date(form.end_time).toISOString().slice(0, 16)}
          onChange={(e) => setForm({ ...form, end_time: e.target.value })}
          className="w-full p-2 rounded border bg-white dark:bg-zinc-800 dark:text-white"
        />

        <textarea
          name="notes"
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={handleChange}
          className="w-full p-2 rounded border bg-white dark:bg-zinc-800 dark:text-white"
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-200 dark:bg-zinc-700 rounded hover:bg-gray-300 dark:hover:bg-zinc-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? 'Saving...' : 'Save Event'}
          </button>
        </div>
      </div>
    </div>
  );
}
