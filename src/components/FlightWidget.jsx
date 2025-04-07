import React from "react";
import { Plane, AlertTriangle } from "lucide-react";
import Lottie from "lottie-react";
import planeTakeoffAnimation from "../assets/lottie/plane_takeoff.json";

export default function FlightWidget() {
  const getTimeBasedGradient = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "from-blue-100 to-yellow-100";
    if (hour >= 12 && hour < 18) return "from-sky-100 to-emerald-100";
    if (hour >= 18 && hour < 21) return "from-orange-200 to-purple-300";
    return "from-gray-800 to-gray-900";
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl shadow-lg p-5 bg-gradient-to-br ${getTimeBasedGradient()} dark:from-gray-800 dark:to-gray-900 transition-all duration-500`}
    >
      <Lottie
        animationData={planeTakeoffAnimation}
        loop
        autoplay
        className="absolute right-4 bottom-4 w-20 h-20 opacity-50 z-0 pointer-events-none"
      />

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
            <Plane className="w-5 h-5" /> Flight
          </h2>
        </div>

        <div className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Flight info temporarily unavailable (rate limit)
        </div>
      </div>
    </div>
  );
}
