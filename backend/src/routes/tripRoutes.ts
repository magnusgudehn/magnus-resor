import express from 'express';
import { Trip } from '../types/Trip';

const router = express.Router();

// In-memory lagring av resor
let trips: Trip[] = [];

// Hämta alla resor
router.get('/', (req, res) => {
  console.log('Hämtar alla resor. Antal:', trips.length);
  res.json(trips);
});

// Hämta en specifik resa
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const trip = trips.find(t => t.id === id);
  
  if (!trip) {
    return res.status(404).json({ error: 'Resan hittades inte' });
  }
  
  res.json(trip);
});

// Skapa en ny resa
router.post('/', (req, res) => {
  console.log('Försöker skapa ny resa:', req.body);
  
  try {
    const trip: Trip = {
      ...req.body,
      bookings: req.body.bookings || []
    };
    
    // Validera required fields
    if (!trip.id || !trip.title || !trip.destination || !trip.startDate || !trip.endDate) {
      console.log('Validering misslyckades:', {
        id: !!trip.id,
        title: !!trip.title,
        destination: !!trip.destination,
        startDate: !!trip.startDate,
        endDate: !!trip.endDate
      });
      return res.status(400).json({ error: 'Saknade obligatoriska fält' });
    }
    
    // Lägg till i vår in-memory lagring
    trips.push(trip);
    console.log('Resa skapad. Totalt antal resor:', trips.length);
    
    // Skicka tillbaka den skapade resan
    res.status(201).json(trip);
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ error: 'Kunde inte skapa resan' });
  }
});

// Uppdatera en resa
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const updatedTrip: Trip = req.body;
  
  const index = trips.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Resan hittades inte' });
  }
  
  // Behåll befintliga bookings om inga nya skickades
  updatedTrip.bookings = updatedTrip.bookings || trips[index].bookings;
  
  trips[index] = updatedTrip;
  res.json(updatedTrip);
});

// Ta bort en resa
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const index = trips.findIndex(t => t.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Resan hittades inte' });
  }
  
  trips = trips.filter(t => t.id !== id);
  res.status(204).send();
});

export default router; 