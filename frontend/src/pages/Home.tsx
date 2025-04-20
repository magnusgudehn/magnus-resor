import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { tripService } from '@/services/tripService';
import { Trip } from '@/types/Trip';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

export default function Home() {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    const loadTrips = () => {
      const loadedTrips = tripService.getTrips();
      setTrips(loadedTrips);
    };

    loadTrips();
  }, []);

  const handleDeleteTrip = (tripId: string) => {
    try {
      const allTrips = tripService.getTrips();
      const updatedTrips = allTrips.filter(trip => trip.id !== tripId);
      localStorage.setItem('trips', JSON.stringify(updatedTrips));
      setTrips(updatedTrips);
      toast.success('Resan togs bort');
    } catch (error) {
      console.error('Kunde inte ta bort resan:', error);
      toast.error('Kunde inte ta bort resan');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mina Resor</h1>
        <Link to="/new-trip">
          <Button>Ny Resa</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <div 
            key={trip.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative"
          >
            <button
              onClick={() => handleDeleteTrip(trip.id)}
              className="absolute top-2 right-2 z-10"
            >
              <Trash2 size={24} className="text-red-500" />
            </button>
            <Link to={`/trips/${trip.id}`} className="block">
              {trip.imageUrl && (
                <div className="aspect-video relative">
                  <img
                    src={trip.imageUrl}
                    alt={trip.destination}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{trip.destination}</h2>
                <p className="text-gray-600">
                  {new Date(trip.startDate).toLocaleDateString('sv-SE')} - 
                  {new Date(trip.endDate).toLocaleDateString('sv-SE')}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {trips.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Inga resor hittades</p>
          <Link to="/new-trip">
            <Button>Skapa din första resa</Button>
          </Link>
        </div>
      )}
    </div>
  );
} 