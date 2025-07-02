'use client';

import React, { useState } from 'react';
import { FormData } from '../../types';
import LaTeXResumePreview from './LaTeXResumePreview';

interface PDFGenerationToggleProps {
  formData: FormData;
  selectedTemplate?: string;
  userId?: string;
  onError?: (error: string) => void;
  onSuccess?: (message: string) => void;
  // Legacy HTML preview component
  children?: React.ReactNode;
}

type GenerationMode = 'html' | 'latex';

export default function PDFGenerationToggle({
  formData,
  selectedTemplate,
  userId,
  onError,
  onSuccess,
  children
}: PDFGenerationToggleProps) {
  const [generationMode, setGenerationMode] = useState<GenerationMode>('latex');

  const handleModeChange = (mode: GenerationMode) => {
    setGenerationMode(mode);
  };

  return (
    <div className="pdf-generation-toggle w-full">
      {/* Mode Selection Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => handleModeChange('latex')}
          className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${
            generationMode === 'latex'
              ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            LaTeX Generation
          </div>
          <div className="text-xs text-gray-500 mt-1">Professional typesetting quality</div>
        </button>
        
        <button
          onClick={() => handleModeChange('html')}
          className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${
            generationMode === 'html'
              ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            HTML Generation
          </div>
          <div className="text-xs text-gray-500 mt-1">Fast web-based rendering</div>
        </button>
      </div>

      {/* Mode-specific Content */}
      <div className="mode-content">
        {generationMode === 'latex' ? (
          <div>
            {/* LaTeX Generation Benefits */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-800 mb-2">✨ LaTeX Quality Benefits</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Professional typography and spacing</li>
                <li>• Consistent formatting across all devices</li>
                <li>• Superior PDF quality for printing</li>
                <li>• Industry-standard document generation</li>
                <li>• Perfect for ATS (Applicant Tracking Systems)</li>
              </ul>
            </div>

            <LaTeXResumePreview
              formData={formData}
              selectedTemplate={selectedTemplate}
              userId={userId}
              onError={onError}
              onSuccess={onSuccess}
            />
          </div>
        ) : (
          <div>
            {/* HTML Generation Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">🚀 HTML Generation</h3>
              <p className="text-sm text-gray-600">
                Fast web-based PDF generation using your existing templates. 
                Great for quick previews and compatibility with current workflow.
              </p>
            </div>

            {/* Render legacy HTML preview component */}
            {children}
          </div>
        )}
      </div>

      {/* Comparison Table */}
      <div className="mt-8 bg-white rounded-lg border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Generation Method Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Feature</th>
                <th className="px-4 py-3 text-center font-medium text-gray-900">LaTeX</th>
                <th className="px-4 py-3 text-center font-medium text-gray-900">HTML</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-gray-900">PDF Quality</td>
                <td className="px-4 py-3 text-center text-green-600 font-semibold">Excellent</td>
                <td className="px-4 py-3 text-center text-yellow-600">Good</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 text-gray-900">Typography</td>
                <td className="px-4 py-3 text-center text-green-600 font-semibold">Professional</td>
                <td className="px-4 py-3 text-center text-yellow-600">Web-based</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-900">Generation Speed</td>
                <td className="px-4 py-3 text-center text-yellow-600">Medium</td>
                <td className="px-4 py-3 text-center text-green-600 font-semibold">Fast</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 text-gray-900">ATS Compatibility</td>
                <td className="px-4 py-3 text-center text-green-600 font-semibold">Excellent</td>
                <td className="px-4 py-3 text-center text-green-600 font-semibold">Good</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-900">Printing Quality</td>
                <td className="px-4 py-3 text-center text-green-600 font-semibold">Superior</td>
                <td className="px-4 py-3 text-center text-yellow-600">Standard</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 