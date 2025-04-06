import React from 'react';
import { Link } from 'react-router-dom';
import { Trip } from '../types';
import { format } from 'date-fns';
import { Calendar, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { tripService } from '../services/tripService';

interface TripCardProps {
  trip: Trip;
  onDelete?: () => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Är du säker på att du vill ta bort denna resa?')) {
      await tripService.deleteTrip(trip.id);
      if (onDelete) {
        onDelete();
      }
    }
  };

  return (
    <div 
      className="relative group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={() => navigate(`/trips/${trip.id}`)}
    >
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={handleDelete}
          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors duration-200"
          title="Ta bort resa"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div className="p-4">
        {trip.image && (
          <div className="mb-4 overflow-hidden rounded-md">
            <img 
              src={trip.image} 
              alt={trip.destination} 
              className="h-48 w-full object-cover transition-transform hover:scale-105"
            />
          </div>
        )}
        <h3 className="text-xl font-semibold mb-2">{trip.title}</h3>
        <p className="text-gray-500 mb-3">{trip.destination}</p>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
          </span>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            {trip.bookings.length} {trip.bookings.length === 1 ? 'bokning' : 'bokningar'}
          </div>
        </div>
      </div>
    </div>
  );
};
