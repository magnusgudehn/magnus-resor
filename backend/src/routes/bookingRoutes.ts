import express from 'express';
import { Booking } from '../types/Booking';

const router = express.Router();

// Hämta alla bokningar
router.get('/', (req, res) => {
  // TODO: Implementera databaslogik
  res.json([]);
});

// Hämta en specifik bokning
router.get('/:id', (req, res) => {
  const { id } = req.params;
  // TODO: Implementera databaslogik
  res.json({});
});

// Skapa en ny bokning
router.post('/', (req, res) => {
  const booking: Booking = req.body;
  // TODO: Implementera databaslogik
  res.status(201).json(booking);
});

// Uppdatera en bokning
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const booking: Booking = req.body;
  // TODO: Implementera databaslogik
  res.json(booking);
});

// Ta bort en bokning
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  // TODO: Implementera databaslogik
  res.status(204).send();
});

export default router; 