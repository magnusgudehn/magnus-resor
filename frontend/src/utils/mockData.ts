import { Trip } from '../types';

const mockTrips: Trip[] = [
  {
    id: 'trip-1',
    title: 'Summer in Paris',
    destination: 'Paris, France',
    startDate: '2024-06-15',
    endDate: '2024-06-25',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    bookings: []
  },
  {
    id: 'trip-2',
    title: 'Tokyo Adventure',
    destination: 'Tokyo, Japan',
    startDate: '2024-07-10',
    endDate: '2024-07-20',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
    bookings: []
  },
  {
    id: 'trip-3',
    title: 'New York City Break',
    destination: 'New York, USA',
    startDate: '2024-08-05',
    endDate: '2024-08-12',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
    bookings: []
  }
];

export function getTrips(): Trip[] {
  return mockTrips;
}

export function getTrip(id: string): Trip | undefined {
  return mockTrips.find(trip => trip.id === id);
}

export function addTrip(trip: Omit<Trip, 'id'>): Trip {
  const newTrip = {
    ...trip,
    id: `trip-${Date.now()}`,
    bookings: []
  };
  mockTrips.push(newTrip);
  return newTrip;
} 