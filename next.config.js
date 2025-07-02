/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  
  // Security Headers Configuration
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: [
          // Prevent clickjacking attacks
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          
          // Control referrer information
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          
          // Enable XSS protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          
          // DNS prefetch control for better privacy
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          
          // Force HTTPS (only in production)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          
          // Permissions Policy (formerly Feature-Policy)
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              // Default source - only same origin
              "default-src 'self'",
              
              // Scripts - allow self, Next.js chunks, Stripe, and Google Analytics
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://www.googletagmanager.com https://www.google-analytics.com",
              
              // Styles - allow self, inline styles, and Google Fonts
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              
              // Images - allow self, data URLs, and external services
              "img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com",
              
              // Fonts - allow self and Google Fonts
              "font-src 'self' https://fonts.gstatic.com",
              
              // Connect sources - APIs and external services
              "connect-src 'self' https://api.stripe.com https://api.openai.com https://*.supabase.co https://www.google-analytics.com https://www.googletagmanager.com",
              
              // Frames - only Stripe for payment processing
              "frame-src https://js.stripe.com https://hooks.stripe.com",
              
              // Media sources
              "media-src 'self'",
              
              // Object sources (flash, etc.)
              "object-src 'none'",
              
              // Base URI
              "base-uri 'self'",
              
              // Form actions - only same origin
              "form-action 'self'",
              
              // Trusted Types for XSS prevention
              "require-trusted-types-for 'script'",
              
              // Upgrade insecure requests in production
              ...(process.env.NODE_ENV === 'production' ? ["upgrade-insecure-requests"] : [])
            ].join('; ')
          }
        ]
      },
      
      // Specific headers for API routes
      {
        source: '/api/(.*)',
        headers: [
          // CORS headers for API routes
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' 
              ? 'https://ez-resume.xyz' 
              : 'http://localhost:3000'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With'
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400' // 24 hours
          }
        ]
      },
      
      // Cache control for static assets
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      
      // Security headers for PDF endpoints
      {
        source: '/api/generate-latex',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'none'"
          }
        ]
      }
    ]
  },
  
  // Redirect HTTP to HTTPS in production
  async redirects() {
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/(.*)',
          has: [
            {
              type: 'header',
              key: 'x-forwarded-proto',
              value: 'http'
            }
          ],
          destination: 'https://ez-resume.xyz/:path*',
          permanent: true
        }
      ]
    }
    return []
  },
  
  // Environment-specific optimizations
  ...(process.env.NODE_ENV === 'production' && {
    // Production optimizations
    compress: true,
    poweredByHeader: false,
    
    // Bundle analyzer (uncomment to analyze bundle size)
    // bundleAnalyzer: {
    //   enabled: process.env.ANALYZE === 'true'
    // }
  })
}

module.exports = nextConfig 