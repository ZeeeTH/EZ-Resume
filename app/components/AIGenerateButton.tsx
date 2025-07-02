import React from 'react';
import { Sparkles, Loader2, Zap } from 'lucide-react';
import { FREE_TIER_LIMITS, checkAIUsage } from '../../lib/ai-utils';

interface AIGenerateButtonProps {
  contentType: 'bulletPoints' | 'summary' | 'skills';
  onGenerate: () => void;
  disabled?: boolean;
  loading?: boolean;
  userTier: 'free' | 'paid';
  currentUsage: number;
  selectedIndustry?: string;
  onUpgradeClick: () => void;
  className?: string;
}

export default function AIGenerateButton({
  contentType,
  onGenerate,
  disabled = false,
  loading = false,
  userTier,
  currentUsage,
  selectedIndustry,
  onUpgradeClick,
  className = ''
}: AIGenerateButtonProps) {
  const usageCheck = checkAIUsage(contentType, currentUsage, userTier);

  const getDisplayText = () => {
    switch (contentType) {
      case 'bulletPoints':
        return 'Generate Bullet Point';
      case 'summary':
        return 'Generate Summary';
      case 'skills':
        return 'Generate Skills';
      default:
        return 'Generate with AI';
    }
  };

  const getIcon = () => {
    if (loading) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (userTier === 'paid') return <Zap className="h-4 w-4" />;
    return <Sparkles className="h-4 w-4" />;
  };

  if (!usageCheck.allowed) {
    return (
      <div className={`ai-generate-section ${className}`}>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-purple-300 font-medium">
                AI Generation Limit Reached
              </span>
            </div>
            <button
              onClick={onUpgradeClick}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-semibold py-1.5 px-3 rounded-md transition-all duration-200 transform hover:scale-105"
            >
              Upgrade - $49 AUD
            </button>
          </div>
          <p className="text-xs text-gray-400">
            Free users get {FREE_TIER_LIMITS[contentType]} {contentType} generation{FREE_TIER_LIMITS[contentType] > 1 ? 's' : ''} per session
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`ai-generate-section ${className}`}>
      <div className="flex flex-col space-y-2">
        <button
          onClick={onGenerate}
          disabled={disabled || loading}
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-purple-300 hover:text-purple-200 font-medium py-2.5 px-4 rounded-lg border border-purple-500/30 hover:border-purple-500/50 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:from-purple-500/20 disabled:hover:to-pink-500/20"
        >
          {getIcon()}
          <span>{loading ? 'Generating...' : getDisplayText()}</span>
          {userTier === 'paid' && (
            <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-2 py-0.5 rounded-full font-bold">
              PRO
            </span>
          )}
        </button>

        {/* Usage indicator for free users */}
        {userTier === 'free' && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">
              {usageCheck.remaining} generation{usageCheck.remaining !== 1 ? 's' : ''} remaining
            </span>
            <button
              onClick={onUpgradeClick}
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Upgrade for unlimited
            </button>
          </div>
        )}

        {/* Industry indicator */}
        {selectedIndustry && (
          <div className="flex items-center justify-center">
            <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-full border border-white/10">
              Optimized for {selectedIndustry.charAt(0).toUpperCase() + selectedIndustry.slice(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
} 