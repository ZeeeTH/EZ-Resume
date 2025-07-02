"use client"

import React from 'react';
import { useContactModal } from '../ContactModalContext';
import { Shield, Lock, Eye, Users, Globe, AlertTriangle } from 'lucide-react';

export default function PrivacyContent() {
  const { openModal } = useContactModal();
  
  return (
    <div className="text-gray-300 space-y-6 text-sm md:text-base">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 rounded-lg border border-blue-500/20">
        <div className="flex items-center space-x-3 mb-3">
          <Shield className="h-6 w-6 text-blue-400" />
          <h1 className="text-xl font-bold text-white">Privacy Policy</h1>
        </div>
        <p className="text-blue-100 mb-2"><strong>Last updated:</strong> January 2025</p>
        <p className="text-blue-100">
          EZ-Resume is an Australian business committed to protecting your privacy under Australian law. 
          This policy explains how we handle your personal information in plain English.
        </p>
      </div>

      {/* Quick Navigation */}
      <div className="bg-white/5 p-4 rounded-lg">
        <h4 className="text-white font-semibold mb-3">Quick Navigation</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <a href="#what-we-collect" className="text-purple-400 hover:text-purple-300">What We Collect</a>
          <a href="#why-we-collect" className="text-purple-400 hover:text-purple-300">Why We Use Data</a>
          <a href="#your-rights" className="text-purple-400 hover:text-purple-300">Your Rights</a>
          <a href="#third-parties" className="text-purple-400 hover:text-purple-300">Third Parties</a>
          <a href="#data-security" className="text-purple-400 hover:text-purple-300">Security</a>
          <a href="#retention" className="text-purple-400 hover:text-purple-300">Data Retention</a>
          <a href="#contact" className="text-purple-400 hover:text-purple-300">Contact Us</a>
          <a href="#international" className="text-purple-400 hover:text-purple-300">International Users</a>
        </div>
      </div>

      {/* About This Policy */}
      <section>
        <h2 className="text-lg font-semibold text-white mt-6 mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          About This Policy
        </h2>
        <div className="space-y-3">
          <p>
            <strong>Who we are:</strong> EZ-Resume is an Australian business that provides AI-powered resume and cover letter generation services.
          </p>
          <p>
            <strong>Australian Privacy Law:</strong> We comply with the Privacy Act 1988 (Cth) and the 13 Australian Privacy Principles (APPs). 
            For international users, we also comply with GDPR and other applicable privacy laws.
          </p>
          <p>
            <strong>What this covers:</strong> This policy explains how we handle your personal information when you use our website and services.
          </p>
        </div>
      </section>

      {/* What We Collect */}
      <section id="what-we-collect">
        <h2 className="text-lg font-semibold text-white mt-6 mb-4 flex items-center">
          <Eye className="h-5 w-5 mr-2" />
          1. What Personal Information We Collect (APP 3)
        </h2>
        
        <div className="space-y-4">
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Account Information</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Email address</strong> - For account creation, login, and document delivery</li>
              <li><strong>Password (encrypted)</strong> - Secure account access</li>
              <li><strong>Signup date and location</strong> - Account management and security</li>
              <li><strong>Industry selection</strong> - Personalised resume templates and AI training</li>
              <li><strong>Subscription tier</strong> - Access control and billing</li>
            </ul>
          </div>

          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Resume & Career Content</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Personal details</strong> - Name, phone, address, LinkedIn profile</li>
              <li><strong>Work experience</strong> - Job titles, companies, dates, responsibilities</li>
              <li><strong>Education</strong> - Degrees, institutions, dates, achievements</li>
              <li><strong>Skills and certifications</strong> - Professional and technical skills</li>
              <li><strong>Professional summary</strong> - Career objectives and highlights</li>
              <li><strong>Cover letters</strong> - Personalised cover letter content</li>
            </ul>
            <p className="text-yellow-300 text-sm mt-2 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              <strong>Important:</strong> Resume content is deleted immediately after PDF generation and email delivery.
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Usage Analytics</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>AI usage counters</strong> - Track free plan usage limits</li>
              <li><strong>Feature usage</strong> - Which tools and templates you use</li>
              <li><strong>Page views</strong> - Website navigation patterns</li>
              <li><strong>Technical data</strong> - Browser type, device, IP address (for security)</li>
              <li><strong>Error logs</strong> - Technical issues for improvement</li>
            </ul>
          </div>

          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Payment Information</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Payment status</strong> - Free or Professional tier</li>
              <li><strong>Purchase date</strong> - For account access and support</li>
              <li><strong>Transaction ID</strong> - For refunds and billing queries</li>
            </ul>
            <p className="text-green-300 text-sm mt-2">
              <strong>Note:</strong> Credit card details are processed and stored by Stripe, not us. 
              We never see or store your payment card information.
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Communication Data</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Support messages</strong> - Contact form submissions and replies</li>
              <li><strong>Email communications</strong> - Service updates and support</li>
              <li><strong>Feedback</strong> - Your comments and suggestions</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why We Collect */}
      <section id="why-we-collect">
        <h2 className="text-lg font-semibold text-white mt-6 mb-4">
          2. Why We Collect Your Information (APPs 3, 6)
        </h2>
        
        <div className="space-y-3">
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Primary Purposes</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Provide our service:</strong> Generate professional resumes and cover letters using AI</li>
              <li><strong>Deliver documents:</strong> Email your completed PDFs securely</li>
              <li><strong>Account management:</strong> Secure login, track usage limits, manage subscriptions</li>
              <li><strong>Payment processing:</strong> Handle Professional plan purchases and refunds</li>
              <li><strong>Customer support:</strong> Respond to questions and resolve issues</li>
            </ul>
          </div>

          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Secondary Purposes</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Service improvement:</strong> Analyse usage patterns to enhance features</li>
              <li><strong>AI training:</strong> Improve our AI models for better resume generation</li>
              <li><strong>Security:</strong> Detect fraud, prevent abuse, and protect user accounts</li>
              <li><strong>Legal compliance:</strong> Meet Australian tax, business, and privacy law requirements</li>
            </ul>
          </div>

          <p className="text-blue-200 bg-blue-500/10 p-3 rounded">
            <strong>Australian Privacy Principle 6:</strong> We only use your information for the purposes stated above, 
            or for related purposes you would reasonably expect. We will ask for your consent before using 
            your information for any other purpose.
          </p>
        </div>
      </section>

      {/* Third Parties */}
      <section id="third-parties">
        <h2 className="text-lg font-semibold text-white mt-6 mb-4">
          3. Who We Share Your Information With (APPs 6, 8)
        </h2>
        
        <div className="space-y-4">
          <p>We only share your information with trusted service providers who help us deliver our service:</p>

          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">🏢 Supabase (Database & Authentication)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>What they do:</strong> Secure database storage and user authentication</li>
              <li><strong>Data shared:</strong> Account information, usage data, stored resumes</li>
              <li><strong>Location:</strong> AWS servers with Australian data residency options</li>
              <li><strong>Protection:</strong> Enterprise-grade encryption and access controls</li>
            </ul>
          </div>

          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">🤖 OpenAI (AI Processing)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>What they do:</strong> AI-powered content generation for resumes</li>
              <li><strong>Data shared:</strong> Your job details and experience (during generation only)</li>
              <li><strong>Location:</strong> United States</li>
              <li><strong>Protection:</strong> Data is processed and immediately deleted, not stored or used for training</li>
            </ul>
          </div>

          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">💳 Stripe (Payment Processing)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>What they do:</strong> Secure payment processing and billing</li>
              <li><strong>Data shared:</strong> Payment information, billing details</li>
              <li><strong>Location:</strong> Global infrastructure with strong data protection</li>
              <li><strong>Protection:</strong> PCI DSS compliant, we never see your card details</li>
            </ul>
          </div>

          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">🌐 Vercel (Website Hosting)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>What they do:</strong> Host our website and handle web traffic</li>
              <li><strong>Data shared:</strong> Technical logs, performance data</li>
              <li><strong>Location:</strong> Global CDN with Australian edge servers</li>
              <li><strong>Protection:</strong> HTTPS encryption, DDoS protection</li>
            </ul>
          </div>

          <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
            <h3 className="text-red-300 font-semibold mb-2">🚫 What We DON'T Do</h3>
            <ul className="list-disc pl-5 space-y-1 text-red-200">
              <li>We never sell, rent, or trade your personal information to anyone</li>
              <li>We don't share your data with advertisers or marketing companies</li>
              <li>We don't use your resume content to train AI models</li>
              <li>We don't share data with employers or recruitment agencies</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Your Rights */}
      <section id="your-rights">
        <h2 className="text-lg font-semibold text-white mt-6 mb-4">
          4. Your Privacy Rights (APPs 6, 12, 13)
        </h2>
        
        <p className="mb-4">Under Australian privacy law, you have the following rights:</p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">📋 Access Your Data</h3>
            <p>Request a copy of all personal information we hold about you, including how we use it and who we share it with.</p>
            <p className="text-purple-300 text-sm mt-2">
              <strong>How:</strong> Use our <a href="/data-rights" className="underline hover:text-purple-200">Data Rights form</a> or contact us directly.
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">✏️ Correct Your Data</h3>
            <p>Request correction of inaccurate, incomplete, or outdated personal information.</p>
            <p className="text-purple-300 text-sm mt-2">
              <strong>How:</strong> Update through your dashboard or contact support for assistance.
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">🗑️ Delete Your Data</h3>
            <p>Request deletion of your personal information (subject to legal requirements).</p>
            <p className="text-purple-300 text-sm mt-2">
              <strong>How:</strong> Delete your account in dashboard settings or request through our Data Rights form.
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">📤 Export Your Data</h3>
            <p>Request a copy of your data in a portable format to transfer to another service.</p>
            <p className="text-purple-300 text-sm mt-2">
              <strong>How:</strong> Use our Data Rights form to request a complete data export.
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">🛑 Object to Processing</h3>
            <p>Object to certain uses of your data, particularly for direct marketing or analytics.</p>
            <p className="text-purple-300 text-sm mt-2">
              <strong>How:</strong> Contact us to discuss your specific concerns and preferences.
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">⚖️ Make a Complaint</h3>
            <p>If you're not satisfied with how we handle your privacy, you can complain to the OAIC.</p>
            <p className="text-purple-300 text-sm mt-2">
              <strong>OAIC:</strong> Office of the Australian Information Commissioner (oaic.gov.au)
            </p>
          </div>
        </div>

        <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20 mt-4">
          <h3 className="text-blue-300 font-semibold mb-2">How to Exercise Your Rights</h3>
          <ol className="list-decimal pl-5 space-y-1 text-blue-200">
            <li>Submit a request through our <a href="/data-rights" className="underline hover:text-blue-100">Data Rights form</a></li>
            <li>We'll verify your identity (for security)</li>
            <li>We'll process your request within 30 days</li>
            <li>We'll confirm completion and provide any requested information</li>
          </ol>
          <p className="text-blue-200 text-sm mt-2">
            <strong>No cost:</strong> We don't charge fees for reasonable requests under Australian privacy law.
          </p>
        </div>
      </section>

      {/* Data Security */}
      <section id="data-security">
        <h2 className="text-lg font-semibold text-white mt-6 mb-4 flex items-center">
          <Lock className="h-5 w-5 mr-2" />
          5. How We Protect Your Data (APP 11)
        </h2>
        
        <div className="space-y-4">
          <p>We implement comprehensive security measures to protect your personal information:</p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="text-white font-semibold mb-2">🔐 Technical Security</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>256-bit SSL/TLS encryption for all data transmission</li>
                <li>AES-256 encryption for data at rest</li>
                <li>Multi-factor authentication for admin access</li>
                <li>Regular security patches and updates</li>
                <li>Automated malware and intrusion detection</li>
              </ul>
            </div>

            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="text-white font-semibold mb-2">🏢 Operational Security</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Strict access controls (need-to-know basis only)</li>
                <li>Regular security audits and penetration testing</li>
                <li>Employee privacy and security training</li>
                <li>Secure data disposal procedures</li>
                <li>Incident response and breach notification plans</li>
              </ul>
            </div>
          </div>

          <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
            <h3 className="text-green-300 font-semibold mb-2">🛡️ Data Minimisation</h3>
            <p className="text-green-200">
              We follow the principle of data minimisation - we only collect, store, and process 
              the minimum amount of personal information necessary to provide our service effectively.
            </p>
          </div>

          <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
            <h3 className="text-yellow-300 font-semibold mb-2">🚨 Data Breach Response</h3>
            <p className="text-yellow-200 mb-2">
              If a data breach occurs that could harm you, we will:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-yellow-200">
              <li>Notify the OAIC within 72 hours (if required by law)</li>
              <li>Notify affected users as soon as reasonably possible</li>
              <li>Provide clear information about what happened and what we're doing</li>
              <li>Offer support and guidance to affected users</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Data Retention */}
      <section id="retention">
        <h2 className="text-lg font-semibold text-white mt-6 mb-4">
          6. How Long We Keep Your Data (APP 11)
        </h2>
        
        <div className="space-y-4">
          <p>We only keep your personal information for as long as necessary:</p>

          <div className="space-y-3">
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="text-white font-semibold mb-2">⚡ Immediate Deletion</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Resume content:</strong> Deleted immediately after PDF generation and email delivery</li>
                <li><strong>AI processing data:</strong> Deleted from OpenAI systems after processing</li>
                <li><strong>Temporary files:</strong> Deleted within 24 hours</li>
              </ul>
            </div>

            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="text-white font-semibold mb-2">📅 Active Account Data</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Account information:</strong> Kept while your account is active</li>
                <li><strong>Usage analytics:</strong> 24 months for service improvement</li>
                <li><strong>Saved resumes:</strong> Kept until you delete them or close your account</li>
              </ul>
            </div>

            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="text-white font-semibold mb-2">🏛️ Legal Requirements</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Payment records:</strong> 7 years (Australian tax law)</li>
                <li><strong>Customer support records:</strong> 3 years for quality and legal purposes</li>
                <li><strong>Security logs:</strong> 12 months for fraud prevention</li>
              </ul>
            </div>

            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="text-white font-semibold mb-2">❌ Account Deletion</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Inactive accounts:</strong> Automatically deleted after 2 years of inactivity</li>
                <li><strong>Requested deletion:</strong> Processed within 30 days of your request</li>
                <li><strong>Full data removal:</strong> All personal data deleted except legal requirements</li>
              </ul>
            </div>
          </div>

          <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
            <p className="text-purple-200">
              <strong>Want to delete your data sooner?</strong> You can request immediate deletion of your account 
              and all associated data at any time through your dashboard or our Data Rights form.
            </p>
          </div>
        </div>
      </section>

      {/* International Transfers */}
      <section id="international">
        <h2 className="text-lg font-semibold text-white mt-6 mb-4 flex items-center">
          <Globe className="h-5 w-5 mr-2" />
          7. International Data Transfers (APP 8)
        </h2>
        
        <div className="space-y-4">
          <p>
            Some of our service providers are located outside Australia. Here's how we protect your data:
          </p>

          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">🌏 Where Your Data Goes</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>United States:</strong> OpenAI (AI processing), Stripe (payments), Vercel (hosting)</li>
              <li><strong>European Union:</strong> Supabase (database - with Australian options available)</li>
              <li><strong>Australia:</strong> Local CDN servers and admin access</li>
            </ul>
          </div>

          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">🛡️ Protection Measures</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Standard Contractual Clauses:</strong> Legal agreements requiring adequate protection</li>
              <li><strong>Privacy Shield alternatives:</strong> Additional US privacy protections where available</li>
              <li><strong>GDPR compliance:</strong> EU-level protections for all users</li>
              <li><strong>Encryption in transit:</strong> All data encrypted during transfer</li>
              <li><strong>Minimal data:</strong> Only essential data crosses borders</li>
            </ul>
          </div>

          <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
            <h3 className="text-blue-300 font-semibold mb-2">🇦🇺 For Australian Users</h3>
            <p className="text-blue-200">
              We ensure that any overseas data processing meets Australian privacy standards. 
              You have the same privacy rights regardless of where your data is processed, 
              and we remain accountable under Australian privacy law.
            </p>
          </div>

          <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
            <h3 className="text-green-300 font-semibold mb-2">🌍 For International Users</h3>
            <p className="text-green-200 mb-2">
              We comply with privacy laws in your jurisdiction:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-green-200">
              <li><strong>EU/UK users:</strong> Full GDPR compliance</li>
              <li><strong>US users:</strong> CCPA compliance for California residents</li>
              <li><strong>Other jurisdictions:</strong> Local privacy law compliance where applicable</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Children's Privacy */}
      <section>
        <h2 className="text-lg font-semibold text-white mt-6 mb-4">
          8. Children's Privacy
        </h2>
        
        <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/20">
          <h3 className="text-orange-300 font-semibold mb-2">⚠️ Age Restriction</h3>
          <div className="text-orange-200 space-y-2">
            <p>Our service is designed for adults entering the workforce and is not suitable for children under 18.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>We do not knowingly collect personal information from anyone under 18</li>
              <li>If we discover we have collected child data, we will delete it immediately</li>
              <li>Parents/guardians should contact us if they believe we have collected their child's information</li>
              <li>Users must be 18+ to create an account or use our services</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Changes to Policy */}
      <section>
        <h2 className="text-lg font-semibold text-white mt-6 mb-4">
          9. Changes to This Policy
        </h2>
        
        <div className="space-y-3">
          <p>We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements.</p>
          
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">How We'll Notify You</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Material changes:</strong> Email notification to all users</li>
              <li><strong>Minor updates:</strong> Posted on our website with updated date</li>
              <li><strong>Legal changes:</strong> Prominent notice on our homepage</li>
              <li><strong>Continued use:</strong> Using our service after changes means you accept the updated policy</li>
            </ul>
          </div>

          <p className="text-gray-400 text-sm">
            We recommend reviewing this policy periodically to stay informed about how we protect your privacy.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section id="contact">
        <h2 className="text-lg font-semibold text-white mt-6 mb-4">
          10. Contact Us About Privacy
        </h2>
        
        <div className="space-y-4">
          <p>
            We're committed to addressing your privacy concerns promptly and transparently. 
            Here's how to reach us:
          </p>

          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-6 rounded-lg border border-purple-500/20">
            <h3 className="text-white font-semibold mb-4">Privacy Contact Information</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-purple-300 font-semibold mb-2">General Privacy Inquiries</h4>
                <ul className="space-y-1 text-purple-200">
                  <li><strong>Contact:</strong> <button type="button" onClick={openModal} className="text-pink-400 hover:underline hover:text-pink-300 font-medium bg-transparent border-none p-0 m-0 focus:outline-none">Privacy Officer</button></li>
                  <li><strong>Response time:</strong> Within 5 business days</li>
                  <li><strong>Method:</strong> Secure contact form</li>
                </ul>
              </div>

              <div>
                <h4 className="text-blue-300 font-semibold mb-2">Data Rights Requests</h4>
                <ul className="space-y-1 text-blue-200">
                  <li><strong>Portal:</strong> <a href="/data-rights" className="underline hover:text-blue-100">Data Rights Form</a></li>
                  <li><strong>Response time:</strong> Within 30 days</li>
                  <li><strong>Identity verification:</strong> Required for security</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white/5 rounded">
              <h4 className="text-white font-semibold mb-2">Business Details</h4>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li><strong>Entity:</strong> EZ-Resume (Australian Business)</li>
                <li><strong>Privacy Officer:</strong> Available through contact form</li>
                <li><strong>Jurisdiction:</strong> Australian Privacy Principles (APPs)</li>
                <li><strong>Regulator:</strong> Office of the Australian Information Commissioner (OAIC)</li>
              </ul>
            </div>
          </div>

          <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
            <h3 className="text-red-300 font-semibold mb-2">🚨 Privacy Complaints</h3>
            <div className="text-red-200 space-y-2">
              <p>If you have a privacy complaint:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Contact us first - we want to resolve your concerns directly</li>
                <li>We'll investigate and respond within 30 days</li>
                <li>If unsatisfied, you can complain to the OAIC (oaic.gov.au)</li>
                <li>EU users can also contact their local data protection authority</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="border-t border-white/10 pt-6 mt-8">
        <div className="bg-gradient-to-r from-gray-500/10 to-gray-600/10 p-4 rounded-lg">
          <h3 className="text-white font-semibold mb-2">Privacy Policy Summary</h3>
          <p className="text-gray-300 text-sm mb-3">
            This policy explains how EZ-Resume, an Australian business, handles your personal information 
            in compliance with Australian Privacy Principles and international privacy laws.
          </p>
          <div className="flex flex-wrap gap-4 text-xs">
            <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded">Australian Privacy Act 1988</span>
            <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded">GDPR Compliant</span>
            <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded">CCPA Compliant</span>
            <span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">Plain English</span>
          </div>
        </div>
      </div>
    </div>
  );
} 