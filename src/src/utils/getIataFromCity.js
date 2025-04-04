import airportData from "./airportData.json";

export default function getIataFromCity(city) {
  if (!city) return null;

  const normalizedCity = city.trim().toLowerCase();
  const airport = airportData.find(
    (a) => a.city && a.city.trim().toLowerCase() === normalizedCity
  );

  return airport ? airport.iata : null;
}
