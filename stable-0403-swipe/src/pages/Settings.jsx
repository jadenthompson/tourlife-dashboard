// src/pages/Settings.jsx
import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

function Settings() {
  const [calendarSync, setCalendarSync] = useState(false);
  const [tempUnit, setTempUnit] = useState('C');

  useEffect(() => {
    async function fetchSettings() {
      const { data: userData, error } = await supabase
        .from('users')
        .select('calendar_sync_enabled, temp_unit')
        .limit(1)
        .single();

      if (userData) {
        setCalendarSync(userData.calendar_sync_enabled);
        setTempUnit(userData.temp_unit || 'C');
      }
    }

    fetchSettings();
  }, []);

  const handleCalendarToggle = async () => {
    const newValue = !calendarSync;
    setCalendarSync(newValue);

    await supabase.from('users').update({ calendar_sync_enabled: newValue }).eq('id', 1); // replace `1` with current user id if available
  };

  const handleTempToggle = async () => {
    const newUnit = tempUnit === 'C' ? 'F' : 'C';
    setTempUnit(newUnit);

    await supabase.from('users').update({ temp_unit: newUnit }).eq('id', 1); // replace `1` with current user id
  };

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
    </div>
  );
}

export default Settings;
