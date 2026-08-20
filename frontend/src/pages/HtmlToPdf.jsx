import { useState } from 'react';
import FileUpload from '../components/FileUpload';

const HtmlToPdf = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleProcess = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      // Using universal mock backend endpoint
      const response = await fetch('http://localhost:5000/api/pdf/universal-mock', {
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
        throw new Error(errData.error || 'Failed to process file');
      }

      // Download the processed file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Append _processed to filename
      const extMatch = files[0].name.match(/\.[^/.]+$/);
      const ext = extMatch ? extMatch[0] : '';
      const baseName = files[0].name.replace(ext, '');
      a.download = `${baseName}_processed.pdf`;
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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">HTML to PDF</h1>
        <p className="text-lg text-gray-600 mb-2">Convert webpages in HTML to PDF. Copy and paste the URL of the page.</p>
        <p className="text-sm text-blue-500 italic">(Ready for Processing)</p>
      </div>

      <FileUpload 
        files={files} 
        setFiles={setFiles} 
        accept={undefined} // Accept all file types just in case (e.g. for JpgToPdf)
        multiple={false}
        title="Select file"
      />

      <div className="mt-8 text-center">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button 
          onClick={handleProcess}
          disabled={files.length === 0 || loading}
          className={`font-bold py-3 px-8 rounded-xl shadow-sm text-lg transition-all ${
            files.length === 0 || loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
          }`}
        >
          {loading ? 'Processing...' : 'Process File'}
        </button>
      </div>
    </div>
  );
};

export default HtmlToPdf;
