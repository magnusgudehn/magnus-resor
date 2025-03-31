
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import TripCard from '@/components/TripCard';
import { Button } from '@/components/ui/button';
import { getTrips } from '@/utils/mockData';
import { Trip } from '@/types';
import { Calendar, MapPin } from 'lucide-react';
import CreateTripForm from '@/components/CreateTripForm';

const Index = () => {
  const [trips, setTrips] = useState<Trip[]>(getTrips());
  
  const handleTripCreated = (newTrip: Trip) => {
    setTrips(prevTrips => [...prevTrips, newTrip]);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
          
          <CreateTripForm onTripCreated={handleTripCreated} />
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-travel-primary" />
            Upcoming Trips
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>
        
        {trips.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <MapPin className="h-8 w-8 text-travel-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">No trips yet</h3>
            <p className="text-gray-500 mb-6">Start by creating your first trip</p>
            <CreateTripForm onTripCreated={handleTripCreated} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
