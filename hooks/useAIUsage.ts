import { useAuth } from '../contexts/AuthContext'
import { FREE_TIER_LIMITS } from '../lib/ai-utils'

export const useAIUsage = () => {
  const { profile, updateProfile } = useAuth()

  const checkUsageLimit = (type: keyof typeof FREE_TIER_LIMITS) => {
    if (profile?.tier === 'paid') {
      return { allowed: true, remaining: 'unlimited' as const }
    }

    const usage = profile?.ai_usage || { bulletPoints: 0, summary: 0, skills: 0 }
    const currentUsage = usage[type] || 0
    const limit = FREE_TIER_LIMITS[type]

    return {
      allowed: currentUsage < limit,
      remaining: limit - currentUsage,
      limitReached: currentUsage >= limit
    }
  }

  const incrementUsage = async (type: keyof typeof FREE_TIER_LIMITS) => {
    if (profile?.tier === 'paid') return // No limits for paid users

    const currentUsage = profile?.ai_usage || { bulletPoints: 0, summary: 0, skills: 0 }
    const newUsage = {
      ...currentUsage,
      [type]: (currentUsage[type] || 0) + 1
    }

    await updateProfile({
      ai_usage: newUsage
    })
  }

  const resetUsage = async () => {
    await updateProfile({
      ai_usage: { bulletPoints: 0, summary: 0, skills: 0 },
      usage_reset_date: new Date().toISOString().split('T')[0]
    })
  }

  const getCurrentUsage = (type: keyof typeof FREE_TIER_LIMITS) => {
    const usage = profile?.ai_usage || { bulletPoints: 0, summary: 0, skills: 0 }
    return usage[type] || 0
  }

  return {
    checkUsageLimit,
    incrementUsage,
    resetUsage,
    getCurrentUsage,
    currentUsage: profile?.ai_usage || { bulletPoints: 0, summary: 0, skills: 0 },
    tier: profile?.tier || 'free'
  }
} 