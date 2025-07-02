// Client-side AI utilities (no OpenAI client import)

import OpenAI from 'openai';

// Free tier AI usage limits
export const FREE_TIER_LIMITS = {
  bulletPoints: 3,     // Total across all sections
  summary: 1,          // One professional summary
  skills: 1            // One skills generation
};

// Check AI usage for free users
export const checkAIUsage = (type: keyof typeof FREE_TIER_LIMITS, currentUsage: number, userTier: 'free' | 'paid') => {
  if (userTier === 'paid') {
    return { allowed: true, remaining: 'unlimited' };
  }
  
  const limit = FREE_TIER_LIMITS[type];
  
  return {
    allowed: currentUsage < limit,
    remaining: limit - currentUsage,
    limitReached: currentUsage >= limit
  };
};

// Analytics tracking for tier interactions
export const trackUpgradePrompt = (trigger: string, context?: any) => {
  // Only track if gtag is available (in production)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'upgrade_prompt_shown', {
      'trigger': trigger, // 'skills', 'industry', 'ai_limit'
      'context': context ? JSON.stringify(context) : null,
      'user_tier': 'free'
    });
  }
};

export const trackUpgradeClick = (source: string, context?: any) => {
  // Only track if gtag is available (in production)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'upgrade_click', {
      'source': source, // 'skills_locked', 'industry_locked', 'contextual_prompt'
      'context': context ? JSON.stringify(context) : null,
      'user_tier': 'free'
    });
  }
};

// AI content response interface
export interface AIContentResponse {
  success: boolean;
  content?: string;
  error?: 'usage_limit' | 'api_error' | 'invalid_type';
  message?: string;
  upgradePrompt?: boolean;
  remaining?: number | 'unlimited';
  industry?: string;
} 