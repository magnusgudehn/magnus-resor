import { useState } from 'react';
import { Button } from './ui/button';
import { Booking } from '../types';
import { Loader2 } from 'lucide-react';
import ManualBookingForm from './ManualBookingForm';

interface AddPlanModalProps {
  onClose: () => void;
  onAddBooking: (booking: Booking) => void;
}

const AddPlanModal = ({ onClose, onAddBooking }: AddPlanModalProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      console.log('Uploading file:', file.name);
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch('http://localhost:3001/api/parse-pdf', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to parse PDF');
      }

      const booking = await response.json();
      console.log('Parsed booking:', booking);
      
      onAddBooking(booking);
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Failed to parse PDF. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (showManualForm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-6">Add Booking Manually</h2>
          <ManualBookingForm
            onSave={(booking) => {
              onAddBooking(booking);
              onClose();
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add a Plan</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center 
              ${isUploading ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="pdf-upload"
              disabled={isUploading}
            />
            <label
              htmlFor="pdf-upload"
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                  <span className="text-blue-600">Processing PDF...</span>
                </>
              ) : (
                <>
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-gray-600">
                    Upload PDF confirmation or itinerary
                  </span>
                  <span className="text-sm text-gray-500">
                    We'll automatically extract the details
                  </span>
                </>
              )}
            </label>
          </div>

          {error && (
            <div className="text-red-600 text-center p-2 bg-red-50 rounded">
              {error}
            </div>
          )}

          <div className="text-center">
            <span className="text-gray-500">or</span>
            <Button
              variant="outline"
              onClick={() => setShowManualForm(true)}
              className="w-full mt-2"
              disabled={isUploading}
            >
              Enter details manually
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPlanModal; 