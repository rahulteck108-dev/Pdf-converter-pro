import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';

const FileUpload = ({ files, setFiles, accept, multiple, title }) => {
  const onDrop = useCallback(acceptedFiles => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, [setFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept,
    multiple 
  });

  const removeFile = (e, index) => {
    e.stopPropagation();
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 bg-white'}`}
      >
        <input {...getInputProps()} />
        <UploadCloud className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-indigo-600' : 'text-gray-400'}`} />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title || 'Drag & Drop files here'}</h3>
        <p className="text-gray-500">or click to browse from your computer</p>
      </div>

      {files.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-sm border p-4">
          <h4 className="font-medium text-gray-700 mb-3">Selected Files ({files.length})</h4>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-600 truncate mr-4">{file.name}</span>
                <button 
                  onClick={(e) => removeFile(e, index)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
