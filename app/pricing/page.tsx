'use client'

import React from 'react'
import Pricing from '../components/Pricing'
import TopNavigation from '../components/TopNavigation'
import Footer from '../components/footer'
import { useContactModal } from '../ContactModalContext'
import ContactModal from '../ContactModal'

export default function PricingPage() {
  const { open, closeModal, openModal } = useContactModal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5"></div>
      
      <div className="relative z-10">
        {/* Top Navigation */}
        <TopNavigation />
        
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-6 md:pt-10 pb-8">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Simple, Transparent
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Pricing
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-3xl mx-auto px-4">
              Choose the plan that works best for you. No hidden fees, no surprises.
            </p>
          </div>

          {/* Pricing Section */}
          <Pricing />
        </div>

        {/* Footer */}
        <Footer 
          openModal={openModal}
          open={open}
          closeModal={closeModal}
        />
      </div>

      {/* Contact Modal */}
      <ContactModal open={open} onClose={closeModal} />
    </div>
  );
} 