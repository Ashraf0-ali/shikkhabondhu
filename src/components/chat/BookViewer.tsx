
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, ZoomIn, ZoomOut } from 'lucide-react';

interface BookViewerProps {
  bookUrl: string;
  bookTitle: string;
  onClose: () => void;
}

const BookViewer = ({ bookUrl, bookTitle, onClose }: BookViewerProps) => {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white bangla-text">
          📖 {bookTitle}
        </h3>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleZoomOut}
            variant="outline"
            size="sm"
            className="bangla-text"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            onClick={handleZoomIn}
            variant="outline"
            size="sm"
            className="bangla-text"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => window.open(bookUrl, '_blank')}
            variant="outline"
            size="sm"
            className="bangla-text"
          >
            <Download className="w-4 h-4 mr-1" />
            ডাউনলোড
          </Button>
          <Button
            onClick={onClose}
            variant="destructive"
            size="sm"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-4">
        <div className="h-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          <iframe
            src={`${bookUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH&zoom=${Math.round(zoom * 100)}`}
            className="w-full h-full"
            title={bookTitle}
            style={{ border: 'none' }}
          />
        </div>
      </div>
    </div>
  );
};

export default BookViewer;
