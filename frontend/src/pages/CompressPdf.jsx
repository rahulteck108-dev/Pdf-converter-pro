import { useState } from 'react';
import FileUpload from '../components/FileUpload';

const CompressPdf = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCompress = async () => {
    if (files.length === 0) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('pdf', files[0]);

    try {
      const response = await fetch('http://localhost:5000/api/pdf/compress', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errData;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          errData = await response.json();
        } else {
          errData = { error: "Server returned an invalid response (HTML). Please restart your backend server." };
        }
        throw new Error(errData.error || 'Failed to compress PDF');
      }

      // Download the compressed pdf file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = files[0].name.replace('.pdf', '_compressed.pdf');
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Compress PDF</h1>
        <p className="text-lg text-gray-600 mb-2">Reduce file size while optimizing for maximal PDF quality.</p>
        <p className="text-sm text-gray-400 italic">(Note: This performs structural compression using Object Streams)</p>
      </div>

      <FileUpload 
        files={files} 
        setFiles={setFiles} 
        accept={{ 'application/pdf': ['.pdf'] }} 
        multiple={false}
        title="Select PDF file"
      />

      <div className="mt-8 text-center">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button 
          onClick={handleCompress}
          disabled={files.length === 0 || loading}
          className={`font-bold py-3 px-8 rounded-xl shadow-sm text-lg transition-all ${
            files.length === 0 || loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md'
          }`}
        >
          {loading ? 'Compressing...' : 'Compress PDF'}
        </button>
      </div>
    </div>
  );
};

export default CompressPdf;
