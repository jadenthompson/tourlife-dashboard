import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Today from "./pages/Today";
import Itinerary from "./pages/Itinerary";
import Assistant from "./pages/Assistant";
import Profile from "./pages/Profile";
import ShareStoryPage from "./pages/ShareStoryPage"; // ✅ new share page
import BottomNav from "./components/BottomNav";
import { initOneSignal } from "./utils/onesignalInit";

function AppWrapper() {
  const location = useLocation();
  const hideNavOn = ["/share/", "/settings", "/public", "/public-event"];

  const shouldShowNav = !hideNavOn.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      <div className="pb-16"> {/* Reserve space for bottom nav */}
        <Routes>
          <Route path="/" element={<Today />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/share/:id" element={<ShareStoryPage />} /> {/* ✅ new route */}
        </Routes>
      </div>
      {shouldShowNav && <BottomNav />}
    </>
  );
}

function App() {
  useEffect(() => {
    initOneSignal();
  }, []);

  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
