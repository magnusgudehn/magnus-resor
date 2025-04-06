import { useFormContext } from 'react-hook-form';
import { BookingFormData } from '../../../lib/schemas';
import { FormField } from '../../ui/form-field';

export default function FlightForm() {
  const { register, formState: { errors } } = useFormContext<BookingFormData>();

  return (
    <div className="space-y-4">
      <FormField
        label="Title"
        error={errors.title?.message}
        required
      >
        <input
          {...register('title')}
          className="w-full border rounded-md p-2"
          placeholder="e.g., Flight to Paris"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="From"
          error={errors.from?.message}
          required
        >
          <input
            {...register('from')}
            className="w-full border rounded-md p-2"
            placeholder="e.g., ARN"
          />
        </FormField>

        <FormField
          label="To"
          error={errors.to?.message}
          required
        >
          <input
            {...register('to')}
            className="w-full border rounded-md p-2"
            placeholder="e.g., CDG"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Airline"
          error={errors.airline?.message}
          required
        >
          <input
            {...register('airline')}
            className="w-full border rounded-md p-2"
            placeholder="e.g., SAS"
          />
        </FormField>

        <FormField
          label="Flight Number"
          error={errors.flightNumber?.message}
          required
        >
          <input
            {...register('flightNumber')}
            className="w-full border rounded-md p-2"
            placeholder="e.g., SK1234"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Departure Time"
          error={errors.departureTime?.message}
          required
        >
          <input
            type="datetime-local"
            {...register('departureTime')}
            className="w-full border rounded-md p-2"
          />
        </FormField>

        <FormField
          label="Arrival Time"
          error={errors.arrivalTime?.message}
          required
        >
          <input
            type="datetime-local"
            {...register('arrivalTime')}
            className="w-full border rounded-md p-2"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Terminal"
          error={errors.terminal?.message}
        >
          <input
            {...register('terminal')}
            className="w-full border rounded-md p-2"
            placeholder="e.g., Terminal 5"
          />
        </FormField>

        <FormField
          label="Confirmation"
          error={errors.confirmation?.message}
        >
          <input
            {...register('confirmation')}
            className="w-full border rounded-md p-2"
            placeholder="Booking reference"
          />
        </FormField>
      </div>

      <FormField
        label="Notes"
        error={errors.notes?.message}
      >
        <textarea
          {...register('notes')}
          className="w-full border rounded-md p-2"
          rows={3}
          placeholder="Additional notes..."
        />
      </FormField>
    </div>
  );
} 