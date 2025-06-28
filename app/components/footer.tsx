import React from 'react';
import { Shield, Users, TrendingUp } from 'lucide-react';

interface FooterProps {
  openModal: () => void;
  open: boolean;
  closeModal: () => void;
}

export default function Footer({ openModal, open, closeModal }: FooterProps) {
  return (
    <>
      {/* Footer */}
      <footer className="text-center mt-12 md:mt-16 pb-8">
        {/* Trust Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-400">
            <div className="flex flex-col items-center space-y-2">
              <Shield className="h-6 w-6 text-blue-400" />
              <p className="font-medium">Your data is private</p>
              <p>Never stored or shared</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Users className="h-6 w-6 text-green-400" />
              <p className="font-medium">AI-powered quality</p>
              <p>Professional results</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <TrendingUp className="h-6 w-6 text-purple-400" />
              <p className="font-medium">Instant generation</p>
              <p>Ready in seconds</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mb-4">
          <div className="flex flex-row items-center gap-4 text-xs md:text-sm text-gray-400">
            <a href="/terms" className="hover:text-blue-400 transition-colors font-medium">Terms and Conditions</a>
            <span className="text-gray-500">|</span>
            <a href="/privacy" className="hover:text-purple-400 transition-colors font-medium">Privacy Policy</a>
            <span className="text-gray-500">|</span>
            <button type="button" onClick={openModal} className="hover:text-pink-400 transition-colors font-medium bg-transparent border-none p-0 m-0 focus:outline-none">Contact Us</button>
          </div>
        </div>
        <p className="text-gray-400 text-sm">
          © 2025 EZ Resume. Powered by AI to help you land your dream job. ✨
        </p>
      </footer>
    </>
  );
}
