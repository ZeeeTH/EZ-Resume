'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../../contexts/AuthContext'
import { useAIUsage } from '../../hooks/useAIUsage'
import { supabase } from '../../lib/supabase-client'
import { 
  FileText, 
  Mail, 
  Zap, 
  Crown, 
  Plus, 
  Star,
  TrendingUp,
  Clock,
  Eye,
  Download
} from 'lucide-react'

interface DashboardStats {
  totalResumes: number
  totalCoverLetters: number
  recentActivity: Array<{
    id: string
    title: string
    created_at: string
    industry?: string
    type: 'resume' | 'cover_letter'
  }>
}

const DashboardOverview = () => {
  const { user, profile } = useAuth()
  const { currentUsage, tier } = useAIUsage()
  const [stats, setStats] = useState<DashboardStats>({
    totalResumes: 0,
    totalCoverLetters: 0,
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardStats()
    }
  }, [user])

  const fetchDashboardStats = async () => {
    try {
      // Get resume count
      const { count: resumeCount } = await supabase
        .from('resumes')
        .select('*', { count: 'exact', head: true })

      // Get cover letter count  
      const { count: coverLetterCount } = await supabase
        .from('cover_letters')
        .select('*', { count: 'exact', head: true })

      // Get recent resumes
      const { data: recentResumes } = await supabase
        .from('resumes')
        .select('id, title, created_at, industry')
        .order('created_at', { ascending: false })
        .limit(3)

      // Get recent cover letters
      const { data: recentCoverLetters } = await supabase
        .from('cover_letters')
        .select('id, title, created_at, company_name')
        .order('created_at', { ascending: false })
        .limit(2)

      // Combine and sort recent activity
      const combinedActivity = [
        ...(recentResumes || []).map(item => ({ 
          ...item, 
          type: 'resume' as const 
        })),
        ...(recentCoverLetters || []).map(item => ({ 
          ...item, 
          type: 'cover_letter' as const 
        }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)

      setStats({
        totalResumes: resumeCount || 0,
        totalCoverLetters: coverLetterCount || 0,
        recentActivity: combinedActivity
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
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

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {getGreeting()}, {user?.email?.split('@')[0]}! 👋
            </h1>
            <p className="text-gray-300 text-lg">
              Ready to create something amazing today?
            </p>
          </div>
          
          <div className="hidden lg:block">
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                tier === 'paid' 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-black' 
                  : 'bg-gray-600 text-white'
              }`}>
                {tier === 'paid' ? (
                  <>
                    <Crown className="h-4 w-4 inline mr-1" />
                    Professional Plan
                  </>
                ) : (
                  'Free Plan'
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Resumes */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Resumes</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.totalResumes}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-400" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
            <span className="text-green-400">Ready to create</span>
          </div>
        </div>

        {/* Cover Letters */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Cover Letters</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.totalCoverLetters}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Mail className="h-6 w-6 text-green-400" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <Plus className="h-4 w-4 text-blue-400 mr-1" />
            <span className="text-blue-400">Create your first</span>
          </div>
        </div>

        {/* AI Usage */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">AI Generations</p>
              <p className="text-3xl font-bold text-white mt-1">
                {tier === 'paid' ? '∞' : `${getTotalUsage()}/${getTotalLimit()}`}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-purple-400" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            {tier === 'paid' ? (
              <>
                <Crown className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-yellow-400">Unlimited</span>
              </>
            ) : (
              <>
                <Clock className="h-4 w-4 text-orange-400 mr-1" />
                <span className="text-orange-400">
                  {getTotalLimit() - getTotalUsage()} remaining
                </span>
              </>
            )}
          </div>
        </div>

        {/* Account Status */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Account Status</p>
              <p className="text-xl font-bold text-white mt-1">
                {tier === 'paid' ? 'Professional' : 'Free'}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              tier === 'paid' ? 'bg-yellow-500/20' : 'bg-gray-500/20'
            }`}>
              {tier === 'paid' ? (
                <Crown className="h-6 w-6 text-yellow-400" />
              ) : (
                <Star className="h-6 w-6 text-gray-400" />
              )}
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            {tier === 'paid' ? (
              <>
                <Zap className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-yellow-400">All features unlocked</span>
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4 text-purple-400 mr-1" />
                <span className="text-purple-400">Upgrade available</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* AI Usage Progress (Free users only) */}
      {tier === 'free' && (
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">AI Usage This Month</h2>
            <Link 
              href="/pricing" 
              className="text-purple-400 hover:text-purple-300 text-sm font-medium"
            >
              Upgrade to Pro →
            </Link>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Bullet Points</span>
              <span className="text-gray-400 text-sm">
                {currentUsage.bulletPoints || 0}/{FREE_TIER_LIMITS.bulletPoints}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                style={{ 
                  width: `${((currentUsage.bulletPoints || 0) / FREE_TIER_LIMITS.bulletPoints) * 100}%` 
                }}
              />
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Professional Summary</span>
              <span className="text-gray-400 text-sm">
                {currentUsage.summary || 0}/{FREE_TIER_LIMITS.summary}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                style={{ 
                  width: `${((currentUsage.summary || 0) / FREE_TIER_LIMITS.summary) * 100}%` 
                }}
              />
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Skills Generation</span>
              <span className="text-gray-400 text-sm">
                {currentUsage.skills || 0}/{FREE_TIER_LIMITS.skills}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                style={{ 
                  width: `${((currentUsage.skills || 0) / FREE_TIER_LIMITS.skills) * 100}%` 
                }}
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
            <p className="text-white font-medium mb-2">Unlock Unlimited AI Power</p>
            <p className="text-gray-300 text-sm mb-3">
              Get unlimited AI generations, premium templates, and priority support for just $49 AUD.
            </p>
            <Link 
              href="/pricing" 
              className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Professional
            </Link>
          </div>
        </div>
      )}

      {/* Latest Resume Download */}
      {stats.recentActivity.length > 0 && stats.recentActivity[0].type === 'resume' && (
        <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-xl rounded-xl border border-green-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Latest Resume Ready!</h2>
              <p className="text-gray-300 mb-4">
                Your most recent resume is ready to download. Click the button below to get your PDF.
              </p>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    const latestResume = stats.recentActivity[0]
                    window.open(`/api/resume/download/${latestResume.id}`, '_blank')
                  }}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
                >
                  <Download className="h-5 w-5" />
                  <span>Download Latest Resume</span>
                </button>
                <Link
                  href="/dashboard/resumes"
                  className="text-gray-300 hover:text-white text-sm font-medium"
                >
                  View All Resumes →
                </Link>
              </div>
            </div>
            <div className="w-16 h-16 bg-green-500/20 rounded-lg flex items-center justify-center">
              <FileText className="h-8 w-8 text-green-400" />
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/resume-builder"
            className="group p-6 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-purple-500/50 transition-all duration-200"
          >
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Create New Resume</h3>
            <p className="text-gray-400 text-sm">Start building a new professional resume with AI assistance</p>
          </Link>

          <Link
            href="/cover-letter-builder"
            className="group p-6 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-green-500/50 transition-all duration-200"
          >
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Mail className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Write Cover Letter</h3>
            <p className="text-gray-400 text-sm">Create a compelling cover letter to accompany your resume</p>
          </Link>

          <Link
            href="/dashboard/resumes"
            className="group p-6 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-purple-500/50 transition-all duration-200"
          >
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Eye className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">View All Resumes</h3>
            <p className="text-gray-400 text-sm">Manage and edit your existing resumes</p>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      {stats.recentActivity.length > 0 && (
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {stats.recentActivity.map((item) => (
              <div 
                key={`${item.type}-${item.id}`}
                className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  item.type === 'resume' ? 'bg-blue-500/20' : 'bg-green-500/20'
                }`}>
                  {item.type === 'resume' ? (
                    <FileText className="h-5 w-5 text-blue-400" />
                  ) : (
                    <Mail className="h-5 w-5 text-green-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className="text-white font-medium">{item.title}</h4>
                  <p className="text-gray-400 text-sm">
                    {item.type === 'resume' ? 'Resume' : 'Cover Letter'} • {
                      new Date(item.created_at).toLocaleDateString()
                    }
                  </p>
                </div>
                
                <Link 
                  href={`/dashboard/${item.type === 'resume' ? 'resumes' : 'cover-letters'}/${item.id}`}
                  className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                >
                  View →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardOverview 