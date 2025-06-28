import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

export default function FAQ() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto select-none">
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h3>
          <p className="text-gray-300 text-lg">
            Everything you need to know about our AI resume generator
          </p>
        </div>
        <div className="space-y-4">
          {faqData.map((faq, idx) => (
            <div
              key={idx}
              className="border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/5 hover:border-pink-500/50 transition-all duration-200"
              onClick={() => toggleFAQ(idx)}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-white">{faq.question}</h4>
                <span className={`text-white transition-transform duration-200 text-2xl font-bold ${openFAQ === idx ? 'rotate-0' : ''}`}>
                  {openFAQ === idx ? '−' : '+'}
                </span>
              </div>
              {openFAQ === idx && (
                <p className="text-gray-300 mt-3 leading-relaxed">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const faqData = [
  {
    question: 'How does the AI resume generator work?',
    answer:
      'Our advanced AI analyzes your experience, skills, and achievements to create a professionally formatted, ATS-optimized resume. It uses industry best practices and proven resume writing techniques to highlight your strengths and maximize your chances of getting interviews. Unlike template-based builders, our AI actually writes and optimizes your content, creating personalized, compelling resumes that stand out to both human recruiters and ATS systems across all industries and career levels.',
  },
  {
    question: 'How fast will I get my resume and cover letter?',
    answer:
      'Instantly! As soon as you hit "Generate," your documents are created and sent to your email as high-quality PDF files within seconds. PDFs are the industry standard for job applications because they maintain perfect formatting across all devices and are universally accepted by employers and ATS systems. You can generate as many resumes as you need for different positions, companies, or industries.',
  },
  {
    question: 'Is my information secure and private?',
    answer:
      'Absolutely. We take your privacy seriously and never store or share your data. Everything you enter stays private and is used only to generate your resume. We use industry-standard encryption and follow GDPR compliance standards to protect your information. Your data is processed securely and deleted immediately after generation.',
  },
  {
    question: 'Are the resumes ATS-friendly and can I edit them?',
    answer:
      "Yes! All our resumes are specifically designed to pass Applicant Tracking Systems with clean formatting, relevant keywords, and industry-standard sections. We offer three distinct professional templates: Modern (contemporary and bold), Classic (traditional and formal), and Structured (clean and spacious). You'll receive fully editable PDF files that you can modify in any PDF editor for quick adjustments or tailoring to specific job postings.",
  },
  {
    question: 'Do you offer cover letters and what makes you different?',
    answer:
      'Yes! When you select the "Resume + Cover Letter" option, our AI creates a personalized cover letter that complements your resume and is tailored to your target role and company. Both documents work together to tell your professional story. What makes us different is that we combine cutting-edge AI with proven resume writing techniques to create personalized, compelling content that stands out from generic template-based builders.',
  },
  {
    question: "What if I'm not satisfied with the results?",
    answer:
      "Your satisfaction is our priority. If you're not completely happy with your resume, we offer one free revision or a full refund. Simply contact us and we'll work to make it right. We're constantly improving our AI and may expand our services in the future, but for now, we focus on delivering exceptional resume and cover letter generation that provides everything you need to create professional, job-winning documents.",
  },
]; 