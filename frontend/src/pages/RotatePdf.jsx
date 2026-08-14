import { useState } from 'react';
import axios from 'axios';
import FileUpload from '../components/FileUpload';

const RotatePdf = () => {
  const [files, setFiles] = useState([]);
  const [angle, setAngle] = useState('90');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRotate = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('angle', angle);

    try {
      const response = await axios.post('http://localhost:5000/api/pdf/rotate', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setSuccess('PDF rotated successfully! Downloading...');
      console.log('Starting direct download from:', response.data.downloadUrl);
      setTimeout(() => { 
        const link = document.createElement('a');
        link.href = response.data.downloadUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during rotation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Rotate PDF</h1>
        <p className="text-lg text-gray-600">Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!</p>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Rotation Angle</label>
          <select 
            value={angle} 
            onChange={(e) => setAngle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="90">90 Degrees (Right)</option>
            <option value="180">180 Degrees (Upside Down)</option>
            <option value="270">270 Degrees (Left)</option>
          </select>
        </div>
      )}

      {error && <div className="mt-4 text-center text-red-500 font-medium">{error}</div>}
      {success && <div className="mt-4 text-center text-green-500 font-medium">{success}</div>}

      <div className="mt-8 text-center">
        <button 
          onClick={handleRotate}
          disabled={loading || files.length === 0}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {loading ? 'Rotating...' : 'Rotate PDF'}
        </button>
      </div>
    </div>
  );
};

export default RotatePdf;
