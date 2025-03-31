
import React from 'react';
import { Booking } from '@/types';
import { format, parseISO } from 'date-fns';
import { Airplane, Hotel, Car, Calendar, MapPin } from 'lucide-react';

interface BookingItemProps {
  booking: Booking;
}

const BookingItem: React.FC<BookingItemProps> = ({ booking }) => {
  const getIcon = () => {
    switch (booking.type) {
      case 'flight':
        return <Airplane className="h-6 w-6 text-travel-primary" />;
      case 'hotel':
        return <Hotel className="h-6 w-6 text-travel-secondary" />;
      case 'car':
        return <Car className="h-6 w-6 text-travel-accent" />;
      default:
        return <Calendar className="h-6 w-6 text-gray-500" />;
    }
  };

  const formatDate = (date: string) => {
    if (date.includes('T')) {
      // Date with time
      return format(parseISO(date), 'MMM d, yyyy - h:mm a');
    } else {
      // Date only
      return format(new Date(date), 'MMM d, yyyy');
    }
  };

  return (
    <div className="booking-item animate-slide-up">
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      
      <div className="flex-1">
        <h4 className="font-medium text-lg">{booking.title}</h4>
        
        <div className="text-sm text-muted-foreground mt-1">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(booking.startDate)}</span>
          </div>
          
          {booking.endDate && booking.startDate !== booking.endDate && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs">→</span>
              <span>{formatDate(booking.endDate)}</span>
            </div>
          )}
          
          {booking.location && (
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="h-4 w-4" />
              <span>{booking.location}</span>
            </div>
          )}
        </div>
        
        {booking.description && (
          <p className="mt-2 text-sm">{booking.description}</p>
        )}
        
        {booking.confirmationNumber && (
          <p className="mt-2 text-xs text-muted-foreground">
            Confirmation: <span className="font-medium">{booking.confirmationNumber}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default BookingItem;
