import { Booking } from '../../types';
import { BookingCard } from './BookingCard';

interface BookingListProps {
  bookings: Booking[];
  onEditBooking: (booking: Booking) => void;
  onDeleteBooking: (bookingId: string) => void;
}

export function BookingList({ 
  bookings, 
  onEditBooking, 
  onDeleteBooking 
}: BookingListProps) {
  const sortedBookings = [...bookings].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedBookings.map(booking => (
        <BookingCard
          key={booking.id}
          booking={booking}
          onEdit={onEditBooking}
          onDelete={onDeleteBooking}
        />
      ))}
      {bookings.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No bookings yet
        </div>
      )}
    </div>
  );
} 