import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useToast } from './ui/use-toast';

interface ParsedBooking {
  type: string;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  confirmationNumber: string;
  from?: string;
  to?: string;
  airline?: string;
  flightNumber?: string;
}

export function PdfUploader() {
  const [isLoading, setIsLoading] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedBooking | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        variant: "destructive",
        title: "Fel filformat",
        description: "Vänligen välj en PDF-fil"
      });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Kunde inte parsa PDF-filen');
      }

      const data = await response.json();
      setParsedData(data);
      toast({
        title: "PDF parsad",
        description: "Bokningsinformationen har extraherats"
      });

    } catch (error) {
      console.error('Fel vid uppladdning:', error);
      toast({
        variant: "destructive",
        title: "Något gick fel",
        description: "Kunde inte parsa PDF-filen"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Ladda upp boknings-PDF</h2>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={isLoading}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
          />
          {isLoading && <p>Bearbetar PDF...</p>}
        </div>
      </Card>

      {parsedData && (
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Extraherad information</h3>
          <pre className="bg-slate-50 p-4 rounded overflow-auto">
            {JSON.stringify(parsedData, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
} 