import { useState } from 'react';
import FileUpload from '../components/FileUpload';

const ProtectPdf = () => {
  const [files, setFiles] = useState([]);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleProtect = async () => {
    if (files.length === 0 || !password) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('pdf', files[0]);
    formData.append('password', password);

    try {
      const response = await fetch('http://localhost:5000/api/pdf/protect', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error((await response.json()).error || 'Failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = files[0].name.replace('.pdf', '_protected.pdf');
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
      <h1 className="text-4xl font-bold mb-4">Protect PDF</h1>
      <p className="text-lg text-gray-600 mb-8">Add a password to encrypt your PDF.</p>
      <FileUpload files={files} setFiles={setFiles} accept={{ 'application/pdf': ['.pdf'] }} multiple={false} title="Select PDF file" />
      <div className="mt-6 max-w-sm mx-auto">
        <input type="password" placeholder="Enter a secure password..." className="w-full px-4 py-2 border rounded mb-4" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button onClick={handleProtect} disabled={files.length === 0 || !password || loading} className={`font-bold py-3 px-8 rounded-xl shadow-sm text-lg text-white ${files.length === 0 || !password || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-900'}`}>
        {loading ? 'Encrypting...' : 'Protect PDF'}
      </button>
    </div>
  );
};
export default ProtectPdf;
