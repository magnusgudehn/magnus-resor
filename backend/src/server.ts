import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import tripRoutes from './routes/tripRoutes';
import bookingRoutes from './routes/bookingRoutes';
import pdfRoutes from './routes/pdfRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/trips', tripRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/pdf', pdfRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 