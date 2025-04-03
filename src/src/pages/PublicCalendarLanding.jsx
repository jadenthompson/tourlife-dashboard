
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';


export default function PublicCalendarLanding() {
  const [link, setLink] = useState('');
  const [tourId, setTourId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePreview = () => {
    try {
      const url = new URL(link);
      const id = url.pathname.split('/').pop();
      if (id && id.length === 36) {
        setTourId(id);
        setError('');
      } else {
        setError('Invalid tour ID.');
      }
    } catch {
      setError('Invalid link format.');
    }
  };

  const handleViewCalendar = () => {
    if (tourId) {
      // 👇 Add this line for debugging
      console.log("✅ CLICKED! Navigating to:", `/public/${tourId}`);
      navigate(`/public/${tourId}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white shadow-md rounded-xl p-6 space-y-4 text-center">
      <h2 className="text-2xl font-bold">View a Public Tour Calendar</h2>

      <input
        type="text"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Paste calendar link here"
        className="w-full border rounded px-3 py-2"
      />

      <button
        onClick={handlePreview}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Preview
      </button>

      {tourId && (
        <div>
          <p className="text-green-600 mt-2">
            ✅ Link looks good. Tour ID: <span className="font-mono">{tourId}</span>
          </p>
          <button
            onClick={handleViewCalendar}
            className="text-blue-600 underline mt-2"
          >
            View Calendar
          </button>
        </div>
      )}

      {error && <p className="text-red-500 mt-2">❌ {error}</p>}
    </div>
  );
}
