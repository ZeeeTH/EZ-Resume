'use client'
// Vercel rebuild cache buster - local fix successful, forcing clean deploy

import React, { useState } from 'react'
import { CheckCircle, Zap, Users } from 'lucide-react'
import ContactModal from './ContactModal'
import { useContactModal } from './ContactModalContext'
import ResumeForm from './components/resumeForm'
import Pricing from './components/Pricing'
import FAQ from './components/FAQ'
import Footer from './components/footer'
import TopNavigation from './components/TopNavigation'
import UpgradeModal from './components/IndustrySelector/UpgradeModal'

export default function Home() {
  const { open, closeModal, openModal } = useContactModal();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5"></div>
      
      <div className="relative z-10">
        {/* Top Navigation */}
        <TopNavigation onUpgradeClick={() => setShowUpgradeModal(true)} />
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-6 md:pt-10 pb-0 md:pb-0 select-none">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight select-none">
              Get Hired Faster with
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI-Powered Resumes
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-3xl mx-auto px-4 select-none">
              Create professional resumes and cover letters in minutes. 
              Stand out to employers with our AI-driven approach. ✨
            </p>
            
            {/* Enhanced Social Proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 text-gray-400 mb-8 select-none">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-sm md:text-base">AI-Powered Quality</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                <span className="text-sm md:text-base">Instant Generation</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-400" />
                <span className="text-sm md:text-base">Professional Templates</span>
              </div>
            </div>
          </div>

          {/* Resume Form */}
          <ResumeForm />
        </div>

        {/* Pricing Section */}
        <Pricing />

        {/* FAQ Section */}
        <FAQ />

        {/* Footer */}
        <Footer 
          openModal={openModal}
          open={open}
          closeModal={closeModal}
        />
      </div>

      {/* Contact Modal */}
      <ContactModal open={open} onClose={closeModal} />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={() => {}} // Handle upgrade logic here if needed
        trigger="general"
        context={{}}
      />
    </div>
  );
} 