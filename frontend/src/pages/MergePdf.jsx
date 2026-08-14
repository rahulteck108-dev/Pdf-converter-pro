import { useState } from 'react';
import axios from 'axios';
import FileUpload from '../components/FileUpload';

const MergePdf = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post('http://localhost:5000/api/pdf/merge', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setSuccess('PDFs merged successfully! Downloading...');
      console.log('Starting direct download from:', response.data.downloadUrl);
      setTimeout(() => { 
        const link = document.createElement('a');
        link.href = response.data.downloadUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during merge.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Merge PDF files</h1>
        <p className="text-lg text-gray-600">Combine PDFs in the order you want with the easiest PDF merger available.</p>
      </div>

      <FileUpload 
        files={files} 
        setFiles={setFiles} 
        accept={{ 'application/pdf': ['.pdf'] }} 
        multiple={true}
        title="Select PDF files"
      />

      {error && <div className="mt-4 text-center text-red-500 font-medium">{error}</div>}
      {success && <div className="mt-4 text-center text-green-500 font-medium">{success}</div>}

      <div className="mt-8 text-center">
        <button 
          onClick={handleMerge}
          disabled={loading || files.length < 2}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {loading ? 'Merging...' : 'Merge PDF'}
        </button>
      </div>
    </div>
  );
};

export default MergePdf;
