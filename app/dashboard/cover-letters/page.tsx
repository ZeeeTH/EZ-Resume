'use client'

import React from 'react'
import Link from 'next/link'
import { Mail, Plus, Sparkles } from 'lucide-react'

const CoverLettersPage = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Cover Letters</h1>
          <p className="text-gray-400 mt-1">
            Create compelling cover letters to accompany your resumes
          </p>
        </div>
        
        <Link
          href="/cover-letter-builder"
          className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Cover Letter
        </Link>
      </div>

      {/* Coming Soon Card */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-white/10 p-12 text-center">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="h-12 w-12 text-green-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">Cover Letter Management Coming Soon!</h2>
        
        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
          We're working on a powerful cover letter management system that will let you:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
          <div className="bg-white/5 rounded-lg p-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Mail className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Save & Organize</h3>
            <p className="text-gray-400 text-sm">Store all your cover letters in one place with easy organization</p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-6">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">AI-Powered</h3>
            <p className="text-gray-400 text-sm">Generate tailored cover letters for specific companies and roles</p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-6">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Plus className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Quick Templates</h3>
            <p className="text-gray-400 text-sm">Use pre-built templates and customize them for each application</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-300 font-medium">In the meantime, you can start creating cover letters:</p>
          
          <Link
            href="/cover-letter-builder"
            className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
          >
            <Mail className="h-5 w-5 mr-2" />
            Create Your First Cover Letter
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CoverLettersPage 