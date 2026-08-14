import { useState } from 'react';
import axios from 'axios';
import FileUpload from '../components/FileUpload';

const ExtractText = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [extractedText, setExtractedText] = useState('');

  const handleExtract = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file.');
      return;
    }
    
    setLoading(true);
    setError('');
    setExtractedText('');
    
    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      const response = await axios.post('http://localhost:5000/api/pdf/extract-text', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const extracted = response.data.text;
      if (!extracted || extracted.trim() === '') {
        setError('No text found! This seems to be a scanned PDF or an Image PDF. You need an OCR tool to extract text from images.');
        setExtractedText('');
      } else {
        setExtractedText(extracted);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during extraction.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText);
    alert('Copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Extract Text from PDF</h1>
        <p className="text-lg text-gray-600">Instantly pull all text out of a digital PDF document.</p>
      </div>

      {!extractedText ? (
        <>
          <FileUpload 
            files={files} 
            setFiles={setFiles} 
            accept={{ 'application/pdf': ['.pdf'] }} 
            multiple={false}
            title="Select PDF file"
          />

          {error && <div className="mt-4 text-center text-red-500 font-medium">{error}</div>}

          <div className="mt-8 text-center">
            <button 
              onClick={handleExtract}
              disabled={loading || files.length === 0}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {loading ? 'Extracting...' : 'Extract Text'}
            </button>
          </div>
        </>
      ) : (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Extracted Text</h3>
            <button 
              onClick={copyToClipboard}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition"
            >
              Copy Text
            </button>
          </div>
          <textarea 
            className="w-full h-96 p-4 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            readOnly
            value={extractedText}
          />
          <div className="mt-6 text-center">
            <button 
              onClick={() => { setExtractedText(''); setFiles([]); }}
              className="text-emerald-600 hover:text-emerald-700 font-medium underline"
            >
              Extract another PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtractText;
