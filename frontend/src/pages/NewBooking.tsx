import { useNavigate } from 'react-router-dom';
import AddBookingForm from '../components/AddBookingForm';

export default function NewBooking() {
  const navigate = useNavigate();

  const handleAddBooking = (booking: any) => {
    console.log('Ny bokning skapad:', booking);
    navigate('/');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Ny Bokning</h1>
      <AddBookingForm onAddBooking={handleAddBooking} />
    </div>
  );
} 