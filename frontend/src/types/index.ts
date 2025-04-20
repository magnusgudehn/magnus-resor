export type BookingType = 'flight' | 'hotel' | 'car' | 'activity' | 'other';

export interface Booking {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  from: string;
  to: string;
  reference: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  image?: string;
  bookings: Booking[];
}
