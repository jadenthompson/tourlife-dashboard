import React, { useEffect, useState } from "react";
import {
  Landmark,
  ExternalLink,
  RefreshCw,
  ImageOff,
  AlertTriangle,
} from "lucide-react";
import supabase from "../supabaseClient";

const CITY_PHOTO_CACHE = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export default function CityPhotoWidget() {
  const [cityData, setCityData] = useState({
    image: null,
    name: "",
    credit: null,
    nextEvent: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCityData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!import.meta.env.VITE_UNSPLASH_KEY) {
        throw new Error("Photo API key not configured");
      }

      // Use only the working `events` table
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("city, venue_name, start_time")
        .order("start_time", { ascending: true })
        .limit(1)
        .single();

      if (eventError || !eventData) {
        throw new Error("No upcoming events found");
      }

      const cityName = eventData.city || "Next City";
      const venueName = eventData.venue_name || "";
      const eventDate = eventData.start_time || null;
      const cacheKey = `city-${cityName}`;

      const cached = CITY_PHOTO_CACHE.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setCityData({
          image: cached.image,
          name: cityName,
          credit: cached.credit,
          nextEvent: { city: cityName, venue: venueName, date: eventDate },
        });
        return;
      }

      const unsplashResponse = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          cityName
        )}&client_id=${import.meta.env.VITE_UNSPLASH_KEY}&per_page=1&orientation=landscape`
      );
      if (!unsplashResponse.ok) throw new Error("Unsplash API error");

      const { results } = await unsplashResponse.json();
      const photo = results?.[0];
      if (!photo?.urls?.regular) throw new Error("No photos found");

      const credit = {
        name: photo.user.name,
        username: photo.user.username,
        link: `${photo.links.html}?utm_source=TourLife&utm_medium=referral`,
      };

      CITY_PHOTO_CACHE.set(cacheKey, {
        image: photo.urls.regular,
        credit,
        timestamp: Date.now(),
      });

      setCityData({
        image: photo.urls.regular,
        name: cityName,
        credit,
        nextEvent: { city: cityName, venue: venueName, date: eventDate },
      });
    } catch (err) {
      console.error("City photo error:", err.message);
      setError(err.message);
      setCityData((prev) => ({
        ...prev,
        image: null,
        name: "Next Destination",
        nextEvent: null,
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCityData();
  }, []);

  const formatEventDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return isNaN(date)
        ? ""
        : date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
    } catch {
      return "";
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Landmark className="w-4 h-4" /> {cityData.name}
        </h2>
        <div className="flex items-center gap-2">
          {error && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
          <button
            onClick={fetchCityData}
            disabled={loading}
            className={`text-xs ${
              loading ? "text-gray-400" : "text-blue-600 hover:underline"
            } flex items-center gap-1`}
          >
            {loading ? "Refreshing..." : <RefreshCw className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {cityData.nextEvent?.venue && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
          {cityData.nextEvent.venue}
        </p>
      )}
      {cityData.nextEvent?.date && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          {formatEventDate(cityData.nextEvent.date)}
        </p>
      )}

      <div className="h-48 bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <ImageOff className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-red-500">{error}</p>
            <button
              onClick={fetchCityData}
              className="mt-2 text-xs text-blue-600 hover:underline dark:text-blue-400"
            >
              Try again
            </button>
          </div>
        ) : cityData.image ? (
          <>
            <img
              src={cityData.image}
              alt={`${cityData.name} cityscape`}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.src = "/city-fallback.jpg";
                setError("Failed to load high-quality image");
              }}
            />
            {cityData.credit && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
                <span>Photo by {cityData.credit.name}</span>
                <a
                  href={cityData.credit.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 hover:underline"
                  aria-label="View on Unsplash"
                >
                  <ExternalLink className="inline w-3 h-3" />
                </a>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Landmark className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No image available
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
