import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';


export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleToggle = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="flex items-center justify-between">
        <span className="text-lg">🌙 Dark Mode</span>
        <button
          onClick={handleToggle}
          className={`w-14 h-8 rounded-full p-1 transition-all ${
            darkMode ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <div
            className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
              darkMode ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
