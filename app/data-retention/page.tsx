import type { Metadata } from 'next'
import React from 'react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Data Retention Policy',
  description: 'Learn about our data retention practices and how long we keep different types of personal information.',
  keywords: 'data retention, data deletion, privacy policy, GDPR compliance, data storage',
  openGraph: {
    title: 'Data Retention Policy | EZ Resume',
    description: 'Learn about our data retention practices and how long we keep different types of personal information.',
    url: 'https://ez-resume.xyz/data-retention',
  },
  twitter: {
    title: 'Data Retention Policy | EZ Resume',
    description: 'Learn about our data retention practices and how long we keep different types of personal information.',
  },
}

export default function DataRetentionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-12 px-4">
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 md:p-12 max-w-4xl w-full shadow-2xl relative">
        <Link href="/" className="absolute left-6 top-6 text-blue-400 hover:text-white font-semibold text-sm flex items-center transition-colors">
          <span className="mr-2">←</span> Back to Home
        </Link>
        
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">Data Retention Policy</h1>
        <p className="text-gray-300 text-center mb-8"><strong>Last updated:</strong> 27/06/2025</p>

        <div className="text-gray-300 space-y-6 text-sm md:text-base">
          <p>
            This Data Retention Policy explains how long EZ Resume retains different types of personal information 
            and the criteria we use to determine retention periods. We are committed to keeping your data only 
            for as long as necessary to provide our services and comply with legal obligations.
          </p>

          <h2 className="text-lg font-semibold text-white mt-8 mb-4">1. Retention Principles</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Data Minimization:</strong> We only collect and retain data that is necessary for our services</li>
            <li><strong>Purpose Limitation:</strong> Data is retained only for the specific purposes for which it was collected</li>
            <li><strong>Legal Compliance:</strong> We retain data as required by applicable laws and regulations</li>
            <li><strong>Security:</strong> All retained data is protected with appropriate security measures</li>
            <li><strong>User Rights:</strong> Users can request deletion of their data at any time</li>
          </ul>

          <h2 className="text-lg font-semibold text-white mt-8 mb-4">2. Data Retention Periods</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-600">
              <thead>
                <tr className="bg-gray-800">
                  <th className="border border-gray-600 p-3 text-left text-white font-semibold">Data Type</th>
                  <th className="border border-gray-600 p-3 text-left text-white font-semibold">Retention Period</th>
                  <th className="border border-gray-600 p-3 text-left text-white font-semibold">Reason</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border border-gray-600">
                  <td className="border border-gray-600 p-3">
                    <strong>Resume/Cover Letter Content</strong><br/>
                    <span className="text-gray-400 text-sm">Job descriptions, skills, achievements</span>
                  </td>
                  <td className="border border-gray-600 p-3 text-green-300">Immediate deletion</td>
                  <td className="border border-gray-600 p-3">
                    Deleted immediately after generation and email delivery to protect user privacy
                  </td>
                </tr>
                <tr className="border border-gray-600 bg-gray-800/30">
                  <td className="border border-gray-600 p-3">
                    <strong>Personal Information</strong><br/>
                    <span className="text-gray-400 text-sm">Name, email, phone number</span>
                  </td>
                  <td className="border border-gray-600 p-3 text-yellow-300">30 days</td>
                  <td className="border border-gray-600 p-3">
                    Retained briefly for customer support and to handle any issues with document delivery
                  </td>
                </tr>
                <tr className="border border-gray-600">
                  <td className="border border-gray-600 p-3">
                    <strong>Payment Records</strong><br/>
                    <span className="text-gray-400 text-sm">Transaction IDs, amounts, dates</span>
                  </td>
                  <td className="border border-gray-600 p-3 text-orange-300">7 years</td>
                  <td className="border border-gray-600 p-3">
                    Required by tax laws and financial regulations for audit purposes
                  </td>
                </tr>
                <tr className="border border-gray-600 bg-gray-800/30">
                  <td className="border border-gray-600 p-3">
                    <strong>Communication Data</strong><br/>
                    <span className="text-gray-400 text-sm">Support emails, contact form submissions</span>
                  </td>
                  <td className="border border-gray-600 p-3 text-blue-300">2 years</td>
                  <td className="border border-gray-600 p-3">
                    Retained for customer support history and service improvement
                  </td>
                </tr>
                <tr className="border border-gray-600">
                  <td className="border border-gray-600 p-3">
                    <strong>Analytics Data</strong><br/>
                    <span className="text-gray-400 text-sm">Usage patterns, page views</span>
                  </td>
                  <td className="border border-gray-600 p-3 text-purple-300">26 months</td>
                  <td className="border border-gray-600 p-3">
                    Google Analytics default retention period for website performance analysis
                  </td>
                </tr>
                <tr className="border border-gray-600 bg-gray-800/30">
                  <td className="border border-gray-600 p-3">
                    <strong>Log Files</strong><br/>
                    <span className="text-gray-400 text-sm">Server logs, error logs</span>
                  </td>
                  <td className="border border-gray-600 p-3 text-red-300">90 days</td>
                  <td className="border border-gray-600 p-3">
                    Retained for security monitoring, debugging, and performance optimization
                  </td>
                </tr>
                <tr className="border border-gray-600">
                  <td className="border border-gray-600 p-3">
                    <strong>Cookie Data</strong><br/>
                    <span className="text-gray-400 text-sm">Session cookies, preferences</span>
                  </td>
                  <td className="border border-gray-600 p-3 text-green-300">Session/1 year</td>
                  <td className="border border-gray-600 p-3">
                    Session cookies deleted when browser closes, preference cookies for 1 year
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-lg font-semibold text-white mt-8 mb-4">3. Data Deletion Process</h2>
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-3">Automatic Deletion</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Resume content is automatically deleted immediately after processing</li>
              <li>Personal information is automatically deleted after 30 days</li>
              <li>Log files are automatically rotated and deleted after 90 days</li>
              <li>Analytics data is automatically deleted after 26 months</li>
            </ul>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg mt-4">
            <h3 className="text-white font-semibold mb-3">Manual Deletion</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Users can request immediate deletion of their data at any time</li>
              <li>We process deletion requests within 30 days as required by GDPR</li>
              <li>We provide confirmation when data has been successfully deleted</li>
              <li>Some data may be retained longer if required by law</li>
            </ul>
          </div>

          <h2 className="text-lg font-semibold text-white mt-8 mb-4">4. Data Backup and Recovery</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>We maintain secure backups for disaster recovery purposes</li>
            <li>Backups are automatically deleted according to our retention schedule</li>
            <li>Backup data is encrypted and stored securely</li>
            <li>We do not use backups to restore data that has been deleted at user request</li>
          </ul>

          <h2 className="text-lg font-semibold text-white mt-8 mb-4">5. Third-Party Data Retention</h2>
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-3">Service Providers</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>OpenAI:</strong> Data is processed and immediately deleted after AI generation</li>
              <li><strong>Stripe:</strong> Payment data retention follows their privacy policy and legal requirements</li>
              <li><strong>Email Services:</strong> Email delivery logs are retained according to provider policies</li>
              <li><strong>Google Analytics:</strong> Analytics data retention follows Google's policies</li>
            </ul>
          </div>

          <h2 className="text-lg font-semibold text-white mt-8 mb-4">6. Legal Basis for Retention</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Contract Performance:</strong> Data necessary to provide our services</li>
            <li><strong>Legal Obligation:</strong> Data required by tax, financial, or other regulations</li>
            <li><strong>Legitimate Interest:</strong> Data for security, fraud prevention, and service improvement</li>
            <li><strong>Consent:</strong> Data for analytics and marketing (where applicable)</li>
          </ul>

          <h2 className="text-lg font-semibold text-white mt-8 mb-4">7. Data Retention Review</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>We review our retention periods annually</li>
            <li>Retention periods are updated based on legal requirements and business needs</li>
            <li>Users are notified of significant changes to retention periods</li>
            <li>We ensure retention periods are no longer than necessary</li>
          </ul>

          <h2 className="text-lg font-semibold text-white mt-8 mb-4">8. Contact Information</h2>
          <p>
            If you have questions about our data retention practices or would like to request deletion of your data, 
            please visit our <Link href="/data-rights" className="text-blue-400 hover:text-white underline">Data Rights page</Link> or 
            contact us directly.
          </p>

          <div className="mt-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <h3 className="text-blue-300 font-semibold mb-2">Key Takeaways</h3>
            <ul className="text-blue-200 text-sm space-y-1">
              <li>• Resume content is deleted immediately after generation</li>
              <li>• Personal information is deleted within 30 days</li>
              <li>• You can request immediate deletion at any time</li>
              <li>• We only keep data as long as legally necessary</li>
              <li>• All data is protected with appropriate security measures</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 