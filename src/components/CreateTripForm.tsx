
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { PlusCircle, CalendarIcon, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { getTrips } from '@/utils/mockData';
import { Trip } from '@/types';

interface CreateTripFormProps {
  onTripCreated?: (trip: Trip) => void;
}

const CreateTripForm: React.FC<CreateTripFormProps> = ({ onTripCreated }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [trip, setTrip] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTrip(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!trip.title || !trip.destination || !trip.startDate || !trip.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Check that end date is after start date
    if (new Date(trip.endDate) < new Date(trip.startDate)) {
      toast.error('End date must be after start date');
      return;
    }

    // Create new trip
    const newTrip = {
      id: `trip-${Date.now()}`,
      title: trip.title,
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
      bookings: [],
      image: getRandomTravelImage(),
    };

    // In a real app, this would be a call to an API
    // For this demo, we'll simulate adding to the trips array
    const trips = getTrips();
    trips.push(newTrip as Trip);

    toast.success(`${trip.title} has been added to your trips.`);

    // Call the callback if provided
    if (onTripCreated) {
      onTripCreated(newTrip as Trip);
    }

    // Close dialog and reset form
    setOpen(false);
    resetForm();

    // Navigate to the trip details page
    navigate(`/trip/${newTrip.id}`);
  };

  const resetForm = () => {
    setTrip({
      title: '',
      destination: '',
      startDate: '',
      endDate: '',
    });
  };

  // Helper function to get a random travel image
  const getRandomTravelImage = (): string => {
    const images = [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop", // Paris
      "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=2070&auto=format&fit=crop", // London
      "https://images.unsplash.com/photo-1544037803-d54973bb3f8d?q=80&w=2070&auto=format&fit=crop", // Mountain
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop", // Beach
      "https://images.unsplash.com/photo-1562181789-a547a3e59b90?w=800&auto=format&fit=crop", // City
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Trip
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Trip</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new trip
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Trip Name</Label>
            <Input 
              id="title" 
              name="title" 
              value={trip.title} 
              onChange={handleChange} 
              placeholder="Summer Vacation"
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                id="destination" 
                name="destination" 
                value={trip.destination} 
                onChange={handleChange} 
                placeholder="Paris, France"
                className="pl-9"
                required 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  id="startDate" 
                  name="startDate" 
                  type="date" 
                  value={trip.startDate} 
                  onChange={handleChange} 
                  className="pl-9"
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  id="endDate" 
                  name="endDate" 
                  type="date" 
                  value={trip.endDate} 
                  onChange={handleChange}
                  className="pl-9" 
                  required 
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => {
              setOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button type="submit">Create Trip</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTripForm;
