// src/components/BottomNav.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Calendar,
  MessageCircle,
  Settings,
  User,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: <Home size={22} />, label: 'Home' },
  { to: '/calendar', icon: <Calendar size={22} />, label: 'Calendar' },
  { to: '/assistant', icon: <MessageCircle size={22} />, label: 'AI' },
  { to: '/settings', icon: <Settings size={22} />, label: 'Settings' },
  { to: '/profile', icon: <User size={22} />, label: 'Profile' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-2 left-0 right-0 z-50 flex justify-center">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 shadow-md rounded-full px-6 py-2 flex gap-6">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center justify-center w-10 h-10 rounded-full transition ${
                isActive ? 'bg-purple-600 text-white shadow-md' : 'text-zinc-500 hover:text-black dark:hover:text-white'
              }`
            }
          >
            {item.icon}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
