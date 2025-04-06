import { Trip } from '../types';

const API_URL = 'http://localhost:3001/api';

export const tripService = {
  getTrip: async (tripId: string): Promise<Trip | null> => {
    try {
      const response = await fetch(`${API_URL}/trips/${tripId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch trip');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting trip:', error);
      return null;
    }
  },

  saveTrip: async (trip: Trip): Promise<Trip> => {
    try {
      const response = await fetch(`${API_URL}/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trip)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save trip');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error saving trip:', error);
      throw error;
    }
  },

  getTrips: async (): Promise<Trip[]> => {
    try {
      const response = await fetch(`${API_URL}/trips`);
      if (!response.ok) {
        throw new Error('Failed to fetch trips');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting trips:', error);
      return [];
    }
  },

  deleteTrip: async (tripId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/trips/${tripId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete trip');
      }
    } catch (error) {
      console.error('Error deleting trip:', error);
      throw error;
    }
  },

  updateTripDates: async (tripId: string, startDate: string, endDate: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/trips/${tripId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startDate, endDate })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update trip dates');
      }
    } catch (error) {
      console.error('Error updating trip dates:', error);
      throw error;
    }
  }
}; 