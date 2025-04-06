import { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useTrip } from '../hooks/useTrip';
import { useBookings } from '../hooks/useBookings';
import { BookingForm } from '../components/bookings/BookingForm';
import { SimpleDialog } from '../components/ui/dialog';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import type { Booking } from '../types';
import { BookingIcon } from '../components/bookings/BookingIcon';
import { Button } from '../components/ui/button';
import { PlusCircle } from 'lucide-react';
import AddBookingForm from '../components/AddBookingForm';

export default function TripDetails() {
  const { tripId } = useParams<{ tripId: string }>();
  const location = useLocation();
  const { trip, isLoading: tripLoading } = useTrip(tripId!);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const {
    bookings,
    isLoading: bookingsLoading,
    addBooking,
    updateBooking,
    deleteBooking
  } = useBookings(tripId!);

  // Skapa expanderad lista med bokningar för både start- och slutdatum
  const expandedBookings = bookings.flatMap(booking => {
    const items = [
      { 
        ...booking, 
        displayDate: booking.startDate, 
        displayTime: booking.startTime,
        isEndDate: false 
      }
    ];
    if (booking.endDate) {
      items.push({
        ...booking,
        displayDate: booking.endDate,
        displayTime: booking.endTime,
        isEndDate: true
      });
    }
    return items;
  }).sort((a, b) => {
    const dateA = new Date(`${a.displayDate}T${a.displayTime || '00:00'}`);
    const dateB = new Date(`${b.displayDate}T${b.displayTime || '00:00'}`);
    return dateA.getTime() - dateB.getTime();
  });

  const handleBookingSubmit = async (bookingData: any) => {
    try {
      if (editingBooking) {
        await updateBooking({ ...bookingData, id: editingBooking.id });
        setEditingBooking(null);
      } else {
        await addBooking(bookingData);
      }
      // Eventuellt uppdatera UI eller ladda om data
    } catch (error) {
      console.error('Failed to save booking:', error);
      alert('Failed to save booking. Please try again.');
    }
  };

  if (tripLoading || bookingsLoading) {
    return <LoadingSpinner />;
  }

  if (!trip) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Trip not found</h2>
          <Link to="/" className="text-blue-500 hover:text-blue-600">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/" className="text-blue-500 hover:text-blue-600 mb-4 block">
          ← Back to trips
        </Link>
        {location.state?.imageUrl && (
          <img
            src={location.state.imageUrl}
            alt={trip.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{trip.title}</h1>
          <AddBookingForm 
            onSubmit={handleBookingSubmit}
            mode="create"
          />
        </div>
      </div>

      <div className="space-y-4">
        {expandedBookings.map((booking, index) => (
          <div
            key={`${booking.id}-${booking.isEndDate ? 'end' : 'start'}`}
            onClick={() => {
              setEditingBooking(booking);
              setShowBookingForm(true);
            }}
            className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <BookingIcon 
                    type={booking.type} 
                    className="w-8 h-8 text-gray-600" 
                  />
                  <h3 className="font-medium">
                    {booking.title}
                    {booking.isEndDate ? ' (End)' : ' (Start)'}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  {new Date(booking.displayDate).toLocaleDateString()}
                  {booking.displayTime && ` ${booking.displayTime}`}
                </p>
                {booking.type === 'flight' && (
                  <p className="text-sm text-gray-500 mt-1">
                    {booking.from} → {booking.to}
                  </p>
                )}
                {booking.notes && (
                  <p className="text-sm text-gray-500 mt-2">{booking.notes}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showBookingForm && editingBooking && (
        <AddBookingForm 
          onSubmit={handleBookingSubmit}
          existingBooking={editingBooking}
          mode="edit"
        />
      )}
    </div>
  );
} 