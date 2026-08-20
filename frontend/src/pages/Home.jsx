import { Link } from 'react-router-dom';
import { Layers, SplitSquareHorizontal, Minimize2, FileText, Presentation, Table, FileOutput, Monitor, LayoutGrid, Edit3, Image as ImageIcon, Type, RotateCw, PenTool, Sparkles, Wrench, Hash, Scan, FileSearch, ArrowLeftRight, ShieldAlert, Crop, FormInput, Languages, Globe, Unlock, Lock, Grid, Archive, FileSignature, FileCode } from 'lucide-react';

const Home = () => {
  const tools = [
    { name: 'Merge PDF', description: 'Combine multiple PDFs into one unified document.', icon: <Layers className="w-8 h-8 text-indigo-500" />, path: '/merge', color: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-100' },
    { name: 'Split PDF', description: 'Separate one page or a whole set for easy conversion into independent PDF files.', icon: <SplitSquareHorizontal className="w-8 h-8 text-rose-500" />, path: '/split', color: 'bg-rose-50 hover:bg-rose-100 border-rose-100' },
    { name: 'Compress PDF', description: 'Reduce file size while optimizing for maximal PDF quality.', icon: <Minimize2 className="w-8 h-8 text-emerald-500" />, path: '/compress', color: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-100' },
    { name: 'PDF to Word', description: 'Easily convert your PDF files into easy to edit DOC and DOCX documents.', icon: <FileText className="w-8 h-8 text-blue-500" />, path: '/pdf-to-word', color: 'bg-blue-50 hover:bg-blue-100 border-blue-100' },
    { name: 'PDF to PowerPoint', description: 'Turn your PDF files into easy to edit PPT and PPTX slideshows.', icon: <Presentation className="w-8 h-8 text-orange-500" />, path: '/pdf-to-powerpoint', color: 'bg-orange-50 hover:bg-orange-100 border-orange-100' },
    { name: 'PDF to Excel', description: 'Pull data straight from PDFs into Excel spreadsheets.', icon: <Table className="w-8 h-8 text-green-500" />, path: '/pdf-to-excel', color: 'bg-green-50 hover:bg-green-100 border-green-100' },
    { name: 'Word to PDF', description: 'Make DOC and DOCX files easy to read by converting them to PDF.', icon: <FileOutput className="w-8 h-8 text-blue-500" />, path: '/word-to-pdf', color: 'bg-blue-50 hover:bg-blue-100 border-blue-100' },
    { name: 'PowerPoint to PDF', description: 'Make PPT and PPTX slideshows easy to view by converting them to PDF.', icon: <Monitor className="w-8 h-8 text-orange-500" />, path: '/powerpoint-to-pdf', color: 'bg-orange-50 hover:bg-orange-100 border-orange-100' },
    { name: 'Excel to PDF', description: 'Make EXCEL spreadsheets easy to read by converting them to PDF.', icon: <LayoutGrid className="w-8 h-8 text-green-500" />, path: '/excel-to-pdf', color: 'bg-green-50 hover:bg-green-100 border-green-100' },
    { name: 'Edit PDF', description: 'Add text, images, shapes or freehand annotations to a PDF document.', icon: <Edit3 className="w-8 h-8 text-yellow-500" />, path: '/edit', color: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-100' },
    { name: 'PDF to JPG', description: 'Convert each PDF page into a JPG or extract all images contained in a PDF.', icon: <ImageIcon className="w-8 h-8 text-amber-500" />, path: '/pdf-to-jpg', color: 'bg-amber-50 hover:bg-amber-100 border-amber-100' },
    { name: 'JPG to PDF', description: 'Convert JPG images to PDF in seconds. Easily adjust orientation and margins.', icon: <ImageIcon className="w-8 h-8 text-amber-500" />, path: '/jpg-to-pdf', color: 'bg-amber-50 hover:bg-amber-100 border-amber-100' },
    { name: 'Sign PDF', description: 'Sign yourself or request electronic signatures from others.', icon: <FileSignature className="w-8 h-8 text-purple-500" />, path: '/sign-pdf', color: 'bg-purple-50 hover:bg-purple-100 border-purple-100' },
    { name: 'Watermark', description: 'Stamp an image or text over your PDF in seconds.', icon: <PenTool className="w-8 h-8 text-rose-500" />, path: '/watermark', color: 'bg-rose-50 hover:bg-rose-100 border-rose-100' },
    { name: 'Rotate PDF', description: 'Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!', icon: <RotateCw className="w-8 h-8 text-indigo-500" />, path: '/rotate', color: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-100' },
    { name: 'HTML to PDF', description: 'Convert webpages in HTML to PDF. Copy and paste the URL of the page.', icon: <Globe className="w-8 h-8 text-blue-500" />, path: '/html-to-pdf', color: 'bg-blue-50 hover:bg-blue-100 border-blue-100' },
    { name: 'Unlock PDF', description: 'Remove PDF password security, giving you the freedom to use your PDFs.', icon: <Unlock className="w-8 h-8 text-gray-500" />, path: '/unlock-pdf', color: 'bg-gray-50 hover:bg-gray-100 border-gray-100' },
    { name: 'Protect PDF', description: 'Protect PDF files with a password. Encrypt PDF documents.', icon: <Lock className="w-8 h-8 text-gray-500" />, path: '/protect-pdf', color: 'bg-gray-50 hover:bg-gray-100 border-gray-100' },
    { name: 'Organize PDF', description: 'Sort pages of your PDF file however you like. Delete or add PDF pages.', icon: <Grid className="w-8 h-8 text-green-500" />, path: '/organize-pdf', color: 'bg-green-50 hover:bg-green-100 border-green-100' },
    { name: 'PDF to PDF/A', description: 'Transform your PDF to PDF/A for long-term archiving.', icon: <Archive className="w-8 h-8 text-yellow-600" />, path: '/pdf-to-pdfa', color: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-100' },
    { name: 'Repair PDF', description: 'Repair a damaged PDF and recover data from corrupt PDF.', icon: <Wrench className="w-8 h-8 text-red-500" />, path: '/repair', color: 'bg-red-50 hover:bg-red-100 border-red-100' },
    { name: 'Page Numbers', description: 'Add page numbers into PDFs with ease.', icon: <Hash className="w-8 h-8 text-gray-500" />, path: '/page-numbers', color: 'bg-gray-50 hover:bg-gray-100 border-gray-100' },
    { name: 'Scan to PDF', description: 'Capture document scans and send them instantly to your browser.', icon: <Scan className="w-8 h-8 text-teal-500" />, path: '/scan', color: 'bg-teal-50 hover:bg-teal-100 border-teal-100' },
    { name: 'OCR PDF', description: 'Easily convert scanned PDF into searchable and selectable documents.', icon: <FileSearch className="w-8 h-8 text-cyan-500" />, path: '/ocr', color: 'bg-cyan-50 hover:bg-cyan-100 border-cyan-100' },
    { name: 'Compare PDF', description: 'Show a side-by-side document comparison and easily spot changes.', icon: <ArrowLeftRight className="w-8 h-8 text-blue-500" />, path: '/compare', color: 'bg-blue-50 hover:bg-blue-100 border-blue-100' },
    { name: 'Redact PDF', description: 'Redact text and graphics to permanently remove sensitive information.', icon: <ShieldAlert className="w-8 h-8 text-gray-700" />, path: '/redact', color: 'bg-gray-50 hover:bg-gray-100 border-gray-100' },
    { name: 'Crop PDF', description: 'Crop margins of PDF documents or select specific areas.', icon: <Crop className="w-8 h-8 text-pink-500" />, path: '/crop', color: 'bg-pink-50 hover:bg-pink-100 border-pink-100' },
    { name: 'PDF Forms', description: 'Create interactive fillable PDFs, or fill PDF forms yourself.', icon: <FormInput className="w-8 h-8 text-indigo-500" />, path: '/forms', color: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-100', badge: 'New!' },
    { name: 'AI Summarizer', description: 'Quickly generate concise summaries from articles, paragraphs, and essays.', icon: <Sparkles className="w-8 h-8 text-purple-500" />, path: '/summarize', color: 'bg-purple-50 hover:bg-purple-100 border-purple-100', badge: 'New!' },
    { name: 'Translate PDF', description: 'Easily translate PDF files powered by AI.', icon: <Languages className="w-8 h-8 text-purple-500" />, path: '/translate', color: 'bg-purple-50 hover:bg-purple-100 border-purple-100', badge: 'New!' },
    { name: 'PDF to Markdown', description: 'Easily turn PDFs into Markdown files. Perfect for notes, docs, and LLMs.', icon: <FileCode className="w-8 h-8 text-emerald-600" />, path: '/pdf-to-markdown', color: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-100', badge: 'New!' }
  ];

  return (
    <div className="text-center max-w-7xl mx-auto mt-12 px-4">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6">Every tool you need to work with PDFs in one place</h1>
      <p className="text-xl text-gray-600 mb-12">All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-20">
        {tools.map((tool) => (
          <Link to={tool.path} state={{ valid: true }} key={tool.name} className={`relative flex flex-col items-center p-8 rounded-2xl border transition-all transform hover:-translate-y-1 ${tool.color}`}>
            {tool.badge && (
              <span className="absolute top-4 right-4 bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
                {tool.badge}
              </span>
            )}
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
