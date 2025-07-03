'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Mail, FileText, Crown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
  const [email, setEmail] = useState<string>('');
  const [upgradeType, setUpgradeType] = useState<string>('premium');
  const [sessionId, setSessionId] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    // Get email and upgrade type from URL params if available
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    const upgradeTypeParam = urlParams.get('upgradeType');
    const sessionIdParam = urlParams.get('session_id');
    
    if (emailParam) {
      setEmail(emailParam);
    }
    if (upgradeTypeParam) {
      setUpgradeType(upgradeTypeParam);
    }
    if (sessionIdParam) {
      setSessionId(sessionIdParam);
    }
  }, []);

  const handleDashboardRedirect = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl text-center max-w-md w-full">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
        
        <h1 className="text-3xl font-bold text-white mb-4">
          {sessionId ? 'Upgrade Successful!' : 'Payment Successful!'}
        </h1>
        
        <p className="text-gray-300 mb-6">
          {sessionId 
            ? 'Thank you for upgrading to Professional! Your account has been upgraded and you now have access to unlimited AI assistance and premium features.'
            : 'Your payment has been processed successfully. You can now access your upgraded features.'
          }
        </p>
        
        {email && (
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <Mail className="w-5 h-5 text-blue-400 mr-2" />
              <p className="text-sm text-gray-400">Account upgraded for:</p>
            </div>
            <p className="text-white font-medium">{email}</p>
          </div>
        )}
        
        <div className="space-y-3 text-sm text-gray-400 mb-8">
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
            <span>Your payment has been processed securely</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-blue-400 mr-2" />
            <span>Your account has been upgraded to Professional</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-purple-400 mr-2" />
            <span>Unlimited AI assistance now available</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-yellow-400 mr-2" />
            <span>Access all premium features in your dashboard</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleDashboardRedirect}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <Crown className="h-5 w-5" />
            <span>Go to Dashboard</span>
            <ArrowRight className="h-5 w-5" />
          </button>
          
          <Link
            href="/resume-builder"
            className="block w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 border border-white/10"
          >
            Create New Resume
          </Link>
        </div>
        
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-xs text-gray-400">
            Need help? Contact us at{' '}
            <a href="mailto:support@ez-resume.xyz" className="text-blue-400 hover:text-blue-300">
              support@ez-resume.xyz
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 