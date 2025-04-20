import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BookingItem from '../components/BookingItem';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { Trip, Booking } from '../types';
import { tripService } from '../services/tripService';
import { format } from 'date-fns';
import { ChevronLeft, Calendar, MapPin, X } from 'lucide-react';
import { toast } from 'sonner';
import PdfTicketUploader from '../components/PdfTicketUploader';
import BookingForm from '../components/BookingForm';
import { imageService } from '../services/imageService';

interface TimelineItem {
  id: string;
  date: Date;
  booking: Booking;
  isReturn?: boolean;
}

const TripDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [showPdfUploader, setShowPdfUploader] = useState(false);
  const [newBooking, setNewBooking] = useState<Booking | null>(null);
  const [tripImage, setTripImage] = useState<string>('');
  
  useEffect(() => {
    const loadTrip = async () => {
      if (id) {
        const tripData = await tripService.getTripById(id);
        if (tripData) {
          setTrip(tripData);
          setBookings(tripData.bookings || []);
          
          // Hämta bild från Unsplash baserat på destinationen
          try {
            const imageUrl = await imageService.getDestinationImage(tripData.destination);
            setTripImage(imageUrl);
          } catch (error) {
            console.error('Kunde inte hämta bild:', error);
          }
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
        items.push({
          id: `${booking.id}-start`,
          date: new Date(booking.startDate),
          booking,
          isReturn: false
        });
        
        if (booking.endDate && booking.startDate !== booking.endDate) {
          items.push({
            id: `${booking.id}-end`,
            date: new Date(booking.endDate),
            booking,
            isReturn: true
          });
        }
      });
      
      items.sort((a, b) => a.date.getTime() - b.date.getTime());
      setTimelineItems(items);
    } else {
      setTimelineItems([]);
    }
  }, [bookings]);
  
  const handlePdfDataExtracted = (data: any) => {
    try {
      const booking: Booking = {
        id: crypto.randomUUID(),
        type: data.type || 'flight',
        startDate: data.startDate || new Date().toISOString(),
        endDate: data.endDate || new Date().toISOString(),
        from: data.from || '',
        to: data.to || '',
        reference: data.reference || '',
        notes: data.notes || '',
        status: 'confirmed'
      };
      setNewBooking(booking);
      setShowPdfUploader(false);
    } catch (error) {
      console.error('Kunde inte extrahera data från PDF:', error);
      toast.error('Kunde inte läsa PDF-filen. Vänligen fyll i bokningen manuellt.');
      setNewBooking({
        id: crypto.randomUUID(),
        type: 'flight',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        from: '',
        to: '',
        reference: '',
        notes: '',
        status: 'pending'
      });
      setShowPdfUploader(false);
    }
  };

  const handleSaveBooking = async (booking: Booking) => {
    if (!trip) return;
    
    try {
      // Uppdatera resan med den nya bokningen
      const updatedBookings = [...bookings, booking];
      await tripService.updateTrip(trip.id, { bookings: updatedBookings });
      
      setBookings(updatedBookings);
      setNewBooking(null);
      toast.success("Bokning tillagd");
    } catch (error) {
      console.error('Kunde inte lägga till bokning:', error);
      toast.error("Kunde inte lägga till bokning");
    }
  };
  
  const handleUpdateBooking = async (updatedBooking: Booking) => {
    if (!trip) return;
    
    try {
      // Uppdatera resan med den uppdaterade bokningen
      const updatedBookings = bookings.map((booking) => 
        booking.id === updatedBooking.id ? updatedBooking : booking
      );
      await tripService.updateTrip(trip.id, { bookings: updatedBookings });
      
      setBookings(updatedBookings);
      toast.success("Bokning uppdaterad");
    } catch (error) {
      console.error('Kunde inte uppdatera bokning:', error);
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
        <div className="bg-white rounded-lg border shadow-sm p-6 mb-8 relative">
          <button
            onClick={() => navigate('/')}
            className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Stäng"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>

          {tripImage && (
            <div className="mb-6 -mt-6 -mx-6 rounded-t-lg overflow-hidden">
              <img 
                src={tripImage} 
                alt={trip?.destination} 
                className="w-full h-64 object-cover"
              />
            </div>
          )}
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{trip?.title}</h1>
              <div className="flex items-center gap-1 text-gray-500 mt-2">
                <MapPin className="h-4 w-4" />
                <span>{trip?.destination}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-md">
              <Calendar className="h-4 w-4 text-travel-primary" />
              <span>
                {trip?.startDate && format(new Date(trip.startDate), 'MMM d')} - 
                {trip?.endDate && format(new Date(trip.endDate), 'MMM d, yyyy')}
              </span>
            </div>
          </div>
          
          <Separator className="mb-6" />
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Bokningar</h2>
            {!showPdfUploader && !newBooking && (
              <Button onClick={() => setShowPdfUploader(true)}>
                Lägg till bokning
              </Button>
            )}
          </div>
          
          {showPdfUploader && (
            <div className="mb-6">
              <PdfTicketUploader onDataExtracted={handlePdfDataExtracted} />
            </div>
          )}
          
          {newBooking && (
            <div className="mb-6">
              <BookingForm 
                booking={newBooking}
                onSave={handleSaveBooking}
                onCancel={() => setNewBooking(null)}
              />
            </div>
          )}
          
          <div className="relative">
            {timelineItems.length > 0 ? (
              <div className="space-y-4 pl-4 relative">
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
                <Button onClick={() => setShowPdfUploader(true)}>
                  Lägg till bokning
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TripDetails;
