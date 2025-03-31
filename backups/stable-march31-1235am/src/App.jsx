import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Today from './pages/Today';
import Itinerary from './pages/Itinerary';
import Settings from './pages/Settings';
import Assistant from './pages/Assistant';
import TourDetails from './pages/TourDetails';
import PublicCalendar from './pages/PublicCalendar';
import PublicCalendarLanding from './pages/PublicCalendarLanding';
import PublicEvent from './pages/PublicEvent';
import EventLogistics from './pages/EventLogistics'; // ✅ Import here
import BottomNav from './components/BottomNav';
import { useEffect } from 'react';

function LayoutWrapper({ children }) {
  const location = useLocation();
  const showBottomNav = ['/', '/itinerary', '/assistant'].includes(location.pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="relative min-h-screen pb-16 bg-gray-50 dark:bg-gray-900">
      {children}
      {showBottomNav && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Today />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/tour/:id" element={<TourDetails />} />
          <Route path="/public/:id" element={<PublicCalendar />} />
          <Route path="/calendar-link" element={<PublicCalendarLanding />} />
          <Route path="/public-event/:id" element={<PublicEvent />} />
          <Route path="/event/:id" element={<EventLogistics />} /> {/* ✅ This goes here */}
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}
