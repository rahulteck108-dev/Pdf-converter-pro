import { useState } from 'react';
import FileUpload from '../components/FileUpload';

const RotatePdf = () => {
  const [files, setFiles] = useState([]);
  const [degrees, setDegrees] = useState('90');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRotate = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('pdf', files[0]);
    formData.append('degrees', degrees);

    try {
      const response = await fetch('http://localhost:5000/api/pdf/rotate', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error((await response.json()).error || 'Failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = files[0].name.replace('.pdf', '_rotated.pdf');
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
      <h1 className="text-4xl font-bold mb-4">Rotate PDF</h1>
      <p className="text-lg text-gray-600 mb-8">Rotate your PDFs the way you need them.</p>
      <FileUpload files={files} setFiles={setFiles} accept={{ 'application/pdf': ['.pdf'] }} multiple={false} title="Select PDF file" />
      <div className="mt-6 mb-4">
        <select className="px-4 py-2 border rounded text-lg" value={degrees} onChange={(e) => setDegrees(e.target.value)}>
          <option value="90">90 Degrees Clockwise</option>
          <option value="180">180 Degrees</option>
          <option value="270">90 Degrees Counter-Clockwise</option>
        </select>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button onClick={handleRotate} disabled={files.length === 0 || loading} className={`font-bold py-3 px-8 rounded-xl shadow-sm text-lg text-white ${files.length === 0 || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
        {loading ? 'Rotating...' : 'Rotate PDF'}
      </button>
    </div>
  );
};
export default RotatePdf;
