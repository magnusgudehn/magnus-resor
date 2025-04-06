import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BookingItem from '../components/BookingItem';
import AddBookingForm from '../components/AddBookingForm';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { Trip, Booking } from '../types';
import { tripService } from '../services/tripService';
import { format } from 'date-fns';
import { ChevronLeft, Calendar, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface TimelineItem {
  id: string;
  date: Date;
  booking: Booking;
  isReturn?: boolean;
}

const TripDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  
  useEffect(() => {
    const loadTrip = async () => {
      if (id) {
        const tripData = await tripService.getTrip(id);
        if (tripData) {
          setTrip(tripData);
          setBookings(tripData.bookings || []);
        }
      }
    };
    loadTrip();
  }, [id]);

  // Create timeline items from bookings
  useEffect(() => {
    if (bookings.length) {
      const items: TimelineItem[] = [];
      
      bookings.forEach(booking => {
        // Add start date item
        items.push({
          id: `${booking.id}-start`,
          date: new Date(booking.startDate),
          booking,
          isReturn: false
        });
        
        // If booking has different end date, add it as a separate item
        if (booking.endDate && booking.startDate !== booking.endDate) {
          items.push({
            id: `${booking.id}-end`,
            date: new Date(booking.endDate),
            booking,
            isReturn: true
          });
        }
      });
      
      // Sort by date
      items.sort((a, b) => a.date.getTime() - b.date.getTime());
      setTimelineItems(items);
    } else {
      setTimelineItems([]);
    }
  }, [bookings]);
  
  const handleAddBooking = async (newBooking: Booking) => {
    if (!trip) return;
    
    const updatedBookings = [...bookings, newBooking];
    const updatedTrip = { ...trip, bookings: updatedBookings };
    
    try {
      await tripService.saveTrip(updatedTrip);
      setBookings(updatedBookings);
      toast.success("Bokning tillagd");
    } catch (error) {
      toast.error("Kunde inte lägga till bokning");
    }
  };
  
  const handleUpdateBooking = async (updatedBooking: Booking) => {
    if (!trip) return;
    
    const updatedBookings = bookings.map((booking) => 
      booking.id === updatedBooking.id ? updatedBooking : booking
    );
    const updatedTrip = { ...trip, bookings: updatedBookings };
    
    try {
      await tripService.saveTrip(updatedTrip);
      setBookings(updatedBookings);
      toast.success("Bokning uppdaterad");
    } catch (error) {
      toast.error("Kunde inte uppdatera bokning");
    }
  };
  
  if (!trip) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <p>Resan hittades inte</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border shadow-sm p-6 mb-8">
          {trip.image && (
            <div className="mb-6 -mt-6 -mx-6 rounded-t-lg overflow-hidden">
              <img 
                src={trip.image} 
                alt={trip.destination} 
                className="w-full h-64 object-cover"
              />
            </div>
          )}
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{trip.title}</h1>
              <div className="flex items-center gap-1 text-gray-500 mt-2">
                <MapPin className="h-4 w-4" />
                <span>{trip.destination}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-md">
              <Calendar className="h-4 w-4 text-travel-primary" />
              <span>
                {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
              </span>
            </div>
          </div>
          
          <Separator className="mb-6" />
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Bokningar</h2>
            <AddBookingForm onAddBooking={handleAddBooking} />
          </div>
          
          <div className="relative">
            {timelineItems.length > 0 ? (
              <div className="space-y-4 pl-4 relative">
                {/* Timeline line */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200" style={{ left: '0.25rem' }} />
                
                {timelineItems.map((item) => (
                  <BookingItem 
                    key={item.id} 
                    booking={item.booking} 
                    onBookingUpdate={handleUpdateBooking}
                    isTimelineItem={true}
                    isReturn={item.isReturn}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed rounded-lg">
                <h3 className="text-lg font-medium mb-2">Inga bokningar än</h3>
                <p className="text-gray-500 mb-4">Börja med att lägga till dina bokningar</p>
                <AddBookingForm onAddBooking={handleAddBooking} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TripDetails;
