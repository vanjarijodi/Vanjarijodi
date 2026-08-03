import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload size for base64 image uploads
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // AI BioData OCR Extraction Endpoint via Gemini 3.6 Flash
  app.post('/api/extract-biodata', async (req, res) => {
    try {
      const { imageBase64, mimeType = 'image/jpeg', textPrompt } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY is not configured in server environment.',
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemPrompt = `You are an expert Marathi & English BioData / Matrimony document OCR parser for Maharashtra Vanjari Matrimonial profiles.
Analyze the provided BioData image, photo, or document text and extract all details accurately into JSON.

Rules:
1. Extract Marathi or English text seamlessly.
2. If gender is not explicitly mentioned, infer from context (e.g. "वर / मुलगा" -> groom, "वधू / मुलगी" -> bride). Default to "groom" or "bride".
3. Extract names, dates (formatted as YYYY-MM-DD if possible or readable format), time of birth, places, caste (subcaste: वंजारी / NT-D), gotra, rashi, nakshatra, height, education, occupation, income, father/mother name & occupation, brothers/sisters, relative surnames (e.g. Mundhe, Sanap, Nagre, Kakad, Ghuge, etc.), mama name & place, contact numbers, email, addresses.
4. Photo Detection Rule: Check if the provided image contains a personal photo/portrait of the candidate (girl/bride or boy/groom). Set "hasCandidatePhoto": true if a person's photo is present/visible in the document image, otherwise false. Provide a brief Marathi description in "candidatePhotoDescription" (e.g. "वधूचा (मुलीचा) फोटो सापडला" or "वराचा (मुलाचा) फोटो सापडला").
5. If a field is missing, return empty string or null or appropriate default.
6. Provide clean Marathi or English strings for fields as requested.

Extract into this exact JSON structure:
{
  "fullName": "string",
  "gender": "bride" | "groom",
  "hasCandidatePhoto": boolean,
  "candidatePhotoDescription": "string",
  "dob": "YYYY-MM-DD or string",
  "birthTime": "string",
  "birthPlace": "string",
  "caste": "string",
  "subCaste": "string",
  "gotra": "string",
  "rashi": "string",
  "nakshatra": "string",
  "gan": "string",
  "nadi": "string",
  "height": "string",
  "weight": "string",
  "bloodGroup": "string",
  "complexion": "string",
  "education": "string",
  "occupation": "string",
  "companyName": "string",
  "income": "string",
  "maritalStatus": "never_married" | "divorced" | "widowed",
  "fatherName": "string",
  "fatherOccupation": "string",
  "motherName": "string",
  "motherOccupation": "string",
  "brothers": number,
  "brotherDetails": "string",
  "sisters": number,
  "sisterDetails": "string",
  "relativeSurnames": ["string"],
  "mamaName": "string",
  "mamaNative": "string",
  "mobile": "string",
  "email": "string",
  "currentAddress": "string",
  "nativeAddress": "string",
  "district": "string",
  "taluka": "string",
  "city": "string",
  "expectations": "string",
  "rawSummary": "string"
}`;

      let contentsPayload: any;

      if (imageBase64) {
        // Strip data URI prefix if present
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        contentsPayload = {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType,
              },
            },
            {
              text: textPrompt || 'Please extract all matrimony bio-data fields from this image document into JSON format.',
            },
          ],
        };
      } else if (textPrompt) {
        contentsPayload = {
          parts: [{ text: textPrompt }],
        };
      } else {
        return res.status(400).json({ error: 'Either imageBase64 or textPrompt is required' });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: contentsPayload,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '{}';
      const parsedData = JSON.parse(responseText);

      return res.json({
        success: true,
        extractedData: parsedData,
      });
    } catch (error: any) {
      console.error('Error extracting BioData via Gemini:', error);
      return res.status(500).json({
        error: 'Failed to extract BioData: ' + (error.message || 'Unknown error'),
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
