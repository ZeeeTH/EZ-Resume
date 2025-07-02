import React from 'react';
import { CheckCircle, Lock, Star, Crown } from 'lucide-react';
import { ResumeTemplate } from '../../../types/templates';

interface TemplateCardProps {
  template: ResumeTemplate;
  isSelected: boolean;
  onClick: () => void;
  isLocked?: boolean;
  selectedColorVariant?: number;
  onColorSelect?: (colorIndex: number) => void;
  onPreview?: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  onClick,
  isLocked = false,
  selectedColorVariant = 0,
  onColorSelect,
  onPreview
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 hover:scale-105 flex flex-col
        w-full max-w-sm mx-auto
        ${isLocked 
          ? 'border-yellow-500/30 bg-yellow-500/5 hover:border-yellow-500/50' 
          : isSelected
            ? 'border-green-400 bg-green-500/10 shadow-lg'
            : 'border-white/20 bg-white/5 hover:border-purple-500/50'
        }
      `}
    >
      {/* Lock Overlay - positioned over the entire card but allowing content to show through */}
      {isLocked && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-xl flex items-center justify-center z-10">
          <div className="text-center">
            <Lock className="h-6 w-6 text-yellow-400 mx-auto mb-1" />
            <p className="text-yellow-300 font-semibold text-xs mb-1">Premium Template</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClick(); // This will trigger the upgrade modal
              }}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold py-1 px-2 rounded text-xs transition-all duration-200 transform hover:scale-105"
            >
              Upgrade to Unlock
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col h-full">
        {/* Header section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-white text-sm">{template.name}</h3>
            {template.tier === 'premium' && !isLocked && (
              <Crown className="h-4 w-4 text-yellow-400" />
            )}
            {template.isUniversal && (
              <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded-full">
                Universal
              </span>
            )}
            {!template.isUniversal && (
              <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-0.5 rounded-full">
                {template.category}
              </span>
            )}
          </div>
          {isSelected && !isLocked && (
            <CheckCircle className="h-5 w-5 text-green-400" />
          )}
        </div>

        {/* Description section - grows to fill space */}
        <div className="flex-1">
          <p className="text-gray-400 text-xs mt-2">{template.description}</p>
        </div>

        {/* Bottom section - always at bottom */}
        <div className="mt-auto">
          {/* Color Options - Always show, even when locked */}
          {template.colorOptions && (
            <div className="pt-3 border-t border-white/10 mt-3">
              <div className="flex items-center justify-center space-x-2">
                {template.colorOptions.palette.map((color, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      onColorSelect?.(index);
                    }}
                    className={`w-6 h-6 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                      isSelected && selectedColorVariant === index
                        ? 'border-white shadow-lg'
                        : 'border-white/30'
                    }`}
                    style={{ backgroundColor: color.primary }}
                    title={color.label}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400 text-center mt-1 min-h-[20px]">
                {template.colorOptions.palette[selectedColorVariant]?.label || template.colorOptions.palette[0]?.label}
              </p>
            </div>
          )}

          {/* Preview Button - Always show, even when locked */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (isLocked) {
                onClick(); // Trigger upgrade modal for locked templates
              } else {
                onPreview?.();
              }
            }}
            className={`mt-3 w-full text-xs font-medium py-2 px-3 rounded-lg transition-all duration-200 border ${
              isLocked 
                ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 hover:text-yellow-200 border-yellow-500/30 hover:border-yellow-500/50'
                : 'bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 hover:text-pink-200 border-pink-500/30 hover:border-pink-500/50'
            }`}
          >
            {isLocked ? 'Unlock Template' : 'Preview Sample'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard; 