import type { Metadata } from 'next'
import React from 'react';
import Link from 'next/link';
import DataRequestForm from '../components/DataRequestForm';

export const metadata: Metadata = {
  title: 'Data Rights & Privacy Requests',
  description: 'Exercise your data rights under GDPR and CCPA. Request access, deletion, portability, or rectification of your personal data.',
  keywords: 'data rights, GDPR, CCPA, privacy request, data deletion, data access, right to be forgotten',
  openGraph: {
    title: 'Data Rights & Privacy Requests | EZ Resume',
    description: 'Exercise your data rights under GDPR and CCPA. Request access, deletion, portability, or rectification of your personal data.',
    url: 'https://ez-resume.xyz/data-rights',
  },
  twitter: {
    title: 'Data Rights & Privacy Requests | EZ Resume',
    description: 'Exercise your data rights under GDPR and CCPA.',
  },
}

export default function DataRightsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl">
        <Link href="/" className="inline-flex items-center text-blue-400 hover:text-white font-semibold text-sm mb-8 transition-colors">
          <span className="mr-2">←</span> Back to Home
        </Link>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Your Data Rights</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We respect your privacy and are committed to protecting your personal data. 
            Under GDPR and CCPA, you have specific rights regarding your personal information.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* GDPR Rights */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-white mb-4">GDPR Rights (EU Users)</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <h3 className="text-white font-semibold">Right to Access</h3>
                  <p className="text-gray-300 text-sm">Request a copy of all personal data we hold about you</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <h3 className="text-white font-semibold">Right to Rectification</h3>
                  <p className="text-gray-300 text-sm">Correct inaccurate or incomplete personal data</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <h3 className="text-white font-semibold">Right to Erasure</h3>
                  <p className="text-gray-300 text-sm">Request deletion of your personal data (Right to be Forgotten)</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <h3 className="text-white font-semibold">Right to Portability</h3>
                  <p className="text-gray-300 text-sm">Receive your data in a structured, machine-readable format</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <h3 className="text-white font-semibold">Right to Object</h3>
                  <p className="text-gray-300 text-sm">Object to processing based on legitimate interests</p>
                </div>
              </div>
            </div>
          </div>

          {/* CCPA Rights */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-white mb-4">CCPA Rights (California Users)</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <h3 className="text-white font-semibold">Right to Know</h3>
                  <p className="text-gray-300 text-sm">Know what personal information is collected and how it's used</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <h3 className="text-white font-semibold">Right to Delete</h3>
                  <p className="text-gray-300 text-sm">Request deletion of personal information we've collected</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <h3 className="text-white font-semibold">Right to Opt-Out</h3>
                  <p className="text-gray-300 text-sm">Opt out of the sale of personal information</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <h3 className="text-white font-semibold">Right to Non-Discrimination</h3>
                  <p className="text-gray-300 text-sm">Not be discriminated against for exercising your rights</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <h3 className="text-white font-semibold">Right to Portability</h3>
                  <p className="text-gray-300 text-sm">Receive your data in a portable and readily usable format</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Request Form */}
        <DataRequestForm />

        {/* Additional Information */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-400 text-xl">⏱️</span>
            </div>
            <h3 className="text-white font-semibold mb-2">30-Day Response</h3>
            <p className="text-gray-300 text-sm">We respond to all data requests within 30 days as required by law</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-400 text-xl">🔒</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Secure Process</h3>
            <p className="text-gray-300 text-sm">All requests are processed securely with proper identity verification</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-400 text-xl">📧</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Email Support</h3>
            <p className="text-gray-300 text-sm">Contact us directly if you need assistance with your data request</p>
          </div>
        </div>

        {/* Links to other privacy pages */}
        <div className="mt-12 text-center">
          <p className="text-gray-300 mb-4">For more information about how we handle your data:</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/privacy" 
              className="text-blue-400 hover:text-white font-medium transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="text-blue-400 hover:text-white font-medium transition-colors"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 