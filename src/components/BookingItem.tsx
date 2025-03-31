
import React from 'react';
import { Booking } from '@/types';
import { format, parseISO } from 'date-fns';
import { Plane, Hotel, Car, Calendar, MapPin, FileText, Edit, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import EditBookingForm from './EditBookingForm';

interface BookingItemProps {
  booking: Booking;
  onBookingUpdate: (updatedBooking: Booking) => void;
  isTimelineItem?: boolean;
  isReturn?: boolean;
}

const BookingItem: React.FC<BookingItemProps> = ({ 
  booking, 
  onBookingUpdate, 
  isTimelineItem = false,
  isReturn = false 
}) => {
  const getIcon = () => {
    switch (booking.type) {
      case 'flight':
        return <Plane className={`h-6 w-6 ${isReturn ? "rotate-180" : ""} text-travel-primary`} />;
      case 'hotel':
        return <Hotel className="h-6 w-6 text-travel-secondary" />;
      case 'car':
        return <Car className="h-6 w-6 text-travel-accent" />;
      case 'activity':
        return <Calendar className="h-6 w-6 text-travel-accent" />;
      case 'other':
        return <FileText className="h-6 w-6 text-gray-500" />;
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

  // For timeline view, we show a simplified version
  if (isTimelineItem) {
    return (
      <div className="booking-item animate-slide-up border rounded-lg p-4 hover:bg-gray-50 transition-colors relative">
        {/* Timeline dot */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 timeline-dot" />
        
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              {getIcon()}
            </div>
            
            <div className="flex-1">
              <h4 className="font-medium text-lg">
                {isReturn ? `${booking.title} (Return)` : booking.title}
              </h4>
              
              <div className="text-sm text-muted-foreground mt-1">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{isReturn ? formatDate(booking.endDate || '') : formatDate(booking.startDate)}</span>
                </div>
                
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
          
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit booking</span>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Edit Booking</DialogTitle>
              </DialogHeader>
              <EditBookingForm 
                booking={booking} 
                onSave={onBookingUpdate}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  // Regular view (non-timeline)
  return (
    <div className="booking-item animate-slide-up border rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
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
                  <ArrowRight className="h-4 w-4" />
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
        
        <Dialog>
          <DialogTrigger asChild>
            <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit booking</span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit Booking</DialogTitle>
            </DialogHeader>
            <EditBookingForm 
              booking={booking} 
              onSave={onBookingUpdate}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BookingItem;
