import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-12 px-4">
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 md:p-12 max-w-2xl w-full shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">Privacy Policy</h1>
        <div className="text-gray-300 space-y-4 text-sm md:text-base">
          <p><strong>Last updated:</strong> June 2024</p>
          <p>EZ Resume is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information when you use our AI-powered resume and cover letter generator.</p>

          <h2 className="text-lg font-semibold text-white mt-6 mb-2">1. Information We Collect</h2>
          <ul className="list-disc pl-6">
            <li>Personal information you provide (name, email, work history, etc.) to generate your documents.</li>
            <li>Payment information is processed securely by our payment provider (Stripe); we do not store your payment details.</li>
            <li>Basic analytics data (browser, device, usage patterns) to improve our service.</li>
          </ul>

          <h2 className="text-lg font-semibold text-white mt-6 mb-2">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6">
            <li>To generate your resume and/or cover letter using AI.</li>
            <li>To send your documents to your email address.</li>
            <li>To process payments and provide customer support.</li>
            <li>To improve and secure our website.</li>
          </ul>

          <h2 className="text-lg font-semibold text-white mt-6 mb-2">3. Data Retention</h2>
          <ul className="list-disc pl-6">
            <li>Your personal data is deleted after your documents are generated and sent.</li>
            <li>We do not store your resume or cover letter content after processing.</li>
          </ul>

          <h2 className="text-lg font-semibold text-white mt-6 mb-2">4. Data Security</h2>
          <ul className="list-disc pl-6">
            <li>We use industry-standard security measures to protect your data.</li>
            <li>All data is encrypted in transit and at rest.</li>
          </ul>

          <h2 className="text-lg font-semibold text-white mt-6 mb-2">5. Sharing of Information</h2>
          <ul className="list-disc pl-6">
            <li>We do not sell, trade, or share your personal information with third parties.</li>
            <li>Payment processing is handled by Stripe, subject to their privacy policy.</li>
          </ul>

          <h2 className="text-lg font-semibold text-white mt-6 mb-2">6. Your Rights</h2>
          <ul className="list-disc pl-6">
            <li>You may request access to or deletion of your personal data at any time.</li>
            <li>Contact us using the form on the main page for any privacy-related requests.</li>
          </ul>

          <h2 className="text-lg font-semibold text-white mt-6 mb-2">7. Cookies and Analytics</h2>
          <ul className="list-disc pl-6">
            <li>We use cookies and analytics tools to understand usage and improve our service.</li>
            <li>No cookies are used for advertising or tracking outside our site.</li>
          </ul>

          <h2 className="text-lg font-semibold text-white mt-6 mb-2">8. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.</p>

          <h2 className="text-lg font-semibold text-white mt-6 mb-2">9. Contact</h2>
          <p>If you have any questions about this Privacy Policy, please contact us using the form on the main page.</p>
        </div>
      </div>
    </div>
  );
} 