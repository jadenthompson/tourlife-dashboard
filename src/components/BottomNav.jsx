import { Home, Settings, MessageSquare, Calendar, Map, User } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700">
      <div className="flex justify-around items-center p-2">
        <NavLink to="/" className={({ isActive }) => `p-2 rounded-full ${isActive ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}>
          <Home className="w-5 h-5" />
        </NavLink>
        <NavLink to="/tours" className={({ isActive }) => `p-2 rounded-full ${isActive ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}>
          <Map className="w-5 h-5" />
        </NavLink>
        <NavLink to="/assistant" className={({ isActive }) => `p-2 rounded-full ${isActive ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}>
          <MessageSquare className="w-5 h-5" />
        </NavLink>
        <NavLink to="/public/current" className={({ isActive }) => `p-2 rounded-full ${isActive ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}>
          <Calendar className="w-5 h-5" />
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `p-2 rounded-full ${isActive ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}>
          <Settings className="w-5 h-5" />
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `p-2 rounded-full ${isActive ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}>
          <User className="w-5 h-5" />
        </NavLink>
      </div>
    </nav>
  );
}
