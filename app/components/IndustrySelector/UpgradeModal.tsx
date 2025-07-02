import React from 'react';
import { X, Star, Lock, Check } from 'lucide-react';
import { industries } from '../../../data/industry-data';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  onUpgrade
}) => {
  if (!isOpen) return null;

  const lockedIndustries = industries.filter(industry => !industry.availableInFreeTier);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Star className="h-5 w-5 text-yellow-400 mr-2" />
            Unlock All Industries
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-300 mb-4">
            Upgrade to unlock all {industries.length} industries and get industry-specific resume optimization!
          </p>
          
          <div className="space-y-2 mb-4">
            <p className="text-sm font-medium text-gray-200">Locked Industries:</p>
            {lockedIndustries.map(industry => (
              <div key={industry.id} className="flex items-center text-sm text-gray-300">
                <Lock className="h-3 w-3 text-yellow-400 mr-2" />
                <span className="font-medium">{industry.name}</span>
                <span className="text-gray-400 ml-2">- {industry.description}</span>
              </div>
            ))}
          </div>
          
          <div className="bg-white/5 rounded-lg p-3 mb-4">
            <p className="text-sm font-medium text-green-400 mb-2 flex items-center">
              <Check className="h-4 w-4 mr-1" />
              Premium Benefits:
            </p>
            <ul className="text-xs text-gray-300 space-y-1 ml-5">
              <li>• Industry-specific resume templates</li>
              <li>• Tailored keyword optimization</li>
              <li>• Industry-focused AI suggestions</li>
              <li>• Unlimited resume generations</li>
            </ul>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-lg border border-white/20 transition-all duration-200"
          >
            Maybe Later
          </button>
          <button
            onClick={onUpgrade}
            className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal; 