import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'EZ Resume - AI-Powered Resume & Cover Letter Generator',
  description: 'Create professional resumes and cover letters with the power of AI. Get personalized, compelling content that helps you stand out to employers.',
  keywords: 'resume builder, cover letter generator, AI resume, professional resume, job application',
  authors: [{ name: 'EZ Resume Team' }],
  openGraph: {
    title: 'EZ Resume - AI-Powered Resume & Cover Letter Generator',
    description: 'Create professional resumes and cover letters with the power of AI.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EZ Resume - AI-Powered Resume & Cover Letter Generator',
    description: 'Create professional resumes and cover letters with the power of AI.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          {children}
        </div>
      </body>
    </html>
  )
} 