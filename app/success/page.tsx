'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Mail, FileText } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
  const [email, setEmail] = useState<string>('');
  const [documentType, setDocumentType] = useState<string>('');

  useEffect(() => {
    // Get email and document type from URL params if available
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    const documentTypeParam = urlParams.get('documentType');
    
    if (emailParam) {
      setEmail(emailParam);
    }
    if (documentTypeParam) {
      setDocumentType(documentTypeParam);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-white mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-gray-300 mb-6">
            Thank you for your purchase! Your {documentType === 'both' ? 'resume and cover letter' : 'resume'} is being generated and will be sent to your email shortly.
          </p>
          
          {email && (
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center mb-2">
                <Mail className="w-5 h-5 text-blue-400 mr-2" />
                <p className="text-sm text-gray-400">Documents will be sent to:</p>
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
              <FileText className="w-4 h-4 text-blue-400 mr-2" />
              <span>Documents are being generated with AI</span>
            </div>
            <div className="flex items-center">
              <Mail className="w-4 h-4 text-purple-400 mr-2" />
              <span>You'll receive an email within 2-3 minutes</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-yellow-400 mr-2" />
              <span>Check your spam folder if you don't see it</span>
            </div>
          </div>
          
          <Link 
            href="/"
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
          >
            Create Another Document
          </Link>
        </div>
      </div>
    </div>
  );
} 