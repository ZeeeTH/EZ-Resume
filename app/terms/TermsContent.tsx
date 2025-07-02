"use client"

import React from 'react';
import { useContactModal } from '../ContactModalContext';

export default function TermsContent() {
  const { openModal } = useContactModal();
  
  return (
    <div className="text-gray-300 space-y-4 text-sm md:text-base">
      <p><strong>Last updated:</strong> {new Date().toLocaleDateString('en-AU')}</p>
      
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
        <p className="text-blue-200"><strong>Important:</strong> These Terms of Service are governed by Australian law. By using EZ Resume, you agree to these terms and acknowledge your rights under Australian Consumer Law.</p>
      </div>

      <p>Welcome to EZ Resume ("we," "our," or "us"). These Terms of Service ("Terms") govern your access to and use of our AI-powered resume and cover letter generation platform ("Service"). By accessing or using our Service, you agree to be bound by these Terms.</p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-4">1. Service Description and Scope</h2>
      
      <h3 className="text-lg font-medium text-white mt-4 mb-2">1.1 What We Provide</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li>AI-powered resume and cover letter generation tools</li>
        <li>Professional resume templates (Classic, Modern, Structured)</li>
        <li>Industry-specific content suggestions</li>
        <li>PDF generation and download capabilities</li>
        <li>Basic customer support via contact form</li>
      </ul>

      <h3 className="text-lg font-medium text-white mt-4 mb-2">1.2 What We Don't Guarantee</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li>Job placement, interviews, or employment outcomes</li>
        <li>100% accuracy of AI-generated content</li>
        <li>Compatibility with all employers' requirements</li>
        <li>Uninterrupted or error-free service availability</li>
        <li>Complete elimination of grammatical or factual errors</li>
      </ul>

      <h3 className="text-lg font-medium text-white mt-4 mb-2">1.3 Service Availability</h3>
      <p>We aim for 99% uptime but cannot guarantee uninterrupted service. Planned maintenance will be communicated in advance where possible. We are not liable for temporary service interruptions due to technical issues, maintenance, or circumstances beyond our reasonable control.</p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-4">2. AI Content Disclaimers and Limitations</h2>
      
      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
        <p className="text-yellow-200"><strong>Important AI Disclaimer:</strong> Our AI generates content based on patterns and data. You must review, verify, and take full responsibility for all content before use.</p>
      </div>

      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Accuracy:</strong> AI-generated content may contain errors, inaccuracies, or inappropriate suggestions</li>
        <li><strong>Originality:</strong> While we strive for unique content, AI may produce similar phrases across different users</li>
        <li><strong>Compliance:</strong> You must ensure generated content complies with anti-discrimination laws and employer requirements</li>
        <li><strong>Professional Responsibility:</strong> You are solely responsible for verifying all facts, achievements, and claims in your resume</li>
        <li><strong>Industry Specificity:</strong> AI suggestions may not always align with specific industry standards or expectations</li>
      </ul>

      <h2 className="text-xl font-semibold text-white mt-8 mb-4">3. User Responsibilities and Conduct</h2>
      
      <h3 className="text-lg font-medium text-white mt-4 mb-2">3.1 Required Conduct</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li>Provide accurate and truthful information</li>
        <li>Review and edit all generated content before use</li>
        <li>Comply with all applicable laws and regulations</li>
        <li>Respect intellectual property rights</li>
        <li>Use the Service only for lawful purposes</li>
      </ul>

      <h3 className="text-lg font-medium text-white mt-4 mb-2">3.2 Prohibited Uses</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li>Creating false, misleading, or deceptive resumes</li>
        <li>Using the Service for commercial resale or redistribution</li>
        <li>Attempting to reverse engineer, hack, or compromise our systems</li>
        <li>Uploading malicious code, viruses, or harmful content</li>
        <li>Violating any applicable laws or regulations</li>
        <li>Impersonating others or providing false identity information</li>
        <li>Using automated tools to access the Service without permission</li>
      </ul>

      <h3 className="text-lg font-medium text-white mt-4 mb-2">3.3 Age Requirements</h3>
      <p>You must be at least 18 years old to use this Service. If you are under 18, you may only use the Service with parental or guardian consent and supervision.</p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-4">4. Payment Terms and Pricing</h2>
      
      <h3 className="text-lg font-medium text-white mt-4 mb-2">4.1 Pricing Structure</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Free Tier:</strong> Limited AI generations and basic templates</li>
        <li><strong>Professional Upgrade:</strong> One-time payment for unlimited AI generations and premium features</li>
        <li>All prices include GST where applicable</li>
        <li>Prices are displayed in Australian Dollars (AUD)</li>
      </ul>

      <h3 className="text-lg font-medium text-white mt-4 mb-2">4.2 Payment Processing</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li>Payments processed securely via Stripe</li>
        <li>One-time payment model - no recurring charges</li>
        <li>Payment confirmation sent via email</li>
        <li>GST receipts provided for Australian transactions</li>
      </ul>

      <h3 className="text-lg font-medium text-white mt-4 mb-2">4.3 Refund Policy</h3>
      <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-4">
        <p className="text-green-200"><strong>Australian Consumer Guarantee:</strong> You have rights under Australian Consumer Law that cannot be excluded, including guarantees about acceptable quality and fitness for purpose.</p>
      </div>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>14-Day Refund Period:</strong> Full refund available within 14 days of purchase if unsatisfied</li>
        <li><strong>Technical Issues:</strong> Immediate refund if service doesn't work as described</li>
        <li><strong>Process:</strong> Contact us via our contact form to request refunds</li>
        <li><strong>Processing Time:</strong> Refunds processed within 5-10 business days</li>
        <li>Your rights under Australian Consumer Law remain unaffected by this policy</li>
      </ul>

      <h2 className="text-xl font-semibold text-white mt-8 mb-4">5. Intellectual Property Rights</h2>
      
      <h3 className="text-lg font-medium text-white mt-4 mb-2">5.1 Our Intellectual Property</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li>EZ Resume platform, software, and technology</li>
        <li>Resume templates, designs, and layouts</li>
        <li>Branding, logos, and trademarks</li>
        <li>AI algorithms and processing methods</li>
        <li>Website content and user interface</li>
      </ul>

      <h3 className="text-lg font-medium text-white mt-4 mb-2">5.2 Your Content Rights</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Your Information:</strong> You retain full ownership of personal information you provide</li>
        <li><strong>Generated Documents:</strong> You own the final resume/cover letter documents you create</li>
        <li><strong>Personal Use License:</strong> You may use generated documents for personal job applications</li>
        <li><strong>Commercial Restrictions:</strong> No resale, redistribution, or commercial use of our templates or platform</li>
      </ul>

      <h3 className="text-lg font-medium text-white mt-4 mb-2">5.3 License to Use Our Service</h3>
      <p>We grant you a limited, non-exclusive, non-transferable license to use our Service for personal purposes in accordance with these Terms. This license terminates when your access ends.</p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-4">6. Privacy and Data Handling</h2>
      <p>Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our Privacy Policy, which forms part of these Terms. By using our Service, you consent to our privacy practices as described in our Privacy Policy.</p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-4">7. Limitation of Liability</h2>
      
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4">
        <p className="text-red-200"><strong>Australian Consumer Law Notice:</strong> Some limitations may not apply to you if you are a consumer under Australian law. Nothing in these Terms excludes, restricts, or modifies any guarantee, condition, warranty, or consumer right that cannot be lawfully excluded.</p>
      </div>

      <h3 className="text-lg font-medium text-white mt-4 mb-2">7.1 Permitted Limitations</h3>
      <p>To the maximum extent permitted by law:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>We exclude liability for indirect, consequential, or special damages</li>
        <li>Our total liability is limited to the amount you paid for the Service</li>
        <li>We do not guarantee employment outcomes or job placement success</li>
        <li>We are not liable for decisions made by employers based on generated content</li>
      </ul>

      <h3 className="text-lg font-medium text-white mt-4 mb-2">7.2 What We Don't Exclude</h3>
      <p>We do not exclude or limit liability for:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Death or personal injury caused by our negligence</li>
        <li>Fraud or fraudulent misrepresentation</li>
        <li>Breach of conditions or warranties implied by Australian Consumer Law</li>
        <li>Any other liability that cannot be excluded by law</li>
      </ul>

      <h2 className="text-xl font-semibold text-white mt-8 mb-4">8. Account Termination</h2>
      
      <h3 className="text-lg font-medium text-white mt-4 mb-2">8.1 Termination by You</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li>You may stop using the Service at any time</li>
        <li>Contact us to request account deletion and data removal</li>
        <li>Refund eligibility as per our refund policy</li>
      </ul>

      <h3 className="text-lg font-medium text-white mt-4 mb-2">8.2 Termination by Us</h3>
      <p>We may suspend or terminate your access if you:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Violate these Terms of Service</li>
        <li>Engage in prohibited conduct</li>
        <li>Fail to pay required fees</li>
        <li>Use the Service in ways that harm our business or other users</li>
      </ul>

      <h3 className="text-lg font-medium text-white mt-4 mb-2">8.3 Data Handling Upon Termination</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li>Account data deleted within 30 days of termination</li>
        <li>You may download your generated documents before termination</li>
        <li>Some information may be retained as required by law or for legitimate business purposes</li>
      </ul>

      <h2 className="text-xl font-semibold text-white mt-8 mb-4">9. Force Majeure and Service Interruptions</h2>
      <p>We are not liable for delays or failures in performance resulting from circumstances beyond our reasonable control, including but not limited to:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Natural disasters, pandemics, or emergencies</li>
        <li>Government actions or regulations</li>
        <li>Internet or telecommunications failures</li>
        <li>Third-party service provider outages (including AI providers)</li>
        <li>Cyber attacks or security incidents</li>
      </ul>

      <h2 className="text-xl font-semibold text-white mt-8 mb-4">10. Changes to Terms</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>We may update these Terms to reflect changes in law, our Service, or business practices</li>
        <li>Significant changes will be communicated via email or prominent website notice</li>
        <li>You'll have 30 days to review changes before they take effect</li>
        <li>Continued use after changes constitute acceptance of new Terms</li>
        <li>If you don't agree to changes, you may terminate your account</li>
      </ul>

      <h2 className="text-xl font-semibold text-white mt-8 mb-4">11. Dispute Resolution</h2>
      
      <h3 className="text-lg font-medium text-white mt-4 mb-2">11.1 Australian Jurisdiction</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li>These Terms are governed by Australian law</li>
        <li>Disputes will be resolved in Australian courts</li>
        <li>Australian Consumer Law applies where relevant</li>
      </ul>

      <h3 className="text-lg font-medium text-white mt-4 mb-2">11.2 Resolution Process</h3>
      <ol className="list-decimal pl-6 space-y-2">
        <li><strong>Direct Contact:</strong> Contact us first to resolve issues informally</li>
        <li><strong>Mediation:</strong> If needed, we'll attempt mediation through an Australian mediation service</li>
        <li><strong>Legal Action:</strong> Formal legal proceedings as a last resort</li>
      </ol>

      <h3 className="text-lg font-medium text-white mt-4 mb-2">11.3 Consumer Rights</h3>
      <p>If you are a consumer under Australian Consumer Law, you may also contact:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Australian Competition and Consumer Commission (ACCC)</li>
        <li>Your state or territory consumer protection agency</li>
        <li>Australian Financial Complaints Authority (for payment disputes)</li>
      </ul>

      <h2 className="text-xl font-semibold text-white mt-8 mb-4">12. General Provisions</h2>
      
      <h3 className="text-lg font-medium text-white mt-4 mb-2">12.1 Entire Agreement</h3>
      <p>These Terms, together with our Privacy Policy, constitute the entire agreement between you and EZ Resume.</p>

      <h3 className="text-lg font-medium text-white mt-4 mb-2">12.2 Severability</h3>
      <p>If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.</p>

      <h3 className="text-lg font-medium text-white mt-4 mb-2">12.3 No Waiver</h3>
      <p>Our failure to enforce any provision does not constitute a waiver of our right to enforce it later.</p>

      <h3 className="text-lg font-medium text-white mt-4 mb-2">12.4 Assignment</h3>
      <p>You may not assign your rights under these Terms. We may assign our rights to any affiliated company or successor.</p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-4">13. Contact Information</h2>
      <p>For questions about these Terms of Service, refund requests, or to report issues, please <button type="button" onClick={openModal} className="text-pink-400 hover:underline hover:text-pink-300 font-medium bg-transparent border-none p-0 m-0 focus:outline-none">contact us</button> using our contact form.</p>
      
      <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-4 mt-8">
        <p className="text-gray-400 text-sm">
          <strong>Acknowledgment:</strong> By using EZ Resume, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. You also acknowledge your rights under Australian Consumer Law and confirm that you are legally capable of entering into this agreement.
        </p>
      </div>
    </div>
  );
} 