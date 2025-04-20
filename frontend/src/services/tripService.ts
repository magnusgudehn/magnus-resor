import { Trip } from '@/types/Trip';

const STORAGE_KEY = 'trips';

export const tripService = {
  async saveTrip(trip: Trip): Promise<void> {
    try {
      // Hämta befintliga resor från localStorage
      const existingTrips = this.getTrips();
      
      // Kontrollera om resan redan finns
      const existingTripIndex = existingTrips.findIndex(t => t.id === trip.id);
      
      if (existingTripIndex >= 0) {
        // Uppdatera befintlig resa
        existingTrips[existingTripIndex] = trip;
      } else {
        // Lägg till ny resa
        existingTrips.push(trip);
      }
      
      // Spara till localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingTrips));
    } catch (error) {
      console.error('Kunde inte spara resan:', error);
      throw new Error('Kunde inte spara resan');
    }
  },

  getTrips(): Trip[] {
    try {
      const tripsJson = localStorage.getItem(STORAGE_KEY);
      return tripsJson ? JSON.parse(tripsJson) : [];
    } catch (error) {
      console.error('Kunde inte hämta resor:', error);
      return [];
    }
  },

  async getTripById(id: string): Promise<Trip | null> {
    try {
      const trips = this.getTrips();
      return trips.find(trip => trip.id === id) || null;
    } catch (error) {
      console.error('Kunde inte hämta resa:', error);
      return null;
    }
  },

  async updateTrip(tripId: string, updates: Partial<Trip>): Promise<void> {
    try {
      const trips = this.getTrips();
      const tripIndex = trips.findIndex(trip => trip.id === tripId);
      
      if (tripIndex === -1) {
        throw new Error('Resan hittades inte');
      }
      
      // Uppdatera resan med nya värden
      trips[tripIndex] = {
        ...trips[tripIndex],
        ...updates
      };
      
      // Spara uppdaterade resor
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    } catch (error) {
      console.error('Kunde inte uppdatera resan:', error);
      throw error;
    }
  },

  async deleteTrip(tripId: string): Promise<void> {
    try {
      const trips = this.getTrips();
      const updatedTrips = trips.filter(trip => trip.id !== tripId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrips));
    } catch (error) {
      console.error('Kunde inte ta bort resan:', error);
      throw error;
    }
  },

  async updateTripDates(tripId: string, startDate: string, endDate: string): Promise<Trip> {
    const response = await fetch(`${API_URL}/trips/${tripId}/dates`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ startDate, endDate }),
    });
    if (!response.ok) {
      throw new Error('Kunde inte uppdatera resans datum');
    }
    return response.json();
  },
}; 