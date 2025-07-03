'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '../../../contexts/AuthContext'
import { CheckCircle, FileText, Mail, ArrowRight, Download } from 'lucide-react'
import Link from 'next/link'

function SuccessPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, profile } = useAuth()
  const [countdown, setCountdown] = useState(5)

  const isNewResume = searchParams?.get('newResume') === 'true'
  const isNewUser = searchParams?.get('newUser') === 'true'

  useEffect(() => {
    if (isNewResume) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            router.push('/dashboard')
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isNewResume, router])

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              {isNewUser ? 'Welcome to EZ-Resume! 🎉' : 'Resume Generated Successfully! ✅'}
            </h1>
            <p className="text-xl text-gray-300">
              {isNewUser 
                ? 'Your account has been created and your resume is ready!'
                : 'Your professional resume has been generated and saved to your account.'
              }
            </p>
          </div>

          {/* Success Details */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-8">
            <div className="space-y-6">
              {/* Welcome Email Sent */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Welcome Email Sent</h3>
                  <p className="text-gray-300">
                    A welcome email has been sent to <span className="text-blue-400 font-medium">{user.email}</span>
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Check your inbox for account details and dashboard access
                  </p>
                </div>
              </div>

              {/* Resume Saved */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Resume Saved</h3>
                  <p className="text-gray-300">
                    Your resume has been automatically saved to your dashboard
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    You can edit, download, or create new versions anytime
                  </p>
                </div>
              </div>

              {isNewUser && (
                /* Account Created */
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Account Created</h3>
                    <p className="text-gray-300">
                      A free EZ-Resume account has been created for you
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      You can now access all your resumes and create new ones
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link
              href="/dashboard"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <FileText className="h-5 w-5" />
              <span>Go to Dashboard</span>
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="/resume-builder"
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 border border-white/10 flex items-center justify-center space-x-2"
            >
              <Download className="h-5 w-5" />
              <span>Create Another Resume</span>
            </Link>
          </div>

          {/* Upgrade CTA for Free Users */}
          {profile?.tier === 'free' && (
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl border border-yellow-500/30 p-6">
              <h3 className="text-xl font-bold text-white mb-3">🚀 Ready to unlock more features?</h3>
              <p className="text-gray-300 mb-4">
                Upgrade to Professional for just $49 AUD (one-time payment) and get:
              </p>
              <ul className="text-gray-300 space-y-2 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                  9 industry-specific templates
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                  Unlimited AI content generation
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                  No watermarks on your resumes
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                  Professional cover letter generator
                </li>
              </ul>
              <Link
                href="/pricing"
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-orange-500 hover:to-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition-all duration-200 inline-block"
              >
                Upgrade to Professional
              </Link>
            </div>
          )}

          {/* Auto-redirect notice */}
          {isNewResume && (
            <div className="text-center mt-8">
              <p className="text-gray-400 text-sm">
                Redirecting to dashboard in {countdown} seconds...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-gray-300">Loading...</p>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessPageContent />
    </Suspense>
  )
} 