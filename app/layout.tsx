import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AppClientWrapper from './AppClientWrapper';
import GoogleAnalytics from './components/GoogleAnalytics';
import CookieConsent from './components/CookieConsent';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'EZ Resume – AI-Powered Resume & Cover Letter Generator',
    template: '%s | EZ Resume'
  },
  description: 'Create professional resumes and cover letters in minutes with AI. Stand out to employers with our intelligent resume builder. Free to start, premium features available.',
  keywords: [
    'resume builder',
    'AI resume generator',
    'cover letter generator',
    'job application',
    'professional resume',
    'career tools',
    'resume template',
    'CV builder',
    'job search',
    'employment',
    'career development',
    'resume writing',
    'cover letter writing',
    'AI writing assistant'
  ].join(', '),
  authors: [{ name: 'EZ Resume Team' }],
  creator: 'EZ Resume',
  publisher: 'EZ Resume',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://ez-resume.xyz'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'EZ Resume – AI-Powered Resume & Cover Letter Generator',
    description: 'Create professional resumes and cover letters in minutes with AI. Stand out to employers with our intelligent resume builder. Free to start, premium features available.',
    url: 'https://ez-resume.xyz',
    siteName: 'EZ Resume',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EZ Resume - AI-Powered Resume Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EZ Resume – AI-Powered Resume & Cover Letter Generator',
    description: 'Create professional resumes and cover letters in minutes with AI. Stand out to employers with our intelligent resume builder.',
    images: ['/og-image.png'],
    creator: '@ezresume',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#8b5cf6',
      },
    ],
  },
  manifest: '/site.webmanifest',
  category: 'productivity',
  classification: 'Resume Builder',
  other: {
    'msapplication-TileColor': '#8b5cf6',
    'msapplication-config': '/browserconfig.xml',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#8b5cf6" />
        <meta name="msapplication-TileColor" content="#8b5cf6" />
        <meta name="theme-color" content="#8b5cf6" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "EZ Resume",
              "description": "AI-powered resume and cover letter generator that helps users create professional documents in minutes",
              "url": "https://ez-resume.xyz",
              "applicationCategory": "ProductivityApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Free to start with premium features available"
              },
              "creator": {
                "@type": "Organization",
                "name": "EZ Resume"
              },
              "featureList": [
                "AI-powered resume generation",
                "Cover letter creation",
                "Professional templates",
                "Real-time editing",
                "PDF export",
                "Email delivery"
              ]
            })
          }}
        />
      </head>
      <body className={inter.className}>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        <AppClientWrapper>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-blue-950 flex flex-col">
            {children}
          </div>
        </AppClientWrapper>
        <CookieConsent />
      </body>
    </html>
  )
} 