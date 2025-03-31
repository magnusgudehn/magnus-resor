
import React, { useState } from 'react';
import { BookingType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';

interface AddBookingFormProps {
  onAddBooking: (booking: any) => void;
}

const AddBookingForm: React.FC<AddBookingFormProps> = ({ onAddBooking }) => {
  const [open, setOpen] = useState(false);
  const [booking, setBooking] = useState({
    type: 'flight' as BookingType,
    title: '',
    startDate: '',
    endDate: '',
    location: '',
    description: '',
    confirmationNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBooking(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: BookingType) => {
    setBooking(prev => ({ ...prev, type: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking = {
      ...booking,
      id: `booking-${Date.now()}`,
    };
    onAddBooking(newBooking);
    setOpen(false);
    setBooking({
      type: 'flight' as BookingType,
      title: '',
      startDate: '',
      endDate: '',
      location: '',
      description: '',
      confirmationNumber: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Booking
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Booking</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="type">Booking Type</Label>
            <Select 
              value={booking.type} 
              onValueChange={(value) => handleTypeChange(value as BookingType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select booking type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flight">Flight</SelectItem>
                <SelectItem value="hotel">Hotel</SelectItem>
                <SelectItem value="car">Car Rental</SelectItem>
                <SelectItem value="activity">Activity</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              name="title" 
              value={booking.title} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input 
                id="startDate" 
                name="startDate" 
                type="datetime-local" 
                value={booking.startDate} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input 
                id="endDate" 
                name="endDate" 
                type="datetime-local" 
                value={booking.endDate} 
                onChange={handleChange} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location" 
              name="location" 
              value={booking.location} 
              onChange={handleChange} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={booking.description} 
              onChange={handleChange} 
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmationNumber">Confirmation Number</Label>
            <Input 
              id="confirmationNumber" 
              name="confirmationNumber" 
              value={booking.confirmationNumber} 
              onChange={handleChange} 
            />
          </div>
          
          <Button type="submit" className="w-full">Add Booking</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookingForm;
