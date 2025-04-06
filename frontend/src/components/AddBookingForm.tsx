import React, { useState, useEffect } from 'react';
import { BookingType } from '@/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from './ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogDescription 
} from './ui/dialog';
import { PlusCircle, FileText, Edit, Loader2 } from 'lucide-react';
import { PdfTicketUploader } from './PdfTicketUploader';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { useToast } from './ui/use-toast';
import { Card } from './ui/card';
import { formatDateTime } from '@/lib/utils';

interface BookingFormProps {
  onSubmit: (booking: any) => void;
  onDelete?: (id: string) => void;
  existingBooking?: any;
  mode: 'create' | 'edit';
}

interface BookingState {
  type: BookingType;
  title: string;
  arrivalDate: string;
  departureDate: string;
  location: string;
  description: string;
  confirmationNumber: string;
  id?: string;
  destination?: string;
  departureTime?: string;
  arrivalTime?: string;
}

interface BookingFormData {
  type: BookingType;
  title: string;
  arrivalDate: string;
  departureDate: string;
  arrivalTime: string;
  departureTime: string;
  location: string;
  description: string;
  confirmationNumber: string;
  from?: string;
  to?: string;
  airline?: string;
  flightNumber?: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ 
  onSubmit, 
  onDelete,
  existingBooking = null,
  mode = 'create' 
}) => {
  const [open, setOpen] = useState(mode === 'edit');
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(mode === 'edit');
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue, watch } = useForm<BookingFormData>({
    defaultValues: existingBooking || {
      type: 'flight',
      title: '',
      arrivalDate: '',
      departureDate: '',
      location: '',
      description: '',
      confirmationNumber: ''
    }
  });

  useEffect(() => {
    if (existingBooking && mode === 'edit') {
      Object.entries(existingBooking).forEach(([key, value]) => {
        if (key === 'startDate') {
          setValue('departureDate', value as string || '');
        } else if (key === 'endDate') {
          setValue('arrivalDate', value as string || '');
        } else if (key === 'departureTime') {
          setValue('departureTime', value as string || '');
        } else if (key === 'arrivalTime') {
          setValue('arrivalTime', value as string || '');
        } else {
          setValue(key as keyof BookingFormData, value as string);
        }
      });
      setOpen(true);
      setShowForm(true);
    }
  }, [existingBooking, mode, setValue]);

  const onSubmitForm: SubmitHandler<BookingFormData> = (data: BookingFormData) => {
    const bookingData = {
      ...data,
      id: mode === 'create' ? `booking-${Date.now()}` : existingBooking?.id
    };
    onSubmit(bookingData);
    setOpen(false);
    if (mode === 'create') {
      reset();
      setShowForm(false);
    }
  };

  const handlePdfParsed = (data: any) => {
    if (data) {
      console.log('Rådata från server:', data);
      setIsLoading(false);
      
      // Använd den validerade bokningsdatan direkt
      setValue('departureDate', data.startDate);
      setValue('departureTime', data.departureTime);
      setValue('arrivalDate', data.endDate);
      setValue('arrivalTime', data.arrivalTime);
      setValue('from', data.from);
      setValue('to', data.to);
      setValue('airline', data.airline);
      setValue('flightNumber', data.flightNumber);
      setValue('location', data.location);
      setValue('title', data.title);
      setValue('description', data.description);
      setValue('confirmationNumber', data.confirmationNumber);
      setValue('type', data.type);

      // Logga formulärets värden efter uppdatering
      const formValues = {
        departureDate: watch('departureDate'),
        departureTime: watch('departureTime'),
        arrivalDate: watch('arrivalDate'),
        arrivalTime: watch('arrivalTime'),
        from: watch('from'),
        to: watch('to'),
        airline: watch('airline'),
        flightNumber: watch('flightNumber')
      };
      console.log('Faktiska formulärvärden:', formValues);
      
      // Visa formuläret efter att PDF:en har parsats
      setShowForm(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === 'create' ? (
          <Button variant="outline" className="flex gap-2 items-center">
            <PlusCircle className="h-4 w-4" />
            Lägg till bokning
          </Button>
        ) : (
          <Button variant="ghost" className="p-2">
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {showForm ? 'Granska bokning' : 'Ladda upp boknings-PDF'}
          </DialogTitle>
        </DialogHeader>

        {!showForm && mode === 'create' ? (
          <PdfTicketUploader onPdfParsed={handlePdfParsed} />
        ) : (
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="type">Typ av bokning</Label>
              <Select defaultValue={watch('type')} onValueChange={(value) => setValue('type', value as BookingType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj typ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flight">Flyg</SelectItem>
                  <SelectItem value="hotel">Hotell</SelectItem>
                  <SelectItem value="car">Hyrbil</SelectItem>
                  <SelectItem value="activity">Aktivitet</SelectItem>
                  <SelectItem value="other">Övrigt</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Titel</Label>
              <Input {...register('title')} placeholder="Titel på bokning" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Avresa</Label>
                <div className="space-y-2">
                  <Input 
                    type="date" 
                    {...register('departureDate')} 
                  />
                  <Input 
                    type="time" 
                    {...register('departureTime')} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Ankomst</Label>
                <div className="space-y-2">
                  <Input 
                    type="date" 
                    {...register('arrivalDate')} 
                  />
                  <Input 
                    type="time" 
                    {...register('arrivalTime')} 
                  />
                </div>
              </div>
            </div>

            {watch('type') === 'flight' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from">Från</Label>
                  <Input {...register('from')} placeholder="Avreseort" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to">Till</Label>
                  <Input {...register('to')} placeholder="Destination" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="airline">Flygbolag</Label>
                  <Input {...register('airline')} placeholder="Flygbolag" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flightNumber">Flygnummer</Label>
                  <Input {...register('flightNumber')} placeholder="Flygnummer" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="location">Plats</Label>
              <Input {...register('location')} placeholder="Plats" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Beskrivning</Label>
              <Textarea {...register('description')} placeholder="Beskrivning" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmationNumber">Bokningsnummer</Label>
              <Input {...register('confirmationNumber')} placeholder="Bokningsnummer" />
            </div>

            <div className="flex justify-between">
              <Button type="submit" className="w-full">
                {mode === 'create' ? 'Lägg till' : 'Spara ändringar'}
              </Button>
              {mode === 'edit' && onDelete && (
                <Button 
                  type="button" 
                  variant="destructive"
                  onClick={() => {
                    if (existingBooking?.id) {
                      onDelete(existingBooking.id);
                      setOpen(false);
                    }
                  }}
                  className="ml-2"
                >
                  Ta bort
                </Button>
              )}
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingForm;
