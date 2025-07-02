import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { User, ChevronDown, Crown, Zap, LogOut, Settings } from 'lucide-react'

interface UserMenuProps {
  onUpgradeClick?: () => void;
}

const UserMenu = ({ onUpgradeClick }: UserMenuProps) => {
  const { user, profile, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

  if (!user) return null

  const getTierInfo = () => {
    if (profile?.tier === 'paid') {
      return {
        label: 'PRO',
        description: 'Professional Plan',
        bgColor: 'bg-gradient-to-r from-yellow-400 to-orange-400',
        textColor: 'text-black',
        icon: <Crown className="h-3 w-3" />
      }
    }
    return {
      label: 'FREE',
      description: 'Free Plan',
      bgColor: 'bg-gradient-to-r from-gray-500 to-gray-600',
      textColor: 'text-white',
      icon: <User className="h-3 w-3" />
    }
  }

  const tierInfo = getTierInfo()

  const getUsageInfo = () => {
    if (profile?.tier === 'paid') return null
    
    const usage = profile?.ai_usage || { bulletPoints: 0, summary: 0, skills: 0 }
    const limits = { bulletPoints: 3, summary: 1, skills: 1 }
    
    return {
      bulletPoints: { used: usage.bulletPoints, limit: limits.bulletPoints },
      summary: { used: usage.summary, limit: limits.summary },
      skills: { used: usage.skills, limit: limits.skills }
    }
  }

  const usageInfo = getUsageInfo()

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white rounded-lg px-3 py-2 transition-all duration-200 border border-white/20 hover:border-white/40"
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium">{user.email}</div>
            <div className={`text-xs px-2 py-0.5 rounded-full inline-flex items-center space-x-1 ${tierInfo.bgColor} ${tierInfo.textColor} font-bold`}>
              {tierInfo.icon}
              <span>{tierInfo.label}</span>
            </div>
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-900/95 backdrop-blur-xl rounded-lg border border-white/10 shadow-2xl z-50">
          <div className="p-4">
            {/* User Info */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-white font-medium">{user.email}</div>
                <div className="text-gray-400 text-sm">{tierInfo.description}</div>
              </div>
            </div>

            {/* Tier Status */}
            <div className={`p-3 rounded-lg mb-4 ${tierInfo.bgColor} ${tierInfo.textColor}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {tierInfo.icon}
                  <span className="font-bold">{tierInfo.label} MEMBER</span>
                </div>
                {profile?.tier === 'paid' && (
                  <Zap className="h-4 w-4" />
                )}
              </div>
            </div>

            {/* Usage Info for Free Users */}
            {usageInfo && (
              <div className="mb-4 p-3 bg-white/5 rounded-lg">
                <h4 className="text-white font-medium mb-2 text-sm">AI Usage This Session</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">Bullet Points</span>
                    <span className="text-gray-300">{usageInfo.bulletPoints.used}/{usageInfo.bulletPoints.limit}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${(usageInfo.bulletPoints.used / usageInfo.bulletPoints.limit) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">Summary</span>
                    <span className="text-gray-300">{usageInfo.summary.used}/{usageInfo.summary.limit}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${(usageInfo.summary.used / usageInfo.summary.limit) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">Skills</span>
                    <span className="text-gray-300">{usageInfo.skills.used}/{usageInfo.skills.limit}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${(usageInfo.skills.used / usageInfo.skills.limit) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Upgrade Button for Free Users */}
            {profile?.tier === 'free' && onUpgradeClick && (
              <button
                onClick={() => {
                  onUpgradeClick()
                  setIsOpen(false)
                }}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 mb-4"
              >
                <Crown className="h-4 w-4" />
                <span>Upgrade to Pro - $49 AUD</span>
              </button>
            )}

            {/* Menu Items */}
            <div className="border-t border-white/10 pt-4">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMenu 