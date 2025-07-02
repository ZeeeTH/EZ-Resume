import { useState } from 'react';
import { CheckCircle, Crown, Shield, Zap, Users, Globe, Lock } from 'lucide-react';

export default function FAQ() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const categories = [
    { id: 'all', name: 'All Questions', icon: CheckCircle },
    { id: 'getting-started', name: 'Getting Started', icon: Users },
    { id: 'ai-features', name: 'AI Features', icon: Zap },
    { id: 'australian-focus', name: 'Australian Focus', icon: Globe },
    { id: 'security', name: 'Security & Privacy', icon: Shield },
    { id: 'support', name: 'Support & Guarantees', icon: Lock },
  ];

  const filteredFAQs = activeCategory === 'all' 
    ? faqData 
    : faqData.filter(faq => faq.category === activeCategory);

  return (
    <div className="max-w-4xl mx-auto select-none">
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h3>
          <p className="text-gray-300 text-lg">
            Everything you need to know about Australia's leading AI resume builder
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          {filteredFAQs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/5 hover:border-pink-500/50 transition-all duration-200"
              onClick={() => toggleFAQ(idx)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`w-2 h-2 rounded-full ${getCategoryColor(faq.category)}`}></span>
                  <h4 className="text-lg font-bold text-white pr-4">{faq.question}</h4>
                </div>
                <span className={`text-white transition-transform duration-200 text-2xl font-bold flex-shrink-0 ${openFAQ === idx ? 'rotate-0' : ''}`}>
                  {openFAQ === idx ? '−' : '+'}
                </span>
              </div>
              {openFAQ === idx && (
                <div className="text-gray-300 mt-4 ml-5 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Help Section */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
          <div className="text-center">
            <h4 className="text-white font-semibold mb-2">Still have questions?</h4>
            <p className="text-gray-300 text-sm mb-4">
              We're here to help! Get in touch and we'll respond within 24 hours.
            </p>
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getCategoryColor(category: string) {
  const colors = {
    'getting-started': 'bg-blue-400',
    'ai-features': 'bg-purple-400',
    'australian-focus': 'bg-green-400',
    'security': 'bg-yellow-400',
    'support': 'bg-pink-400',
  };
  return colors[category as keyof typeof colors] || 'bg-gray-400';
}

const faqData = [
  // Getting Started & Pricing
  {
    category: 'getting-started',
    question: 'Why choose EZ-Resume over free alternatives like Canva?',
    answer: (
      <div className="space-y-3">
        <p>While free tools like Canva offer basic templates, EZ-Resume provides intelligent, AI-powered content creation specifically designed for the Australian job market:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>AI-Generated Content:</strong> Our AI writes your bullet points, professional summary, and skills - not just templates</li>
          <li><strong>Australian ATS Optimization:</strong> Designed for systems used by SEEK, LinkedIn, and major Australian employers</li>
          <li><strong>Industry Expertise:</strong> Trained on Australian hiring practices and job market expectations</li>
          <li><strong>Professional Quality:</strong> Enterprise-grade output that matches $500+ professional resume services</li>
          <li><strong>No Design Skills Required:</strong> Focus on content while we handle professional formatting</li>
        </ul>
        <p>Free tools require you to write everything yourself. We do the heavy lifting with AI that understands what Australian employers want to see.</p>
      </div>
    ),
  },
  {
    category: 'getting-started',
    question: 'How is your one-time $49 AUD payment better than monthly subscriptions?',
    answer: (
      <div className="space-y-3">
        <p>Our one-time payment model is designed with job seekers in mind:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>No Recurring Stress:</strong> Pay once, own forever - no monthly charges during your job search</li>
          <li><strong>Better Value:</strong> Most subscription services cost $15-30/month. Our $49 pays for itself in 2-3 months</li>
          <li><strong>Unlimited Access:</strong> Create unlimited resumes for different roles without worrying about monthly limits</li>
          <li><strong>No Pressure:</strong> Take your time to perfect your resume without subscription deadlines</li>
          <li><strong>Future Updates:</strong> Get new features and templates as we add them, no extra cost</li>
        </ul>
        <p>Perfect for job seekers who want professional results without ongoing financial commitment during an already stressful time.</p>
      </div>
    ),
  },
  {
    category: 'getting-started',
    question: 'What exactly do I get with the free plan vs Professional?',
    answer: (
      <div className="space-y-4">
        <div className="bg-white/5 p-4 rounded-lg">
          <h5 className="text-white font-semibold mb-2 flex items-center">
            <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded mr-2">FREE</span>
            Free Plan Includes:
          </h5>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>3 AI bullet point generations per month</li>
            <li>1 AI professional summary per month</li>
            <li>1 AI skills generation per month</li>
            <li>Access to 3 basic templates</li>
            <li>Access to 3 industries (Technology, Healthcare, Finance)</li>
            <li>Basic resume builder</li>
            <li>PDF download</li>
          </ul>
        </div>
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-4 rounded-lg border border-yellow-500/20">
          <h5 className="text-white font-semibold mb-2 flex items-center">
            <Crown className="h-4 w-4 mr-2 text-yellow-400" />
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs px-2 py-1 rounded mr-2">PRO</span>
            Professional ($49 AUD) Includes:
          </h5>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><strong>Unlimited AI generations</strong> - bullet points, summaries, skills</li>
            <li><strong>All 9 industry templates</strong> including premium designs</li>
            <li><strong>Industry-specific AI training</strong> for all sectors</li>
            <li><strong>Advanced ATS optimization</strong></li>
            <li><strong>Premium support</strong> with 24-hour response</li>
            <li><strong>Cover letter generation</strong></li>
            <li><strong>Resume storage and management</strong></li>
            <li><strong>Priority feature access</strong></li>
          </ul>
        </div>
        <p className="text-sm text-gray-400">Perfect for testing our quality before upgrading for unlimited access during your job search.</p>
      </div>
    ),
  },

  // AI Features & Limits
  {
    category: 'ai-features',
    question: 'How does your AI actually work to create better resumes?',
    answer: (
      <div className="space-y-3">
        <p>Our AI is specifically trained on Australian hiring practices and uses advanced language models to create compelling content:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Industry Intelligence:</strong> Trained on thousands of successful Australian resumes across 9 industries</li>
          <li><strong>ATS Optimization:</strong> Automatically includes relevant keywords and formatting for Australian recruitment systems</li>
          <li><strong>Achievement-Focused Writing:</strong> Transforms basic job duties into compelling achievement statements</li>
          <li><strong>Australian Language:</strong> Uses terminology and phrasing that resonates with Australian employers</li>
          <li><strong>Dynamic Content:</strong> Each generation is unique and tailored to your specific experience and target role</li>
        </ul>
        <p>Unlike template-based builders, our AI actually <em>writes</em> content for you, analyzing your input to create professional, compelling descriptions that highlight your value to employers.</p>
      </div>
    ),
  },
  {
    category: 'ai-features',
    question: 'What happens when I hit my free plan AI limits?',
    answer: (
      <div className="space-y-3">
        <p>When you reach your monthly limits on the free plan:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Clear Notifications:</strong> You'll see exactly how many generations you have left</li>
          <li><strong>Manual Option:</strong> You can still create resumes manually without AI assistance</li>
          <li><strong>Reset Date:</strong> Your limits reset on the 1st of each month</li>
          <li><strong>Upgrade Anytime:</strong> Unlock unlimited access instantly with our one-time Professional upgrade</li>
          <li><strong>No Data Loss:</strong> All your work is saved and accessible regardless of your plan</li>
        </ul>
        <p>The free plan is perfect for testing our quality. Most users find 3 bullet points, 1 summary, and 1 skills generation enough to create one excellent resume and decide if they want unlimited access.</p>
      </div>
    ),
  },
  {
    category: 'ai-features',
    question: 'Can I edit the AI-generated content?',
    answer: (
      <p>Absolutely! Our AI provides a strong foundation, but you have complete control. You can edit any AI-generated content directly in the builder, combine multiple AI suggestions, or use the AI output as inspiration for your own writing. The AI is designed to save you time and provide professional-quality starting points, not replace your personal touch. Many users find the AI gets them 80% of the way there, then they customize the final 20% to perfectly match their experience.</p>
    ),
  },

  // Australian Focus
  {
    category: 'australian-focus',
    question: 'What makes your Australian focus different from global resume builders?',
    answer: (
      <div className="space-y-3">
        <p>We're built specifically for the Australian job market, not adapted from global platforms:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Australian ATS Systems:</strong> Optimized for SEEK, CareerOne, and systems used by major Australian employers like Telstra, Woolworths, and government departments</li>
          <li><strong>Local Terminology:</strong> Uses Australian spelling, job titles, and industry terms (e.g., "organised" not "organized")</li>
          <li><strong>Cultural Understanding:</strong> Reflects Australian workplace culture - direct communication, achievement-focused, less corporate jargon</li>
          <li><strong>Industry Standards:</strong> Follows Australian resume conventions for length, sections, and formatting preferences</li>
          <li><strong>Compliance Ready:</strong> Adheres to Australian privacy laws and employment standards</li>
          <li><strong>Local Support:</strong> Australian business hours support from people who understand the local job market</li>
        </ul>
        <p>Global platforms treat Australia as an afterthought. We're built for Australian job seekers by people who understand what works here.</p>
      </div>
    ),
  },
  {
    category: 'australian-focus',
    question: 'Are your resumes compatible with major Australian employers and recruitment systems?',
    answer: (
      <div className="space-y-3">
        <p>Yes! Our resumes are specifically designed and tested for Australian ATS systems:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>SEEK Compatibility:</strong> Optimized for Australia's largest job platform</li>
          <li><strong>Major Employers:</strong> Tested with systems used by Commonwealth Bank, Westpac, Telstra, BHP, Woolworths, and Coles</li>
          <li><strong>Government Roles:</strong> Compatible with Australian Public Service and state government application systems</li>
          <li><strong>Recruitment Agencies:</strong> Works with systems used by Hays, Robert Half, Michael Page, and other major agencies</li>
          <li><strong>Industry-Specific:</strong> Tailored for healthcare (NSW Health), education (Department of Education), and mining (Rio Tinto, Fortescue) systems</li>
        </ul>
        <p>We regularly test and update our templates to ensure compatibility with the evolving landscape of Australian recruitment technology.</p>
      </div>
    ),
  },

  // Security & Privacy
  {
    category: 'security',
    question: 'How do you protect my personal information and comply with Australian privacy laws?',
    answer: (
      <div className="space-y-3">
        <p>We take your privacy seriously and follow strict Australian data protection standards:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Australian Privacy Principles:</strong> Full compliance with the Privacy Act 1988 and GDPR standards</li>
          <li><strong>Data Sovereignty:</strong> Your data is processed and stored in accordance with Australian law</li>
          <li><strong>Minimal Collection:</strong> We only collect information necessary to provide our service</li>
          <li><strong>No Data Selling:</strong> We never sell, rent, or share your personal information with third parties</li>
          <li><strong>Secure Encryption:</strong> All data is encrypted in transit and at rest using industry-standard protocols</li>
          <li><strong>Right to Deletion:</strong> You can request complete deletion of your data at any time</li>
          <li><strong>Transparent Policies:</strong> Clear, readable privacy policy written in plain English</li>
        </ul>
        <p>As an Australian business, we're committed to protecting your privacy in accordance with local laws and expectations.</p>
      </div>
    ),
  },
  {
    category: 'security',
    question: 'Is my resume data stored securely and can I delete it?',
    answer: (
      <div className="space-y-3">
        <p>Your data security and control are our top priorities:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Secure Storage:</strong> All resumes are encrypted and stored on secure Australian servers</li>
          <li><strong>Access Control:</strong> Only you can access your resumes - we cannot view your personal content</li>
          <li><strong>Automatic Backups:</strong> Your work is automatically saved and backed up to prevent data loss</li>
          <li><strong>Export Options:</strong> Download your data in multiple formats anytime</li>
          <li><strong>Complete Deletion:</strong> Delete individual resumes or your entire account through your dashboard</li>
          <li><strong>Retention Policy:</strong> We only keep data as long as necessary to provide our service</li>
        </ul>
        <p>You maintain complete control over your data with the ability to access, edit, download, or delete it at any time through your secure dashboard.</p>
      </div>
    ),
  },

  // Support & Guarantees
  {
    category: 'support',
    question: 'What is your refund policy and satisfaction guarantee?',
    answer: (
      <div className="space-y-3">
        <p>We stand behind our service with a comprehensive satisfaction guarantee:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>30-Day Money-Back Guarantee:</strong> Full refund if you're not satisfied within 30 days of purchase</li>
          <li><strong>No Questions Asked:</strong> Simple refund process through your dashboard or by contacting support</li>
          <li><strong>Free Trial:</strong> Test our quality with the free plan before purchasing</li>
          <li><strong>Revision Support:</strong> Free assistance to improve your resume if you're not happy with the initial result</li>
          <li><strong>Technical Issues:</strong> Full refund if technical problems prevent you from using our service</li>
        </ul>
        <p>We're confident in our service quality and want you to feel secure in your purchase. Our goal is your success in landing your ideal job.</p>
      </div>
    ),
  },
  {
    category: 'support',
    question: 'What technical requirements do I need and which browsers work best?',
    answer: (
      <div className="space-y-3">
        <p>EZ-Resume works on any modern device with internet access:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Browsers:</strong> Chrome, Safari, Firefox, Edge (latest versions recommended)</li>
          <li><strong>Devices:</strong> Desktop, laptop, tablet, or smartphone</li>
          <li><strong>Internet:</strong> Stable internet connection required for AI features</li>
          <li><strong>Operating Systems:</strong> Windows, Mac, iOS, Android, Linux</li>
          <li><strong>Storage:</strong> No downloads required - everything works in your browser</li>
          <li><strong>PDF Viewing:</strong> Built-in browser PDF viewer or Adobe Reader for downloads</li>
        </ul>
        <p>No software installation required. If you can browse the web and check email, you can use EZ-Resume. We recommend using Chrome or Safari for the best experience.</p>
      </div>
    ),
  },
  {
    category: 'support',
    question: 'How quickly do you respond to support requests?',
    answer: (
      <div className="space-y-3">
        <p>We provide fast, helpful support during Australian business hours:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Professional Users:</strong> 24-hour response guarantee during business days</li>
          <li><strong>Free Users:</strong> 48-hour response during business days</li>
          <li><strong>Urgent Issues:</strong> Same-day response for payment or technical problems</li>
          <li><strong>Business Hours:</strong> 9 AM - 5 PM AEST/AEDT, Monday to Friday</li>
          <li><strong>Multiple Channels:</strong> Contact form, email, and in-app support</li>
          <li><strong>Australian Team:</strong> Support from people who understand the local job market</li>
        </ul>
        <p>Our support team consists of HR professionals and technical experts who can help with everything from resume advice to technical troubleshooting.</p>
      </div>
    ),
  },

  // Additional helpful questions
  {
    category: 'getting-started',
    question: 'How long does it take to create a professional resume?',
    answer: (
      <p>Most users create a complete, professional resume in 10-15 minutes. The process is streamlined: enter your basic information (5 minutes), select your industry and template (1 minute), use our AI to generate professional content (2-3 minutes), review and customize (5-7 minutes). The AI handles the heavy lifting of writing compelling bullet points and summaries, so you focus on accuracy and personalization rather than struggling with what to write.</p>
    ),
  },
  {
    category: 'ai-features',
    question: 'Can I create multiple resumes for different roles?',
    answer: (
      <p>Absolutely! This is one of our most popular features. Many users create multiple resumes tailored for different roles, industries, or companies. Professional users get unlimited resume creation and storage, while free users can create multiple resumes but with limited AI assistance per month. Each resume is saved in your dashboard where you can edit, download, or duplicate them as needed. Perfect for applying to diverse roles or career pivoting.</p>
    ),
  },
  {
    category: 'australian-focus',
    question: 'Do you offer industry-specific templates for Australian sectors?',
    answer: (
      <div className="space-y-3">
        <p>Yes! We offer specialized templates and AI training for 9 key Australian industries:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Free Plan:</strong> Technology & Software, Healthcare & Medical, Finance & Banking</li>
          <li><strong>Professional Plan:</strong> Plus Marketing & Creative, Engineering & Construction, Education & Training, Legal & Government, Retail & Customer Service, Hospitality & Tourism</li>
        </ul>
        <p>Each industry template is designed with sector-specific formatting, terminology, and AI training data to create resumes that resonate with Australian employers in your field.</p>
      </div>
    ),
  },
]; 