
import React from 'react';
import { Link } from 'react-router-dom';
import { Trip } from '@/types';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';

interface TripCardProps {
  trip: Trip;
}

const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  return (
    <Link to={`/trip/${trip.id}`} className="block animate-fade-in">
      <div className="trip-card">
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
            {trip.bookings.length} {trip.bookings.length === 1 ? 'booking' : 'bookings'}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TripCard;
