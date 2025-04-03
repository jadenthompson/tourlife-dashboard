import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient.js';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const Settings = () => {
  const [calendarSync, setCalendarSync] = useState(false);
  const [tempUnit, setTempUnit] = useState('C');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) navigate('/login');
  };

  useEffect(() => {
    async function fetchSettings() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData, error } = await supabase
        .from('users')
        .select('calendar_sync_enabled, temp_unit')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching settings:', error);
      } else if (userData) {
        setCalendarSync(userData.calendar_sync_enabled || false);
        setTempUnit(userData.temp_unit || 'C');
      }
      setLoading(false);
    }

    fetchSettings();
  }, []);

  const handleCalendarToggle = async () => {
    const newValue = !calendarSync;
    setCalendarSync(newValue);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('users').update({ calendar_sync_enabled: newValue }).eq('id', user.id);
    }
  };

  const handleTempToggle = async () => {
    const newUnit = tempUnit === 'C' ? 'F' : 'C';
    setTempUnit(newUnit);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('users').update({ temp_unit: newUnit }).eq('id', user.id);
    }
  };

  if (loading) return <div className="p-6">Loading settings...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <div className="mb-4">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={calendarSync}
            onChange={handleCalendarToggle}
            className="w-5 h-5"
          />
          <span>Enable Calendar Sync</span>
        </label>
      </div>

      <div className="mb-4">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={tempUnit === 'F'}
            onChange={handleTempToggle}
            className="w-5 h-5"
          />
          <span>Temperature Unit: {tempUnit}</span>
        </label>
      </div>

      <button 
        onClick={handleLogout}
        className="mt-6 w-full flex items-center justify-center gap-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  );
};

export default Settings;