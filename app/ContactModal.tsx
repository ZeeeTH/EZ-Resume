"use client"

import React, { useState } from 'react';

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ open, onClose }) => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900/90 to-blue-950/90 rounded-2xl shadow-2xl p-8 w-full max-w-md relative border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-pink-400 text-2xl font-bold focus:outline-none"
          aria-label="Close"
        >
          ×
        </button>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Contact Us</h3>
        <form
          onSubmit={e => {
            e.preventDefault();
            onClose();
          }}
          className="space-y-4"
        >
          <input
            type="text"
            required
            placeholder="Your Name"
            className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          />
          <input
            type="email"
            required
            placeholder="Your Email"
            className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />
          <textarea
            required
            placeholder="Your Message"
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            value={form.message}
            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 rounded-lg transition-all"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactModal; 