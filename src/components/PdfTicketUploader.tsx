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
    // In a real application, we would use pdfjs or another PDF parsing library
    // For the demo, we'll use enhanced simulation with multilingual support
    
    // Simulate the text content extraction from PDF
    const extractedText = await simulatePdfTextExtraction(file);
    console.log('Extracted text from PDF:', extractedText);
    
    // Process the extracted text to identify booking details
    const bookingData = extractBookingDetailsFromText(extractedText, file.name);
    
    // Show success message
    toast({
      title: 'PDF processed successfully',
      description: 'Booking information extracted from the PDF.',
    });
    
    // Pass extracted data to parent component
    onExtractedData(bookingData);
  };

  // Simulate PDF text extraction with multilingual awareness
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
          `;
        } else if (fileName.includes('hotel') || fileName.includes('hotell')) {
          extractedText = `
            HOTEL RESERVATION / HOTELLBOKNING
            -------------------------------
            Confirmation / Bekräftelse: HD98765
            Guest / Gäst: John Smith
            Hotel / Hotell: Grand Hotel Stockholm
            Check-in: ${new Date().toLocaleDateString('sv-SE')}
            Check-out: ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('sv-SE')}
            Room type / Rumstyp: Double / Dubbel
            Address / Adress: Södra Blasieholmshamnen 8, 111 48 Stockholm
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
          `;
        } else {
          extractedText = `
            GENERAL BOOKING / GENERELL BOKNING
            ------------------------------
            Reference number / Referensnummer: GEN67890
            Description / Beskrivning: ${file.name.replace('.pdf', '')}
            Date / Datum: ${new Date().toLocaleDateString('sv-SE')}
            Location / Plats: Stockholm, Sweden / Sverige
          `;
        }
        
        resolve(extractedText);
      }, 1500); // Simulate processing time
    });
  };

  // Extract booking details from the text with multilingual support
  const extractBookingDetailsFromText = (text: string, fileName: string): any => {
    console.log('Processing text to extract booking details');
    
    // Determine booking type - checking both English and Swedish terms
    let type: BookingType = 'other';
    let title = 'Extracted Booking';
    let location = '';
    let confirmationNumber = '';
    
    const textLower = text.toLowerCase();
    
    // Detect booking type
    if (textLower.includes('flight') || textLower.includes('flyg') || 
        textLower.includes('airline') || textLower.includes('flygbolag')) {
      type = 'flight';
      title = extractBilingualValue(text, ['from', 'från'], ['to', 'till']) || 'Flight Booking';
    } else if (textLower.includes('hotel') || textLower.includes('hotell') || 
               textLower.includes('reservation') || textLower.includes('bokning')) {
      type = 'hotel';
      title = extractBilingualValue(text, ['hotel', 'hotell'], null) || 'Hotel Reservation';
    } else if (textLower.includes('car') || textLower.includes('bil') || 
               textLower.includes('rental') || textLower.includes('uthyrning')) {
      type = 'car';
      title = extractBilingualValue(text, ['vehicle', 'fordon'], null) || 'Car Rental';
    } else if (textLower.includes('activity') || textLower.includes('aktivitet') || 
               textLower.includes('event') || textLower.includes('händelse')) {
      type = 'activity';
      title = extractBilingualValue(text, ['event', 'händelse'], null) || 'Activity Booking';
    }
    
    // Extract location
    location = extractBilingualValue(text, ['location', 'plats', 'address', 'adress'], null) || 
               extractBilingualValue(text, ['hotel', 'hotell'], null) || 
               'Stockholm, Sweden';
    
    // Extract confirmation number
    confirmationNumber = extractBilingualValue(text, 
      ['confirmation', 'bekräftelse', 'reference', 'referens', 'booking reference', 'bokningsreferens'], 
      null) || `PDF-${Math.floor(Math.random() * 10000)}`;
    
    // Extract dates - look for patterns that might indicate dates
    const dateRegex = /\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}|\d{2}\.\d{2}\.\d{4}|\d{1,2}\s(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|jan|feb|mar|apr|maj|jun|jul|aug|sep|okt|nov|dec)[a-zé]*\s\d{4}/gi;
    const dateMatches = text.match(dateRegex) || [];
    
    // Clean up dates and convert to ISO string
    const dates = dateMatches.map(d => {
      try {
        return new Date(d).toISOString();
      } catch (e) {
        return null;
      }
    }).filter(Boolean);
    
    // If no dates found in text, use current date for startDate and future date for endDate
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + (type === 'hotel' ? 3 : 1)); // Default duration based on type
    
    const startDate = dates[0] || today.toISOString();
    const endDate = dates[1] || (type !== 'activity' ? futureDate.toISOString() : undefined);
    
    // Create description using available information
    const description = `Extracted from ${fileName}\n\n${text.trim().substring(0, 200)}...`;
    
    return {
      type,
      title,
      startDate,
      endDate,
      location,
      description,
      confirmationNumber,
    };
  };
  
  // Helper function to extract values between key patterns
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
