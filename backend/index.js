import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { PDFDocument, degrees } from 'pdf-lib';
import pptxgen from 'pptxgenjs';
import xlsx from 'xlsx';
import officeParser from 'officeparser';
import fs from 'fs';
import path from 'path';
import os from 'os';

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

app.post('/api/pdf/protect', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No PDF file uploaded' });
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'No password provided' });
    
    const pdfDoc = await PDFDocument.load(req.file.buffer);
    pdfDoc.encrypt({
      userPassword: password,
      ownerPassword: password,
      permissions: {
        printing: 'highResolution',
        modifying: false,
        copying: false,
      },
    });
    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Disposition', 'attachment; filename=protected.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to protect PDF', details: error.message });
  }
});

app.post('/api/pdf/unlock', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No PDF file uploaded' });
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'No password provided' });
    
    const pdfDoc = await PDFDocument.load(req.file.buffer, { password });
    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Disposition', 'attachment; filename=unlocked.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to unlock PDF or invalid password', details: error.message });
  }
});

app.post('/api/pdf/rotate', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No PDF file uploaded' });
    const angle = parseInt(req.body.degrees || '90', 10);
    
    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const pages = pdfDoc.getPages();
    pages.forEach((page) => {
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees(currentRotation + angle));
    });
    
    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Disposition', 'attachment; filename=rotated.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to rotate PDF', details: error.message });
  }
});

app.post('/api/pdf/extract-text', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No PDF file uploaded' });
    const data = await pdfParse(req.file.buffer);
    res.json({ text: data.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to extract text', details: error.message });
  }
});

app.post('/api/pdf/merge', upload.array('pdfs', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ error: 'Please upload at least 2 PDFs to merge' });
    }
    
    const mergedPdf = await PDFDocument.create();
    
    for (const file of req.files) {
      const pdfDoc = await PDFDocument.load(file.buffer);
      const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    
    const pdfBytes = await mergedPdf.save();
    res.setHeader('Content-Disposition', 'attachment; filename=merged.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to merge PDFs', details: error.message });
  }
});

app.post('/api/pdf/to-powerpoint', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }
    
    // Extract text from the PDF
    const data = await pdfParse(req.file.buffer);
    const pdfText = data.text;
    
    // Split text into slides (by newlines or chunks of 1000 characters)
    const paragraphs = pdfText.split('\n').filter(p => p.trim().length > 10);
    
    const pres = new pptxgen();

    if (paragraphs.length === 0) {
      // Empty presentation
      pres.addSlide().addText("No text found in PDF", { x: 1, y: 1, fontSize: 18 });
    } else {
      // Group paragraphs into chunks of 3 for each slide to avoid overcrowding
      for (let i = 0; i < paragraphs.length; i += 3) {
        const slide = pres.addSlide();
        const slideText = paragraphs.slice(i, i + 3).join('\n\n');
        slide.addText(slideText, {
          x: 0.5,
          y: 0.5,
          w: '90%',
          h: '90%',
          fontSize: 14,
          align: 'left',
          valign: 'top',
        });
      }
    }

    // Generate buffer
    const buffer = await pres.write({ outputType: 'nodebuffer' });
    
    // Send back to client
    res.setHeader('Content-Disposition', 'attachment; filename=converted.pptx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.send(buffer);
  } catch (error) {
    console.error('PDF to PowerPoint Error:', error);
    res.status(500).json({ error: 'Failed to convert PDF to PowerPoint', details: error.message });
  }
});

app.post('/api/pdf/to-excel', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }
    
    // Extract text from the PDF
    const data = await pdfParse(req.file.buffer);
    const pdfText = data.text;
    
    // Split text into rows and columns
    // Very rudimentary: split by newline for rows, and multiple spaces/tabs for columns
    const rows = pdfText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const sheetData = rows.map(row => row.split(/\s{2,}|\t/).map(cell => cell.trim()));
    
    // Create workbook and worksheet
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet(sheetData);
    xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
    
    // Generate buffer
    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    // Send back to client
    res.setHeader('Content-Disposition', 'attachment; filename=converted.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error('PDF to Excel Error:', error);
    res.status(500).json({ error: 'Failed to convert PDF to Excel', details: error.message });
  }
});

app.post('/api/powerpoint/to-pdf', upload.single('powerpoint'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PowerPoint file uploaded' });
    }
    
    // officeparser needs a file path, so we temporarily write the buffer to disk
    const tempFilePath = path.join(os.tmpdir(), `temp-${Date.now()}-${req.file.originalname}`);
    await fs.promises.writeFile(tempFilePath, req.file.buffer);
    
    // Parse the text
    const pptText = await officeParser.parseOfficeAsync(tempFilePath);
    
    // Clean up temp file
    await fs.promises.unlink(tempFilePath);
    
    // Split text into lines/paragraphs
    const lines = pptText.split('\n').filter(l => l.trim().length > 0);

    // Create a new PDF and write text to it
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();
    let y = page.getHeight() - 50;
    const { width, height } = page.getSize();
    
    for (const line of lines) {
      if (y < 50) {
        page = pdfDoc.addPage();
        y = height - 50;
      }
      
      // A very basic wrapping mechanism for long lines could go here, but for simplicity we'll just draw the text.
      // pdf-lib's drawText doesn't auto-wrap out of the box, but this is a structural fallback.
      page.drawText(line.substring(0, 100), { x: 50, y: y, size: 12 });
      y -= 20;
    }
    
    const pdfBytes = await pdfDoc.save();
    const buffer = Buffer.from(pdfBytes);
    
    res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(buffer);
  } catch (error) {
    console.error('PowerPoint to PDF Error:', error);
    res.status(500).json({ error: 'Failed to convert PowerPoint to PDF', details: error.message });
  }
});

app.post('/api/pdf/universal-mock', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let pdfBytes;
    
    try {
      // Try to parse the uploaded file as a PDF
      const pdfDoc = await PDFDocument.load(req.file.buffer);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { height } = firstPage.getSize();
      
      // Stamp it to show it was processed
      firstPage.drawText('PROCESSED BY PDF PRO', {
        x: 50,
        y: height - 50,
        size: 30,
        color: undefined, // Default black
        opacity: 0.5,
      });
      
      pdfBytes = await pdfDoc.save();
    } catch (err) {
      // If it's an image or something else, create a new PDF
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const { height } = page.getSize();
      page.drawText('PROCESSED BY PDF PRO', { x: 50, y: height - 50, size: 30 });
      page.drawText(`Original file: ${req.file.originalname}`, { x: 50, y: height - 100, size: 15 });
      page.drawText('Note: This is a universal fallback mock document.', { x: 50, y: height - 150, size: 15 });
      
      pdfBytes = await pdfDoc.save();
    }
    
    const buffer = Buffer.from(pdfBytes);
    res.setHeader('Content-Disposition', 'attachment; filename=processed.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(buffer);
  } catch (error) {
    console.error('Universal Mock Error:', error);
    res.status(500).json({ error: 'Failed to process file', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
