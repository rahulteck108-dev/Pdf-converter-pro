import { useState } from 'react';
import axios from 'axios';
import FileUpload from '../components/FileUpload';

const SummarizePdf = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState('');

  const handleSummarize = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSummary('');
    
    const formData = new FormData();
    formData.append('pdf', files[0]); // field name must match backend upload.single('pdf')

    try {
      const response = await axios.post('http://localhost:5000/api/ai/summarize', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const summarizedText = response.data.summary;
      if (!summarizedText || summarizedText.trim() === '') {
        setError('No summary was generated. Please try again.');
        setSummary('');
      } else {
        setSummary(summarizedText);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.details || 'An error occurred during summarization.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    alert('Copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">AI PDF Summarizer</h1>
        <p className="text-lg text-gray-600">Use Artificial Intelligence to quickly generate a comprehensive summary of your PDF document.</p>
      </div>

      {!summary ? (
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
              onClick={handleSummarize}
              disabled={loading || files.length === 0}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {loading ? 'Generating Summary...' : 'Summarize PDF with AI ✨'}
            </button>
          </div>
        </>
      ) : (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-purple-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-purple-900">AI Generated Summary</h3>
            <button 
              onClick={copyToClipboard}
              className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg font-medium transition"
            >
              Copy Summary
            </button>
          </div>
          <textarea 
            className="w-full h-96 p-6 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 leading-relaxed"
            readOnly
            value={summary}
          />
          <div className="mt-6 text-center">
            <button 
              onClick={() => { setSummary(''); setFiles([]); }}
              className="text-purple-600 hover:text-purple-700 font-medium underline"
            >
              Summarize another PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummarizePdf;
