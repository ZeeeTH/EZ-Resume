'use client';

import React, { useState } from 'react';
import { X, Download, Loader2, Eye, EyeOff } from 'lucide-react';
import { FormData } from '../../../types';

interface LaTeXViewerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  formData: FormData;
  templateName?: string;
  userId?: string;
  type: 'resume' | 'cover_letter';
}

export default function LaTeXViewer({
  isOpen,
  onClose,
  title,
  formData,
  templateName = 'classic-professional',
  userId,
  type
}: LaTeXViewerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generatePreview = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/latex-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userData: formData,
          templateName: templateName,
          userId: userId,
          type: type
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to generate preview');
      }
    } catch (error) {
      setError('Network error while generating preview');
      console.error('Preview error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadDocument = async () => {
    setIsDownloading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-latex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userData: formData,
          templateName: templateName,
          userId: userId,
          downloadMode: true,
          type: type
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Generate filename
        const name = formData.name || 'Document';
        const firstName = name.split(' ')[0] || 'Document';
        const lastName = name.split(' ').slice(1).join('') || '';
        const docType = type === 'resume' ? 'Resume' : 'CoverLetter';
        a.download = `${firstName}${lastName}_${docType}_LaTeX.pdf`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to download document');
      }
    } catch (error) {
      setError('Network error while downloading document');
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Generate preview when modal opens
  React.useEffect(() => {
    if (isOpen && !pdfUrl && !isLoading) {
      generatePreview();
    }
  }, [isOpen]);

  // Cleanup URL when modal closes
  React.useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/80 p-4">
      <div className="relative w-full max-w-6xl h-full max-h-[90vh] bg-slate-900 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <p className="text-sm text-gray-400">
              {type === 'resume' ? 'Resume' : 'Cover Letter'} Preview - LaTeX Quality
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={downloadDocument}
              disabled={isDownloading || isLoading}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span>{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
            </button>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 h-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="h-12 w-12 animate-spin text-purple-500 mb-4" />
              <p className="text-gray-300">Generating LaTeX preview...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-red-400 mb-4">
                <EyeOff className="h-12 w-12 mx-auto mb-2" />
                <p className="text-lg font-medium">Preview Error</p>
              </div>
              <p className="text-gray-400 mb-4 text-center max-w-md">{error}</p>
              <button
                onClick={generatePreview}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full border-0"
              title={`${title} - LaTeX Preview`}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <Eye className="h-12 w-12 text-gray-500 mb-4" />
              <p className="text-gray-400">Click to generate preview</p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="p-3 border-t border-gray-700 bg-slate-800">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4 text-gray-400">
              <span>Template: {templateName}</span>
              <span>•</span>
              <span>LaTeX Quality</span>
            </div>
            <div className="text-gray-500">
              Professional typography and ATS-optimized formatting
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 