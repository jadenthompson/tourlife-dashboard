// src/App.jsx
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Today from "./pages/Today";
import Itinerary from "./pages/Itinerary";
import Assistant from "./pages/Assistant";
import PublicCalendar from './pages/PublicCalendar';
import Profile from "./pages/Profile";
import ShareTour from "./pages/ShareTour"; // ✅ NEW
import ShareStoryPage from "./pages/ShareStoryPage"; // already exists
import BottomNav from "./components/BottomNav";
import { initOneSignal } from "./utils/onesignalInit";

function App() {
  useEffect(() => {
    initOneSignal();
  }, []);

  return (
    <Router>
      <div className="pb-16">
        <Routes>
          <Route path="/" element={<Today />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/public/:id" element={<PublicCalendar />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/share/:id" element={<ShareTour />} /> {/* ✅ NEW route */}
          <Route path="/share-story/:id" element={<ShareStoryPage />} />
        </Routes>
      </div>
      <BottomNav />
    </Router>
  );
}

export default App;
