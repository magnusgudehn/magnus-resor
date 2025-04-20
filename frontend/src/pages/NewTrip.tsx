import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { tripService } from '@/services/tripService';
import { imageService } from '@/services/imageService';
import { Trip } from '@/types/Trip';
import { toast } from 'sonner';

export default function NewTrip() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Hämta bild från Unsplash
      const imageUrl = await imageService.getDestinationImage(destination);

      const newTrip: Trip = {
        destination,
        id: crypto.randomUUID(),
        userId: 'anonymous',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        description: '',
        imageUrl, // Lägg till bild-URL i resan
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await tripService.saveTrip(newTrip);
      toast.success('Resan sparades!');
      navigate('/');
    } catch (error) {
      console.error('Kunde inte spara resan:', error);
      toast.error('Kunde inte spara resan. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Ny Resa</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="destination">Vart vill du resa?</Label>
          <Input
            id="destination"
            name="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Ange destination"
            required
            className="text-lg"
          />
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/')}
          >
            Avbryt
          </Button>
          <Button 
            type="submit" 
            disabled={loading || !destination}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Sparar...' : 'Spara Resa'}
          </Button>
        </div>
      </form>
    </div>
  );
} 