import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import supabase from '../supabaseClient';
import { format } from 'date-fns';
import UploadIcon from '@/assets/icons/upload.svg?react';

export default function EventLogistics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [guests, setGuests] = useState([]);
  const [newGuest, setNewGuest] = useState('');
  const [itineraryUrl, setItineraryUrl] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [travel, setTravel] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [sharedNotes, setSharedNotes] = useState('');

  useEffect(() => {
    fetchEvent();
    fetchGuests();
    fetchItinerary();
    fetchTravel();
    fetchHotel();
    fetchNotes();
  }, [id]);

  const fetchEvent = async () => {
    const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
    if (!error) setEvent(data);
  };

  const fetchGuests = async () => {
    const { data } = await supabase.from('guests').select('*').eq('event_id', id);
    setGuests(data || []);
  };

  const fetchItinerary = async () => {
    const { data } = await supabase.from('itineraries').select('*').eq('event_id', id).single();
    setItineraryUrl(data?.pdf_url || '');
  };

  const fetchTravel = async () => {
    const { data } = await supabase.from('travel_segments').select('*').eq('event_id', id).maybeSingle();
    setTravel(data);
  };

  const fetchHotel = async () => {
    const { data } = await supabase.from('accommodations').select('*').eq('event_id', id).maybeSingle();
    setHotel(data);
  };

  const fetchNotes = async () => {
    const { data } = await supabase.from('event_notes').select('*').eq('event_id', id).single();
    setSharedNotes(data?.content || '');
  };

  const handleSaveNotes = async () => {
    await supabase.from('event_notes').upsert({
      event_id: id,
      content: sharedNotes,
      updated_at: new Date().toISOString(),
    });
  };

  const handleUpload = async () => {
    if (!pdfFile) return;
    const fileName = `${id}_${Date.now()}.pdf`;
    const filePath = `${id}/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('itineraries').upload(filePath, pdfFile, { upsert: true });
    if (uploadError) return;

    const { data: publicUrlData } = supabase.storage.from('itineraries').getPublicUrl(filePath);
    await supabase.from('itineraries').insert({ event_id: id, pdf_url: publicUrlData.publicUrl });
    setItineraryUrl(publicUrlData.publicUrl);
  };

  const handleAddGuest = async () => {
    if (!newGuest) return;
    await supabase.from('guests').insert({ event_id: id, name: newGuest });
    setNewGuest('');
    fetchGuests();
  };

  const handleDeleteGuest = async (guestId) => {
    await supabase.from('guests').delete().eq('id', guestId);
    fetchGuests();
  };

  if (!event) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 dark:bg-black min-h-screen dark:text-white text-black">
      <button onClick={() => navigate('/calendar')} className="text-sm text-blue-500 mb-4">← Back to Calendar</button>

      <h1 className="text-2xl font-bold">{event.name}</h1>
      <p className="text-gray-500">{event.city} • {format(new Date(event.start_time), 'dd/MM/yyyy, HH:mm')}</p>

      {/* 📄 Itinerary */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-1">
          <UploadIcon className="w-5 h-5" /> Itinerary
        </h2>
        {itineraryUrl ? (
          <iframe src={itineraryUrl} title="Itinerary PDF" className="w-full h-96 rounded border" />
        ) : (
          <p className="text-gray-400 text-sm mb-2">No itinerary uploaded yet.</p>
        )}
        <div className="mt-2 flex gap-2 items-center">
          <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files[0])} className="text-sm" />
          <button onClick={handleUpload} className="bg-purple-600 text-white text-sm px-4 py-1.5 rounded hover:bg-purple-700">
            Upload Itinerary PDF
          </button>
        </div>
      </div>

      {/* 👥 Guestlist */}
<div className="mt-10">
  <h2 className="text-lg font-semibold mb-3 flex items-center gap-1">👥 Guestlist</h2>
  {guests.length === 0 ? (
    <p className="text-gray-400 text-sm">No guests added yet.</p>
  ) : (
    <ul className="space-y-2">
      {guests.map((guest) => (
        <li
          key={guest.id}
          className="flex items-center justify-between bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md px-4 py-2"
        >
          <span className="text-sm text-black dark:text-white">{guest.name}</span>
          <button
            onClick={() => handleDeleteGuest(guest.id)}
            className="text-red-500 hover:text-red-700 text-lg"
            title="Delete"
          >
            🗑️
          </button>
        </li>
      ))}
    </ul>
  )}

  {/* Add guest */}
  <div className="mt-4 flex gap-2">
    <input
      type="text"
      placeholder="Add guest name"
      value={newGuest}
      onChange={(e) => setNewGuest(e.target.value)}
      className="p-2 rounded-md w-full border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-black dark:text-white placeholder-gray-400"
    />
    <button
      onClick={handleAddGuest}
      className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700"
    >
      Add
    </button>
  </div>
</div>


      {/* 📝 Shared Notes */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-2">📝 Team Notes</h2>
        <textarea
          value={sharedNotes}
          onChange={(e) => setSharedNotes(e.target.value)}
          onBlur={handleSaveNotes}
          placeholder="Add notes for the team..."
          className="w-full min-h-[120px] rounded-lg p-4 bg-white/10 dark:bg-zinc-800 text-white placeholder-gray-400 border border-zinc-400 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* ✈️ Travel */}
      {travel && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-2">✈️ Flight Info</h2>
          <p className="text-sm text-gray-500">{travel.airline} {travel.flight_number} • {travel.departure_city} → {travel.arrival_city}</p>
          <p className="text-sm text-gray-500">Departs: {format(new Date(travel.departure_time), 'PPpp')}</p>
        </div>
      )}

      {/* 🏨 Hotel */}
      {hotel && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">🏨 Hotel Info</h2>
          <p className="text-sm text-gray-500">{hotel.name}</p>
          <p className="text-sm text-gray-500">{hotel.address}</p>
          <p className="text-sm text-gray-500">Reservation #: {hotel.reservation_number}</p>
        </div>
      )}
    </div>
  );
}
