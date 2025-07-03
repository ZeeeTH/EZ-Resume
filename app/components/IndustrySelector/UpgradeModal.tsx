import React, { useState } from 'react';
import { X, Crown, CheckCircle, Sparkles, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  trigger?: 'skills' | 'industry' | 'ai_limit' | 'general';
  context?: {
    industry?: string;
    experienceLevel?: string;
    lockedCount?: number;
  };
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  trigger = 'general',
  context = {}
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const getUpgradeMessage = () => {
    switch (trigger) {
      case 'skills':
        return `Unlock ${context.lockedCount || 'more'} professional ${context.industry || ''} skills for ${context.experienceLevel || ''} level professionals`;
      case 'industry':
        return `Access industry-specific templates and skills for all 9 industries`;
      case 'ai_limit':
        return `Get unlimited AI content generation for better resume writing`;
      default:
        return `Upgrade to Professional for the complete resume building experience`;
    }
  };

  const getContextualBenefits = () => {
    const baseBenefits = [
      'All 9 industries with specialized templates',
      '200+ professional skills across all experience levels',
      'Unlimited AI content generation',
      'Cover letter generator',
      'One-time payment - no monthly fees'
    ];

    if (trigger === 'skills') {
      return [
        `${context.lockedCount || 'More'} additional ${context.industry || ''} skills`,
        ...baseBenefits
      ];
    }

    if (trigger === 'industry') {
      return [
        '6 additional locked industries',
        ...baseBenefits
      ];
    }

    return baseBenefits;
  };

  const handleUpgrade = async () => {
    if (!user?.email) {
      setError('Please sign in to upgrade your account');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail: user.email,
          upgradeType: 'premium'
        })
      });
      
      const result = await response.json();
      
      if (result.success && result.url) {
        // Redirect to Stripe checkout
        window.location.href = result.url;
      } else {
        setError(result.error || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
              <Crown className="h-6 w-6 text-black" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Upgrade to Professional</h3>
              <p className="text-gray-400 text-sm">Unlock the full experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={isLoading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="contextual-upgrade-prompt">
          <p className="text-gray-300 mb-6 text-center">
            {getUpgradeMessage()}
          </p>

          <ul className="upgrade-benefits space-y-3 mb-8">
            {getContextualBenefits().map((benefit, index) => (
              <li key={index} className="flex items-center space-x-3 text-sm text-gray-300">
                <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <button 
              onClick={handleUpgrade}
              disabled={isLoading || !user?.email}
              className="upgrade-btn-primary w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Crown className="h-5 w-5" />
                  <span>Upgrade Now - $49 AUD</span>
                </>
              )}
            </button>
            
            <div className="text-center">
              <p className="text-xs text-gray-400">
                One-time payment • No recurring fees • Instant access
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal; 