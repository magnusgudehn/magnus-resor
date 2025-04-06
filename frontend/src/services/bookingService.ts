import { Booking } from '../types';

export const bookingService = {
  getBookings(tripId: string): Promise<Booking[]> {
    const bookings = localStorage.getItem(`travel_bookings_${tripId}`);
    return Promise.resolve(bookings ? JSON.parse(bookings) : []);
  },

  async addBooking(tripId: string, booking: Omit<Booking, 'id'>): Promise<Booking> {
    const bookings = await this.getBookings(tripId);
    const newBooking = {
      ...booking,
      id: `booking-${Date.now()}`
    };
    
    const updatedBookings = [...bookings, newBooking];
    localStorage.setItem(`travel_bookings_${tripId}`, JSON.stringify(updatedBookings));
    
    return newBooking;
  },

  async updateBooking(tripId: string, booking: Booking): Promise<Booking> {
    const bookings = await this.getBookings(tripId);
    const updatedBookings = bookings.map(b => 
      b.id === booking.id ? booking : b
    );
    localStorage.setItem(`travel_bookings_${tripId}`, JSON.stringify(updatedBookings));
    return booking;
  },

  async deleteBooking(tripId: string, bookingId: string): Promise<void> {
    const bookings = await this.getBookings(tripId);
    const updatedBookings = bookings.filter(b => b.id !== bookingId);
    localStorage.setItem(`travel_bookings_${tripId}`, JSON.stringify(updatedBookings));
  }
}; 