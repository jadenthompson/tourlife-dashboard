// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [publicProfile, setPublicProfile] = useState(false);
  const [joinCommunity, setJoinCommunity] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setProfile({
      name: "Jaden Thompson",
      tour: "Echo World Tour",
      citiesThisYear: 7,
      citiesAllTime: 23,
      showsThisYear: 12,
      showsAllTime: 67,
      flightsThisYear: 9,
      flightsAllTime: 35,
      publicId: "echo-world-tour",
    });
  }, []);

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading profile...
      </div>
    );
  }

  const profileUrl = `https://tourlife.app/public/${profile.publicId}`;

  const getBadges = () => {
    const badges = [];

    if (profile.showsAllTime >= 10) {
      badges.push("🎉 10 Shows Club");
    }
    if (profile.showsAllTime >= 25) {
      badges.push("🔥 25 Shows Club");
    }
    if (profile.showsAllTime >= 50) {
      badges.push("🏆 50 Shows Club");
    }
    if (profile.flightsAllTime >= 25) {
      badges.push("✈️ Frequent Flyer");
    }
    if (profile.citiesAllTime >= 20) {
      badges.push("🌍 Globetrotter");
    }

    return badges;
  };

  const badges = getBadges();

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="bg-black text-white rounded-2xl p-6 shadow-xl relative">
        <div className="text-sm font-semibold tracking-widest text-right">
          PRIORITY ACCESS
        </div>

        <div className="mt-4">
          <div className="text-lg font-bold">🎟 {profile.name}</div>
          <div className="text-xs text-gray-300 mt-1">
            TOUR: {profile.tour}
          </div>
        </div>

        <hr className="my-4 border-gray-700" />

        <div className="text-white space-y-2 text-sm">
          <div>🌍 Cities visited: {profile.citiesThisYear} (this year)</div>
          <div>🎤 Shows completed: {profile.showsThisYear} (this year)</div>
          <div>✈️ Flights taken: {profile.flightsThisYear} (this year)</div>
        </div>

        <div className="text-gray-400 text-xs mt-4">
          All-time: {profile.citiesAllTime} cities, {profile.showsAllTime} shows,{" "}
          {profile.flightsAllTime} flights
        </div>

        {badges.length > 0 && (
          <div className="mt-6">
            <div className="text-sm font-semibold text-gray-300 mb-2">
              Earned Badges
            </div>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge, index) => (
                <span
                  key={index}
                  className="bg-white text-black text-xs px-3 py-1 rounded-full shadow animate-pulse"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <QRCodeCanvas value={profileUrl} size={96} />
          <p className="text-xs text-gray-300 mt-2">
            Share your tour: <br />
            <a
              href={profileUrl}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              {profileUrl}
            </a>
          </p>
        </div>

        <div className="mt-4">
          <button
            onClick={() => navigate("/settings")}
            className="text-xs underline text-gray-400"
          >
            Edit Settings
          </button>
        </div>
      </div>

      <div className="mt-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={publicProfile}
            onChange={() => setPublicProfile(!publicProfile)}
          />
          Make my profile public
        </label>

        <label className="flex items-center gap-2 text-sm mt-2">
          <input
            type="checkbox"
            checked={joinCommunity}
            onChange={() => setJoinCommunity(!joinCommunity)}
          />
          Join community rankings
        </label>
      </div>
    </div>
  );
}
