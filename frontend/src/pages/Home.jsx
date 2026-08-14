import { Link } from 'react-router-dom';
import { Layers, SplitSquareHorizontal, Image as ImageIcon, Type, RotateCw, PenTool, FileOutput } from 'lucide-react';

const Home = () => {
  const tools = [
    {
      name: 'Merge PDF',
      description: 'Combine multiple PDFs into one unified document.',
      icon: <Layers className="w-8 h-8 text-indigo-500" />,
      path: '/merge',
      color: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-100'
    },
    {
      name: 'Split PDF',
      description: 'Separate one page or a whole set for easy conversion into independent PDF files.',
      icon: <SplitSquareHorizontal className="w-8 h-8 text-rose-500" />,
      path: '/split',
      color: 'bg-rose-50 hover:bg-rose-100 border-rose-100'
    },
    {
      name: 'Image to PDF',
      description: 'Convert JPG, PNG or GIF to PDF. Adjust orientation and margins.',
      icon: <ImageIcon className="w-8 h-8 text-amber-500" />,
      path: '/image-to-pdf',
      color: 'bg-amber-50 hover:bg-amber-100 border-amber-100'
    },
    {
      name: 'Extract Text',
      description: 'Instantly pull all text out of a digital PDF document.',
      icon: <Type className="w-8 h-8 text-emerald-500" />,
      path: '/extract-text',
      color: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-100'
    },
    {
      name: 'Rotate PDF',
      description: 'Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!',
      icon: <RotateCw className="w-8 h-8 text-indigo-500" />,
      path: '/rotate',
      color: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-100'
    },
    {
      name: 'Add Watermark',
      description: 'Stamp an image or text over your PDF in seconds.',
      icon: <PenTool className="w-8 h-8 text-rose-500" />,
      path: '/watermark',
      color: 'bg-rose-50 hover:bg-rose-100 border-rose-100'
    },
    {
      name: 'Word to PDF',
      description: 'Make DOC and DOCX files easy to read by converting them to PDF.',
      icon: <FileOutput className="w-8 h-8 text-blue-500" />,
      path: '/word-to-pdf',
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-100'
    }
  ];

  return (
    <div className="text-center max-w-4xl mx-auto mt-12">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6">Every tool you need to work with PDFs in one place</h1>
      <p className="text-xl text-gray-600 mb-12">All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link to={tool.path} state={{ valid: true }} key={tool.name} className={`flex flex-col items-center p-8 rounded-2xl border transition-all transform hover:-translate-y-1 ${tool.color}`}>
            <div className="mb-4 bg-white p-4 rounded-full shadow-sm">{tool.icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.name}</h3>
            <p className="text-gray-600 text-sm text-center">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
