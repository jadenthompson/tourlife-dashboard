export async function getFlightStatus(flightNumber, departureDate) {
    const apiKey = import.meta.env.VITE_AVIATIONSTACK_API_KEY;
  
    const url = `https://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_iata=${flightNumber}&flight_date=${departureDate}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (!data || !data.data || data.data.length === 0) {
        console.warn("No flight data found");
        return null;
      }
  
      // Return the first matching result
      const flight = data.data[0];
      return {
        airline: flight.airline.name,
        flightNumber: flight.flight.iata,
        status: flight.flight_status,
        depAirport: flight.departure.airport,
        depTime: flight.departure.scheduled,
        arrAirport: flight.arrival.airport,
        arrTime: flight.arrival.scheduled,
      };
    } catch (error) {
      console.error("Flight API error:", error);
      return null;
    }
  }
  