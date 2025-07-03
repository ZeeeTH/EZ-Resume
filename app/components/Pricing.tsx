import React, { useState } from 'react';
import { CheckCircle, Crown, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Pricing() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
    <div className="max-w-4xl mx-auto mt-12 mb-12 select-none">
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h3>
          <p className="text-gray-300 text-lg">
            Pay once, use forever - No subscriptions, no recurring fees
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
        
        {/* Free Plan */}
                  {/* Free Plan */}
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
            <div className="text-center mb-4">
              <h4 className="text-xl font-bold text-white mb-2">Free Plan</h4>
              <div className="flex items-center justify-center space-x-2 mb-1">
                <span className="text-3xl font-bold text-blue-400">$0</span>
              </div>
              <p className="text-gray-400 text-sm">Perfect for testing our quality</p>
            </div>
            
            <ul className="space-y-2 text-sm text-gray-300 mb-6">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                1 Resume Creation
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                Classic Professional Template
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                3 Industry Options (Tech, Healthcare, Finance)
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                3 AI Bullet Points + 1 Summary + 1 Skills
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                PDF Download (with small watermark)
              </li>
            </ul>
          </div>

                  {/* Professional Plan */}
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-xl p-6 border border-purple-500/30 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </span>
            </div>
            <div className="text-center mb-4">
              <h4 className="text-xl font-bold text-white mb-2">Professional Plan</h4>
              <div className="flex items-center justify-center space-x-2 mb-1">
                <span className="text-3xl font-bold text-purple-400">$49 AUD</span>
              </div>
              <p className="text-gray-400 text-sm">One-time payment - Lifetime access</p>
              <p className="text-green-400 text-sm font-medium">Save $311+ vs competitors!</p>
            </div>
            <ul className="space-y-2 text-sm text-gray-300 mb-6">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                Unlimited Resume & Cover Letter Creation
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                All 9 Industries + 25+ Premium Templates
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                Unlimited AI Assistance (Bullet Points, Summaries, Skills)
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                Industry-Specific AI Prompts & Content
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                Professional Cover Letter Generator
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                Clean PDF Downloads (No Watermarks)
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                All Future Template Updates Included
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                Priority Customer Support
              </li>
            </ul>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button 
              onClick={handleUpgrade}
              disabled={isLoading || !user?.email}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
          </div>
              </div>
        
        {/* Pricing Note */}
        <div className="text-center mt-4 pt-2 border-t border-white/10">
          <p className="text-sm text-gray-400">ALL PRICES ARE IN AUD</p>
        </div>
      </div>
    </div>
  );
}
