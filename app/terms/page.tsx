import type { Metadata } from 'next'
import React from 'react';
import Link from 'next/link';
import TermsContent from './TermsContent';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Read the terms and conditions for using EZ Resume, our AI-powered resume and cover letter generator service.',
  keywords: 'terms and conditions, service agreement, user agreement, legal terms, EZ Resume terms',
  openGraph: {
    title: 'Terms and Conditions | EZ Resume',
    description: 'Read the terms and conditions for using EZ Resume, our AI-powered resume and cover letter generator service.',
    url: 'https://ez-resume.xyz/terms',
  },
  twitter: {
    title: 'Terms and Conditions | EZ Resume',
    description: 'Read the terms and conditions for using EZ Resume, our AI-powered resume and cover letter generator service.',
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-12 px-4">
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 md:p-12 max-w-2xl w-full shadow-2xl relative">
        <Link href="/" className="absolute left-6 top-6 text-blue-400 hover:text-white font-semibold text-sm flex items-center transition-colors">
          <span className="mr-2">←</span> Back to Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">Terms and Conditions</h1>
        <TermsContent />
      </div>
    </div>
  );
} 