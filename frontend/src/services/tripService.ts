import { Trip } from '../types';

const STORAGE_KEY = 'travel_trips';

export const tripService = {
  getTrip: async (tripId: string): Promise<Trip | null> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        console.log('No trips found in storage');
        return null;
      }

      const trips: Trip[] = JSON.parse(stored);
      console.log('All trips:', trips);
      
      const trip = trips.find(t => t.id === tripId);
      console.log('Found trip:', trip);
      
      return trip || null;
    } catch (error) {
      console.error('Error getting trip:', error);
      return null;
    }
  },

  saveTrip: async (trip: Trip): Promise<Trip> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const trips: Trip[] = stored ? JSON.parse(stored) : [];
      
      const existingTripIndex = trips.findIndex(t => t.id === trip.id);
      if (existingTripIndex >= 0) {
        trips[existingTripIndex] = trip;
      } else {
        trips.push(trip);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
      return trip;
    } catch (error) {
      console.error('Error saving trip:', error);
      throw error;
    }
  },

  getTrips(): Promise<Trip[]> {
    const trips = localStorage.getItem('travel_trips');
    return Promise.resolve(trips ? JSON.parse(trips) : []);
  },

  async deleteTrip(tripId: string): Promise<void> {
    const trips = await this.getTrips();
    const updatedTrips = trips.filter(trip => trip.id !== tripId);
    localStorage.setItem('travel_trips', JSON.stringify(updatedTrips));
    // Ta även bort alla bokningar för denna resa
    localStorage.removeItem(`travel_bookings_${tripId}`);
  },

  async updateTripDates(tripId: string, bookings: Booking[]): Promise<void> {
    const trips = await this.getTrips();
    const tripIndex = trips.findIndex(t => t.id === tripId);
    
    if (tripIndex === -1) return;

    if (bookings.length > 0) {
      const dates = bookings.flatMap(booking => [
        booking.startDate,
        booking.endDate
      ]).filter(Boolean);

      if (dates.length > 0) {
        trips[tripIndex].startDate = new Date(Math.min(...dates.map(d => new Date(d).getTime()))).toISOString().split('T')[0];
        trips[tripIndex].endDate = new Date(Math.max(...dates.map(d => new Date(d).getTime()))).toISOString().split('T')[0];
      }
    }

    localStorage.setItem('travel_trips', JSON.stringify(trips));
  }
}; 