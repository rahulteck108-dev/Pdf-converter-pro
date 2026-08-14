import { useState } from 'react';
import axios from 'axios';
import FileUpload from '../components/FileUpload';

const SplitPdf = () => {
  const [files, setFiles] = useState([]);
  const [range, setRange] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSplit = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file to split.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    const formData = new FormData();
    formData.append('file', files[0]);
    if (range) {
        formData.append('range', range);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/pdf/split', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setSuccess('PDF split successfully! Downloading...');
      console.log('Starting direct download from:', response.data.downloadUrl);
      setTimeout(() => { 
        const link = document.createElement('a');
        link.href = response.data.downloadUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during split.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Split PDF file</h1>
        <p className="text-lg text-gray-600">Extract pages from your PDF or save each page as a separate PDF.</p>
      </div>

      <FileUpload 
        files={files} 
        setFiles={setFiles} 
        accept={{ 'application/pdf': ['.pdf'] }} 
        multiple={false}
        title="Select PDF file"
      />

      {files.length > 0 && (
          <div className="mt-6 flex flex-col items-center justify-center">
              <label className="text-gray-700 font-medium mb-2">Custom Range (e.g., 1-3)</label>
              <input 
                type="text" 
                placeholder="Leave blank to extract all"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="border rounded px-4 py-2 w-64 text-center focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
          </div>
      )}

      {error && <div className="mt-4 text-center text-red-500 font-medium">{error}</div>}
      {success && <div className="mt-4 text-center text-green-500 font-medium">{success}</div>}

      <div className="mt-8 text-center">
        <button 
          onClick={handleSplit}
          disabled={loading || files.length === 0}
          className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {loading ? 'Splitting...' : 'Split PDF'}
        </button>
      </div>
    </div>
  );
};

export default SplitPdf;
