import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, User } from "lucide-react";

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: <Home size={20} />, label: "Today" },
    { path: "/itinerary", icon: <Calendar size={20} />, label: "Calendar" },
    { path: "/profile", icon: <User size={20} />, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 z-50 dark:bg-black dark:border-gray-700">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center text-xs ${
            location.pathname === item.path
              ? "text-blue-500 font-medium"
              : "text-gray-400"
          }`}
        >
          {item.icon}
          <span className="text-[11px] mt-1">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
