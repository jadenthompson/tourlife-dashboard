// src/components/FlightWidget.jsx
import React from "react";

const formatDateTime = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return isNaN(date) ? "Invalid" : date.toLocaleString();
};

const FlightWidget = ({ segment }) => {
  if (!segment) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 space-y-1">
      <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Next Flight</h2>
      <p className="font-medium">
        ✈️ {segment.airline || "Airline"} – {segment.flight_number || "N/A"}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {segment.dep_city} → {segment.arr_city}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {formatDateTime(segment.dep_time)} → {formatDateTime(segment.arr_time)}
      </p>
    </div>
  );
};

export default FlightWidget;
