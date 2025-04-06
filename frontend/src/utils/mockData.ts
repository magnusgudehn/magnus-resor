
import { Trip, Booking } from "../types";

export const mockTrips: Trip[] = [
  {
    id: "trip-1",
    title: "Summer in Paris",
    startDate: "2023-07-15",
    endDate: "2023-07-22",
    destination: "Paris, France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop",
    bookings: [
      {
        id: "booking-1",
        type: "flight",
        title: "Stockholm to Paris",
        startDate: "2023-07-15T08:45:00",
        endDate: "2023-07-15T11:20:00",
        location: "ARN to CDG",
        description: "Air France AF1263",
        confirmationNumber: "AF123456",
      },
      {
        id: "booking-2",
        type: "hotel",
        title: "Hotel de la Seine",
        startDate: "2023-07-15",
        endDate: "2023-07-22",
        location: "54 Rue Bonaparte, 75006 Paris",
        description: "Standard Double Room",
        confirmationNumber: "HB789012",
      },
      {
        id: "booking-3",
        type: "activity",
        title: "Eiffel Tower Tour",
        startDate: "2023-07-16T10:00:00",
        location: "Champ de Mars, 5 Avenue Anatole France",
        description: "Guided tour with skip-the-line tickets",
        confirmationNumber: "ET345678",
      },
    ],
  },
  {
    id: "trip-2",
    title: "Business in London",
    startDate: "2023-09-10",
    endDate: "2023-09-14",
    destination: "London, UK",
    image: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=2070&auto=format&fit=crop",
    bookings: [
      {
        id: "booking-4",
        type: "flight",
        title: "Stockholm to London",
        startDate: "2023-09-10T06:30:00",
        endDate: "2023-09-10T08:10:00",
        location: "ARN to LHR",
        description: "British Airways BA777",
        confirmationNumber: "BA987654",
      },
      {
        id: "booking-5",
        type: "hotel",
        title: "The Savoy",
        startDate: "2023-09-10",
        endDate: "2023-09-14",
        location: "Strand, London WC2R 0EZ",
        description: "Deluxe King Room",
        confirmationNumber: "TS456789",
      },
      {
        id: "booking-6",
        type: "car",
        title: "Car Rental - Compact",
        startDate: "2023-09-10T09:00:00",
        endDate: "2023-09-14T17:00:00",
        location: "Heathrow Airport",
        description: "Avis - Ford Focus or similar",
        confirmationNumber: "AV567890",
      },
    ],
  },
  {
    id: "trip-3",
    title: "Winter in the Alps",
    startDate: "2023-12-22",
    endDate: "2023-12-28",
    destination: "Chamonix, France",
    image: "https://images.unsplash.com/photo-1544037803-d54973bb3f8d?q=80&w=2070&auto=format&fit=crop",
    bookings: [
      {
        id: "booking-7",
        type: "flight",
        title: "Stockholm to Geneva",
        startDate: "2023-12-22T12:15:00",
        endDate: "2023-12-22T14:50:00",
        location: "ARN to GVA",
        description: "Swiss LX1233",
        confirmationNumber: "LX234567",
      },
      {
        id: "booking-8",
        type: "car",
        title: "SUV Rental",
        startDate: "2023-12-22T15:30:00",
        endDate: "2023-12-28T10:00:00",
        location: "Geneva Airport",
        description: "Hertz - Volvo XC60 or similar",
        confirmationNumber: "HZ678901",
      },
      {
        id: "booking-9",
        type: "hotel",
        title: "Chalet Les Cimes",
        startDate: "2023-12-22",
        endDate: "2023-12-28",
        location: "123 Route des Pèlerins, 74400 Chamonix",
        description: "2 Bedroom Chalet",
        confirmationNumber: "CLC890123",
      },
      {
        id: "booking-10",
        type: "activity",
        title: "Ski Passes - 5 days",
        startDate: "2023-12-23",
        endDate: "2023-12-27",
        location: "Chamonix Mont Blanc",
        description: "All area pass - 2 adults",
        confirmationNumber: "SP901234",
      },
    ],
  },
];

export function getTrips(): Trip[] {
  return mockTrips;
}

export function getTrip(id: string): Trip | undefined {
  return mockTrips.find(trip => trip.id === id);
}
