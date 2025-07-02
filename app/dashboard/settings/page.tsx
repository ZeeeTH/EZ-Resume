'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../../../contexts/AuthContext'
import { useAIUsage } from '../../../hooks/useAIUsage'
import { 
  User, 
  Mail, 
  Crown, 
  Settings as SettingsIcon, 
  Zap,
  Save,
  AlertCircle,
  CheckCircle,
  Calendar,
  TrendingUp,
  Clock
} from 'lucide-react'

const SettingsPage = () => {
  const { user, profile, updateProfile } = useAuth()
  const { currentUsage, tier } = useAIUsage()
  const [formData, setFormData] = useState({
    selectedIndustry: profile?.selected_industry || '',
    email: profile?.email || user?.email || ''
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (profile) {
      setFormData({
        selectedIndustry: profile.selected_industry || '',
        email: profile.email || user?.email || ''
      })
    }
  }, [profile, user])

  const industries = [
    { id: 'technology', name: 'Technology & Software' },
    { id: 'healthcare', name: 'Healthcare & Medical' },
    { id: 'finance', name: 'Finance & Banking' },
    { id: 'marketing', name: 'Marketing & Creative' },
    { id: 'engineering', name: 'Engineering & Construction' },
    { id: 'education', name: 'Education & Training' },
    { id: 'legal', name: 'Legal & Government' },
    { id: 'retail', name: 'Retail & Customer Service' },
    { id: 'hospitality', name: 'Hospitality & Tourism' },
    { id: 'consulting', name: 'Consulting & Business' },
    { id: 'manufacturing', name: 'Manufacturing & Operations' },
    { id: 'nonprofit', name: 'Non-Profit & Social Services' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const { error } = await updateProfile({
        selected_industry: formData.selectedIndustry
      })

      if (error) throw error
      
      setMessage({ type: 'success', text: 'Settings updated successfully!' })
      setIsEditing(false)
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update settings. Please try again.' })
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const FREE_TIER_LIMITS = {
    bulletPoints: 3,
    summary: 1,
    skills: 1
  }

  const getTotalUsage = () => {
    return (currentUsage.bulletPoints || 0) + (currentUsage.summary || 0) + (currentUsage.skills || 0)
  }

  const getTotalLimit = () => {
    return FREE_TIER_LIMITS.bulletPoints + FREE_TIER_LIMITS.summary + FREE_TIER_LIMITS.skills
  }

  const getUsageResetDate = () => {
    if (profile?.usage_reset_date) {
      return new Date(profile.usage_reset_date).toLocaleDateString()
    }
    // Default to next month
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1, 1)
    return nextMonth.toLocaleDateString()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
        <p className="text-gray-400">
          Manage your account preferences and settings
        </p>
      </div>

      {/* Account Overview */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
          <User className="h-5 w-5 mr-2" />
          Account Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Email Address</label>
            <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
              <Mail className="h-5 w-5 text-gray-400" />
              <span className="text-white">{user?.email}</span>
            </div>
          </div>

          {/* Plan */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Current Plan</label>
            <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
              {tier === 'paid' ? (
                <Crown className="h-5 w-5 text-yellow-400" />
              ) : (
                <User className="h-5 w-5 text-gray-400" />
              )}
              <span className={`font-medium ${tier === 'paid' ? 'text-yellow-400' : 'text-white'}`}>
                {tier === 'paid' ? 'Professional' : 'Free Plan'}
              </span>
            </div>
          </div>

          {/* Member Since */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Member Since</label>
            <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span className="text-white">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Recently'}
              </span>
            </div>
          </div>
        </div>

        {/* Upgrade Section for Free Users */}
        {tier === 'free' && (
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold mb-1">Upgrade to Professional</h3>
                <p className="text-gray-300 text-sm">
                  Unlock unlimited AI generations, premium templates, and priority support
                </p>
              </div>
              <Link
                href="/pricing"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 whitespace-nowrap"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* AI Usage Section */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Zap className="h-5 w-5 mr-2" />
          AI Usage & Limits
        </h2>

        {tier === 'paid' ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="h-8 w-8 text-yellow-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Unlimited AI Access</h3>
            <p className="text-gray-400">
              You have unlimited access to all AI features as a Professional member
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Usage Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-sm">Total Usage</span>
                  <span className="text-white font-semibold">{getTotalUsage()}/{getTotalLimit()}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                    style={{ width: `${(getTotalUsage() / getTotalLimit()) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-sm">Remaining</span>
                  <span className="text-green-400 font-semibold">{getTotalLimit() - getTotalUsage()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>This month</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-sm">Resets On</span>
                  <span className="text-blue-400 font-semibold">{getUsageResetDate()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>Monthly cycle</span>
                </div>
              </div>
            </div>

            {/* Detailed Usage Breakdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Usage Breakdown</h3>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Bullet Points Generation</span>
                    <span className="text-gray-400 text-sm">
                      {currentUsage.bulletPoints || 0}/{FREE_TIER_LIMITS.bulletPoints}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ 
                        width: `${((currentUsage.bulletPoints || 0) / FREE_TIER_LIMITS.bulletPoints) * 100}%` 
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Professional Summary</span>
                    <span className="text-gray-400 text-sm">
                      {currentUsage.summary || 0}/{FREE_TIER_LIMITS.summary}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ 
                        width: `${((currentUsage.summary || 0) / FREE_TIER_LIMITS.summary) * 100}%` 
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Skills Generation</span>
                    <span className="text-gray-400 text-sm">
                      {currentUsage.skills || 0}/{FREE_TIER_LIMITS.skills}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all"
                      style={{ 
                        width: `${((currentUsage.skills || 0) / FREE_TIER_LIMITS.skills) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preferences */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <SettingsIcon className="h-5 w-5 mr-2" />
            Preferences
          </h2>
          
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-purple-400 hover:text-purple-300 text-sm font-medium"
            >
              Edit Preferences
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Industry Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              Default Industry
            </label>
            <select
              value={formData.selectedIndustry}
              onChange={(e) => setFormData({
                ...formData,
                selectedIndustry: e.target.value
              })}
              disabled={!isEditing}
              className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                !isEditing ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <option value="">Select your primary industry</option>
              {industries.map(industry => (
                <option key={industry.id} value={industry.id} className="bg-slate-900">
                  {industry.name}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-400">
              This will be pre-selected when creating new resumes and help personalize AI suggestions
            </p>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`flex items-center space-x-2 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-500/20 border border-green-500/30 text-green-300' 
                : 'bg-red-500/20 border border-red-500/30 text-red-300'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          )}

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-5 w-5 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setFormData({
                    selectedIndustry: profile?.selected_industry || '',
                    email: profile?.email || user?.email || ''
                  })
                  setMessage(null)
                }}
                className="px-6 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Data & Privacy */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Data & Privacy</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <h3 className="text-white font-medium">Data Export</h3>
              <p className="text-gray-400 text-sm">Download all your account data</p>
            </div>
            <Link
              href="/data-rights"
              className="text-purple-400 hover:text-purple-300 text-sm font-medium"
            >
              Request Export →
            </Link>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <h3 className="text-white font-medium">Privacy Policy</h3>
              <p className="text-gray-400 text-sm">Learn how we protect your data</p>
            </div>
            <Link
              href="/privacy"
              className="text-purple-400 hover:text-purple-300 text-sm font-medium"
            >
              View Policy →
            </Link>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <h3 className="text-white font-medium">Terms of Service</h3>
              <p className="text-gray-400 text-sm">Read our terms and conditions</p>
            </div>
            <Link
              href="/terms"
              className="text-purple-400 hover:text-purple-300 text-sm font-medium"
            >
              View Terms →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage 