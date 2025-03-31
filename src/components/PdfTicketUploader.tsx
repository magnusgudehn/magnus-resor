
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileText, Upload, LoaderCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BookingType } from '@/types';

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
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Only accept PDF files
    if (file.type !== 'application/pdf') {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF file',
        variant: 'destructive',
      });
      return;
    }

    setFileName(file.name);
    setIsLoading(true);

    try {
      // In a real application, you would use a PDF parsing library
      // For this demo, we'll simulate extraction with a timeout
      await simulatePdfExtraction(file);
    } catch (error) {
      toast({
        title: 'Error processing PDF',
        description: 'Failed to extract booking information from the PDF.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate PDF data extraction
  const simulatePdfExtraction = async (file: File) => {
    return new Promise<void>((resolve) => {
      // Simulate processing time
      setTimeout(() => {
        // Extract mock data based on filename
        const isFlightTicket = file.name.toLowerCase().includes('flight') || 
                               file.name.toLowerCase().includes('airline');
        const isHotelBooking = file.name.toLowerCase().includes('hotel') || 
                               file.name.toLowerCase().includes('reservation');
        
        let extractedType: BookingType = 'other';
        let mockTitle = 'Extracted Booking';
        
        if (isFlightTicket) {
          extractedType = 'flight';
          mockTitle = 'Flight to New York';
        } else if (isHotelBooking) {
          extractedType = 'hotel';
          mockTitle = 'Hotel Reservation';
        }

        // Generate data with current date + 30 days for demo
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + 30);

        const mockData = {
          type: extractedType,
          title: mockTitle,
          startDate: today.toISOString(),
          endDate: futureDate.toISOString(),
          location: 'Extracted from PDF',
          description: `Booking information extracted from ${file.name}`,
          confirmationNumber: `PDF-${Math.floor(Math.random() * 10000)}`,
        };

        // Show success message
        toast({
          title: 'PDF processed successfully',
          description: 'Booking information extracted from the PDF.',
        });

        // Pass extracted data to parent component
        onExtractedData(mockData);
        resolve();
      }, 1500); // Simulate 1.5 second processing time
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-travel-primary" />
        <Label htmlFor="pdf-upload" className="font-medium">Upload PDF Ticket</Label>
      </div>
      
      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
        {fileName ? (
          <div className="text-center">
            <FileText className="h-10 w-10 text-travel-primary mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">{fileName}</p>
            {isLoading && (
              <div className="flex items-center justify-center mt-2">
                <LoaderCircle className="h-5 w-5 text-travel-primary animate-spin mr-2" />
                <span className="text-sm text-gray-500">Processing PDF...</span>
              </div>
            )}
          </div>
        ) : (
          <>
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-2">
              Drag and drop your PDF ticket, or click to browse
            </p>
            <p className="text-xs text-gray-400">
              We'll automatically extract booking details
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
            className="mt-4"
            onClick={() => document.getElementById('pdf-upload')?.click()}
            disabled={isLoading}
          >
            Select PDF
          </Button>
        )}
        
        {fileName && !isLoading && (
          <Button
            variant="outline"
            className="mt-4"
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
