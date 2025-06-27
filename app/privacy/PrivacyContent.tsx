"use client"

import React from 'react';
import { useContactModal } from '../ContactModalContext';

export default function PrivacyContent() {
  const { openModal } = useContactModal();
  
  return (
    <div className="text-gray-300 space-y-4 text-sm md:text-base">
      <p><strong>Last updated:</strong> 27/06/2025</p>
      <p>EZ Resume ("we," "our," or "us") is committed to protecting your privacy and ensuring compliance with data protection laws, including the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA). This Privacy Policy explains how we collect, use, process, and protect your personal information when you use our AI-powered resume and cover letter generator.</p>

      <h2 className="text-lg font-semibold text-white mt-6 mb-2">1. Information We Collect</h2>
      
      <h3 className="text-md font-semibold text-white mt-4 mb-2">1.1 Personal Information You Provide</h3>
      <ul className="list-disc pl-6">
        <li><strong>Contact Information:</strong> Name, email address, phone number</li>
        <li><strong>Professional Information:</strong> Work history, education, skills, certifications, achievements</li>
        <li><strong>Resume Content:</strong> Job descriptions, responsibilities, accomplishments, personal statements</li>
        <li><strong>Cover Letter Content:</strong> Job applications, company information, personal statements</li>
        <li><strong>Communication Data:</strong> Messages sent through our contact forms or support channels</li>
      </ul>

      <h3 className="text-md font-semibold text-white mt-4 mb-2">1.2 Automatically Collected Information</h3>
      <ul className="list-disc pl-6">
        <li><strong>Technical Data:</strong> IP address, browser type, device information, operating system</li>
        <li><strong>Usage Data:</strong> Pages visited, time spent, features used, error logs</li>
        <li><strong>Analytics Data:</strong> Google Analytics data (with consent), performance metrics</li>
        <li><strong>Cookies:</strong> Essential cookies for functionality, analytics cookies (with consent)</li>
      </ul>

      <h3 className="text-md font-semibold text-white mt-4 mb-2">1.3 Payment Information</h3>
      <ul className="list-disc pl-6">
        <li>Payment processing is handled securely by Stripe</li>
        <li>We do not store your payment card details</li>
        <li>Stripe may store payment information according to their privacy policy</li>
      </ul>

      <h2 className="text-lg font-semibold text-white mt-6 mb-2">2. Legal Basis for Processing (GDPR)</h2>
      <p>We process your personal data based on the following legal grounds:</p>
      <ul className="list-disc pl-6">
        <li><strong>Contract Performance:</strong> To provide our resume generation services</li>
        <li><strong>Legitimate Interest:</strong> To improve our services, prevent fraud, and ensure security</li>
        <li><strong>Consent:</strong> For analytics and marketing communications (where applicable)</li>
        <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
      </ul>

      <h2 className="text-lg font-semibold text-white mt-6 mb-2">3. How We Use Your Information</h2>
      <ul className="list-disc pl-6">
        <li><strong>Service Provision:</strong> Generate resumes and cover letters using AI technology</li>
        <li><strong>Communication:</strong> Send generated documents to your email address</li>
        <li><strong>Customer Support:</strong> Respond to inquiries and provide assistance</li>
        <li><strong>Payment Processing:</strong> Process payments for premium features</li>
        <li><strong>Service Improvement:</strong> Analyze usage patterns to enhance our platform</li>
        <li><strong>Security:</strong> Detect and prevent fraud, abuse, and security threats</li>
        <li><strong>Legal Compliance:</strong> Fulfill legal obligations and respond to legal requests</li>
      </ul>

      <h2 className="text-lg font-semibold text-white mt-6 mb-2">4. Data Sharing and Third Parties</h2>
      
      <h3 className="text-md font-semibold text-white mt-4 mb-2">4.1 Service Providers</h3>
      <ul className="list-disc pl-6">
        <li><strong>OpenAI:</strong> AI processing for resume and cover letter generation</li>
        <li><strong>Stripe:</strong> Payment processing and fraud prevention</li>
        <li><strong>Email Services:</strong> Document delivery and communication</li>
        <li><strong>Analytics:</strong> Google Analytics for website performance (with consent)</li>
        <li><strong>Hosting:</strong> Vercel for website hosting and infrastructure</li>
      </ul>

      <h3 className="text-md font-semibold text-white mt-4 mb-2">4.2 Data Sharing Limitations</h3>
      <ul className="list-disc pl-6">
        <li>We do not sell, rent, or trade your personal information</li>
        <li>We do not share data with third parties for marketing purposes</li>
        <li>Service providers are bound by data processing agreements</li>
        <li>We may share data if required by law or to protect our rights</li>
      </ul>

      <h2 className="text-lg font-semibold text-white mt-6 mb-2">5. Data Retention and Deletion</h2>
      
      <h3 className="text-md font-semibold text-white mt-4 mb-2">5.1 Retention Periods</h3>
      <ul className="list-disc pl-6">
        <li><strong>Resume/Cover Letter Content:</strong> Deleted immediately after generation and email delivery</li>
        <li><strong>Personal Information:</strong> Deleted within 30 days of document generation</li>
        <li><strong>Analytics Data:</strong> Retained for up to 26 months (Google Analytics)</li>
        <li><strong>Payment Records:</strong> Retained for 7 years for tax and legal compliance</li>
        <li><strong>Communication Data:</strong> Retained for 2 years for customer support</li>
      </ul>

      <h3 className="text-md font-semibold text-white mt-4 mb-2">5.2 Data Deletion</h3>
      <ul className="list-disc pl-6">
        <li>You can request immediate deletion of your data at any time</li>
        <li>We will confirm deletion within 30 days of your request</li>
        <li>Some data may be retained longer if required by law</li>
      </ul>

      <h2 className="text-lg font-semibold text-white mt-6 mb-2">6. Data Security</h2>
      <ul className="list-disc pl-6">
        <li><strong>Encryption:</strong> All data is encrypted in transit (HTTPS/TLS) and at rest</li>
        <li><strong>Access Controls:</strong> Strict access controls and authentication</li>
        <li><strong>Security Monitoring:</strong> Continuous monitoring for security threats</li>
        <li><strong>Data Minimization:</strong> We only collect data necessary for our services</li>
        <li><strong>Regular Audits:</strong> Security assessments and vulnerability testing</li>
      </ul>

      <h2 className="text-lg font-semibold text-white mt-6 mb-2">7. Your Rights (GDPR & CCPA)</h2>
      
      <h3 className="text-md font-semibold text-white mt-4 mb-2">7.1 Right to Access</h3>
      <p>You have the right to request a copy of all personal data we hold about you.</p>

      <h3 className="text-md font-semibold text-white mt-4 mb-2">7.2 Right to Rectification</h3>
      <p>You can request correction of inaccurate or incomplete personal data.</p>

      <h3 className="text-md font-semibold text-white mt-4 mb-2">7.3 Right to Erasure (Right to be Forgotten)</h3>
      <p>You can request deletion of your personal data, subject to legal requirements.</p>

      <h3 className="text-md font-semibold text-white mt-4 mb-2">7.4 Right to Restrict Processing</h3>
      <p>You can request that we limit how we process your personal data.</p>

      <h3 className="text-md font-semibold text-white mt-4 mb-2">7.5 Right to Data Portability</h3>
      <p>You can request a copy of your data in a structured, machine-readable format.</p>

      <h3 className="text-md font-semibold text-white mt-4 mb-2">7.6 Right to Object</h3>
      <p>You can object to processing based on legitimate interests.</p>

      <h3 className="text-md font-semibold text-white mt-4 mb-2">7.7 Right to Withdraw Consent</h3>
      <p>Where processing is based on consent, you can withdraw consent at any time.</p>

      <h3 className="text-md font-semibold text-white mt-4 mb-2">7.8 Right to Lodge a Complaint</h3>
      <p>You have the right to complain to your local data protection authority.</p>

      <h2 className="text-lg font-semibold text-white mt-6 mb-2">8. Cookies and Tracking</h2>
      
      <h3 className="text-md font-semibold text-white mt-4 mb-2">8.1 Essential Cookies</h3>
      <ul className="list-disc pl-6">
        <li>Session management and security</li>
        <li>Form functionality and validation</li>
        <li>These cookies are necessary for the website to function</li>
      </ul>

      <h3 className="text-md font-semibold text-white mt-4 mb-2">8.2 Analytics Cookies</h3>
      <ul className="list-disc pl-6">
        <li>Google Analytics for website performance</li>
        <li>These cookies require your consent</li>
        <li>You can opt out through our cookie consent banner</li>
      </ul>

      <h3 className="text-md font-semibold text-white mt-4 mb-2">8.3 Cookie Management</h3>
      <ul className="list-disc pl-6">
        <li>You can manage cookie preferences in your browser settings</li>
        <li>Our cookie consent banner allows granular control</li>
        <li>Opting out of analytics cookies won't affect core functionality</li>
      </ul>

      <h2 className="text-lg font-semibold text-white mt-6 mb-2">9. International Data Transfers</h2>
      <ul className="list-disc pl-6">
        <li>Your data may be processed in countries outside your residence</li>
        <li>We ensure adequate protection through Standard Contractual Clauses (SCCs)</li>
        <li>All transfers comply with applicable data protection laws</li>
        <li>Service providers are located in the EU, US, and other jurisdictions</li>
      </ul>

      <h2 className="text-lg font-semibold text-white mt-6 mb-2">10. Children's Privacy</h2>
      <ul className="list-disc pl-6">
        <li>Our service is not intended for children under 16 years of age</li>
        <li>We do not knowingly collect personal information from children under 16</li>
        <li>If we become aware of such collection, we will delete it immediately</li>
        <li>Parents or guardians should contact us if they believe we have collected children's data</li>
      </ul>

      <h2 className="text-lg font-semibold text-white mt-6 mb-2">11. Data Breach Procedures</h2>
      <ul className="list-disc pl-6">
        <li>We have procedures to detect, report, and investigate data breaches</li>
        <li>In case of a breach, we will notify affected users within 72 hours</li>
        <li>We will also notify relevant authorities as required by law</li>
        <li>All breaches are documented and reviewed to prevent recurrence</li>
      </ul>

      <h2 className="text-lg font-semibold text-white mt-6 mb-2">12. Changes to This Policy</h2>
      <ul className="list-disc pl-6">
        <li>We may update this Privacy Policy periodically</li>
        <li>Material changes will be communicated via email or website notice</li>
        <li>Continued use of our service constitutes acceptance of updated policies</li>
        <li>Previous versions are archived and available upon request</li>
      </ul>

      <h2 className="text-lg font-semibold text-white mt-6 mb-2">13. Contact Information</h2>
      <p>For privacy-related inquiries, data requests, or to exercise your rights:</p>
      <ul className="list-disc pl-6">
        <li><strong>Email:</strong> <button type="button" onClick={openModal} className="text-pink-400 hover:underline hover:text-pink-300 font-medium bg-transparent border-none p-0 m-0 focus:outline-none">Contact us</button></li>
        <li><strong>Data Protection Officer:</strong> Available through our contact form</li>
        <li><strong>Response Time:</strong> We will respond to all requests within 30 days</li>
        <li><strong>Verification:</strong> We may need to verify your identity before processing requests</li>
      </ul>

      <h2 className="text-lg font-semibold text-white mt-6 mb-2">14. Legal Basis and Jurisdiction</h2>
      <ul className="list-disc pl-6">
        <li>This policy is governed by applicable data protection laws</li>
        <li>For EU users: GDPR applies to all processing activities</li>
        <li>For California users: CCPA provides additional rights</li>
        <li>Disputes will be resolved in accordance with applicable law</li>
      </ul>
    </div>
  );
} 