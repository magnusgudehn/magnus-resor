export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  image?: string;
  bookings: Booking[];
}

export interface Booking {
  id: string;
  type: 'flight' | 'car' | 'activity' | 'hotel';
  title?: string;
  from?: string;
  to?: string;
  airline?: string;
  flightNumber?: string;
  confirmation?: string;
  terminal?: string;
  startDate?: string;
  endDate?: string;
  arrivalTime?: string;
  seats?: string;
  location?: string;
  pickupTime?: string;
  dropoffTime?: string;
  notes?: string;
} 