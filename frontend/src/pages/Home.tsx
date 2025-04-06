import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { tripService } from '../services/tripService';
import { imageService } from '../services/imageService';
import { Trip } from '../types';
import { Button } from '../components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';

function isOldTrip(trip: Trip): boolean {
  const today = new Date().setHours(0, 0, 0, 0);
  return new Date(trip.endDate).getTime() < today;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripImages, setTripImages] = useState<Record<string, string>>({});

  // Separera resor i kommande och tidigare
  const upcomingTrips = trips.filter(trip => !isOldTrip(trip));
  const pastTrips = trips.filter(trip => isOldTrip(trip));

  useEffect(() => {
    loadTrips();
  }, []);

  async function loadTrips() {
    const loadedTrips = await tripService.getTrips();
    setTrips(loadedTrips);
    
    const images: Record<string, string> = {};
    for (const trip of loadedTrips) {
      const imageUrl = await imageService.getDestinationImage(trip.title);
      images[trip.id] = imageUrl;
    }
    setTripImages(images);
  }

  async function handleDeleteTrip(tripId: string) {
    if (confirm('Are you sure you want to delete this trip?')) {
      await tripService.deleteTrip(tripId);
      await loadTrips();
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resor</h1>
        <Button onClick={() => navigate('/trips/new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ny resa
        </Button>
      </div>

      {/* Kommande resor */}
      <h2 className="text-2xl font-bold mb-4">Kommande resor</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {upcomingTrips.map((trip) => (
          <div key={trip.id} className="relative">
            <Link to={`/trips/${trip.id}`} className="block">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img 
                  src={tripImages[trip.id]} 
                  alt={trip.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{trip.title}</h3>
                  <p className="text-gray-600">
                    {new Date(trip.startDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleDeleteTrip(trip.id);
              }}
              className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full shadow"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </button>
          </div>
        ))}
      </div>

      {/* Avdelare och tidigare resor */}
      {pastTrips.length > 0 && (
        <>
          <div className="my-8 border-b border-gray-300">
            <h2 className="text-2xl font-bold mb-4">Tidigare resor</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastTrips.map((trip) => (
              <Link key={trip.id} to={`/trips/${trip.id}`} className="block opacity-75">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img 
                    src={tripImages[trip.id]} 
                    alt={trip.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">{trip.title}</h3>
                    <p className="text-gray-600">{new Date(trip.startDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home; 