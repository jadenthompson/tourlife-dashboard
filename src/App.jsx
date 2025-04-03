import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Today from './pages/Today.jsx';
import Settings from './pages/Settings.jsx';
import Tours from './pages/Tours.jsx';
import TourDetails from './pages/TourDetails.jsx';
import PublicCalendar from './pages/PublicCalendar.jsx';
import PublicEvent from './pages/PublicEvent.jsx';
import Itinerary from './pages/Itinerary.jsx';
import Assistant from './pages/Assistant.jsx';
import BottomNav from './components/BottomNav.jsx';

function App() {
  return (
    <Router>
      <div className="relative pb-16">
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
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;