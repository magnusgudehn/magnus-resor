import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { Trip } from '../types';

interface TripCardProps {
  trip: Trip;
}

const TripCard = ({ trip }: TripCardProps) => {
  return (
    <Link to={`/trip/${trip.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {trip.image && (
          <img 
            src={trip.image} 
            alt={trip.destination} 
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{trip.title}</h2>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{trip.destination}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              {new Date(trip.startDate).toLocaleDateString()} - 
              {new Date(trip.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TripCard; 