import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import supabase from '../supabaseClient';

export default function Settings() {
  const [calendarSync, setCalendarSync] = useState(false);
  const [tempUnit, setTempUnit] = useState('C');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // TEMP: Dev-only fallback user
  const fallbackUser = {
    id: "dc157e19-327c-4bec-b16c-6049de513215", // Replace with your real user ID
    email: "jadentmusic@gmail.com"
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();

        const user = data?.user || fallbackUser;

        const { data: userData, error: fetchError } = await supabase
          .from('users')
          .select('calendar_sync_enabled, temp_unit')
          .eq('id', user.id)
          .single();

        if (fetchError) {
          console.error("Supabase fetch error:", fetchError.message);
        } else {
          setCalendarSync(userData?.calendar_sync_enabled ?? false);
          setTempUnit(userData?.temp_unit ?? 'C');
        }
      } catch (err) {
        console.error("Unknown settings load error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleCalendarToggle = async () => {
    const newValue = !calendarSync;
    setCalendarSync(newValue);

    const { data } = await supabase.auth.getUser();
    const user = data?.user || fallbackUser;

    await supabase
      .from('users')
      .update({ calendar_sync_enabled: newValue })
      .eq('id', user.id);
  };

  const handleTempToggle = async () => {
    const newUnit = tempUnit === 'C' ? 'F' : 'C';
    setTempUnit(newUnit);

    const { data } = await supabase.auth.getUser();
    const user = data?.user || fallbackUser;

    await supabase
      .from('users')
      .update({ temp_unit: newUnit })
      .eq('id', user.id);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) navigate('/login');
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500 text-sm">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-800 dark:text-gray-200 font-medium">
            Calendar Sync
          </span>
          <input
            type="checkbox"
            checked={calendarSync}
            onChange={handleCalendarToggle}
            className="w-5 h-5"
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-800 dark:text-gray-200 font-medium">
            Temperature Unit
          </span>
          <button
            onClick={handleTempToggle}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            {tempUnit === 'C' ? '°C (Metric)' : '°F (Imperial)'}
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 w-full flex items-center justify-center gap-2 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
