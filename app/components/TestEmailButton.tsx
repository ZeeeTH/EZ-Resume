'use client'

import { useState } from 'react'

export default function TestEmailButton() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const sendTestEmail = async () => {
    if (!email) {
      setMessage('Please enter an email address')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (result.success) {
        setMessage('✅ Test email sent successfully! Check your inbox.')
        setEmail('')
      } else {
        setMessage(`❌ Error: ${result.error}`)
      }
    } catch (error) {
      setMessage('❌ Failed to send test email')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-xl rounded-lg p-4 border border-white/20 shadow-lg z-[9999] min-w-[250px]">
      <h3 className="text-white font-semibold mb-2 text-sm">🧪 Test Email</h3>
      <div className="space-y-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={sendTestEmail}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? 'Sending...' : 'Send Test Email'}
        </button>
        {message && (
          <p className={`text-xs ${message.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
} 