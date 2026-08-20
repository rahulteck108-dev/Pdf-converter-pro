import { useState } from 'react';
import FileUpload from '../components/FileUpload';

const MergePdf = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge.');
      return;
    }
    setLoading(true);
    setError(null);
    const formData = new FormData();
    files.forEach(f => formData.append('pdfs', f));

    try {
      const response = await fetch('http://localhost:5000/api/pdf/merge', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error((await response.json()).error || 'Failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Merge PDF</h1>
      <p className="text-lg text-gray-600 mb-8">Combine multiple PDFs into one unified document.</p>
      <FileUpload files={files} setFiles={setFiles} accept={{ 'application/pdf': ['.pdf'] }} multiple={true} title="Select PDF files" />
      
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <div className="mt-8">
        <button onClick={handleMerge} disabled={files.length < 2 || loading} className={`font-bold py-3 px-8 rounded-xl shadow-sm text-lg text-white ${files.length < 2 || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
          {loading ? 'Merging...' : 'Merge PDFs'}
        </button>
      </div>
    </div>
  );
};
export default MergePdf;
