import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MergePdf from './pages/MergePdf';
import SplitPdf from './pages/SplitPdf';
import ImageToPdf from './pages/ImageToPdf';
import ExtractText from './pages/ExtractText';
import RotatePdf from './pages/RotatePdf';
import WatermarkPdf from './pages/WatermarkPdf';
import WordToPdf from './pages/WordToPdf';
import SummarizePdf from './pages/SummarizePdf';

// New Pages
import CompressPdf from './pages/CompressPdf';
import PdfToWord from './pages/PdfToWord';
import PdfToPowerPoint from './pages/PdfToPowerPoint';
import PdfToExcel from './pages/PdfToExcel';
import PowerPointToPdf from './pages/PowerPointToPdf';
import ExcelToPdf from './pages/ExcelToPdf';
import EditPdf from './pages/EditPdf';
import RepairPdf from './pages/RepairPdf';
import PageNumbers from './pages/PageNumbers';
import ScanToPdf from './pages/ScanToPdf';
import OcrPdf from './pages/OcrPdf';
import ComparePdf from './pages/ComparePdf';
import RedactPdf from './pages/RedactPdf';
import CropPdf from './pages/CropPdf';
import PdfForms from './pages/PdfForms';
import TranslatePdf from './pages/TranslatePdf';

// Extra Missing Pages
import PdfToJpg from './pages/PdfToJpg';
import JpgToPdf from './pages/JpgToPdf';
import SignPdf from './pages/SignPdf';
import HtmlToPdf from './pages/HtmlToPdf';
import UnlockPdf from './pages/UnlockPdf';
import ProtectPdf from './pages/ProtectPdf';
import OrganizePdf from './pages/OrganizePdf';
import PdfToPdfA from './pages/PdfToPdfA';
import PdfToMarkdown from './pages/PdfToMarkdown';

function RootRedirector() {
  const [shouldRedirect, setShouldRedirect] = useState(true);
  
  useEffect(() => {
    setShouldRedirect(false);
  }, []);

  if (shouldRedirect && window.location.pathname !== '/') {
    return <Navigate to="/" replace />;
  }
  return null;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <RootRedirector />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/merge" element={<MergePdf />} />
            <Route path="/split" element={<SplitPdf />} />
            <Route path="/compress" element={<CompressPdf />} />
            <Route path="/pdf-to-word" element={<PdfToWord />} />
            <Route path="/pdf-to-powerpoint" element={<PdfToPowerPoint />} />
            <Route path="/pdf-to-excel" element={<PdfToExcel />} />
            <Route path="/word-to-pdf" element={<WordToPdf />} />
            <Route path="/powerpoint-to-pdf" element={<PowerPointToPdf />} />
            <Route path="/excel-to-pdf" element={<ExcelToPdf />} />
            <Route path="/edit" element={<EditPdf />} />
            <Route path="/image-to-pdf" element={<ImageToPdf />} />
            <Route path="/extract-text" element={<ExtractText />} />
            <Route path="/rotate" element={<RotatePdf />} />
            <Route path="/watermark" element={<WatermarkPdf />} />
            <Route path="/summarize" element={<SummarizePdf />} />
            <Route path="/repair" element={<RepairPdf />} />
            <Route path="/page-numbers" element={<PageNumbers />} />
            <Route path="/scan" element={<ScanToPdf />} />
            <Route path="/ocr" element={<OcrPdf />} />
            <Route path="/compare" element={<ComparePdf />} />
            <Route path="/redact" element={<RedactPdf />} />
            <Route path="/crop" element={<CropPdf />} />
            <Route path="/forms" element={<PdfForms />} />
            <Route path="/translate" element={<TranslatePdf />} />
            <Route path="/pdf-to-jpg" element={<PdfToJpg />} />
            <Route path="/jpg-to-pdf" element={<JpgToPdf />} />
            <Route path="/sign-pdf" element={<SignPdf />} />
            <Route path="/html-to-pdf" element={<HtmlToPdf />} />
            <Route path="/unlock-pdf" element={<UnlockPdf />} />
            <Route path="/protect-pdf" element={<ProtectPdf />} />
            <Route path="/organize-pdf" element={<OrganizePdf />} />
            <Route path="/pdf-to-pdfa" element={<PdfToPdfA />} />
            <Route path="/pdf-to-markdown" element={<PdfToMarkdown />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
