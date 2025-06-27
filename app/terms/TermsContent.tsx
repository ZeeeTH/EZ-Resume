"use client"

import React from 'react';
import { useContactModal } from '../ContactModalContext';

export default function TermsContent() {
  const { openModal } = useContactModal();
  
  return (
    <div className="text-gray-300 space-y-4 text-sm md:text-base">
      <p><strong>Last updated:</strong> 27/06/2025</p>
      <p>Welcome to EZ Resume! By accessing or using our website and services, you agree to be bound by these Terms and Conditions. Please read them carefully before using our AI-powered resume and cover letter generator.</p>

      <h2 className="text-lg font-semibold text-white mt-6 mb-2">1. Service Description</h2>
      <p>EZ Resume provides users with tools to generate professional resumes and cover letters using artificial intelligence. The service is intended for personal, non-commercial use only.</p>

      <h2 className="text-lg font-semibold text-white mt-6 mb-2">2. User Responsibilities</h2>
      <ul className="list-disc pl-6">
        <li>You agree to provide accurate and complete information when using our service.</li>
        <li>You are responsible for reviewing and editing the generated documents before use.</li>
        <li>You agree not to use the service for any unlawful or harmful purposes.</li>
        <li>You must be at least 18 years old or have parental consent to use this service.</li>
      </ul>

      <h2 className="text-lg font-semibold text-white mt-6 mb-2">3. Payments and Refunds</h2>
      <ul className="list-disc pl-6">
        <li>All payments are processed securely via our payment provider (Stripe).</li>
        <li>Fees are clearly displayed before purchase. No hidden charges.</li>
        <li>If you are not satisfied with your resume, you may request a free revision or a full refund within 7 days of purchase.</li>
      </ul>

      <h2 className="text-lg font-semibold text-white mt-6 mb-2">4. Intellectual Property</h2>
      <ul className="list-disc pl-6">
        <li>All content, branding, and software on this site are the property of EZ Resume.</li>
        <li>You may use generated documents for personal use only. Commercial redistribution is prohibited.</li>
      </ul>

      <h2 className="text-lg font-semibold text-white mt-6 mb-2">5. Limitation of Liability</h2>
      <ul className="list-disc pl-6">
        <li>EZ Resume is not liable for any damages resulting from the use or inability to use our service.</li>
        <li>We do not guarantee job placement or employment outcomes.</li>
        <li>The AI-generated content is provided as-is and should be reviewed for accuracy.</li>
      </ul>

      <h2 className="text-lg font-semibold text-white mt-6 mb-2">6. Changes to Terms</h2>
      <p>We may update these Terms and Conditions at any time. Changes will be posted on this page with an updated date. Continued use of the service constitutes acceptance of the new terms.</p>

      <h2 className="text-lg font-semibold text-white mt-6 mb-2">7. Contact</h2>
      <p>If you have any questions about these Terms, please <button type="button" onClick={openModal} className="text-pink-400 hover:underline hover:text-pink-300 font-medium bg-transparent border-none p-0 m-0 focus:outline-none">contact us</button>.</p>
    </div>
  );
} 