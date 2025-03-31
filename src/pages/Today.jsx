import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { Moon, Sun, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function Today() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const widgets = [
    {
      id: "flight",
      title: "Next Flight",
      icon: "✈️",
      content: "No upcoming flights found.",
    },
    {
      id: "travel-summary",
      title: "Travel Summary",
      icon: "🧳",
      content: "2 cities, 3 flights, 1 hotel this week.",
    },
    {
      id: "weather",
      title: "Weather Forecast",
      icon: "🌤️",
      content: "Partly sunny in Berlin. High 18°C, Low 9°C.",
    },
    {
      id: "crew-notes",
      title: "Crew Notes",
      icon: "🧑‍🚀",
      content: "Soundcheck at 3pm. Meet promoter at venue.",
    },
  ];

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
        <div className="relative overflow-hidden rounded-xl shadow bg-gray-100 dark:bg-gray-900 transition-all duration-300">
          <div
            className="h-40 flex transform transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {widgets.map((widget, index) => (
              <div key={index} className="min-w-full flex-shrink-0">
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <span>{widget.icon}</span> {widget.title}
                  </h2>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{widget.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-3 gap-2">
          {widgets.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "bg-blue-500 scale-110"
                  : "bg-gray-400 dark:bg-gray-600 opacity-50"
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* AI Assistant */}
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
