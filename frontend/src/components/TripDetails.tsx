import { Card } from './ui/card';
import { Booking } from '@/types';
import { formatDate } from '@/lib/utils';
import { CalendarIcon, MapPinIcon, PlaneIcon, HotelIcon, CarIcon, Trash2 } from 'lucide-react';

interface TripDetailsProps {
  bookings: Booking[];
  onEdit: (booking: Booking) => void;
  onDelete: (id: string) => void;
}

export function TripDetails({ bookings, onEdit, onDelete }: TripDetailsProps) {
  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card 
          key={booking.id} 
          className="p-4"
        >
          <div className="flex justify-between items-start">
            <div 
              className="flex-1"
              onClick={() => onEdit(booking)}
              style={{ cursor: 'pointer' }}
            >
              <h3 className="font-semibold">{booking.title}</h3>
              <div className="text-sm text-slate-500 mt-1">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{formatDate(booking.startDate)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onDelete(booking.id)}
              className="p-1 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
} 