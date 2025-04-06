import { useForm } from 'react-hook-form';
import { Booking } from '../../types';

interface BookingFormProps {
  tripId: string;
  initialData?: Booking;
  onSubmit: (data: Booking) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function BookingForm({ tripId, initialData, onSubmit, onCancel, onDelete }: BookingFormProps) {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: initialData || {
      type: 'flight',
      title: '',
      startDate: new Date().toISOString().split('T')[0],
      startTime: '',
      endDate: '',
      endTime: ''
    }
  });

  const bookingType = watch('type');
  const needsEndDate = ['flight', 'hotel', 'rental-car'].includes(bookingType);

  return (
    <div className="bg-white p-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">
        {initialData ? 'Edit Booking' : 'Add Booking'}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            {...register('type')}
            className="w-full border rounded-md p-2"
          >
            <option value="flight">Flight</option>
            <option value="hotel">Hotel</option>
            <option value="restaurant">Restaurant</option>
            <option value="rental-car">Rental Car</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            {...register('title')}
            className="w-full border rounded-md p-2"
            placeholder="Enter title"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              {...register('startDate')}
              className="w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Time (optional)</label>
            <input
              type="time"
              {...register('startTime')}
              className="w-full border rounded-md p-2"
            />
          </div>
        </div>

        {needsEndDate && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">End Date (optional)</label>
              <input
                type="date"
                {...register('endDate')}
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Time (optional)</label>
              <input
                type="time"
                {...register('endTime')}
                className="w-full border rounded-md p-2"
              />
            </div>
          </div>
        )}

        {bookingType === 'flight' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">From</label>
              <input
                {...register('from')}
                className="w-full border rounded-md p-2"
                placeholder="Departure airport"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">To</label>
              <input
                {...register('to')}
                className="w-full border rounded-md p-2"
                placeholder="Arrival airport"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            {...register('notes')}
            className="w-full border rounded-md p-2"
            rows={3}
            placeholder="Additional notes..."
          />
        </div>

        <div className="flex justify-between pt-4">
          <div>
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="px-4 py-2 text-red-600 hover:text-red-700"
              >
                Delete
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 