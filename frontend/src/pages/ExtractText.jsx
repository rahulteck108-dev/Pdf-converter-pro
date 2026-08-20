import { useState } from 'react';
import FileUpload from '../components/FileUpload';

const ExtractText = () => {
  const [files, setFiles] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExtract = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setError(null);
    setText('');
    const formData = new FormData();
    formData.append('pdf', files[0]);

    try {
      const response = await fetch('http://localhost:5000/api/pdf/extract-text', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed');
      setText(data.text);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Extract Text</h1>
      <p className="text-lg text-gray-600 mb-8">Instantly pull all text out of a digital PDF document.</p>
      <FileUpload files={files} setFiles={setFiles} accept={{ 'application/pdf': ['.pdf'] }} multiple={false} title="Select PDF file" />
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <div className="mt-8">
        <button onClick={handleExtract} disabled={files.length === 0 || loading} className={`font-bold py-3 px-8 rounded-xl shadow-sm text-lg text-white ${files.length === 0 || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
          {loading ? 'Extracting...' : 'Extract Text'}
        </button>
      </div>
      {text && (
        <div className="mt-8 text-left bg-gray-50 p-6 rounded-lg border shadow-inner">
          <h3 className="font-bold text-xl mb-4 text-gray-800">Extracted Text:</h3>
          <pre className="whitespace-pre-wrap text-sm text-gray-700 h-96 overflow-y-auto p-4 bg-white border rounded">{text}</pre>
        </div>
      )}
    </div>
  );
};
export default ExtractText;
