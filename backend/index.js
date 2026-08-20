import express from 'express';
import cors from 'cors';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { PDFDocument } from 'pdf-lib';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const upload = multer({ storage: multer.memoryStorage() });
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'placeholder' });

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('PDF Converter API is running...');
});

app.post('/api/ai/summarize', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }
    
    // Extract text from the PDF
    const data = await pdfParse(req.file.buffer);
    const pdfText = data.text;
    
    if (!pdfText.trim()) {
      return res.status(400).json({ error: 'Could not extract text from the PDF' });
    }
    
    // Call Gemini API
    const prompt = `Please provide a concise and comprehensive summary of the following document:\n\n${pdfText.substring(0, 30000)}`; // limit chars
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    res.json({ summary: response.text });
  } catch (error) {
    console.error('AI Summarization Error:', error);
    res.status(500).json({ error: 'Failed to summarize PDF', details: error.message });
  }
});

app.post('/api/pdf/to-word', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }
    
    // Extract text from the PDF
    const data = await pdfParse(req.file.buffer);
    const pdfText = data.text;
    
    // Split text into paragraphs (rudimentary conversion)
    const textParagraphs = pdfText.split('\n').filter(p => p.trim() !== '');

    // Create a new Word document
    const doc = new Document({
      sections: [{
        properties: {},
        children: textParagraphs.map(text => 
          new Paragraph({
            children: [new TextRun(text)],
          })
        ),
      }],
    });

    // Generate buffer
    const buffer = await Packer.toBuffer(doc);
    
    // Send back to client
    res.setHeader('Content-Disposition', 'attachment; filename=converted.docx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buffer);
  } catch (error) {
    console.error('PDF to Word Error:', error);
    res.status(500).json({ error: 'Failed to convert PDF to Word', details: error.message });
  }
});

app.post('/api/pdf/compress', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }
    
    // Load the PDF Document
    const pdfDoc = await PDFDocument.load(req.file.buffer);

    // Save with useObjectStreams to compress structure
    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
    
    const buffer = Buffer.from(pdfBytes);

    // Send back to client
    res.setHeader('Content-Disposition', 'attachment; filename=compressed.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(buffer);
  } catch (error) {
    console.error('PDF Compression Error:', error);
    res.status(500).json({ error: 'Failed to compress PDF', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
