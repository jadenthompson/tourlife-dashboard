// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { createBrowserClient } from "@supabase/auth-helpers-react";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import App from "./App.jsx";
import "./index.css";

// 👇 Supabase client setup
const supabase = createBrowserClient(
  "https://jorntgixpsjetsyujkl.supabase.co", // Replace with your Supabase URL if not auto-imported
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvcmFudGdpeHBzamV0c3l1amtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNjU0MjcsImV4cCI6MjA1ODc0MTQyN30.QxPmwjTHxUru_GBT_EbxzkhOg2RCE4-4a5X_l8Ul0SY"
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SessionContextProvider>
  </React.StrictMode>
);
