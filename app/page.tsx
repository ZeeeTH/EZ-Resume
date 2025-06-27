'use client'
// Vercel rebuild cache buster - local fix successful, forcing clean deploy

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FileText, Mail, Sparkles, CheckCircle, Loader2, Star, Zap, Shield, Users, TrendingUp } from 'lucide-react'

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
  coverLetter: z.boolean()
})

interface FormData {
  name: string
  email: string
  phone?: string
  jobTitle: string
  company: string
  experience: string
  education: string
  skills: string
  achievements: string
  coverLetter: boolean
}

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coverLetter: false
    },
    mode: 'onChange' // Enable real-time validation
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
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Get Hired Faster with
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI-Powered Resumes
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-3xl mx-auto px-4">
              Create professional resumes and cover letters in minutes. 
              Stand out to employers with our AI-driven approach. ✨
            </p>
            
            {/* Enhanced Social Proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 text-gray-400 mb-8">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-sm md:text-base">1,000+ Resumes Generated</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                <span className="text-sm md:text-base">95% Success Rate</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-400" />
                <span className="text-sm md:text-base">Trusted by Job Seekers</span>
              </div>
            </div>
          </div>

          {/* Main Form Card */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
              {!isSuccess ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        {...register('name')}
                        id="name"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Enter your full name"
                        aria-describedby="name-error"
                      />
                      {errors.name && (
                        <p id="name-error" className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        {...register('email')}
                        id="email"
                        type="email"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="your.email@example.com"
                        aria-describedby="email-error"
                      />
                      {errors.email && (
                        <p id="email-error" className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        {...register('phone')}
                        id="phone"
                        type="tel"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="+1 (555) 123-4567 (optional)"
                      />
                    </div>
                    <div>
                      <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-300 mb-2">
                        Desired Job Title *
                      </label>
                      <input
                        {...register('jobTitle')}
                        id="jobTitle"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="e.g., Software Engineer, Marketing Manager"
                        aria-describedby="jobTitle-error"
                      />
                      {errors.jobTitle && (
                        <p id="jobTitle-error" className="mt-1 text-sm text-red-400">{errors.jobTitle.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                      Target Company *
                    </label>
                    <input
                      {...register('company')}
                      id="company"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="e.g., Google, Microsoft, or 'Any Tech Company'"
                      aria-describedby="company-error"
                    />
                    {errors.company && (
                      <p id="company-error" className="mt-1 text-sm text-red-400">{errors.company.message}</p>
                    )}
                  </div>

                  {/* Experience */}
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-300 mb-2">
                      Work Experience *
                    </label>
                    <textarea
                      {...register('experience')}
                      id="experience"
                      rows={4}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                      placeholder="Describe your work experience, responsibilities, and achievements. Include specific projects, technologies used, and measurable results."
                      aria-describedby="experience-error"
                    />
                    {errors.experience && (
                      <p id="experience-error" className="mt-1 text-sm text-red-400">{errors.experience.message}</p>
                    )}
                  </div>

                  {/* Education */}
                  <div>
                    <label htmlFor="education" className="block text-sm font-medium text-gray-300 mb-2">
                      Education *
                    </label>
                    <textarea
                      {...register('education')}
                      id="education"
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                      placeholder="List your degrees, certifications, relevant coursework, and academic achievements."
                      aria-describedby="education-error"
                    />
                    {errors.education && (
                      <p id="education-error" className="mt-1 text-sm text-red-400">{errors.education.message}</p>
                    )}
                  </div>

                  {/* Skills */}
                  <div>
                    <label htmlFor="skills" className="block text-sm font-medium text-gray-300 mb-2">
                      Skills *
                    </label>
                    <textarea
                      {...register('skills')}
                      id="skills"
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                      placeholder="List technical skills, programming languages, tools, soft skills, and technologies you're proficient with."
                      aria-describedby="skills-error"
                    />
                    {errors.skills && (
                      <p id="skills-error" className="mt-1 text-sm text-red-400">{errors.skills.message}</p>
                    )}
                  </div>

                  {/* Achievements */}
                  <div>
                    <label htmlFor="achievements" className="block text-sm font-medium text-gray-300 mb-2">
                      Key Achievements *
                    </label>
                    <textarea
                      {...register('achievements')}
                      id="achievements"
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                      placeholder="Highlight notable accomplishments, awards, projects, metrics, and quantifiable results from your career."
                      aria-describedby="achievements-error"
                    />
                    {errors.achievements && (
                      <p id="achievements-error" className="mt-1 text-sm text-red-400">{errors.achievements.message}</p>
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

                  {/* Privacy Statement */}
                  <div className="flex items-start space-x-3 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <Shield className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-300">
                      <p className="font-medium mb-1">Your privacy is protected</p>
                      <p>We never share your personal data with third parties. Your information is only used to generate your resume and is deleted after processing.</p>
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Enhanced Submit Button */}
                  <button
                    type="submit"
                    disabled={isGenerating || !isValid}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-lg shadow-lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Generating your resume...</span>
                      </>
                    ) : (
                      <>
                        <FileText className="h-6 w-6" />
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
                  <p className="text-gray-300 mb-8 max-w-md mx-auto">
                    Your professional resume has been created and sent to your email address.
                    Check your inbox for the download link.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Generate Another Resume
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center mt-12 md:mt-16 pb-8">
            <p className="text-gray-400 text-sm">
              © 2024 EZ Resume. Powered by AI to help you land your dream job. ✨
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
} 