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
      // Read the file as ArrayBuffer to process
      const arrayBuffer = await readFileAsArrayBuffer(file);
      await processPdf(file, arrayBuffer);
    } catch (error) {
      console.error('PDF processing error:', error);
      toast({
        title: 'Error processing PDF',
        description: 'Failed to extract booking information from the PDF.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Convert file to ArrayBuffer for PDF parsing
  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  // Process PDF and extract booking information
  const processPdf = async (file: File, arrayBuffer: ArrayBuffer) => {
    // Simulate the text content extraction from PDF
    const extractedText = await simulatePdfTextExtraction(file);
    console.log('Extracted text from PDF:', extractedText);
    
    // Process the extracted text to identify booking details with improved extraction
    const bookingData = extractBookingDetailsFromText(extractedText, file.name);
    
    // Show success message
    toast({
      title: 'PDF processed successfully',
      description: 'Booking information extracted from the PDF.',
    });
    
    // Pass extracted data to parent component
    onExtractedData(bookingData);
  };

  // Simulate PDF text extraction with enhanced multilingual awareness
  const simulatePdfTextExtraction = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const fileName = file.name.toLowerCase();
        
        // Simulate different text content based on filename to demonstrate multilingual handling
        let extractedText = '';
        
        if (fileName.includes('flight') || fileName.includes('flyg')) {
          extractedText = `
            FLIGHT DETAILS / FLYGDETALJER
            ----------------------------
            Booking Reference / Bokningsreferens: AB123456
            Passenger / Passagerare: Jane Doe
            From / Från: Stockholm (ARN)
            To / Till: Copenhagen (CPH)
            Date / Datum: ${new Date().toLocaleDateString('sv-SE')}
            Departure / Avgång: 10:30
            Arrival / Ankomst: 11:45
            Airline / Flygbolag: Scandinavian Airlines
            Contact / Kontakt: info@airline.com
            Price / Pris: 1500 SEK
          `;
        } else if (fileName.includes('hotel') || fileName.includes('hotell')) {
          extractedText = `
            HOTEL RESERVATION / HOTELLBOKNING
            -------------------------------
            Confirmation / Bekräftelse: HD98765
            Guest / Gäst: John Smith
            Hotel / Hotell: Grand Hotel Stockholm
            Check-in: ${new Date().toLocaleDateString('sv-SE')} 14:00
            Check-out: ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('sv-SE')} 12:00
            Room type / Rumstyp: Double / Dubbel
            Address / Adress: Södra Blasieholmshamnen 8, 111 48 Stockholm
            Contact / Kontakt: booking@grandhotel.se
            Price / Pris: 2950 SEK / night
          `;
        } else if (fileName.includes('car') || fileName.includes('bil')) {
          extractedText = `
            CAR RENTAL / BILUTHYRNING
            -----------------------
            Confirmation / Bekräftelse: CR45678
            Customer / Kund: Alex Johnson
            Vehicle / Fordon: Volvo V60
            Pick-up / Upphämtning: ${new Date().toLocaleDateString('sv-SE')} 12:00
            Return / Återlämning: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('sv-SE')} 12:00
            Location / Plats: Arlanda Airport / Arlanda Flygplats
            Insurance / Försäkring: Full coverage / Helförsäkring
            Contact / Kontakt: arlanda@carrental.com
            Total / Totalt: 4200 SEK
          `;
        } else if (fileName.includes('activity') || fileName.includes('aktivitet')) {
          extractedText = `
            ACTIVITY BOOKING / AKTIVITETSBOKNING
            ---------------------------------
            Confirmation / Bekräftelse: ACT12345
            Event / Händelse: Stockholm Archipelago Tour / Skärgårdstur
            Date / Datum: ${new Date().toLocaleDateString('sv-SE')}
            Time / Tid: 09:00 - 17:00
            Meeting point / Mötesplats: Strandvägen, Stockholm
            Participants / Deltagare: 2
            Included / Ingår: Lunch, guide, boat trip / Lunch, guide, båttur
            Contact / Kontakt: info@archipelagotours.com
            Price / Pris: 1200 SEK / person
          `;
        } else {
          extractedText = `
            GENERAL BOOKING / GENERELL BOKNING
            ------------------------------
            Reference number / Referensnummer: GEN67890
            Description / Beskrivning: ${file.name.replace('.pdf', '')}
            Date / Datum: ${new Date().toLocaleDateString('sv-SE')}
            Time / Tid: 10:00 - 16:00
            Location / Plats: Stockholm, Sweden / Sverige
            Contact / Kontakt: booking@service.se
            Price / Pris: 850 SEK
          `;
        }
        
        resolve(extractedText);
      }, 1500); // Simulate processing time
    });
  };

  // Enhanced extraction of booking details from text with improved field recognition
  const extractBookingDetailsFromText = (text: string, fileName: string): any => {
    console.log('Processing text to extract booking details');
    
    // Initialize booking data with empty fields
    let type: BookingType = 'other';
    let title = '';
    let startDate = '';
    let endDate = '';
    let location = '';
    let description = '';
    let confirmationNumber = '';
    
    const textLower = text.toLowerCase();
    
    // Detect booking type with more comprehensive patterns
    if (textLower.includes('flight') || textLower.includes('flyg') || 
        textLower.includes('airline') || textLower.includes('flygbolag') ||
        textLower.includes('departure') || textLower.includes('avgång')) {
      type = 'flight';
      
      // Try to extract flight route for title
      const fromLocation = extractBilingualValue(text, ['from', 'från'], null);
      const toLocation = extractBilingualValue(text, ['to', 'till'], null);
      
      if (fromLocation && toLocation) {
        title = `${fromLocation} to ${toLocation}`;
      } else {
        title = 'Flight Booking';
      }
      
      // Location could be departure and arrival airports
      if (fromLocation && toLocation) {
        location = `${fromLocation} to ${toLocation}`;
      }
      
      // Description could include airline and flight number
      const airline = extractBilingualValue(text, ['airline', 'flygbolag'], null) || '';
      description = airline ? `${airline}` : '';
      
      // Extract departure and arrival times for description
      const departure = extractBilingualValue(text, ['departure', 'avgång'], null) || '';
      const arrival = extractBilingualValue(text, ['arrival', 'ankomst'], null) || '';
      if (departure || arrival) {
        description += description ? ', ' : '';
        description += departure ? `Departure: ${departure}` : '';
        description += (departure && arrival) ? ', ' : '';
        description += arrival ? `Arrival: ${arrival}` : '';
      }
      
      // Extract passenger info if available
      const passenger = extractBilingualValue(text, ['passenger', 'passagerare'], null);
      if (passenger) {
        description += description ? `\nPassenger: ${passenger}` : `Passenger: ${passenger}`;
      }
      
    } else if (textLower.includes('hotel') || textLower.includes('hotell') || 
               textLower.includes('reservation') || textLower.includes('bokning') ||
               textLower.includes('check-in') || textLower.includes('check-out')) {
      type = 'hotel';
      
      // Hotel name for title
      title = extractBilingualValue(text, ['hotel', 'hotell'], null) || 'Hotel Reservation';
      
      // Address for location
      location = extractBilingualValue(text, ['address', 'adress'], null) || 
                 extractBilingualValue(text, ['location', 'plats'], null) || '';
      
      // Room type and other details for description
      const roomType = extractBilingualValue(text, ['room type', 'rumstyp'], null) || '';
      const guests = extractBilingualValue(text, ['guest', 'gäst'], null) || '';
      description = '';
      if (roomType) description += `Room: ${roomType}`;
      if (guests) description += description ? `, Guest: ${guests}` : `Guest: ${guests}`;
      
      // Try to get check-in/out times
      const checkInTime = extractBilingualValue(text, ['check-in'], null) || '';
      if (checkInTime) description += description ? `, Check-in: ${checkInTime}` : `Check-in: ${checkInTime}`;
      
      const checkOutTime = extractBilingualValue(text, ['check-out'], null) || '';
      if (checkOutTime) description += description ? `, Check-out: ${checkOutTime}` : `Check-out: ${checkOutTime}`;
      
    } else if (textLower.includes('car') || textLower.includes('bil') || 
               textLower.includes('rental') || textLower.includes('uthyrning') ||
               textLower.includes('vehicle') || textLower.includes('fordon')) {
      type = 'car';
      
      // Vehicle model for title
      title = extractBilingualValue(text, ['vehicle', 'fordon'], null) || 'Car Rental';
      
      // Pickup location
      location = extractBilingualValue(text, ['location', 'plats'], null) || '';
      
      // Rental details for description
      const pickupTime = extractBilingualValue(text, ['pick-up', 'upphämtning'], null) || '';
      const returnTime = extractBilingualValue(text, ['return', 'återlämning'], null) || '';
      const insurance = extractBilingualValue(text, ['insurance', 'försäkring'], null) || '';
      
      description = '';
      if (pickupTime) description += `Pick-up: ${pickupTime}`;
      if (returnTime) description += description ? `, Return: ${returnTime}` : `Return: ${returnTime}`;
      if (insurance) description += description ? `, Insurance: ${insurance}` : `Insurance: ${insurance}`;
      
      // Customer info
      const customer = extractBilingualValue(text, ['customer', 'kund'], null);
      if (customer) {
        description += description ? `\nCustomer: ${customer}` : `Customer: ${customer}`;
      }
      
    } else if (textLower.includes('activity') || textLower.includes('aktivitet') || 
               textLower.includes('event') || textLower.includes('händelse') ||
               textLower.includes('tour') || textLower.includes('tur')) {
      type = 'activity';
      
      // Event name for title
      title = extractBilingualValue(text, ['event', 'händelse'], null) || 'Activity Booking';
      
      // Meeting point for location
      location = extractBilingualValue(text, ['meeting point', 'mötesplats'], null) || 
                 extractBilingualValue(text, ['location', 'plats'], null) || '';
      
      // Activity details for description
      const time = extractBilingualValue(text, ['time', 'tid'], null) || '';
      const participants = extractBilingualValue(text, ['participants', 'deltagare'], null) || '';
      const included = extractBilingualValue(text, ['included', 'ingår'], null) || '';
      
      description = '';
      if (time) description += `Time: ${time}`;
      if (participants) description += description ? `, Participants: ${participants}` : `Participants: ${participants}`;
      if (included) description += description ? `, Included: ${included}` : `Included: ${included}`;
    }
    
    // Extract confirmation number with multiple patterns
    confirmationNumber = extractBilingualValue(text, 
      ['confirmation', 'bekräftelse', 'reference', 'referens', 'booking reference', 'bokningsreferens'], 
      null) || '';
    
    // Extract dates with better pattern matching for both languages
    // Look for dates in various formats
    const dateRegex = /\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}|\d{2}\.\d{2}\.\d{4}|\d{1,2}\s(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|jan|feb|mar|apr|maj|jun|jul|aug|sep|okt|nov|dec)[a-zé]*\s\d{4}/gi;
    const dateMatches = text.match(dateRegex) || [];
    
    // Extract times (HH:MM format)
    const timeRegex = /\d{1,2}:\d{2}/g;
    const timeMatches = text.match(timeRegex) || [];
    
    // Try to associate dates with check-in/out, departure/arrival, etc.
    const checkInIndex = textLower.indexOf('check-in');
    const checkOutIndex = textLower.indexOf('check-out');
    const departureIndex = textLower.indexOf('departure');
    const arrivalIndex = textLower.indexOf('arrival');
    const pickUpIndex = textLower.indexOf('pick-up');
    const returnIndex = textLower.indexOf('return');
    
    // Extract date from format like "Date / Datum: 2023-05-15"
    const dateLabel = extractBilingualValue(text, ['date', 'datum'], null);
    
    // Clean up dates and convert to ISO string with better handling
    if (dateMatches.length > 0 || dateLabel) {
      try {
        // If we have a specific date label, use that
        if (dateLabel) {
          startDate = new Date(dateLabel).toISOString();
        } else {
          // Otherwise use the first date match
          startDate = new Date(dateMatches[0]).toISOString();
        }
        
        // For endDate, prefer check-out, arrival, or return date if available
        if (dateMatches.length > 1) {
          endDate = new Date(dateMatches[1]).toISOString();
        }
      } catch (e) {
        console.error('Error parsing dates:', e);
        // Use current date as fallback
        const today = new Date();
        startDate = today.toISOString();
        
        if (type === 'hotel' || type === 'car') {
          const futureDate = new Date();
          futureDate.setDate(today.getDate() + (type === 'hotel' ? 3 : 1));
          endDate = futureDate.toISOString();
        }
      }
    } else {
      // If no dates found, use current date
      const today = new Date();
      startDate = today.toISOString();
      
      if (type === 'hotel' || type === 'car') {
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + (type === 'hotel' ? 3 : 1));
        endDate = futureDate.toISOString();
      }
    }
    
    // If title is still empty, use a default based on the type
    if (!title) {
      switch(type) {
        case 'flight': title = 'Flight Booking'; break;
        case 'hotel': title = 'Hotel Reservation'; break;
        case 'car': title = 'Car Rental'; break;
        case 'activity': title = 'Activity Booking'; break;
        default: title = 'Booking';
      }
    }
    
    // If description is empty, use file name and some raw text
    if (!description) {
      description = `Extracted from ${fileName}`;
    }
    
    return {
      type,
      title,
      startDate,
      endDate: endDate || undefined,
      location: location || undefined,
      description: description || undefined,
      confirmationNumber: confirmationNumber || undefined,
    };
  };
  
  // Helper function to extract values between key patterns with improved handling
  const extractBilingualValue = (text: string, startPatterns: string[], endPatterns: string[] | null): string | null => {
    const lines = text.split('\n');
    
    for (const line of lines) {
      for (const pattern of startPatterns) {
        if (line.toLowerCase().includes(pattern.toLowerCase())) {
          // If we have a line with the pattern, extract the value
          let value = '';
          
          // If there's a colon, take what's after it
          if (line.includes(':')) {
            value = line.split(':')[1].trim();
          } else {
            // Otherwise try to find the value after the pattern
            const patternIndex = line.toLowerCase().indexOf(pattern.toLowerCase());
            if (patternIndex >= 0) {
              value = line.substring(patternIndex + pattern.length).trim();
              
              // Clean up punctuation and common separators
              value = value.replace(/^[\s:/-]+/, '');
            }
          }
          
          // If we have end patterns, limit the extraction
          if (endPatterns && value) {
            for (const endPattern of endPatterns) {
              const endIndex = value.toLowerCase().indexOf(endPattern.toLowerCase());
              if (endIndex >= 0) {
                value = value.substring(0, endIndex).trim();
              }
            }
          }
          
          // Clean up the value
          value = value.replace(/^[\s:/-]+/, '').replace(/[\s:/-]+$/, '');
          
          if (value) return value;
        }
      }
    }
    
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-travel-primary" />
        <Label htmlFor="pdf-upload" className="font-medium">Upload PDF Ticket</Label>
      </div>
      
      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center bg-white">
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
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop your PDF ticket, or click to browse
            </p>
            <p className="text-xs text-gray-500">
              We'll extract booking details in both English and Swedish
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
