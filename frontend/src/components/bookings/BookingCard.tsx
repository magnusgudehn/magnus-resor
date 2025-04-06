import { Booking } from '../../types';
import { format } from 'date-fns';
import { 
  Plane, 
  Hotel, 
  Car, 
  Utensils, 
  FileText,
  Calendar,
  MapPin,
  Clock,
  Edit2,
  Trash2
} from 'lucide-react';
import { Button } from '../ui/button';

interface BookingCardProps {
  booking: Booking;
  onEdit: (booking: Booking) => void;
  onDelete: (bookingId: string) => void;
}

export function BookingCard({ booking, onEdit, onDelete }: BookingCardProps) {
  const getIcon = () => {
    switch (booking.type) {
      case 'flight':
        return <Plane className="w-5 h-5" />;
      case 'hotel':
        return <Hotel className="w-5 h-5" />;
      case 'car':
        return <Car className="w-5 h-5" />;
      case 'restaurant':
        return <Utensils className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const renderDetails = () => {
    switch (booking.type) {
      case 'flight':
        return (
          <>
            <div className="flex items-center gap-2">
              <span className="font-medium">{booking.from}</span>
              <span>→</span>
              <span className="font-medium">{booking.to}</span>
            </div>
            <div className="text-sm text-gray-500">
              {booking.airline} • {booking.flightNumber}
            </div>
          </>
        );
      case 'hotel':
        return (
          <div className="text-sm text-gray-500">
            {booking.hotelName}
          </div>
        );
      // ... liknande för andra typer
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {getIcon()}
          <div>
            <h3 className="font-medium">{booking.title}</h3>
            {renderDetails()}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(booking)}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(booking.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(booking.startDate), 'MMM d, yyyy')}</span>
        </div>
        {booking.address && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{booking.address}</span>
          </div>
        )}
      </div>
    </div>
  );
} 