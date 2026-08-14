import { useState } from 'react';
import axios from 'axios';
import FileUpload from '../components/FileUpload';

const WatermarkPdf = () => {
  const [files, setFiles] = useState([]);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleWatermark = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file.');
      return;
    }
    if (!watermarkText.trim()) {
      setError('Please enter watermark text.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('text', watermarkText);

    try {
      const response = await axios.post('http://localhost:5000/api/pdf/watermark', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setSuccess('Watermark added successfully! Downloading...');
      console.log('Starting direct download from:', response.data.downloadUrl);
      setTimeout(() => { 
        const link = document.createElement('a');
        link.href = response.data.downloadUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during watermarking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Add Watermark</h1>
        <p className="text-lg text-gray-600">Stamp an image or text over your PDF in seconds.</p>
      </div>

      <FileUpload 
        files={files} 
        setFiles={setFiles} 
        accept={{ 'application/pdf': ['.pdf'] }} 
        multiple={false}
        title="Select PDF file"
      />

      {files.length > 0 && (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Watermark Text</label>
          <input 
            type="text"
            value={watermarkText} 
            onChange={(e) => setWatermarkText(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. CONFIDENTIAL or DRAFT"
          />
        </div>
      )}

      {error && <div className="mt-4 text-center text-red-500 font-medium">{error}</div>}
      {success && <div className="mt-4 text-center text-green-500 font-medium">{success}</div>}

      <div className="mt-8 text-center">
        <button 
          onClick={handleWatermark}
          disabled={loading || files.length === 0}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {loading ? 'Adding Watermark...' : 'Add Watermark'}
        </button>
      </div>
    </div>
  );
};

export default WatermarkPdf;
