// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import OneSignal from "react-onesignal";
import Today from "./pages/Today";
import CreateTour from "./pages/CreateTour";
import Settings from "./pages/Settings";
import TourDetails from "./pages/TourDetails";
import PublicCalendar from "./pages/PublicCalendar";
import PublicEvent from "./pages/PublicEvent";
import Itinerary from "./pages/Itinerary";
import Assistant from "./pages/Assistant";
import BigCalendarView from "./pages/BigCalendar";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import BottomNav from "./components/BottomNav";
import { Toaster } from 'react-hot-toast';
import EventLogistics from './pages/EventLogistics';


function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    OneSignal.init({
      appId: "37e1dbd9-eb4d-4979-9541-56ca2a580b8f",
      notifyButton: {
        enable: true,
        allowLocalhostAsSecureOrigin: true,
      },
    });
  }, []);

  <Toaster />

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <div className="relative pb-20 min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 z-50 p-2 bg-gray-100 dark:bg-zinc-700 text-black dark:text-white rounded-full shadow hover:scale-105 transition"
        aria-label="Toggle Dark Mode"
      >
        {darkMode ? "🌞" : "🌙"}
      </button>

      <Routes>
        <Route path="/" element={<Today />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/create-tour" element={<CreateTour />} />
        <Route path="/tour/:id" element={<TourDetails />} />
        <Route path="/public/:id" element={<PublicCalendar />} />
        <Route path="/public-event/:id" element={<PublicEvent />} />
        <Route path="/itinerary" element={<Itinerary />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/calendar" element={<BigCalendarView />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/event/:id" element={<EventLogistics />} />
      </Routes>

      <BottomNav />
    </div>
  );
}

export default App;
