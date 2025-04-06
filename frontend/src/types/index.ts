export type BookingType = 'flight' | 'hotel' | 'car' | 'activity' | 'other' | 'restaurant';

export interface BaseBooking {
  id: string;
  type: BookingType;
  title: string;
  startDate: string;
  endDate?: string;
  address?: string;
  notes?: string;
  confirmation?: string;
}

export interface FlightBooking extends BaseBooking {
  type: 'flight';
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  terminal?: string;
}

export interface HotelBooking extends BaseBooking {
  type: 'hotel';
  hotelName: string;
  roomType?: string;
}

export interface CarBooking extends BaseBooking {
  type: 'car';
  carCompany: string;
  pickupLocation: string;
  dropoffLocation: string;
  carType?: string;
}

export interface RestaurantBooking extends BaseBooking {
  type: 'restaurant';
  restaurantName: string;
  reservationTime: string;
  numberOfGuests: number;
}

export interface OtherBooking extends BaseBooking {
  type: 'other';
  description?: string;
  location?: string;
}

export interface ActivityBooking extends BaseBooking {
  type: 'activity';
  activityName: string;
  activityType: string;
}

export type Booking = FlightBooking | HotelBooking | CarBooking | RestaurantBooking | OtherBooking | ActivityBooking;

export interface Trip {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  bookings: Booking[];
}
