import express from 'express';
import multer from 'multer';
import path from 'path';
import { parsePdf } from '../services/pdfParser';

const router = express.Router();

// Konfigurera multer för PDF-uppladdning
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.pdf');
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Endast PDF-filer är tillåtna!'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB gräns
  }
});

router.post('/parse', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Ingen PDF-fil laddades upp' });
    }

    const result = await parsePdf(req.file.path);
    
    try {
      // Försök parse:a resultatet som JSON om det inte redan är ett objekt
      const parsedResult = typeof result === 'string' ? JSON.parse(result) : result;
      res.json(parsedResult);
    } catch (parseError) {
      console.error('Fel vid parsing av resultat:', parseError);
      res.status(500).json({ error: 'Kunde inte tolka resultatet från PDF-parsningen' });
    }
  } catch (error) {
    console.error('Fel vid parsning av PDF:', error);
    res.status(500).json({ 
      error: 'Ett fel uppstod vid parsning av PDF-filen',
      details: error instanceof Error ? error.message : 'Okänt fel'
    });
  }
});

export default router; 