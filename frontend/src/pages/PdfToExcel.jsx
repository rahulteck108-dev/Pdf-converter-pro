import { useState } from 'react';
import FileUpload from '../components/FileUpload';

const PdfToExcel = () => {
  const [files, setFiles] = useState([]);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">PDF to Excel</h1>
        <p className="text-lg text-gray-600">Pull data straight from PDFs into Excel spreadsheets.</p>
        <div className="mt-4 inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold px-4 py-2 rounded-full border border-yellow-200">
          Coming Soon: This tool is currently under development.
        </div>
      </div>

      <FileUpload 
        files={files} 
        setFiles={setFiles} 
        accept={{ 'application/pdf': ['.pdf'] }} 
        multiple={false}
        title="Select PDF file"
      />

      <div className="mt-8 text-center">
        <button 
          disabled
          className="bg-gray-300 text-gray-500 font-bold py-3 px-8 rounded-xl shadow-sm cursor-not-allowed text-lg"
        >
          Tool Unavailable
        </button>
      </div>
    </div>
  );
};

export default PdfToExcel;
