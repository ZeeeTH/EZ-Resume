'use client'
// Vercel rebuild cache buster - local fix successful, forcing clean deploy

import { useState } from 'react'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">EZ Resume</h1>
        <p className="text-xl text-gray-600 mb-8">AI-Powered Resume & Cover Letter Generator</p>
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <p className="text-green-600 font-semibold">✅ Website is working!</p>
          <p className="text-gray-600 mt-2">If you can see this, the deployment is successful.</p>
        </div>
      </div>
    </div>
  )
} 