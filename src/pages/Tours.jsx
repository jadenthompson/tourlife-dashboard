import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../supabaseClient';


const Tours = () => {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    const fetchTours = async () => {
      const { data, error } = await supabase.from('tours').select('*');
      if (!error) setTours(data);
    };
    fetchTours();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tours</h1>
      <ul>
        {tours.map((tour) => (
          <li key={tour.id} className="mb-2">
            <Link to={`/tour/${tour.id}`} className="text-blue-600 underline">
              <strong>{tour.name}</strong>
            </Link>{' '}
            ({tour.start_date} to {tour.end_date})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tours;
