import React, { useEffect, useState, useRef } from "react";
import {
  Settings,
  Plane,
  Hotel,
  Cloud,
  Landmark,
  Calendar as CalendarIcon,
  Pencil,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import FlightWidget from "../components/FlightWidget";
import HotelWidget from "../components/HotelWidget";
import WeatherWidget from "../components/WeatherWidget";
import CityPhotoWidget from "../components/CityPhotoWidget";
import CalendarSummaryWidget from "../components/CalendarSummaryWidget";
import supabase from "../supabaseClient";

export default function Today() {
  const [timeOfDay, setTimeOfDay] = useState("morning");
  const [firstName, setFirstName] = useState("there");
  const [editMode, setEditMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const [widgetGroups, setWidgetGroups] = useState([
    {
      id: "travel",
      title: "Travel",
      widgets: [
        {
          id: "flight",
          name: "Flight",
          icon: <Plane className="w-4 h-4 inline-block mr-1" />,
          component: <FlightWidget />,
          route: "/flights",
        },
        {
          id: "hotel",
          name: "Hotel",
          icon: <Hotel className="w-4 h-4 inline-block mr-1" />,
          component: <HotelWidget />,
          route: "/hotels",
        },
      ],
    },
    {
      id: "location",
      title: "Location",
      widgets: [
        {
          id: "city",
          name: "Next City",
          icon: <Landmark className="w-4 h-4 inline-block mr-1" />,
          component: <CityPhotoWidget />,
          route: "/map",
        },
      ],
    },
    {
      id: "weather",
      title: "Weather",
      widgets: [
        {
          id: "weather",
          name: "Weather",
          icon: <Cloud className="w-4 h-4 inline-block mr-1" />,
          component: <WeatherWidget />,
          route: "/weather",
        },
      ],
    },
    {
      id: "schedule",
      title: "Schedule",
      widgets: [
        {
          id: "calendar",
          name: "Today & Upcoming",
          icon: <CalendarIcon className="w-4 h-4 inline-block mr-1" />,
          component: <CalendarSummaryWidget />,
          route: "/calendar",
        },
      ],
    },
  ]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDay("morning");
    else if (hour >= 12 && hour < 18) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.id) {
        const { data } = await supabase
          .from("users")
          .select("first_name, full_name")
          .eq("id", user.id)
          .maybeSingle();

        if (data?.first_name) {
          setFirstName(data.first_name);
        } else if (data?.full_name) {
          setFirstName(data.full_name.split(" ")[0]);
        }
      }

      setInitializing(false);
    };

    fetchUser();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(widgetGroups);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setWidgetGroups(items);
  };

  const greetingText = {
    morning: "Good morning",
    afternoon: "Good afternoon",
    evening: "Good evening",
  }[timeOfDay];

  if (initializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black text-gray-400 text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300 pb-32"
      onTouchStart={(e) => (scrollRef.current = e.touches[0].clientY)}
      onTouchEnd={(e) => {
        const end = e.changedTouches[0].clientY;
        if (end - scrollRef.current > 50) handleRefresh();
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-4 pt-6 pb-2">
        <h1 className="text-2xl font-bold">
          {greetingText}, {firstName}.
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditMode(!editMode)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            <Pencil className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate("/settings")}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Refreshing state */}
      {refreshing && (
        <div className="text-center text-sm text-gray-400 mb-2">
          Refreshing...
        </div>
      )}

      {/* Drag-and-drop groups */}
      <div className="mt-1 px-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="groups">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {widgetGroups.map((group, index) => (
                  <Draggable
                    key={group.id}
                    draggableId={group.id}
                    index={index}
                    isDragDisabled={!editMode}
                  >
                    {(provided) => (
                      <div
                        className="mb-6"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <div
                          className="text-lg font-semibold mb-2 flex items-center justify-between"
                          {...provided.dragHandleProps}
                        >
                          <span>{group.title}</span>
                          {editMode && (
                            <div className="text-xs text-gray-400">⇅</div>
                          )}
                        </div>
                        {group.widgets.map((widget) => (
                          <div
                            key={widget.id}
                            onClick={() => navigate(widget.route)}
                            className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-md p-4 mb-4 transition-transform duration-300 active:scale-[0.98] cursor-pointer"
                          >
                            <h2 className="text-lg font-semibold mb-2">
                              {widget.icon}
                              {widget.name}
                            </h2>
                            {refreshing ? null : widget.component}
                          </div>
                        ))}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
