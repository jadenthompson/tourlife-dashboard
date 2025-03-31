import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="h-16 border-t bg-white flex items-center justify-around shadow-sm fixed bottom-0 left-0 right-0 z-50">
      <Link
        to="/"
        className={`text-sm ${isActive('/') ? 'font-semibold text-blue-600' : 'text-gray-500'}`}
      >
        🏠 Home
      </Link>

      <Link
        to="/itinerary"
        className={`text-sm ${isActive('/itinerary') ? 'font-semibold text-blue-600' : 'text-gray-500'}`}
      >
        📅 Itinerary
      </Link>
    </nav>
  );
}
