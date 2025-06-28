import React from 'react';

interface PdfPreviewProps {
  showResumePreview: boolean;
  showCoverLetterPreview: boolean;
  setShowResumePreview: (show: boolean) => void;
  setShowCoverLetterPreview: (show: boolean) => void;
}

export default function PdfPreview({
  showResumePreview,
  showCoverLetterPreview,
  setShowResumePreview,
  setShowCoverLetterPreview
}: PdfPreviewProps) {
  return (
    <>
      {/* PDF Preview Modals */}
      {showResumePreview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-bold text-gray-800">Resume Preview</h3>
              <button
                onClick={() => setShowResumePreview(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
              <img 
                src="/resume-preview.png" 
                alt="Resume Preview" 
                className="w-full h-auto rounded-lg shadow-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const sibling = e.currentTarget.nextElementSibling as HTMLElement | null;
                  if (sibling) sibling.style.display = 'block';
                }}
              />
              <div className="hidden text-center py-12 text-gray-500">
                <p className="text-lg mb-4">Resume Preview</p>
                <p className="text-sm">Sample resume preview image will be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCoverLetterPreview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-bold text-gray-800">Cover Letter Preview</h3>
              <button
                onClick={() => setShowCoverLetterPreview(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
              <img 
                src="/cover-letter-preview.png" 
                alt="Cover Letter Preview" 
                className="w-full h-auto rounded-lg shadow-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const sibling = e.currentTarget.nextElementSibling as HTMLElement | null;
                  if (sibling) sibling.style.display = 'block';
                }}
              />
              <div className="hidden text-center py-12 text-gray-500">
                <p className="text-lg mb-4">Cover Letter Preview</p>
                <p className="text-sm">Sample cover letter preview image will be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}