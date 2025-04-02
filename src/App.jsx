// src/App.jsx
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Today from "./pages/Today";
import Itinerary from "./pages/Itinerary";
import Assistant from "./pages/Assistant";
import { initOneSignal } from "./utils/onesignalInit";

function App() {
  useEffect(() => {
    initOneSignal();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Today />} />
        <Route path="/itinerary" element={<Itinerary />} />
        <Route path="/assistant" element={<Assistant />} />
      </Routes>
    </Router>
  );
}

export default App;
