import { promises as fs } from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Ladda miljövariabler
dotenv.config();

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY?.trim();
console.log('Använder Mistral API-nyckel:', MISTRAL_API_KEY?.substring(0, 5) + '...');
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

interface MistralResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function parsePdf(filePath: string): Promise<any> {
  try {
    console.log('Försöker läsa PDF-fil från:', filePath);
    
    // Kontrollera att filen existerar
    try {
      await fs.access(filePath);
    } catch (error) {
      console.error('Filen existerar inte:', filePath);
      throw new Error('PDF-filen kunde inte hittas');
    }

    // Läs PDF-filen
    console.log('Läser PDF-fil...');
    const fileBuffer = await fs.readFile(filePath);
    console.log('PDF-fil läst, storlek:', fileBuffer.length, 'bytes');

    // Extrahera text från PDF
    console.log('Extraherar text från PDF...');
    const pdfData = await pdfParse(fileBuffer);
    console.log('PDF-text extraherad, längd:', pdfData.text.length, 'tecken');
    console.log('Första 200 tecken av texten:', pdfData.text.substring(0, 200));

    // Skapa system prompt för Mistral AI
    const systemPrompt = `Du är en AI-assistent som hjälper till att extrahera bokningsinformation från PDF-dokument. 
    Extrahera följande fält om de finns tillgängliga:
    - type (typ av bokning: "flight" eller "hotel")
    - title (kort beskrivande titel)
    - startDate (startdatum)
    - endDate (slutdatum)
    - location (plats)
    - description (beskrivning)
    - confirmationNumber (bokningsnummer)
    
    För flygbokningar, extrahera även:
    - from (avgångsplats)
    - to (destination)
    - airline (flygbolag)
    - flightNumber (flightnummer)
    - departureTime (avgångstid)
    - arrivalTime (ankomsttid)
    
    Returnera informationen i JSON-format.`;

    // Skapa användar prompt
    const userPrompt = `Analysera följande text från en boknings-PDF och extrahera relevant information:\n\n${pdfData.text}`;

    console.log('Anropar Mistral AI API...');
    console.log('\n=== MISTRAL PROMPTS ===');
    console.log('System prompt:');
    console.log(systemPrompt);
    console.log('\nUser prompt (första 500 tecken):');
    console.log(userPrompt.substring(0, 500) + (userPrompt.length > 500 ? '...' : ''));
    console.log('=====================\n');

    // Kontrollera att vi har en API-nyckel
    if (!MISTRAL_API_KEY) {
      throw new Error('Mistral API-nyckel saknas i miljövariablerna');
    }

    // Anropa Mistral AI API
    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'open-mistral-7b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    console.log('Mistral API anrop headers:', {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MISTRAL_API_KEY?.substring(0, 5)}...`
    });

    console.log('Mistral API svarstatus:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Mistral API fel:', errorText);
      throw new Error(`Mistral API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Mistral API svar mottaget');
    
    // Formatera och skriv ut resultatet
    const content = result.choices[0].message.content;
    console.log('\n=== PARSAD INFORMATION ===');
    console.log('Rå JSON:', content);
    try {
      const parsed = typeof content === 'string' ? JSON.parse(content) : content;
      console.log('\nFormaterad data:');
      Object.entries(parsed).forEach(([key, value]) => {
        console.log(`${key.padEnd(20)}: ${value}`);
      });
      console.log('========================\n');
    } catch (parseError) {
      console.log('Kunde inte formatera resultatet som JSON');
      console.log(content);
      console.log('========================\n');
    }
    
    // Ta bort PDF-filen efter användning
    try {
      await fs.unlink(filePath);
      console.log('PDF-fil borttagen:', filePath);
    } catch (error) {
      console.error('Kunde inte ta bort PDF-filen:', error);
    }

    return result.choices[0].message.content;
  } catch (error) {
    console.error('Detaljerat fel vid PDF-parsning:', error);
    throw error;
  }
} 