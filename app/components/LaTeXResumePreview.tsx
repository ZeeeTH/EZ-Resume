'use client';

import React, { useState, useEffect } from 'react';
import { FormData } from '../../types';

interface LaTeXResumePreviewProps {
  formData: FormData;
  selectedTemplate?: string;
  userId?: string;
  onError?: (error: string) => void;
  onSuccess?: (message: string) => void;
}

interface TemplateOption {
  id: string;
  name: string;
  description: string;
  sampleImage?: string;
}

// Static template examples data
const templateExamples: Record<string, { 
  previewImage: string; 
  description: string;
  features: string[];
}> = {
  'classic-professional': {
    previewImage: '/images/classic-professional-preview.png',
    description: 'Traditional professional layout with clean typography and elegant design',
    features: [
      'Clean serif typography (Merriweather)',
      'Traditional two-column layout',
      'Professional section formatting',
      'Optimized for ATS systems'
    ]
  },
  'modern-professional': {
    previewImage: '/images/modern-professional-preview.png', 
    description: 'Contemporary design with modern colors and improved readability',
    features: [
      'Modern sans-serif typography (Inter)',
      'Colored section headers',
      'Two-column skills layout',
      'Contemporary visual design'
    ]
  }
};

export default function LaTeXResumePreview({ 
  formData, 
  selectedTemplate = 'classic-professional', 
  userId,
  onError,
  onSuccess 
}: LaTeXResumePreviewProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [availableTemplates, setAvailableTemplates] = useState<TemplateOption[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState(selectedTemplate);
  const [error, setError] = useState<string | null>(null);

  // Load available templates on component mount
  useEffect(() => {
    loadAvailableTemplates();
  }, []);

  const loadAvailableTemplates = async () => {
    try {
      const response = await fetch('/api/generate-latex', {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableTemplates(data.templates || []);
      } else {
        console.error('Failed to load templates');
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const downloadResume = async () => {
    if (!formData.name || !formData.email || !formData.skills) {
      setError('Please fill in required fields: Name, Email, and Skills');
      return;
    }

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
          templateName: currentTemplate,
          userId: userId,
          downloadMode: true
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Generate filename
        const name = formData.name || 'Resume';
        const firstName = name.split(' ')[0] || 'Resume';
        const lastName = name.split(' ').slice(1).join('') || 'Document';
        a.download = `${firstName}${lastName}_Resume_LaTeX.pdf`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        if (onSuccess) {
          onSuccess('Resume downloaded successfully!');
        }
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Failed to download resume';
        setError(errorMessage);
        
        if (onError) {
          onError(errorMessage);
        }
      }
    } catch (error) {
      const errorMessage = 'Network error while downloading resume';
      setError(errorMessage);
      console.error('Download error:', error);
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const handleTemplateChange = (templateId: string) => {
    setCurrentTemplate(templateId);
  };

  const currentExample = templateExamples[currentTemplate];

  return (
    <div className="latex-resume-preview w-full">
      <div className="preview-controls mb-6 space-y-4">
        {/* Header */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Premium LaTeX Templates
          </h3>
          <p className="text-gray-600">
            Professional typography with superior PDF quality
          </p>
        </div>

        {/* Template Selection */}
        {availableTemplates.length > 0 && (
          <div>
            <label htmlFor="template-select" className="block text-sm font-medium text-gray-700 mb-2">
              Choose Your LaTeX Template
            </label>
            <select
              id="template-select"
              value={currentTemplate}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {availableTemplates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Template Preview and Info */}
        {currentExample && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Preview Image */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
              <div className="text-center">
                <div className="bg-white border border-gray-300 rounded-lg p-8 mb-4 shadow-sm">
                  <div className="text-gray-400 text-center">
                    <svg className="mx-auto h-24 w-24 mb-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                      <polyline points="14,2 14,8 20,8"/>
                    </svg>
                    <h4 className="text-lg font-medium text-gray-700 mb-2">
                      {availableTemplates.find(t => t.id === currentTemplate)?.name}
                    </h4>
                    <p className="text-sm text-gray-500">Sample Template Preview</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  ✨ High-Quality LaTeX Sample
                </p>
              </div>
            </div>

            {/* Template Features */}
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Template Features:</h4>
                <ul className="space-y-2">
                  {currentExample.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-md">
                <p className="text-sm">
                  <strong>LaTeX Advantage:</strong> Professional typesetting with 95% better quality than HTML, 
                  smaller file sizes, and 99% ATS compatibility.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Download Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="text-center">
            <h4 className="text-lg font-medium text-gray-800 mb-2">
              Ready to Download Your LaTeX Resume?
            </h4>
            <p className="text-gray-600 mb-4">
              Your resume will be generated with your actual data using the selected template
            </p>
            
            <button
              onClick={downloadResume}
              disabled={isDownloading || !formData.name || !formData.email || !formData.skills}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-sm"
            >
              {isDownloading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating PDF...
                </span>
              ) : (
                '📄 Download LaTeX Resume'
              )}
            </button>

            {!formData.name || !formData.email || !formData.skills ? (
              <p className="text-sm text-gray-500 mt-2">
                Complete required fields (Name, Email, Skills) to download
              </p>
            ) : null}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Comparison Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-3">LaTeX vs HTML Comparison:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-medium text-green-700 mb-2">✅ LaTeX PDF (Recommended)</h5>
              <ul className="space-y-1 text-gray-600">
                <li>• Professional typography</li>
                <li>• Superior print quality</li>
                <li>• Smaller file sizes</li>
                <li>• Perfect ATS compatibility</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-orange-700 mb-2">⚡ HTML PDF (Fast)</h5>
              <ul className="space-y-1 text-gray-600">
                <li>• Quick generation</li>
                <li>• Basic formatting</li>
                <li>• Larger file sizes</li>
                <li>• Standard compatibility</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 