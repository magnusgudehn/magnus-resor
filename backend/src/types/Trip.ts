export interface Booking {
  id: string;
  type: 'flight' | 'hotel' | 'car' | 'activity' | 'other';
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