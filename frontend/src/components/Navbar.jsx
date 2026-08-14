import { Link, useLocation } from 'react-router-dom';
import { FileText, SplitSquareHorizontal, Layers, Image as ImageIcon, Type, RotateCw, PenTool, FileOutput } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? "text-indigo-600 font-semibold" : "text-gray-600 hover:text-indigo-600";

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <FileText className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">PDF Pro</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/merge" state={{ valid: true }} className={`flex items-center space-x-1 transition ${isActive('/merge')}`}>
              <Layers className="w-4 h-4" />
              <span>Merge PDF</span>
            </Link>
            <Link to="/split" state={{ valid: true }} className={`flex items-center space-x-1 transition ${isActive('/split')}`}>
              <SplitSquareHorizontal className="w-4 h-4" />
              <span>Split PDF</span>
            </Link>
            <Link to="/image-to-pdf" state={{ valid: true }} className={`flex items-center space-x-1 transition ${isActive('/image-to-pdf')}`}>
              <ImageIcon className="w-4 h-4" />
              <span>Image to PDF</span>
            </Link>
            <Link to="/extract-text" state={{ valid: true }} className={`flex items-center space-x-1 transition ${isActive('/extract-text')}`}>
              <Type className="w-4 h-4" />
              <span>Extract Text</span>
            </Link>
            <Link to="/rotate" state={{ valid: true }} className={`flex items-center space-x-1 transition ${isActive('/rotate')}`}>
              <RotateCw className="w-4 h-4" />
              <span>Rotate PDF</span>
            </Link>
            <Link to="/watermark" state={{ valid: true }} className={`flex items-center space-x-1 transition ${isActive('/watermark')}`}>
              <PenTool className="w-4 h-4" />
              <span>Watermark</span>
            </Link>
            <Link to="/word-to-pdf" state={{ valid: true }} className={`flex items-center space-x-1 transition ${isActive('/word-to-pdf')}`}>
              <FileOutput className="w-4 h-4" />
              <span>Word to PDF</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
