import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripService } from '../services/tripService';
import { imageService } from '../services/imageService';
import { Trip } from '../types';
import { Button } from '../components/ui/button';
import { ChevronLeft } from 'lucide-react';

const NewTrip: React.FC = () => {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      title,
      destination: title,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      bookings: []
    };

    await tripService.saveTrip(newTrip);
    const imageUrl = await imageService.getDestinationImage(title);
    await tripService.saveTrip({ ...newTrip, image: imageUrl });
    navigate('/');
  };

  return (
    <div className="container mx-auto p-4">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/')}
        className="mb-6"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Tillbaka
      </Button>

      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-2xl font-bold mb-6">Skapa ny resa</h1>
          
          <div>
            <label className="block text-sm font-medium mb-1">Destination</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-md p-2"
              placeholder="Ange destination"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
            >
              Avbryt
            </Button>
            <Button type="submit">
              Skapa resa
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTrip; 