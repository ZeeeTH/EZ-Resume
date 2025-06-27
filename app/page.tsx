'use client'
// Vercel rebuild cache buster - local fix successful, forcing clean deploy

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FileText, Mail, Sparkles, CheckCircle, Loader2, Star, Zap } from 'lucide-react'

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  jobTitle: z.string().min(3, 'Job title must be at least 3 characters'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  experience: z.string().min(50, 'Please provide at least 50 characters of experience'),
  education: z.string().min(20, 'Please provide at least 20 characters of education'),
  skills: z.string().min(20, 'Please provide at least 20 characters of skills'),
  achievements: z.string().min(30, 'Please provide at least 30 characters of achievements'),
  coverLetter: z.boolean().default(false)
})

type FormData = z.infer<typeof formSchema>

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })

  const coverLetter = watch('coverLetter')

  const onSubmit = async (data: FormData) => {
    setIsGenerating(true)
    setError('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to generate resume')
      }

      const result = await response.json()
      
      if (result.success) {
        setIsSuccess(true)
      } else {
        setError(result.error || 'Something went wrong')
      }
    } catch (err) {
      setError('Failed to generate resume. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Sparkles className="h-8 w-8 text-purple-400" />
                <Star className="h-4 w-4 text-blue-400 absolute -top-1 -right-1" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                EZ Resume
              </h1>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Get Hired Faster with
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI-Powered Resumes
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Create professional resumes and cover letters in minutes. 
              Stand out to employers with our AI-driven approach. ✨
            </p>
            
            {/* Social Proof */}
            <div className="flex items-center justify-center space-x-8 text-gray-400 mb-8">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>1,000+ Resumes Generated</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                <span>95% Success Rate</span>
              </div>
            </div>
          </div>

          {/* Main Form Card */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
              {!isSuccess ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        {...register('name')}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="John Doe"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        {...register('email')}
                        type="email"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        {...register('phone')}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Desired Job Title *
                      </label>
                      <input
                        {...register('jobTitle')}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Software Engineer"
                      />
                      {errors.jobTitle && (
                        <p className="mt-1 text-sm text-red-400">{errors.jobTitle.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Target Company *
                    </label>
                    <input
                      {...register('company')}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Google, Microsoft, etc."
                    />
                    {errors.company && (
                      <p className="mt-1 text-sm text-red-400">{errors.company.message}</p>
                    )}
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Work Experience *
                    </label>
                    <textarea
                      {...register('experience')}
                      rows={4}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                      placeholder="Describe your work experience, responsibilities, and achievements..."
                    />
                    {errors.experience && (
                      <p className="mt-1 text-sm text-red-400">{errors.experience.message}</p>
                    )}
                  </div>

                  {/* Education */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Education *
                    </label>
                    <textarea
                      {...register('education')}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                      placeholder="Your educational background, degrees, certifications..."
                    />
                    {errors.education && (
                      <p className="mt-1 text-sm text-red-400">{errors.education.message}</p>
                    )}
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Skills *
                    </label>
                    <textarea
                      {...register('skills')}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                      placeholder="Technical skills, soft skills, tools, technologies..."
                    />
                    {errors.skills && (
                      <p className="mt-1 text-sm text-red-400">{errors.skills.message}</p>
                    )}
                  </div>

                  {/* Achievements */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Key Achievements *
                    </label>
                    <textarea
                      {...register('achievements')}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                      placeholder="Notable accomplishments, awards, projects, metrics..."
                    />
                    {errors.achievements && (
                      <p className="mt-1 text-sm text-red-400">{errors.achievements.message}</p>
                    )}
                  </div>

                  {/* Cover Letter Option */}
                  <div className="flex items-center space-x-3 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <input
                      {...register('coverLetter')}
                      type="checkbox"
                      id="coverLetter"
                      className="w-4 h-4 text-purple-500 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <label htmlFor="coverLetter" className="text-sm text-gray-300">
                      Also generate a cover letter for this position
                    </label>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Generating your resume...</span>
                      </>
                    ) : (
                      <>
                        <FileText className="h-5 w-5" />
                        <span>Generate My Resume</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-6">
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Resume Generated Successfully! 🎉</h3>
                  <p className="text-gray-300 mb-8">
                    Your professional resume has been created and sent to your email address.
                    Check your inbox for the download link.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Generate Another Resume
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center mt-16 pb-8">
            <p className="text-gray-400 text-sm">
              © 2024 EZ Resume. Powered by AI to help you land your dream job. ✨
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
} 