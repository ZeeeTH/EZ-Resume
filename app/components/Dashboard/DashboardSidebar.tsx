'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../../../contexts/AuthContext'
import { useAIUsage } from '../../../hooks/useAIUsage'
import { 
  BarChart3, 
  FileText, 
  Mail, 
  Settings, 
  User, 
  Crown, 
  LogOut, 
  ChevronLeft,
  Menu,
  Home
} from 'lucide-react'

const DashboardSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { user, profile, signOut } = useAuth()
  const { currentUsage, tier } = useAIUsage()
  const pathname = usePathname()

  const navItems = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: BarChart3, 
      href: '/dashboard',
      description: 'Dashboard overview'
    },
    { 
      id: 'resumes', 
      label: 'My Resumes', 
      icon: FileText, 
      href: '/dashboard/resumes',
      description: 'Manage your resumes'
    },
    { 
      id: 'cover-letters', 
      label: 'Cover Letters', 
      icon: Mail, 
      href: '/dashboard/cover-letters',
      description: 'Your cover letters'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      href: '/dashboard/settings',
      description: 'Account settings'
    },
  ]

  const handleSignOut = async () => {
    await signOut()
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

  return (
    <div className={`bg-slate-900/95 backdrop-blur-xl border-r border-white/10 transition-all duration-300 flex flex-col ${
      isCollapsed ? 'w-16' : 'w-80'
    }`}>
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">EZ</span>
                </div>
                <span className="text-white font-bold text-lg">Resume</span>
              </Link>
            </div>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            {isCollapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{user?.email}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                  tier === 'paid' 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-black' 
                    : 'bg-gray-600 text-white'
                }`}>
                  {tier === 'paid' ? (
                    <>
                      <Crown className="h-3 w-3 inline mr-1" />
                      PRO
                    </>
                  ) : (
                    'FREE'
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* AI Usage for Free Users */}
          {tier === 'free' && (
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">AI Usage</span>
                <span className="text-sm text-gray-400">{getTotalUsage()}/{getTotalLimit()}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                  style={{ width: `${(getTotalUsage() / getTotalLimit()) * 100}%` }}
                />
              </div>
              <Link 
                href="/pricing" 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white text-center py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 block"
              >
                Upgrade to Pro
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors group ${
                isActive 
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <span className="font-medium">{item.label}</span>
                  {item.description && (
                    <p className="text-xs text-gray-400 truncate">{item.description}</p>
                  )}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="p-4 border-t border-white/10">
          <div className="space-y-2">
            <Link
              href="/"
              className="flex items-center space-x-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Collapsed Mode Tooltip */}
      {isCollapsed && (
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className="w-full p-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Sign Out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  )
}

export default DashboardSidebar 