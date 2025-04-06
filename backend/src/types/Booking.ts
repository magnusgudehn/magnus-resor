export interface Booking {
  id: string;
  tripId: string;
  customerName: string;
  customerEmail: string;
  numberOfPeople: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
} 