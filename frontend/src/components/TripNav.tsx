import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripService } from '../services/tripService';
import { Trip } from '../types';

export function TripNav({ currentTripId }: { currentTripId: string }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    tripService.getTrips().then(setTrips);
  }, []);

  return (
    <div className="bg-white shadow mb-6">
      <div className="container mx-auto px-4">
        <div className="flex gap-4 py-2">
          {trips.map(trip => (
            <button
              key={trip.id}
              onClick={() => navigate(`/trip/${trip.id}`)}
              className={`px-4 py-2 rounded-md transition-colors ${
                trip.id === currentTripId
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {trip.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 