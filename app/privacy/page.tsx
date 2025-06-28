import type { Metadata } from 'next'
import React from 'react';
import Link from 'next/link';
import PrivacyContent from './PrivacyContent';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how EZ Resume protects your privacy and handles your personal information when using our AI-powered resume generator.',
  keywords: 'privacy policy, data protection, personal information, GDPR, privacy',
  openGraph: {
    title: 'Privacy Policy | EZ Resume',
    description: 'Learn how EZ Resume protects your privacy and handles your personal information when using our AI-powered resume generator.',
    url: 'https://ez-resume.xyz/privacy',
  },
  twitter: {
    title: 'Privacy Policy | EZ Resume',
    description: 'Learn how EZ Resume protects your privacy and handles your personal information.',
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-12 px-4">
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 md:p-12 max-w-2xl w-full shadow-2xl relative select-none">
        <Link href="/" className="absolute left-6 top-6 text-blue-400 hover:text-white font-semibold text-sm flex items-center transition-colors">
          <span className="mr-2">←</span> Back to Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">Privacy Policy</h1>
        <PrivacyContent />
      </div>
    </div>
  );
} 