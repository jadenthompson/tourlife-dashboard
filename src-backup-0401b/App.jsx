import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Today from "./pages/Today";
import Itinerary from "./pages/Itinerary";
import Assistant from "./pages/Assistant";
import Profile from "./pages/Profile";
import BottomNav from "./components/BottomNav";
import { initOneSignal } from "./utils/onesignalInit";

function App() {
  useEffect(() => {
    initOneSignal();
  }, []);

  return (
    <Router>
      <div className="pb-16"> {/* Reserve space for bottom nav */}
        <Routes>
          <Route path="/" element={<Today />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
      <BottomNav />
    </Router>
  );
}

export default App;
