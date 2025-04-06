
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { PlusCircle, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PdfTicketUploader from './PdfTicketUploader';

interface AddBookingFormProps {
  onAddBooking: (booking: any) => void;
}

const AddBookingForm: React.FC<AddBookingFormProps> = ({ onAddBooking }) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('manual');
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
    resetForm();
  };

  const handlePdfData = (extractedData: any) => {
    setBooking(extractedData);
    setActiveTab('manual'); // Switch to manual tab to show extracted data
  };

  const resetForm = () => {
    setBooking({
      type: 'flight' as BookingType,
      title: '',
      startDate: '',
      endDate: '',
      location: '',
      description: '',
      confirmationNumber: '',
    });
    setActiveTab('manual');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Booking
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Booking</DialogTitle>
          <DialogDescription>
            Add booking details manually or upload a PDF ticket
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="pdf" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>PDF Upload</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual">
            <form onSubmit={handleSubmit} className="space-y-4">
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
          </TabsContent>
          
          <TabsContent value="pdf">
            <PdfTicketUploader onExtractedData={handlePdfData} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookingForm;
