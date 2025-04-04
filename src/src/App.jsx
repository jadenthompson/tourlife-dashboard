// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Today from './pages/Today';
import TourDetails from './pages/TourDetails';
import PublicCalendar from './pages/PublicCalendar';
import PublicEvent from './pages/PublicEvent';
import Settings from './pages/Settings';
import ShareTour from './pages/ShareTour';
import EventLogistics from './pages/EventLogistics';
import Profile from './pages/Profile';



function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white font-sans">
        <Routes>
          {/* Home */}
          <Route path="/" element={<Today />} />

          {/* Private/Internal Routes */}
          <Route path="/tour/:id" element={<TourDetails />} />
          <Route path="/event/:id" element={<EventLogistics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />

          {/* Public Shareable Routes */}
          <Route path="/public/:id" element={<PublicCalendar />} />
          <Route path="/public-event/:id" element={<PublicEvent />} />
          <Route path="/share/:id" element={<ShareTour />} />
        </Routes>
      </div>
    </Router>
  );
}



export default App;
