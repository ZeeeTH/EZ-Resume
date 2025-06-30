import React from 'react';

interface A4PreviewProps {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
}

export default function A4Preview({ children, title, onClose }: A4PreviewProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-black/70 p-4">
      <div className="relative max-w-full overflow-auto">
        <div className="flex items-center justify-center select-none">
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-400 hover:text-pink-400 text-2xl font-bold z-10 bg-white/80 rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-colors duration-200"
              aria-label="Close preview"
            >
              ×
            </button>
            {/* A4 Preview Container - Exact PDF dimensions */}
            <div 
              className="bg-white shadow-2xl overflow-hidden" 
              style={{ 
                width: '210mm', 
                height: '297mm',
                maxWidth: 'calc(100vw - 2rem)',
                maxHeight: 'calc(100vh - 2rem)',
                transformOrigin: 'center center'
              }}
            >
              {/* Scale content to fit when viewport is smaller than A4 */}
              <div 
                style={{
                  width: '100%',
                  height: '100%',
                  transform: 'scale(min(calc((100vw - 2rem) / 210mm), calc((100vh - 2rem) / 297mm)))',
                  transformOrigin: 'top left'
                }}
              >
                {children}
              </div>
            </div>
            {/* Preview label */}
            <div className="text-white text-center mt-2 text-sm opacity-75">
              {title} - A4 Print Preview (210mm × 297mm)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 