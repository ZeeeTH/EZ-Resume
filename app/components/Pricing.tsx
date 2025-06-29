import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function Pricing() {
  return (
    <div className="max-w-4xl mx-auto mt-12 mb-12 select-none">
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h3>
          <p className="text-gray-300 text-lg">
            No hidden fees, no subscriptions - just great results
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Resume Only */}
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
            <div className="text-center mb-4">
              <h4 className="text-xl font-bold text-white mb-2">Resume Only</h4>
              <div className="flex items-center justify-center space-x-2 mb-1">
                <span className="text-3xl font-bold text-blue-400">$14.99</span>
                <span className="text-lg text-gray-400 line-through">$29.99</span>
              </div>
              <p className="text-gray-400 text-sm">One-time payment</p>
              <p className="text-green-400 text-sm font-medium">Save $14.00!</p>
            </div>
            <ul className="space-y-2 text-sm text-gray-300 mb-6">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                Professional resume design
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                ATS-optimized formatting
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                AI-enhanced content
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                PDF download
              </li>
            </ul>
          </div>

          {/* Resume + Cover Letter */}
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-xl p-6 border border-purple-500/30 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </span>
            </div>
            <div className="text-center mb-4">
              <h4 className="text-xl font-bold text-white mb-2">Resume + Cover Letter</h4>
              <div className="flex items-center justify-center space-x-2 mb-1">
                <span className="text-3xl font-bold text-purple-400">$0.50</span>
                <span className="text-lg text-gray-400 line-through">$49.99</span>
              </div>
              <p className="text-gray-400 text-sm">One-time payment</p>
              <p className="text-green-400 text-sm font-medium">Save $25.00!</p>
            </div>
            <ul className="space-y-2 text-sm text-gray-300 mb-6">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                Everything in Resume Only
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                Personalized cover letter
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                Target company optimization
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                Both PDF downloads
              </li>
            </ul>
          </div>
        </div>
        
        {/* Pricing Note */}
        <div className="text-center mt-4 pt-2 border-t border-white/10">
          <p className="text-sm text-gray-400">All prices in USD</p>
        </div>
      </div>
    </div>
  );
}
