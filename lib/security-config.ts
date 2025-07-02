// Security configuration for EZ-Resume
// This file centralizes security settings for easier management

interface SecurityConfig {
  csp: {
    scriptSrc: string[];
    connectSrc: string[];
    frameSrc: string[];
    imgSrc: string[];
  };
  cors: {
    allowedOrigins: string[];
  };
  domains: {
    production: string;
    development: string;
  };
}

export const securityConfig: SecurityConfig = {
  csp: {
    scriptSrc: [
      "'self'",
      "'unsafe-eval'", // Required for Next.js
      "'unsafe-inline'", // Required for Stripe and inline scripts
      "https://js.stripe.com",
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com"
    ],
    connectSrc: [
      "'self'",
      "https://api.stripe.com",
      "https://api.openai.com",
      "https://*.supabase.co",
      "https://www.google-analytics.com",
      "https://www.googletagmanager.com",
      // Add your Supabase URL specifically if needed
      ...(process.env.NEXT_PUBLIC_SUPABASE_URL ? [process.env.NEXT_PUBLIC_SUPABASE_URL] : [])
    ],
    frameSrc: [
      "https://js.stripe.com",
      "https://hooks.stripe.com"
    ],
    imgSrc: [
      "'self'",
      "data:",
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com"
    ]
  },
  cors: {
    allowedOrigins: [
      process.env.NODE_ENV === 'production' 
        ? 'https://ez-resume.xyz'
        : 'http://localhost:3000'
    ]
  },
  domains: {
    production: 'https://ez-resume.xyz',
    development: 'http://localhost:3000'
  }
};

// Helper function to generate CSP string
export function generateCSP(): string {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return [
    "default-src 'self'",
    `script-src ${securityConfig.csp.scriptSrc.join(' ')}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    `img-src ${securityConfig.csp.imgSrc.join(' ')}`,
    "font-src 'self' https://fonts.gstatic.com",
    `connect-src ${securityConfig.csp.connectSrc.join(' ')}`,
    `frame-src ${securityConfig.csp.frameSrc.join(' ')}`,
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    // Only require trusted types in production (can cause issues in development)
    ...(isDevelopment ? [] : ["require-trusted-types-for 'script'"]),
    // Only upgrade insecure requests in production
    ...(isDevelopment ? [] : ["upgrade-insecure-requests"])
  ].join('; ');
}

// Security headers that should be applied to all routes
export const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  // Only add HSTS in production
  ...(process.env.NODE_ENV === 'production' ? [{
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload'
  }] : []),
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(self)'
  },
  {
    key: 'Content-Security-Policy',
    value: generateCSP()
  }
];

// CORS headers for API routes
export const corsHeaders = [
  {
    key: 'Access-Control-Allow-Origin',
    value: securityConfig.cors.allowedOrigins[0]
  },
  {
    key: 'Access-Control-Allow-Methods',
    value: 'GET, POST, PUT, DELETE, OPTIONS'
  },
  {
    key: 'Access-Control-Allow-Headers',
    value: 'Content-Type, Authorization, X-Requested-With, stripe-signature'
  },
  {
    key: 'Access-Control-Max-Age',
    value: '86400'
  },
  {
    key: 'Access-Control-Allow-Credentials',
    value: 'true'
  }
];

// Rate limiting configuration (for future implementation)
export const rateLimitConfig = {
  // API rate limits (requests per minute)
  api: {
    default: 60,
    auth: 10,
    payment: 5,
    aiGeneration: 20,
    pdfGeneration: 30
  },
  // Window in milliseconds
  window: 60 * 1000, // 1 minute
};

// Helper to validate if current environment is secure
export function validateSecurityConfig(): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Check required environment variables
  if (!process.env.STRIPE_SECRET_KEY) {
    issues.push('STRIPE_SECRET_KEY is not configured');
  }
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    issues.push('NEXT_PUBLIC_SUPABASE_URL is not configured');
  }
  
  if (!process.env.OPENAI_API_KEY) {
    issues.push('OPENAI_API_KEY is not configured');
  }
  
  // In production, ensure HTTPS
  if (process.env.NODE_ENV === 'production') {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL;
    if (!baseUrl?.startsWith('https://')) {
      issues.push('Production base URL must use HTTPS');
    }
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
} 