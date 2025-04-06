import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { PlusCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { tripService } from '@/services/tripService';

const CreateTripForm: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [destination, setDestination] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) {
      toast.error('Vänligen ange en destination');
      return;
    }

    setIsLoading(true);
    setError(null);

    const apiKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
    console.log('Using API Key:', apiKey ? 'API key exists' : 'API key is missing');

    try {
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(destination)}&per_page=1`;
      console.log('Fetching from URL:', url);
      
      const headers = new Headers({
        'Authorization': `Client-ID zQjStJiHD5v_dd-0BdUS0fdGvYD0DpzdbxviwOwBfVw`,
        'Accept-Version': 'v1'
      });

      const unsplashResponse = await fetch(url, { 
        method: 'GET',
        headers: headers 
      });

      if (!unsplashResponse.ok) {
        const errorText = await unsplashResponse.text();
        console.error('Unsplash API Error Response:', errorText);
        throw new Error(`Unsplash API error: ${unsplashResponse.status} - ${errorText}`);
      }

      const unsplashData = await unsplashResponse.json();
      console.log('Unsplash API response:', unsplashData);

      if (!unsplashData.results || unsplashData.results.length === 0) {
        throw new Error('Inga bilder hittades för denna destination');
      }

      const imageUrl = unsplashData.results[0].urls.regular;
      console.log('Selected image URL:', imageUrl);

      // Skapa ny resa med tripService
      const tripData = {
        id: crypto.randomUUID(),
        title: destination,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        destination: destination,
        image: imageUrl,
        bookings: []
      };

      try {
        await tripService.saveTrip(tripData);
        toast.success('Ny resa skapad');
        setOpen(false);
        // Uppdatera listan med resor genom att ladda om sidan
        window.location.href = '/';
      } catch (error) {
        console.error('Error saving trip:', error);
        toast.error('Kunde inte skapa resan');
      }
    } catch (err) {
      console.error('Error fetching image:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ett fel uppstod vid hämtning av bild';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-travel-primary hover:bg-travel-primary/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Ny resa
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Skapa ny resa</DialogTitle>
          <DialogDescription>
            Ange destination för din nya resa.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="T.ex. Paris, Frankrike"
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-travel-primary hover:bg-travel-primary/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Skapar resa...
              </>
            ) : (
              'Skapa resa'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTripForm;
