import { useState, useEffect } from 'react';
import { Booking } from '../types';
import { bookingService } from '../services/bookingService';
import { tripService } from '../services/tripService';

export function useBookings(tripId: string) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, [tripId]);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const loadedBookings = await bookingService.getBookings(tripId);
      setBookings(loadedBookings);
      await tripService.updateTripDates(tripId, loadedBookings);
    } catch (err) {
      console.error('Failed to load bookings:', err);
      setError('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const addBooking = async (bookingData: Omit<Booking, 'id'>) => {
    try {
      const newBooking = await bookingService.addBooking(tripId, bookingData);
      const updatedBookings = [...bookings, newBooking];
      setBookings(updatedBookings);
      await tripService.updateTripDates(tripId, updatedBookings);
      return newBooking;
    } catch (err) {
      console.error('Failed to add booking:', err);
      throw new Error('Failed to add booking');
    }
  };

  const updateBooking = async (booking: Booking) => {
    try {
      const updatedBooking = await bookingService.updateBooking(tripId, booking);
      const updatedBookings = bookings.map(b => 
        b.id === booking.id ? updatedBooking : b
      );
      setBookings(updatedBookings);
      await tripService.updateTripDates(tripId, updatedBookings);
      return updatedBooking;
    } catch (err) {
      console.error('Failed to update booking:', err);
      throw new Error('Failed to update booking');
    }
  };

  const deleteBooking = async (bookingId: string) => {
    try {
      await bookingService.deleteBooking(tripId, bookingId);
      const updatedBookings = bookings.filter(b => b.id !== bookingId);
      setBookings(updatedBookings);
      await tripService.updateTripDates(tripId, updatedBookings);
    } catch (err) {
      console.error('Failed to delete booking:', err);
      throw new Error('Failed to delete booking');
    }
  };

  return {
    bookings,
    isLoading,
    error,
    addBooking,
    updateBooking,
    deleteBooking,
    reloadBookings: loadBookings
  };
} 