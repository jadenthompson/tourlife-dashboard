import React from 'react';
// /src/components/VenuePhotoWidget.jsx
import { useEffect, useState } from "react";
import supabase from "../supabase/supabaseClient";
import axios from "axios";

const UNSPLASH_ACCESS_KEY = "53aZo05gjX9GxRogOT_VelqfHRo3AWSZw0V1joqsSg0";

export default function VenuePhotoWidget() {
  const [photoUrl, setPhotoUrl] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState(null);

  const fetchCityAndPhoto = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("city")
        .order("set_time", { ascending: true })
        .limit(1);

      if (error) throw error;
      if (!data || data.length === 0) throw new Error("No upcoming events found.");

      const nextCity = data[0].city;
      setCity(nextCity);

      const res = await axios.get(
        `https://api.unsplash.com/photos/random?query=${encodeURIComponent(
          nextCity
        )}&client_id=${UNSPLASH_ACCESS_KEY}`
      );

      if (res.data && res.data.urls) {
        setPhotoUrl(res.data.urls.regular);
      } else {
        throw new Error("No image found.");
      }
    } catch (err) {
      console.error("Venue photo widget error:", err.message);
      setError("Photo unavailable.");
    }
  };

  useEffect(() => {
    fetchCityAndPhoto();
  }, []);

  return (
    <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-md">
      {photoUrl ? (
        <>
          <img
            src={photoUrl}
            alt={`Photo of ${city}`}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
            <div className="text-white text-sm p-4 font-semibold">
              📍 {city}
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400">
          {error || "Loading photo..."}
        </div>
      )}
    </div>
  );
}
