import { Link, useLocation } from 'react-router-dom';
import { FileText, SplitSquareHorizontal, Layers, Image as ImageIcon, Type, RotateCw, PenTool, FileOutput, Sparkles } from 'lucide-react';

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
            <Link to="/" className={`flex items-center space-x-1 font-medium text-gray-700 hover:text-indigo-600 transition`}>
              <Layers className="w-4 h-4" />
              <span>All PDF Tools</span>
            </Link>
            <Link to="/merge" state={{ valid: true }} className={`flex items-center space-x-1 font-medium text-gray-700 hover:text-indigo-600 transition ${isActive('/merge')}`}>
              <SplitSquareHorizontal className="w-4 h-4" />
              <span>Merge PDF</span>
            </Link>
            <Link to="/summarize" state={{ valid: true }} className={`flex items-center space-x-1 font-medium text-purple-600 hover:text-purple-700 transition ${isActive('/summarize')}`}>
              <Sparkles className="w-4 h-4" />
              <span>AI Summarize ✨</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
