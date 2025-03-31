// src/components/FlightWidget.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getIataFromCity } from "../utils/cityToIata";
import { format } from "date-fns";

const FlightWidget = ({ departureCity, arrivalCity, flightNumber, flightDate }) => {
  const [flightData, setFlightData] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  const depIata = getIataFromCity(departureCity);
  const arrIata = getIataFromCity(arrivalCity);
  const cacheKey = `flight_${flightNumber}_${flightDate}`;

  useEffect(() => {
    const fetchFlightStatus = async () => {
      try {
        const response = await axios.get(
          `https://api.aviationstack.com/v1/flights`,
          {
            params: {
              access_key: import.meta.env.VITE_AVSTACK_KEY,
              flight_iata: flightNumber,
              flight_date: flightDate,
            },
          }
        );

        const data = response.data.data?.[0];

        if (data) {
          setFlightData(data);
          localStorage.setItem(cacheKey, JSON.stringify(data));
        } else {
          setIsOffline(true);
        }
      } catch (error) {
        console.warn("Using cached flight status due to offline mode");
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          setFlightData(JSON.parse(cached));
          setIsOffline(true);
        }
      }
    };

    fetchFlightStatus();
  }, [flightNumber, flightDate, cacheKey]);

  if (!flightData) return null;

  const getTime = (timestamp) =>
    timestamp ? format(new Date(timestamp), "HH:mm") : "N/A";

  return (
    <div className="max-w-md mx-auto mt-4 bg-black text-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-medium text-gray-400">{flightNumber}</div>
            <div className="text-lg font-semibold">
              {getTime(flightData.departure?.scheduled)}{" "}
              <span className="text-xs text-gray-400">{depIata}</span>
            </div>
            <div className="text-sm text-gray-400">
              {flightData.departure?.airport || departureCity}
            </div>
          </div>
          <div className="text-3xl">✈️</div>
          <div className="text-right">
            <div className="text-lg font-semibold">
              {getTime(flightData.arrival?.scheduled)}{" "}
              <span className="text-xs text-gray-400">{arrIata}</span>
            </div>
            <div className="text-sm text-gray-400">
              {flightData.arrival?.airport || arrivalCity}
            </div>
          </div>
        </div>
        <div className="mt-2 text-center text-sm">
          <span className="text-green-400">
            {flightData.flight_status || "scheduled"}
          </span>{" "}
          {isOffline && <span className="text-yellow-400">(Offline)</span>}
        </div>
        <div className="text-center text-xs text-gray-500 mt-1">
          Real-time updates powered by AviationStack
        </div>
      </div>
    </div>
  );
};

export default FlightWidget;
