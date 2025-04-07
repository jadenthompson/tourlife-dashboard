import React, { useEffect, useRef, useState } from 'react';
import supabase from '../supabaseClient';
import { toast } from 'react-hot-toast';
import { Camera } from 'lucide-react';
import { toPng } from 'html-to-image';

export default function Profile() {
  const [userId, setUserId] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [fullName, setFullName] = useState('Your Name');
  const [tourStats, setTourStats] = useState({ cities: 0, shows: 0, flights: 0 });
  const cardRef = useRef();

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();

      if (authError || !user) {
        toast.error('Not logged in.');
        return;
      }

      setUserId(user.id);

      // Fetch profile from users table
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError || !userProfile) {
        toast.error('Could not load profile.');
        return;
      }

      setFullName(userProfile.full_name || 'Your Name');
      setAvatarUrl(userProfile.avatar_url || null);

      // Load stats
      const [{ data: events }, { data: travel }] = await Promise.all([
        supabase.from('events').select('city').eq('user_id', user.id),
        supabase.from('travel_segments').select('id').eq('user_id', user.id),
      ]);

      const citySet = new Set(events?.map((e) => e.city));
      setTourStats({
        cities: citySet.size || 0,
        shows: events?.length || 0,
        flights: travel?.length || 0,
      });
    };

    fetchProfile();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !userId) return;

    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error('Upload failed.');
      return;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const publicUrl = data.publicUrl;

    const { error: updateError } = await supabase
      .from('users')
      .update({ avatar_url: publicUrl })
      .eq('id', userId);

    if (updateError) {
      toast.error('Failed to save avatar URL.');
    } else {
      setAvatarUrl(publicUrl);
      toast.success('Profile photo updated!');
    }
  };

  const handleExport = async () => {
    if (!cardRef.current) return;
    const dataUrl = await toPng(cardRef.current);
    const link = document.createElement('a');
    link.download = 'tour-pass.png';
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4 py-6">
      <div
        ref={cardRef}
        className="w-full max-w-sm p-6 rounded-3xl bg-gradient-to-b from-purple-500 to-black text-white shadow-xl relative min-h-[90vh] flex flex-col justify-between"
      >
        {/* Camera icon */}
        <label htmlFor="avatar-upload">
          <div className="absolute top-5 right-5 z-10 cursor-pointer bg-white/20 hover:bg-white/30 p-2 rounded-full">
            <Camera className="w-5 h-5 text-white" />
          </div>
        </label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Avatar */}
        <div className="flex flex-col items-center mt-6">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full border-2 border-white flex items-center justify-center text-sm text-gray-300">
              Avatar
            </div>
          )}
        </div>

        {/* Name */}
        <div className="text-center mt-4">
          <h2 className="text-xl font-bold">{fullName}</h2>
          <p className="text-xs text-gray-300">Powered by TourLife</p>
        </div>

        {/* Stats */}
        <div className="flex justify-around mt-8 text-sm">
          <div className="text-center">
            <p className="font-bold text-lg">{tourStats.cities}</p>
            <p className="text-gray-300">Cities</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">{tourStats.shows}</p>
            <p className="text-gray-300">Shows</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">{tourStats.flights}</p>
            <p className="text-gray-300">Flights</p>
          </div>
        </div>

        {/* Export */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-gradient-to-r from-purple-400 to-blue-500 text-white rounded-full text-sm font-medium shadow hover:opacity-90"
          >
            Export as Instagram Story
          </button>
        </div>
      </div>
    </div>
  );
}
