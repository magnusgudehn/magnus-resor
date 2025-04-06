import { useState, useEffect } from 'react';
import { Trip } from '../types';
import { tripService } from '../services/tripService';

export function useTrip(tripId: string) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTrip() {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Loading trip with ID:', tripId);
        const loadedTrip = await tripService.getTrip(tripId);
        console.log('Loaded trip:', loadedTrip);
        
        if (!loadedTrip) {
          console.error('Trip not found for ID:', tripId);
          setError('Trip not found');
          return;
        }
        
        setTrip(loadedTrip);
      } catch (err) {
        console.error('Error loading trip:', err);
        setError('Failed to load trip');
      } finally {
        setIsLoading(false);
      }
    }

    if (tripId) {
      loadTrip();
    }
  }, [tripId]);

  const updateTrip = async (updatedTrip: Trip) => {
    try {
      const saved = await tripService.saveTrip(updatedTrip);
      setTrip(saved);
      return saved;
    } catch (err) {
      console.error('Error updating trip:', err);
      setError('Failed to update trip');
      throw err;
    }
  };

  return { trip, isLoading, error, updateTrip };
} 