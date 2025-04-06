import React, { useState } from 'react';
import { Button } from './ui/button';
import { Upload, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface PdfTicketUploaderProps {
  onPdfParsed: (data: any) => void;
}

interface ParsedBookingData {
  type: string;
  title: string;
  startDate: string;
  endDate?: string;
  location?: string;
  description?: string;
  confirmationNumber?: string;
  from?: string;
  to?: string;
  airline?: string;
  flightNumber?: string;
  departureTime?: string;
  arrivalTime?: string;
}

export const PdfTicketUploader: React.FC<PdfTicketUploaderProps> = ({ onPdfParsed }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const validateParsedData = (data: any): ParsedBookingData | null => {
    console.log('Validerar parsad data:', data);
    
    if (!data.type || !data.title || !data.startDate) {
      console.error('Saknar obligatoriska fält:', {
        type: !!data.type,
        title: !!data.title,
        startDate: !!data.startDate
      });
      return null;
    }

    // Extrahera tid från startDate och endDate om det finns
    const [startDate, startTime] = data.startDate.split('T');
    const [endDate, endTime] = data.endDate?.split('T') || [];

    // Använd de specifika tidsfälten om de finns, annars använd tiden från datum
    const departureTime = data.departureTime || (startTime ? startTime.slice(0, 5) : '');
    const arrivalTime = data.arrivalTime || (endTime ? endTime.slice(0, 5) : '');

    console.log('Extraherade tider:', {
      startDate,
      startTime,
      endDate,
      endTime,
      departureTime,
      arrivalTime
    });

    return {
      type: data.type,
      title: data.title,
      startDate,
      endDate: endDate || startDate,
      departureTime,
      arrivalTime,
      location: data.location || data.destination,
      description: data.description,
      confirmationNumber: data.confirmationNumber || data.bookingReference,
      from: data.from || data.departure,
      to: data.to || data.arrival,
      airline: data.airline,
      flightNumber: data.flightNumber
    };
  };

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log('Ingen fil vald');
      return;
    }

    console.log('Vald fil:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    if (!file.type.includes('pdf')) {
      setError('Endast PDF-filer stöds');
      console.error('Fel filtyp:', file.type);
      return;
    }

    console.log('Försöker ladda upp fil:', file.name, 'Storlek:', file.size, 'bytes');
    setIsLoading(true);
    setError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      console.log('Skickar PDF till servern...');
      const response = await fetch('http://localhost:3001/api/parse-pdf', {
        method: 'POST',
        body: formData,
      });
      
      console.log('Server svarade:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server svarade med fel:', response.status, errorText);
        throw new Error(`Kunde inte läsa PDF-filen: ${errorText}`);
      }
      
      const rawData = await response.json();
      console.log('Rådata från server:', rawData);

      const parsedData = validateParsedData(rawData);
      if (!parsedData) {
        throw new Error('Kunde inte tolka bokningsinformationen från PDF:en');
      }

      console.log('Validerad bokningsdata:', parsedData);
      onPdfParsed(parsedData);
      
    } catch (error) {
      console.error('Fel vid PDF-hantering:', error);
      setError(error instanceof Error ? error.message : 'Ett fel uppstod vid PDF-hantering');
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
      // Rensa input-fältet
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          accept=".pdf"
          onChange={handlePdfUpload}
          className="hidden"
          id="pdf-upload"
        />
        <label 
          htmlFor="pdf-upload" 
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <div className="text-sm text-gray-600">
                Läser PDF...
              </div>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400" />
              <div className="text-sm text-gray-600">
                Klicka för att ladda upp PDF eller dra och släpp
              </div>
            </>
          )}
          <Button 
            variant="outline" 
            disabled={isLoading}
            className="mt-2"
          >
            {isLoading ? 'Läser in...' : 'Välj PDF'}
          </Button>
        </label>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {uploadProgress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      <div className="text-sm text-gray-500 text-center">
        Stödjer boknings-PDF:er från de flesta flygbolag och hotell
      </div>
    </div>
  );
};
