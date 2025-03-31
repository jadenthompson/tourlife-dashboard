import { useState, useRef, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { Moon, Sun, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Today() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerHeight, setContainerHeight] = useState("auto");
  const containerRef = useRef(null);

  const widgets = [
    {
      id: "flight",
      title: "Next Flight",
      content: (
        <div className="p-4">
          ✈️ <span className="font-medium">No upcoming flights found.</span>
        </div>
      ),
    },
    {
      id: "hotel",
      title: "Hotel Info",
      content: (
        <div className="p-4">
          🏨 <span className="font-medium">No hotel booked yet.</span>
        </div>
      ),
    },
    {
      id: "weather",
      title: "Weather Forecast",
      content: (
        <div className="p-4">
          🌦️ <span className="font-medium">Weather data coming soon...</span>
        </div>
      ),
    },
  ];

  // Adjust height based on active widget
  useEffect(() => {
    if (containerRef.current) {
      const newHeight = containerRef.current.offsetHeight;
      setContainerHeight(newHeight);
    }
  }, [currentIndex]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setCurrentIndex((prev) => (prev + 1) % widgets.length),
    onSwipedRight: () =>
      setCurrentIndex((prev) => (prev - 1 + widgets.length) % widgets.length),
    trackMouse: true,
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-6">
        <div>
          <h1 className="text-xl font-semibold">Good evening, Jaden</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Echo World Tour</p>
        </div>
        <Link to="/settings">
          <Settings className="w-5 h-5 text-gray-500 dark:text-gray-300" />
        </Link>
      </div>

      {/* Widget Carousel */}
      <div {...swipeHandlers} className="px-4">
        <div
          className="relative overflow-hidden rounded-xl shadow bg-gray-100 dark:bg-gray-900 transition-all duration-300"
          style={{ height: containerHeight }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentIndex}
              ref={containerRef}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-0 left-0 w-full"
            >
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">
                  {widgets[currentIndex].title}
                </h2>
                {widgets[currentIndex].content}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-3 gap-2">
          {widgets.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                i === currentIndex
                  ? "bg-blue-500"
                  : "bg-gray-400 dark:bg-gray-600"
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* Assistant Buttons */}
      <div className="px-4 mt-8">
        <h2 className="text-lg font-semibold mb-2">AI Assistant</h2>
        <div className="grid grid-cols-3 gap-2">
          <button className="bg-gray-200 dark:bg-gray-800 text-sm rounded px-2 py-1">
            🛏️ When should I sleep?
          </button>
          <button className="bg-gray-200 dark:bg-gray-800 text-sm rounded px-2 py-1">
            ✈️ Optimize my travel
          </button>
          <button className="bg-gray-200 dark:bg-gray-800 text-sm rounded px-2 py-1">
            📋 Summarize today
          </button>
        </div>
      </div>
    </div>
  );
}
