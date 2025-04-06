import React, { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { FileText, Upload, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { BookingType } from '../types';

interface PdfTicketUploaderProps {
  onExtractedData: (data: {
    type: BookingType;
    title: string;
    startDate: string;
    endDate?: string;
    location?: string;
    description?: string;
    confirmationNumber?: string;
  }) => void;
}

const PdfTicketUploader: React.FC<PdfTicketUploaderProps> = ({ onExtractedData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Only accept PDF files
    if (file.type !== 'application/pdf') {
      toast.error('Invalid file type. Please upload a PDF file');
      return;
    }

    setFileName(file.name);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch('/api/pdf/parse', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to process PDF');
      }

      const data = await response.json();
      console.log('Parsed data:', data);
      
      // Parse the response if it's a string
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      
      // Format dates correctly
      let startDate = '';
      let endDate = '';
      
      if (parsedData.startDate) {
        try {
          const date = new Date(parsedData.startDate);
          startDate = date.toISOString().split('.')[0]; // Format as YYYY-MM-DDTHH:mm:ss
        } catch (e) {
          console.error('Error parsing start date:', e);
        }
      }
      
      if (parsedData.endDate) {
        try {
          const date = new Date(parsedData.endDate);
          endDate = date.toISOString().split('.')[0]; // Format as YYYY-MM-DDTHH:mm:ss
        } catch (e) {
          console.error('Error parsing end date:', e);
        }
      }

      // Prepare description with additional details if available
      let description = parsedData.description || '';
      if (parsedData.from && parsedData.to) {
        description = `${description}\nFrom: ${parsedData.from}\nTo: ${parsedData.to}`;
      }
      if (parsedData.airline) {
        description = `${description}\nAirline: ${parsedData.airline}`;
      }
      if (parsedData.flightNumber) {
        description = `${description}\nFlight: ${parsedData.flightNumber}`;
      }
      description = description.trim();

      // Convert the data to match the expected format
      const bookingData = {
        type: parsedData.type as BookingType || 'other',
        title: parsedData.title || 'Untitled Booking',
        startDate: startDate || new Date().toISOString().split('.')[0],
        endDate: endDate || undefined,
        location: parsedData.location || parsedData.from && parsedData.to ? `${parsedData.from} - ${parsedData.to}` : undefined,
        description: description || undefined,
        confirmationNumber: parsedData.confirmationNumber || undefined,
      };

      toast.success('PDF processed successfully');
      onExtractedData(bookingData);
    } catch (error) {
      console.error('Error processing PDF:', error);
      toast.error('Failed to process the PDF file');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-blue-500" />
        <Label htmlFor="pdf-upload" className="font-medium">Upload PDF Ticket</Label>
      </div>
      
      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center bg-white">
        {fileName ? (
          <div className="text-center">
            <FileText className="h-10 w-10 text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">{fileName}</p>
            {isLoading && (
              <div className="flex items-center justify-center mt-2">
                <Loader className="h-5 w-5 text-blue-500 animate-spin mr-2" />
                <span className="text-sm text-gray-500">Processing PDF...</span>
              </div>
            )}
          </div>
        ) : (
          <>
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop your PDF ticket, or click to browse
            </p>
            <p className="text-xs text-gray-500">
              We'll extract booking details automatically
            </p>
          </>
        )}
        
        <input
          id="pdf-upload"
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
          disabled={isLoading}
        />
        
        {!fileName && (
          <Button
            variant="outline"
            className="mt-4 bg-white"
            onClick={() => document.getElementById('pdf-upload')?.click()}
            disabled={isLoading}
          >
            Select PDF
          </Button>
        )}
        
        {fileName && !isLoading && (
          <Button
            variant="outline"
            className="mt-4 bg-white"
            onClick={() => {
              setFileName(null);
              const input = document.getElementById('pdf-upload') as HTMLInputElement;
              if (input) input.value = '';
            }}
          >
            Upload Another PDF
          </Button>
        )}
      </div>
    </div>
  );
};

export default PdfTicketUploader;
