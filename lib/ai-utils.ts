// Client-side AI utilities (no OpenAI client import)

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