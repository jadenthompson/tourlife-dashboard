// src/pages/Settings.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Trash2 } from 'lucide-react';
import supabase from '../supabaseClient';
import { sendNotification } from '../utils/sendNotification';

export default function Settings() {
  const [calendarSync, setCalendarSync] = useState(false);
  const [tempUnit, setTempUnit] = useState('C');
  const [loading, setLoading] = useState(true);
  const [frequentFlyers, setFrequentFlyers] = useState([]);
  const [newAirline, setNewAirline] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [nameUpdateMessage, setNameUpdateMessage] = useState('');
  const navigate = useNavigate();

  const fallbackUser = {
    id: 'dc157e19-327c-4bec-b16c-6049de513215',
    email: 'jadentmusic@gmail.com',
  };

  const [currentUser, setCurrentUser] = useState(fallbackUser);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        const user = data?.user || fallbackUser;
        setCurrentUser(user);

        const { data: userData } = await supabase
          .from('users')
          .select('calendar_sync_enabled, temp_unit, full_name')
          .eq('id', user.id)
          .single();

        setCalendarSync(userData?.calendar_sync_enabled ?? false);
        setTempUnit(userData?.temp_unit ?? 'C');
        setFullName(userData?.full_name || '');
      } catch (err) {
        console.error('Settings load error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
    fetchFrequentFlyers();
  }, []);

  const fetchFrequentFlyers = async () => {
    const { data, error } = await supabase
      .from('frequent_flyer_numbers')
      .select('*');

    if (error) {
      console.error('FF fetch error:', error.message);
    } else {
      setFrequentFlyers(data || []);
    }
  };

  const handleAddFlyer = async () => {
    if (!newAirline || !newNumber) return;

    const { error } = await supabase.from('frequent_flyer_numbers').insert([
      {
        user_id: currentUser.id,
        airline: newAirline,
        ff_number: newNumber,
      },
    ]);

    if (!error) {
      setNewAirline('');
      setNewNumber('');
      fetchFrequentFlyers();
    } else {
      console.error('Insert FF error:', error.message);
    }
  };

  const handleDeleteFlyer = async (id) => {
    const { error } = await supabase
      .from('frequent_flyer_numbers')
      .delete()
      .eq('id', id);

    if (!error) {
      fetchFrequentFlyers();
    } else {
      console.error('Delete FF error:', error.message);
    }
  };

  const handleCalendarToggle = async () => {
    const newValue = !calendarSync;
    setCalendarSync(newValue);

    let updates = { calendar_sync_enabled: newValue };

    if (newValue) {
      const generatedUrl = `https://yourdomain.com/ical/${currentUser.id}.ics`;
      updates.ical_url = generatedUrl;
    }

    await supabase.from('users').update(updates).eq('id', currentUser.id);
  };

  const handleTempToggle = async () => {
    const newUnit = tempUnit === 'C' ? 'F' : 'C';
    setTempUnit(newUnit);
    await supabase
      .from('users')
      .update({ temp_unit: newUnit })
      .eq('id', currentUser.id);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) navigate('/login');
  };

  const handleNameUpdate = async () => {
    const { error } = await supabase
      .from('users')
      .update({ full_name: fullName })
      .eq('id', currentUser.id);

    if (error) {
      setNameUpdateMessage("Update failed. Try again.");
      console.error('Update name error:', error.message);
    } else {
      setNameUpdateMessage("Name updated successfully!");
    }

    setTimeout(() => setNameUpdateMessage(''), 3000);
  };

  if (loading) {
    return <div className="p-6 text-gray-500 text-sm">Loading settings...</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Update Name */}
      <div className="space-y-2">
        <label className="text-gray-800 dark:text-gray-200 font-medium">
          Your Name
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter full name"
            className="p-2 border rounded w-full"
          />
          <button
            onClick={handleNameUpdate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
          >
            Save
          </button>
        </div>
        {nameUpdateMessage && (
          <p className="text-sm text-green-500 dark:text-green-400">{nameUpdateMessage}</p>
        )}
      </div>

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
          className="mt-6 w-full flex items-center justify-center gap-2 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* 🎛 Frequent Flyer Settings */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          ✈️ Frequent Flyer Numbers
        </h2>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 mb-4">
          <input
            type="text"
            placeholder="Airline"
            value={newAirline}
            onChange={(e) => setNewAirline(e.target.value)}
            className="p-2 border rounded w-full sm:w-1/3"
          />
          <input
            type="text"
            placeholder="FF Number"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            className="p-2 border rounded w-full sm:w-1/3"
          />
          <button
            onClick={handleAddFlyer}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
          >
            <Plus className="w-4 h-4" />
            Save
          </button>
        </div>

        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {frequentFlyers.map((ff) => (
            <li
              key={ff.id}
              className="flex justify-between items-center py-2 text-sm text-gray-800 dark:text-gray-200"
            >
              <span>
                ✈️ <strong>{ff.airline}</strong> — {ff.ff_number}
              </span>
              {ff.user_id === currentUser.id && (
                <button
                  onClick={() => handleDeleteFlyer(ff.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* ✅ Test Notification Button */}
      <div className="pt-10">
        <button
          onClick={() =>
            sendNotification({
              title: '🚨 Flight Alert',
              message: 'Your flight has been delayed by 30 minutes.',
            })
          }
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-3 rounded-lg shadow"
        >
          📣 Send Test Notification
        </button>
      </div>
    </div>
  );
}