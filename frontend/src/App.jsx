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
            <Route path="/image-to-pdf" element={<ImageToPdf />} />
            <Route path="/extract-text" element={<ExtractText />} />
            <Route path="/rotate" element={<RotatePdf />} />
            <Route path="/watermark" element={<WatermarkPdf />} />
            <Route path="/word-to-pdf" element={<WordToPdf />} />
            <Route path="/summarize" element={<SummarizePdf />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
