import React, { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { FileText, Upload, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { BookingType } from '../types';

interface PdfTicketUploaderProps {
  onDataExtracted: (data: {
    type: BookingType;
    startDate: string;
    endDate: string;
    from: string;
    to: string;
    reference: string;
    notes: string;
  }) => void;
}

const PdfTicketUploader: React.FC<PdfTicketUploaderProps> = ({ onDataExtracted }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Only accept PDF files
    if (file.type !== 'application/pdf') {
      toast.error('Ogiltig filtyp. Vänligen ladda upp en PDF-fil');
      return;
    }

    setFileName(file.name);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch('http://localhost:8080/api/pdf/parse', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Kunde inte bearbeta PDF-filen');
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

      // Convert the data to match the expected format
      const bookingData = {
        type: parsedData.type || 'flight',
        startDate: startDate || new Date().toISOString().split('.')[0],
        endDate: endDate || new Date().toISOString().split('.')[0],
        from: parsedData.from || '',
        to: parsedData.to || '',
        reference: parsedData.confirmationNumber || '',
        notes: parsedData.description || ''
      };

      toast.success('PDF bearbetad');
      onDataExtracted(bookingData);
    } catch (error) {
      console.error('Error processing PDF:', error);
      toast.error('Kunde inte bearbeta PDF-filen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-blue-500" />
        <Label htmlFor="pdf-upload" className="font-medium">Ladda upp PDF-biljett</Label>
      </div>
      
      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center bg-white">
        {fileName ? (
          <div className="text-center">
            <FileText className="h-10 w-10 text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">{fileName}</p>
            {isLoading && (
              <div className="flex items-center justify-center mt-2">
                <Loader className="h-5 w-5 text-blue-500 animate-spin mr-2" />
                <span className="text-sm text-gray-500">Bearbetar PDF...</span>
              </div>
            )}
          </div>
        ) : (
          <>
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Dra och släpp din PDF-biljett, eller klicka för att bläddra
            </p>
            <p className="text-xs text-gray-500">
              Vi extraherar bokningsdetaljerna automatiskt
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
            Välj PDF
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
            Ladda upp en annan PDF
          </Button>
        )}
      </div>
    </div>
  );
};

export default PdfTicketUploader;
