// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Today from './pages/Today';
import Settings from './pages/Settings';
import Tours from './pages/Tours';
import TourDetails from './pages/TourDetails';
import PublicCalendar from './pages/PublicCalendar';
import PublicEvent from './pages/PublicEvent';
import Itinerary from './pages/Itinerary';
import Assistant from './pages/Assistant';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Today />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/tour/:id" element={<TourDetails />} />
        <Route path="/public/:id" element={<PublicCalendar />} />
        <Route path="/public-event/:id" element={<PublicEvent />} />
        <Route path="/itinerary" element={<Itinerary />} />
        <Route path="/assistant" element={<Assistant />} />
      </Routes>
    </Router>
  );
}

export default App;
