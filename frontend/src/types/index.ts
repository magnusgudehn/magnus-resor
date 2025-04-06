
export type BookingType = 'flight' | 'hotel' | 'car' | 'activity' | 'other';

export interface Booking {
  id: string;
  type: BookingType;
  title: string;
  startDate: string;
  endDate?: string;
  location?: string;
  description?: string;
  confirmationNumber?: string;
  image?: string;
}

export interface Trip {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  destination: string;
  image?: string;
  bookings: Booking[];
}
