import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Booking } from '@/types';
import { format } from 'date-fns';

interface BookingFormProps {
  booking: Booking;
  onSave: (booking: Booking) => void;
  onCancel: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ booking, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Booking>(booking);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="type">Typ</Label>
        <Input
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="startDate">Startdatum</Label>
        <Input
          id="startDate"
          name="startDate"
          type="date"
          value={format(new Date(formData.startDate), 'yyyy-MM-dd')}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="endDate">Slutdatum</Label>
        <Input
          id="endDate"
          name="endDate"
          type="date"
          value={format(new Date(formData.endDate), 'yyyy-MM-dd')}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="from">Från</Label>
        <Input
          id="from"
          name="from"
          value={formData.from}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="to">Till</Label>
        <Input
          id="to"
          name="to"
          value={formData.to}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="reference">Referens</Label>
        <Input
          id="reference"
          name="reference"
          value={formData.reference}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label htmlFor="notes">Anteckningar</Label>
        <Input
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Avbryt
        </Button>
        <Button type="submit">
          Spara
        </Button>
      </div>
    </form>
  );
};

export default BookingForm; 