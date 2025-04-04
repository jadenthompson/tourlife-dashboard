import Profile from './pages/Profile';
import React from 'react';
import ReactDOM from 'react-dom/client';
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
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import supabase from './supabaseClient';
import Login from './pages/Login';


ReactDOM.createRoot(document.getElementById('root')).render(
  <SessionContextProvider supabaseClient={supabase}>
    <App />
  </SessionContextProvider>
);


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
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;