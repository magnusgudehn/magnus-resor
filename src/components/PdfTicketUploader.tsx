import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileText, Upload, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { BookingType } from '@/types';
import * as pdfjs from 'pdfjs-dist';

// Initialize PDF.js worker
const PdfTicketUploader: React.FC<{
  onExtractedData: (data: {
    type: BookingType;
    title: string;
    startDate: string;
    endDate?: string;
    location?: string;
    description?: string;
    confirmationNumber?: string;
  }) => void;
}> = ({ onExtractedData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  
  // Initialize PDF.js worker when component mounts
  useEffect(() => {
    const workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
  }, []);

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
      toast.error('Failed to extract booking information from the PDF.');
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

  // Process PDF and extract booking information using PDF.js
  const processPdf = async (file: File, arrayBuffer: ArrayBuffer) => {
    try {
      // Load PDF document using PDF.js
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      console.log(`PDF loaded: ${pdf.numPages} page(s)`);
      
      // Extract text from all pages
      let extractedText = '';
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        extractedText += pageText + ' ';
      }
      
      console.log('Extracted text from PDF:', extractedText);
      
      // Process the extracted text to identify booking details
      const bookingData = extractBookingDetailsFromText(extractedText, file.name);
      
      // Show success message
      toast.success('PDF processed successfully');
      
      // Pass extracted data to parent component
      onExtractedData(bookingData);
    } catch (error) {
      console.error('Error parsing PDF:', error);
      toast.error('Failed to read the PDF file. Please try again with a different file.');
      
      // As a fallback, try the simple extraction method based on filename
      const fallbackData = extractDataFromFilename(file.name);
      if (fallbackData) {
        console.log('Using fallback extraction method');
        onExtractedData(fallbackData);
        toast.success('Used filename-based extraction as a fallback');
      }
    }
  };

  // Fallback method: extract booking type from filename
  const extractDataFromFilename = (filename: string): any => {
    const filenameLower = filename.toLowerCase();
    const today = new Date();
    const tomorrowDate = new Date();
    tomorrowDate.setDate(today.getDate() + 1);
    
    let type: BookingType = 'other';
    let title = filename.replace('.pdf', '');
    
    if (filenameLower.includes('flight') || filenameLower.includes('airline')) {
      type = 'flight';
      title = 'Flight Booking';
    } else if (filenameLower.includes('hotel') || filenameLower.includes('accommodation')) {
      type = 'hotel';
      title = 'Hotel Reservation';
    } else if (filenameLower.includes('car') || filenameLower.includes('rental')) {
      type = 'car';
      title = 'Car Rental';
    } else if (filenameLower.includes('activity') || filenameLower.includes('tour')) {
      type = 'activity';
      title = 'Activity Booking';
    }
    
    return {
      type,
      title,
      startDate: today.toISOString(),
      endDate: tomorrowDate.toISOString(),
      description: `Extracted from ${filename}`,
      confirmationNumber: `AUTO-${Math.floor(Math.random() * 100000)}`
    };
  };

  // Enhanced extraction of booking details from text
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
    if (textLower.includes('flight') || textLower.includes('airline') || 
        textLower.includes('boarding') || textLower.includes('departure') || 
        textLower.includes('arrival') || textLower.includes('passenger') ||
        textLower.includes('airport')) {
      type = 'flight';
      
      // Try to extract flight route for title
      const fromMatch = text.match(/(?:from|departure|depart)(?:\s*:)?\s*([A-Za-z\s]+(?:\([A-Z]{3}\))?)/i);
      const toMatch = text.match(/(?:to|arrival|destination)(?:\s*:)?\s*([A-Za-z\s]+(?:\([A-Z]{3}\))?)/i);
      
      if (fromMatch && toMatch) {
        title = `${fromMatch[1].trim()} to ${toMatch[1].trim()}`;
      } else {
        title = 'Flight Booking';
      }
      
      // Location could be departure and arrival airports
      const airportMatch = text.match(/([A-Z]{3})\s*(?:-|to|→)\s*([A-Z]{3})/);
      if (airportMatch) {
        location = `${airportMatch[1]} to ${airportMatch[2]}`;
      } else if (fromMatch && toMatch) {
        location = `${fromMatch[1].trim()} to ${toMatch[1].trim()}`;
      }
      
      // Try to extract airline
      const airlineMatch = text.match(/(?:airline|operated by|carrier)(?:\s*:)?\s*([A-Za-z\s]+)/i);
      if (airlineMatch) {
        description = `Airline: ${airlineMatch[1].trim()}`;
      }
      
      // Try to extract flight number
      const flightNumberMatch = text.match(/(?:flight|flight number|flight no)(?:\s*[:.]?)?\s*([A-Z]{2}\s*\d{1,4}|\d{1,4})/i);
      if (flightNumberMatch) {
        description += description ? `, Flight: ${flightNumberMatch[1].trim()}` : `Flight: ${flightNumberMatch[1].trim()}`;
      }
      
      // Try to extract confirmation/booking reference
      const confirmationMatch = text.match(/(?:confirmation|booking|reference|pnr|reservation)(?:\s*[:.]?)?\s*([A-Z0-9]{5,8})/i);
      if (confirmationMatch) {
        confirmationNumber = confirmationMatch[1].trim();
      }
      
    } else if (textLower.includes('hotel') || textLower.includes('reservation') || 
               textLower.includes('accommodation') || textLower.includes('check-in') || 
               textLower.includes('check-out') || textLower.includes('guest')) {
      type = 'hotel';
      
      // Hotel name for title
      const hotelMatch = text.match(/(?:hotel|property|accommodation|stay at)(?:\s*:)?\s*([A-Za-z0-9\s',.]+)/i);
      title = hotelMatch ? hotelMatch[1].trim() : 'Hotel Reservation';
      
      // Address for location
      const addressMatch = text.match(/(?:address|location|situated at)(?:\s*:)?\s*([A-Za-z0-9\s',.]+)/i);
      if (addressMatch) {
        location = addressMatch[1].trim();
      }
      
      // Room type and other details for description
      const roomTypeMatch = text.match(/(?:room type|room|accommodation type)(?:\s*:)?\s*([A-Za-z0-9\s]+)/i);
      const guestsMatch = text.match(/(?:guest|name|traveler|customer)(?:\s*:)?\s*([A-Za-z\s]+)/i);
      
      description = '';
      if (roomTypeMatch) description += `Room: ${roomTypeMatch[1].trim()}`;
      if (guestsMatch) description += description ? `, Guest: ${guestsMatch[1].trim()}` : `Guest: ${guestsMatch[1].trim()}`;
      
      // Confirmation number
      const confirmationMatch = text.match(/(?:confirmation|booking|reference|reservation)(?:\s*[:.]?)?\s*([A-Z0-9]{5,10})/i);
      if (confirmationMatch) {
        confirmationNumber = confirmationMatch[1].trim();
      }
      
    } else if (textLower.includes('car') || textLower.includes('rental') || 
               textLower.includes('vehicle') || textLower.includes('pick-up') || 
               textLower.includes('return') || textLower.includes('driver')) {
      type = 'car';
      
      // Vehicle model for title
      const vehicleMatch = text.match(/(?:vehicle|car|model)(?:\s*:)?\s*([A-Za-z0-9\s]+)/i);
      title = vehicleMatch ? vehicleMatch[1].trim() : 'Car Rental';
      
      // Pickup location
      const locationMatch = text.match(/(?:location|pick-?up location|collect at|branch)(?:\s*:)?\s*([A-Za-z0-9\s',.]+)/i);
      if (locationMatch) {
        location = locationMatch[1].trim();
      }
      
      // Rental details for description
      const rentalCompanyMatch = text.match(/(?:rental company|provider|supplied by)(?:\s*:)?\s*([A-Za-z\s]+)/i);
      
      description = '';
      if (rentalCompanyMatch) description += `Company: ${rentalCompanyMatch[1].trim()}`;
      
      // Confirmation number
      const confirmationMatch = text.match(/(?:confirmation|booking|reference|reservation)(?:\s*[:.]?)?\s*([A-Z0-9]{5,10})/i);
      if (confirmationMatch) {
        confirmationNumber = confirmationMatch[1].trim();
      }
      
    } else if (textLower.includes('activity') || textLower.includes('tour') || 
               textLower.includes('event') || textLower.includes('experience') || 
               textLower.includes('ticket') || textLower.includes('attraction')) {
      type = 'activity';
      
      // Event name for title
      const eventMatch = text.match(/(?:event|activity|tour|experience|name)(?:\s*:)?\s*([A-Za-z0-9\s',.]+)/i);
      title = eventMatch ? eventMatch[1].trim() : 'Activity Booking';
      
      // Meeting point for location
      const locationMatch = text.match(/(?:meeting point|location|venue|place|address)(?:\s*:)?\s*([A-Za-z0-9\s',.]+)/i);
      if (locationMatch) {
        location = locationMatch[1].trim();
      }
      
      // Activity details for description
      const participantsMatch = text.match(/(?:participants|persons|guests|group size)(?:\s*:)?\s*(\d+)/i);
      
      description = '';
      if (participantsMatch) description += `Participants: ${participantsMatch[1].trim()}`;
      
      // Confirmation number
      const confirmationMatch = text.match(/(?:confirmation|booking|reference|reservation)(?:\s*[:.]?)?\s*([A-Z0-9]{5,10})/i);
      if (confirmationMatch) {
        confirmationNumber = confirmationMatch[1].trim();
      }
    }
    
    // Extract dates - looking for common date formats
    const dateRegex = /\b(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}|\d{4}[\/-]\d{1,2}[\/-]\d{1,2}|\d{1,2}\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s\d{2,4})\b/gi;
    const dateMatches = text.match(dateRegex) || [];
    
    // Convert found dates to ISO format
    let possibleDates: Date[] = [];
    dateMatches.forEach(dateStr => {
      try {
        const parsedDate = new Date(dateStr);
        if (!isNaN(parsedDate.getTime())) {
          possibleDates.push(parsedDate);
        }
      } catch (e) {
        console.error('Error parsing date:', dateStr, e);
      }
    });
    
    // Try to extract dates associated with specific labels
    const checkInMatch = text.match(/check[\s-]?in(?:\s*:)?\s*([A-Za-z0-9\s,.\/\-]+)/i);
    const checkOutMatch = text.match(/check[\s-]?out(?:\s*:)?\s*([A-Za-z0-9\s,.\/\-]+)/i);
    const departureMatch = text.match(/depart(?:ure)?(?:\s*date)?(?:\s*:)?\s*([A-Za-z0-9\s,.\/\-]+)/i);
    const arrivalMatch = text.match(/arrival(?:\s*date)?(?:\s*:)?\s*([A-Za-z0-9\s,.\/\-]+)/i);
    const dateMatch = text.match(/date(?:\s*:)?\s*([A-Za-z0-9\s,.\/\-]+)/i);
    
    // Try to parse these specific dates
    if (checkInMatch) {
      try {
        const checkInDate = new Date(checkInMatch[1].trim());
        if (!isNaN(checkInDate.getTime())) {
          startDate = checkInDate.toISOString();
        }
      } catch (e) { console.error('Error parsing check-in date', e); }
    }
    
    if (checkOutMatch) {
      try {
        const checkOutDate = new Date(checkOutMatch[1].trim());
        if (!isNaN(checkOutDate.getTime())) {
          endDate = checkOutDate.toISOString();
        }
      } catch (e) { console.error('Error parsing check-out date', e); }
    }
    
    if (departureMatch) {
      try {
        const departureDate = new Date(departureMatch[1].trim());
        if (!isNaN(departureDate.getTime())) {
          startDate = departureDate.toISOString();
        }
      } catch (e) { console.error('Error parsing departure date', e); }
    }
    
    if (arrivalMatch && type === 'flight') {
      try {
        const arrivalDate = new Date(arrivalMatch[1].trim());
        if (!isNaN(arrivalDate.getTime())) {
          endDate = arrivalDate.toISOString();
        }
      } catch (e) { console.error('Error parsing arrival date', e); }
    }
    
    if (dateMatch && !startDate) {
      try {
        const eventDate = new Date(dateMatch[1].trim());
        if (!isNaN(eventDate.getTime())) {
          startDate = eventDate.toISOString();
        }
      } catch (e) { console.error('Error parsing event date', e); }
    }
    
    // If we have found possible dates but not assigned them yet
    if (possibleDates.length > 0 && !startDate) {
      // Sort dates chronologically
      possibleDates.sort((a, b) => a.getTime() - b.getTime());
      
      // Use first date as start date
      startDate = possibleDates[0].toISOString();
      
      // Use second date as end date if available and it's after start date
      if (possibleDates.length > 1 && possibleDates[1] > possibleDates[0]) {
        endDate = possibleDates[1].toISOString();
      }
    }
    
    // If we still don't have dates, use current date
    if (!startDate) {
      const today = new Date();
      startDate = today.toISOString();
      
      if ((type === 'hotel' || type === 'car') && !endDate) {
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
        default: title = fileName.replace('.pdf', '');
      }
    }
    
    // If description is empty, use file name
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
