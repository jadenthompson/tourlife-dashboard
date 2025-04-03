// src/utils/cityToIata.js

import airportData from './airportData.json';

export function getIataFromCity(city) {
  if (!city) return null;

  // Normalize: lowercase and trim spaces
  const normalizedCity = city.trim().toLowerCase();

  const match = airportData.find((entry) => {
    const entryCity = entry.city?.trim().toLowerCase();
    return entryCity === normalizedCity;
  });

  return match ? match.iata_code : null;
}
