'use client'
// Vercel rebuild cache buster - local fix successful, forcing clean deploy

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FileText, Mail, Sparkles, CheckCircle, Loader2, Star, Zap, Shield, Users, TrendingUp } from 'lucide-react'
import React from 'react'
import ContactModal from './ContactModal'
import { useContactModal } from './ContactModalContext'

const workExperienceSchema = z.object({
  title: z.string().min(2, 'Job title is required'),
  company: z.string().min(2, 'Company is required'),
  startMonth: z.string().min(1, 'Start month is required'),
  startYear: z.string().min(1, 'Start year is required'),
  endMonth: z.string().optional(),
  endYear: z.string().optional(),
  description: z.string().min(10, 'Description is required'),
});
const educationSchema = z.object({
  degree: z.string().min(2, 'Degree is required'),
  school: z.string().min(2, 'School is required'),
  startMonth: z.string().min(1, 'Start month is required'),
  startYear: z.string().min(1, 'Start year is required'),
  endMonth: z.string().optional(),
  endYear: z.string().optional(),
});
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  skills: z.string().min(2, 'Please provide at least 2 characters of skills'),
  achievements: z.string().min(2, 'Please provide at least 2 characters of achievements'),
  coverLetter: z.boolean(),
  location: z.string().optional(),
  workExperience: z.array(workExperienceSchema).min(1, 'At least one work experience is required'),
  education: z.array(educationSchema).min(1, 'At least one education entry is required'),
}).refine((data) => {
  if (data.coverLetter) {
    return data.jobTitle && data.jobTitle.length >= 3 && data.company && data.company.length >= 2;
  }
  return true;
}, {
  message: "Job title and company are required when generating a cover letter",
  path: ["jobTitle"]
});

type FormData = z.infer<typeof formSchema>;

interface WorkExperience {
  title: string
  company: string
  startMonth: string
  startYear: string
  endMonth: string
  endYear: string
  description: string
}

interface Education {
  degree: string
  school: string
  startMonth: string
  startYear: string
  endMonth: string
  endYear: string
}

// Helper arrays for months and years
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 51 }, (_, i) => currentYear - i);

// Restore the isFieldMissing helper for red border UX
const isFieldMissing = (value: string) => !value || value.trim() === '';

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [formProgress, setFormProgress] = useState(0)
  const { open, closeModal, openModal } = useContactModal();

  // PDF Preview Modal States
  const [showResumePreview, setShowResumePreview] = useState(false)
  const [showCoverLetterPreview, setShowCoverLetterPreview] = useState(false)

  // useFieldArray for dynamic work experience and education
  const { control, ...formMethods } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coverLetter: false,
      workExperience: [
        { title: '', company: '', startMonth: '', startYear: '', endMonth: '', endYear: '', description: '' }
      ],
      education: [
        { degree: '', school: '', startMonth: '', startYear: '', endMonth: '', endYear: '' }
      ]
    },
    mode: 'onChange'
  });
  const { register, handleSubmit, formState: { errors, isValid, isDirty, touchedFields }, watch, trigger } = formMethods;
  const workExpFieldArray = useFieldArray({ control, name: 'workExperience' });
  const eduFieldArray = useFieldArray({ control, name: 'education' });

  const coverLetter = watch('coverLetter')
  const watchedFields = watch()

  // Calculate form progress
  React.useEffect(() => {
    // Count all required top-level fields
    const requiredFields = ['name', 'email', 'skills', 'achievements'];
    const coverLetterFields = coverLetter ? ['jobTitle', 'company'] : [];
    let totalFields = requiredFields.length + coverLetterFields.length;
    let filledFields = 0;
    requiredFields.forEach(field => {
      const value = watchedFields[field as keyof FormData];
      if (value && value.toString().trim().length > 0) filledFields++;
    });
    coverLetterFields.forEach(field => {
      const value = watchedFields[field as keyof FormData];
      if (value && value.toString().trim().length > 0) filledFields++;
    });
    // Count dynamic work experience fields
    const workExp = watchedFields.workExperience || [];
    totalFields += workExp.length * 5; // 5 required fields per job
    workExp.forEach((job: any) => {
      if (job.title?.trim()) filledFields++;
      if (job.company?.trim()) filledFields++;
      if (job.startMonth?.trim()) filledFields++;
      if (job.startYear?.trim()) filledFields++;
      if (job.description?.trim()) filledFields++;
    });
    // Count dynamic education fields
    const eduArr = watchedFields.education || [];
    totalFields += eduArr.length * 4; // 4 required fields per edu
    eduArr.forEach((edu: any) => {
      if (edu.degree?.trim()) filledFields++;
      if (edu.school?.trim()) filledFields++;
      if (edu.startMonth?.trim()) filledFields++;
      if (edu.startYear?.trim()) filledFields++;
    });
    const progress = totalFields === 0 ? 0 : Math.round((filledFields / totalFields) * 100);
    setFormProgress(progress);
  }, [watchedFields, coverLetter]);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  const getFieldStatus = (fieldName: keyof FormData) => {
    const value = watchedFields[fieldName]
    const hasError = errors[fieldName]
    
    // Handle arrays (workExperience, education) differently
    if (Array.isArray(value)) {
      const isFilled = value.length > 0 && value.some(item => 
        Object.values(item).some(val => val && val.toString().trim().length > 0)
      )
      if (hasError) return 'error'
      if (isFilled) return 'success'
      return 'default'
    }
    
    // Handle regular string fields
    const isFilled = value && value.toString().trim().length > 0
    
    if (hasError) return 'error'
    if (isFilled) return 'success'
    return 'default'
  }

  const onSubmit = async (data: FormData) => {
    setIsGenerating(true)
    setError('')

    try {
      // Transform the data to match the API expectations
      const apiData = {
        ...data,
        workExperience: data.workExperience,
        educationData: data.education
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
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

  // Helper to check if a work experience entry is valid
  const isWorkValid = (job: WorkExperience) => {
    return (
      (job.title?.trim() ?? '') &&
      (job.company?.trim() ?? '') &&
      (job.startMonth?.trim() ?? '') &&
      (job.startYear?.trim() ?? '') &&
      (job.description?.trim() ?? '')
    );
  };

  // Helper to check if an education entry is valid
  const isEduValid = (edu: Education) => {
    return (
      (edu.degree?.trim() ?? '') &&
      (edu.school?.trim() ?? '') &&
      (edu.startMonth?.trim() ?? '') &&
      (edu.startYear?.trim() ?? '')
    );
  };

  const addJob = () => workExpFieldArray.append({ title: '', company: '', startMonth: '', startYear: '', endMonth: '', endYear: '', description: '' });
  const removeJob = (idx: number) => workExpFieldArray.remove(idx);
  const addEducation = () => eduFieldArray.append({ degree: '', school: '', startMonth: '', startYear: '', endMonth: '', endYear: '' });
  const removeEducation = (idx: number) => eduFieldArray.remove(idx);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5"></div>
      
      <div className="relative z-10">
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
                  {/* Progress Indicator */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-300">Form Progress</span>
                      <span className="text-sm text-gray-400">{formProgress}% Complete</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${formProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {formProgress < 50 && "Keep going! You're making great progress."}
                      {formProgress >= 50 && formProgress < 100 && "Almost there! Just a few more details."}
                      {formProgress === 100 && "Perfect! Your form is complete and ready to generate."}
                    </p>
                  </div>

                  {/* Personal Details Section */}
                  <div className="mb-10">
                    <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Personal Details</h2>
                    <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                          Full Name *
                        </label>
                        <div className="relative">
                          <input
                            {...register('name')}
                            id="name"
                            className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${!!touchedFields.name && isFieldMissing(watchedFields.name) ? 'border-red-400' : 'border-white/20'}`}
                            placeholder="Enter your full name"
                            aria-describedby="name-error"
                          />
                          {getFieldStatus('name') === 'success' && (
                            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-400" />
                          )}
                        </div>
                        {errors.name && (
                          <p id="name-error" className="mt-1 text-sm text-red-400 flex items-center">
                            <span className="mr-1">⚠</span>
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address *
                        </label>
                        <div className="relative">
                          <input
                            {...register('email')}
                            id="email"
                            type="email"
                            className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${!!touchedFields.email && isFieldMissing(watchedFields.email) ? 'border-red-400' : 'border-white/20'}`}
                            placeholder="your.email@example.com"
                            aria-describedby="email-error"
                          />
                          {getFieldStatus('email') === 'success' && (
                            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-400" />
                          )}
                        </div>
                        {errors.email && (
                          <p id="email-error" className="mt-1 text-sm text-red-400 flex items-center">
                            <span className="mr-1">⚠</span>
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 md:gap-6 mt-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <input
                            {...register('phone')}
                            id="phone"
                            type="tel"
                            className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                              getFieldStatus('phone') === 'success' ? 'border-green-400' : 'border-white/20'
                            }`}
                            placeholder="+1 (555) 123-4567 (optional)"
                          />
                          {getFieldStatus('phone') === 'success' && (
                            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-400" />
                          )}
                        </div>
                      </div>
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                          Location
                        </label>
                        <div className="relative">
                          <input
                            {...register('location')}
                            id="location"
                            className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                            getFieldStatus('location') === 'success' ? 'border-green-400' : 'border-white/20'
                          }`}
                            placeholder="City, State (optional)"
                          />
                          {getFieldStatus('location') === 'success' && (
                            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Work Experience Section */}
                  <div className="mb-10">
                    <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Work Experience</h2>
                    {workExpFieldArray.fields.map((job, idx) => (
                      <div
                        key={idx}
                        className={`bg-white/5 backdrop-blur-xl rounded-2xl p-6 mb-6 border shadow-2xl flex flex-col gap-4 transition-all duration-200 ${isWorkValid(job) ? 'border-green-400' : 'border-white/10'}`}
                        style={{ position: 'relative' }}
                      >
                        {workExpFieldArray.fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeJob(idx)}
                            className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-lg font-bold bg-transparent border-none p-0 m-0 focus:outline-none z-10"
                            aria-label="Remove job"
                          >
                            ×
                          </button>
                        )}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Job Title
                          </label>
                          <input
                            {...register(`workExperience.${idx}.title` as const)}
                            className={`w-full bg-white/10 text-white rounded-lg px-4 py-3 placeholder-gray-400 border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              !!touchedFields.workExperience?.[idx]?.title && isFieldMissing(watchedFields.workExperience?.[idx]?.title) ? 'border-red-400' : 'border-white/20'
                            }`}
                            placeholder="e.g., Senior Software Engineer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Company
                          </label>
                          <input
                            {...register(`workExperience.${idx}.company` as const)}
                            className={`w-full bg-white/10 text-white rounded-lg px-4 py-3 placeholder-gray-400 border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              !!touchedFields.workExperience?.[idx]?.company && isFieldMissing(watchedFields.workExperience?.[idx]?.company) ? 'border-red-400' : 'border-white/20'
                            }`}
                            placeholder="e.g., Google, Microsoft"
                          />
                        </div>
                        <div className="flex gap-6 w-full">
                          <div className="flex flex-col w-1/2">
                            <label className="text-sm font-medium text-gray-300 mb-2">Start Date</label>
                            <div className="flex gap-2">
                              <select
                                {...register(`workExperience.${idx}.startMonth` as const)}
                                className={`w-1/2 bg-[#6a4a90] text-white rounded-lg px-4 py-3 border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                  !!touchedFields.workExperience?.[idx]?.startMonth && isFieldMissing(watchedFields.workExperience?.[idx]?.startMonth) ? 'border-red-400' : 'border-white/20'
                                }`}
                              >
                                <option value="">Month</option>
                                {months.map((month, index) => (
                                  <option key={index} value={month}>{month}</option>
                                ))}
                              </select>
                              <select
                                {...register(`workExperience.${idx}.startYear` as const)}
                                className={`w-1/2 bg-[#6a4a90] text-white rounded-lg px-4 py-3 border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                  !!touchedFields.workExperience?.[idx]?.startYear && isFieldMissing(watchedFields.workExperience?.[idx]?.startYear) ? 'border-red-400' : 'border-white/20'
                                }`}
                              >
                                <option value="">Year</option>
                                {years.map((year) => (
                                  <option key={year} value={year}>{year}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="flex flex-col w-1/2">
                            <label className="text-sm font-medium text-gray-300 mb-2">End Date</label>
                            <div className="flex gap-2">
                              <select
                                {...register(`workExperience.${idx}.endMonth` as const)}
                                className="w-1/2 bg-[#6a4a90] text-white rounded-lg px-4 py-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              >
                                <option value="">Month</option>
                                {months.map((month, index) => (
                                  <option key={index} value={month}>{month}</option>
                                ))}
                              </select>
                              <select
                                {...register(`workExperience.${idx}.endYear` as const)}
                                className="w-1/2 bg-[#6a4a90] text-white rounded-lg px-4 py-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              >
                                <option value="">Year</option>
                                {years.map((year) => (
                                  <option key={year} value={year}>{year}</option>
                                ))}
                              </select>
                            </div>
                            <span className="text-xs text-gray-400 mt-1">(Leave blank if still present)</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Job Description
                          </label>
                          <textarea
                            {...register(`workExperience.${idx}.description` as const)}
                            className={`w-full bg-white/10 text-white rounded-lg px-4 py-3 placeholder-gray-400 border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                              !!touchedFields.workExperience?.[idx]?.description && isFieldMissing(watchedFields.workExperience?.[idx]?.description) ? 'border-red-400' : 'border-white/20'
                            }`}
                            placeholder="Describe your responsibilities, achievements, and key contributions in this role"
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addJob}
                      className="mt-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      + Add Job
                    </button>
                  </div>

                  {/* Education Section */}
                  <div className="mb-10">
                    <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Education</h2>
                    {eduFieldArray.fields.map((edu, idx) => (
                      <div
                        key={idx}
                        className={`bg-white/5 backdrop-blur-xl rounded-2xl p-6 mb-6 border shadow-2xl flex flex-col gap-4 transition-all duration-200 ${isEduValid(edu) ? 'border-green-400' : 'border-white/10'}`}
                        style={{ position: 'relative' }}
                      >
                        {eduFieldArray.fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEducation(idx)}
                            className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-lg font-bold bg-transparent border-none p-0 m-0 focus:outline-none z-10"
                            aria-label="Remove education"
                          >
                            ×
                          </button>
                        )}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Degree
                          </label>
                          <input
                            {...register(`education.${idx}.degree` as const)}
                            className={`w-full bg-white/10 text-white rounded-lg px-4 py-3 placeholder-gray-400 border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              !!touchedFields.education?.[idx]?.degree && isFieldMissing(watchedFields.education?.[idx]?.degree) ? 'border-red-400' : 'border-white/20'
                            }`}
                            placeholder="e.g., Bachelor of Science in Computer Science"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            School/University
                          </label>
                          <input
                            {...register(`education.${idx}.school` as const)}
                            className={`w-full bg-white/10 text-white rounded-lg px-4 py-3 placeholder-gray-400 border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              !!touchedFields.education?.[idx]?.school && isFieldMissing(watchedFields.education?.[idx]?.school) ? 'border-red-400' : 'border-white/20'
                            }`}
                            placeholder="e.g., Stanford University"
                          />
                        </div>
                        <div className="flex gap-6 w-full">
                          <div className="flex flex-col w-1/2">
                            <label className="text-sm font-medium text-gray-300 mb-2">Start Date</label>
                            <div className="flex gap-2">
                              <select
                                {...register(`education.${idx}.startMonth` as const)}
                                className={`w-1/2 bg-[#6a4a90] text-white rounded-lg px-4 py-3 border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                  !!touchedFields.education?.[idx]?.startMonth && isFieldMissing(watchedFields.education?.[idx]?.startMonth) ? 'border-red-400' : 'border-white/20'
                                }`}
                              >
                                <option value="">Month</option>
                                {months.map((month, index) => (
                                  <option key={index} value={month}>{month}</option>
                                ))}
                              </select>
                              <select
                                {...register(`education.${idx}.startYear` as const)}
                                className={`w-1/2 bg-[#6a4a90] text-white rounded-lg px-4 py-3 border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                  !!touchedFields.education?.[idx]?.startYear && isFieldMissing(watchedFields.education?.[idx]?.startYear) ? 'border-red-400' : 'border-white/20'
                                }`}
                              >
                                <option value="">Year</option>
                                {years.map((year) => (
                                  <option key={year} value={year}>{year}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="flex flex-col w-1/2">
                            <label className="text-sm font-medium text-gray-300 mb-2">End Date</label>
                            <div className="flex gap-2">
                              <select
                                {...register(`education.${idx}.endMonth` as const)}
                                className="w-1/2 bg-[#6a4a90] text-white rounded-lg px-4 py-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              >
                                <option value="">Month</option>
                                {months.map((month, index) => (
                                  <option key={index} value={month}>{month}</option>
                                ))}
                              </select>
                              <select
                                {...register(`education.${idx}.endYear` as const)}
                                className="w-1/2 bg-[#6a4a90] text-white rounded-lg px-4 py-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              >
                                <option value="">Year</option>
                                {years.map((year) => (
                                  <option key={year} value={year}>{year}</option>
                                ))}
                              </select>
                            </div>
                            <span className="text-xs text-gray-400 mt-1">(Leave blank if still present)</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addEducation}
                      className="mt-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      + Add Education
                    </button>
                  </div>

                  {/* Skills Section */}
                  <div className="mb-10">
                    <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Skills</h2>
                    <div className="relative">
                      <textarea
                        {...register('skills')}
                        id="skills"
                        rows={3}
                        className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none ${!!touchedFields.skills && isFieldMissing(watchedFields.skills) ? 'border-red-400' : 'border-white/20'}`}
                        placeholder="e.g., JavaScript, React, Node.js, Python, AWS, Docker, Git, Agile methodologies, Team leadership, Problem-solving, Communication"
                        aria-describedby="skills-error"
                      />
                      {getFieldStatus('skills') === 'success' && (
                        <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-400" />
                      )}
                    </div>
                    {errors.skills && (
                      <p id="skills-error" className="mt-1 text-sm text-red-400 flex items-center">
                        <span className="mr-1">⚠</span>
                        {errors.skills.message}
                      </p>
                    )}
                  </div>

                  {/* Key Achievements Section */}
                  <div className="mb-10">
                    <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Key Achievements</h2>
                    <div className="relative">
                      <textarea
                        {...register('achievements')}
                        id="achievements"
                        rows={3}
                        className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none ${!!touchedFields.achievements && isFieldMissing(watchedFields.achievements) ? 'border-red-400' : 'border-white/20'}`}
                        placeholder="e.g., Increased website conversion rate by 25% through A/B testing. Won 'Employee of the Year' award. Reduced system downtime by 60%. Launched 3 successful products generating $2M in revenue."
                        aria-describedby="achievements-error"
                      />
                      {getFieldStatus('achievements') === 'success' && (
                        <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-400" />
                      )}
                    </div>
                    {errors.achievements && (
                      <p id="achievements-error" className="mt-1 text-sm text-red-400 flex items-center">
                        <span className="mr-1">⚠</span>
                        {errors.achievements.message}
                      </p>
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

                  {/* Conditional Job Title and Company Fields */}
                  {coverLetter && (
                    <>
                      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                          <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-300 mb-2">
                            Desired Job Title *
                          </label>
                          <div className="relative">
                            <input
                              {...register('jobTitle')}
                              id="jobTitle"
                              className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${!!touchedFields.jobTitle && isFieldMissing(watchedFields.jobTitle) ? 'border-red-400' : 'border-white/20'}`}
                              placeholder="e.g., Software Engineer, Marketing Manager"
                              aria-describedby="jobTitle-error"
                            />
                            {getFieldStatus('jobTitle') === 'success' && (
                              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-400" />
                            )}
                          </div>
                          {errors.jobTitle && (
                            <p id="jobTitle-error" className="mt-1 text-sm text-red-400 flex items-center">
                              <span className="mr-1">⚠</span>
                              {errors.jobTitle.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                            Target Company *
                          </label>
                          <div className="relative">
                            <input
                              {...register('company')}
                              id="company"
                              className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${!!touchedFields.company && isFieldMissing(watchedFields.company) ? 'border-red-400' : 'border-white/20'}`}
                              placeholder="e.g., Google, Microsoft, or 'Any Tech Company'"
                              aria-describedby="company-error"
                            />
                            {getFieldStatus('company') === 'success' && (
                              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-400" />
                            )}
                          </div>
                          {errors.company && (
                            <p id="company-error" className="mt-1 text-sm text-red-400 flex items-center">
                              <span className="mr-1">⚠</span>
                              {errors.company.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  )}

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
                      <p className="text-red-400 text-sm flex items-center">
                        <span className="mr-2">⚠</span>
                        {error}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isGenerating || !isValid || formProgress < 100}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-lg shadow-lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Generating your {coverLetter ? 'resume & cover letter' : 'resume'}...</span>
                      </>
                    ) : (
                      <>
                        <FileText className="h-6 w-6" />
                        <span>Generate My {coverLetter ? 'Resume & Cover Letter' : 'Resume'}</span>
                      </>
                    )}
                  </button>
                  
                  {!isValid && formProgress > 0 && (
                    <p className="text-sm text-yellow-400 text-center">
                      Please complete all required fields to continue
                    </p>
                  )}
                  
                  {formProgress < 100 && (
                    <p className="text-sm text-gray-400 text-center">
                      {formProgress === 0 && "Start filling out the form above"}
                      {formProgress > 0 && formProgress < 50 && "Keep going! You're making great progress."}
                      {formProgress >= 50 && formProgress < 100 && "Almost there! Just a few more details needed."}
                    </p>
                  )}
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
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Generate Another Resume
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sample Output Preview */}
          <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  See What You'll Get
                </h3>
                <p className="text-gray-300 text-lg">
                  Professional, ATS-optimized resumes that get you noticed
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {/* Resume Preview */}
                <div 
                  className="bg-white rounded-lg p-6 shadow-lg transform hover:scale-105 transition-transform duration-200 cursor-pointer"
                  onClick={() => setShowResumePreview(true)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-800">Professional Resume</h4>
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="border-l-4 border-blue-500 pl-3">
                      <p className="font-semibold">Clean, Modern Design</p>
                      <p>ATS-friendly formatting</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-3">
                      <p className="font-semibold">AI-Optimized Content</p>
                      <p>Keyword-rich descriptions</p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-3">
                      <p className="font-semibold">Professional Layout</p>
                      <p>Industry-standard sections</p>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-blue-600 text-sm font-medium">Click to preview →</span>
                  </div>
                </div>

                {/* Cover Letter Preview */}
                <div 
                  className="bg-white rounded-lg p-6 shadow-lg transform hover:scale-105 transition-transform duration-200 cursor-pointer"
                  onClick={() => setShowCoverLetterPreview(true)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-800">Cover Letter</h4>
                    <Mail className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="border-l-4 border-purple-500 pl-3">
                      <p className="font-semibold">Personalized Content</p>
                      <p>Tailored to your target role</p>
                    </div>
                    <div className="border-l-4 border-emerald-500 pl-3">
                      <p className="font-semibold">Compelling Narrative</p>
                      <p>Highlights your unique value</p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-3">
                      <p className="font-semibold">Professional Tone</p>
                      <p>Perfect for any industry</p>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-purple-600 text-sm font-medium">Click to preview →</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Simple, Transparent Pricing
                </h3>
                <p className="text-gray-300 text-lg">
                  No hidden fees, no subscriptions - just great results
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Resume Only */}
                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
                  <div className="text-center mb-4">
                    <h4 className="text-xl font-bold text-white mb-2">Resume Only</h4>
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <span className="text-3xl font-bold text-blue-400">$19.99</span>
                      <span className="text-lg text-gray-400 line-through">$49.99</span>
                    </div>
                    <p className="text-gray-400 text-sm">One-time payment</p>
                    <p className="text-green-400 text-sm font-medium">Save $30!</p>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-300 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      Professional resume design
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      ATS-optimized formatting
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      AI-enhanced content
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      PDF download
                    </li>
                  </ul>
                </div>

                {/* Resume + Cover Letter */}
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-xl p-6 border border-purple-500/30 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                  <div className="text-center mb-4">
                    <h4 className="text-xl font-bold text-white mb-2">Resume + Cover Letter</h4>
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <span className="text-3xl font-bold text-purple-400">$29.99</span>
                      <span className="text-lg text-gray-400 line-through">$79.99</span>
                    </div>
                    <p className="text-gray-400 text-sm">One-time payment</p>
                    <p className="text-green-400 text-sm font-medium">Save $50!</p>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-300 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      Everything in Resume Only
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      Personalized cover letter
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      Target company optimization
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      Both PDF downloads
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Pricing Note */}
              <div className="text-center mt-4 pt-2 border-t border-white/10">
                <p className="text-sm text-gray-400">All prices in USD</p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Frequently Asked Questions
                </h3>
                <p className="text-gray-300 text-lg">
                  Everything you need to know about our AI resume generator
                </p>
              </div>

              <div className="space-y-4">
                <div 
                  className="border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/5 hover:border-pink-500/50 transition-all duration-200"
                  onClick={() => toggleFAQ(0)}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-white">
                      How does the resume generator actually work?
                    </h4>
                    <span className={`text-white transition-transform duration-200 text-2xl font-bold ${openFAQ === 0 ? 'rotate-0' : ''}`}>
                      {openFAQ === 0 ? '−' : '+'}
                    </span>
                  </div>
                  {openFAQ === 0 && (
                    <p className="text-gray-300 mt-3 leading-relaxed">
                      Our AI takes your responses and builds a fully-formatted, ATS-optimized resume in seconds. No templates, no fluff — just clean, job-ready results.
                    </p>
                  )}
                </div>

                <div 
                  className="border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/5 hover:border-pink-500/50 transition-all duration-200"
                  onClick={() => toggleFAQ(1)}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-white">
                      Why should I use EZ Resume instead of doing it myself?
                    </h4>
                    <span className={`text-white transition-transform duration-200 text-2xl font-bold ${openFAQ === 1 ? 'rotate-0' : ''}`}>
                      {openFAQ === 1 ? '−' : '+'}
                    </span>
                  </div>
                  {openFAQ === 1 && (
                    <p className="text-gray-300 mt-3 leading-relaxed">
                      We combine AI with proven resume writing techniques to give you a professionally written resume in less time than it takes to brew a coffee.
                    </p>
                  )}
                </div>

                <div 
                  className="border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/5 hover:border-pink-500/50 transition-all duration-200"
                  onClick={() => toggleFAQ(2)}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-white">
                      How fast will I get my resume?
                    </h4>
                    <span className={`text-white transition-transform duration-200 text-2xl font-bold ${openFAQ === 2 ? 'rotate-0' : ''}`}>
                      {openFAQ === 2 ? '−' : '+'}
                    </span>
                  </div>
                  {openFAQ === 2 && (
                    <p className="text-gray-300 mt-3 leading-relaxed">
                      Instantly. As soon as you hit "Generate," your resume is created and sent to your email/downloaded on the spot.
                    </p>
                  )}
                </div>

                <div 
                  className="border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/5 hover:border-pink-500/50 transition-all duration-200"
                  onClick={() => toggleFAQ(3)}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-white">
                      Will my information be safe?
                    </h4>
                    <span className={`text-white transition-transform duration-200 text-2xl font-bold ${openFAQ === 3 ? 'rotate-0' : ''}`}>
                      {openFAQ === 3 ? '−' : '+'}
                    </span>
                  </div>
                  {openFAQ === 3 && (
                    <p className="text-gray-300 mt-3 leading-relaxed">
                      100%. We don't store or share your data. Everything you enter stays private and is used only to generate your resume.
                    </p>
                  )}
                </div>

                <div 
                  className="border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/5 hover:border-pink-500/50 transition-all duration-200"
                  onClick={() => toggleFAQ(4)}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-white">
                      Can I make changes to my resume after it's generated?
                    </h4>
                    <span className={`text-white transition-transform duration-200 text-2xl font-bold ${openFAQ === 4 ? 'rotate-0' : ''}`}>
                      {openFAQ === 4 ? '−' : '+'}
                    </span>
                  </div>
                  {openFAQ === 4 && (
                    <p className="text-gray-300 mt-3 leading-relaxed">
                      Yes! You'll get a fully editable PDF — perfect for small tweaks or tailoring it to other jobs later.
                    </p>
                  )}
                </div>

                <div 
                  className="border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/5 hover:border-pink-500/50 transition-all duration-200"
                  onClick={() => toggleFAQ(5)}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-white">
                      What if I don't like the result?
                    </h4>
                    <span className={`text-white transition-transform duration-200 text-2xl font-bold ${openFAQ === 5 ? 'rotate-0' : ''}`}>
                      {openFAQ === 5 ? '−' : '+'}
                    </span>
                  </div>
                  {openFAQ === 5 && (
                    <p className="text-gray-300 mt-3 leading-relaxed">
                      If you're not happy, reach out. We offer one free revision or refund — your satisfaction matters.
                    </p>
                  )}
                </div>

                <div 
                  className="border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/5 hover:border-pink-500/50 transition-all duration-200"
                  onClick={() => toggleFAQ(6)}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-white">
                      Is this resume ATS-friendly?
                    </h4>
                    <span className={`text-white transition-transform duration-200 text-2xl font-bold ${openFAQ === 6 ? 'rotate-0' : ''}`}>
                      {openFAQ === 6 ? '−' : '+'}
                    </span>
                  </div>
                  {openFAQ === 6 && (
                    <p className="text-gray-300 mt-3 leading-relaxed">
                      Yes — all resumes are formatted to pass Applicant Tracking Systems and help you stand out to recruiters.
                    </p>
                  )}
                </div>

                <div 
                  className="border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/5 hover:border-pink-500/50 transition-all duration-200"
                  onClick={() => toggleFAQ(7)}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-white">
                      Do you support cover letters too?
                    </h4>
                    <span className={`text-white transition-transform duration-200 text-2xl font-bold ${openFAQ === 7 ? 'rotate-0' : ''}`}>
                      {openFAQ === 7 ? '−' : '+'}
                    </span>
                  </div>
                  {openFAQ === 7 && (
                    <p className="text-gray-300 mt-3 leading-relaxed">
                      Absolutely. Choose the "Resume + Cover Letter" option and we'll generate a personalized letter tailored to your role.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center mt-12 md:mt-16 pb-8">
            {/* Trust Section */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-400">
                <div className="flex flex-col items-center space-y-2">
                  <Shield className="h-6 w-6 text-blue-400" />
                  <p className="font-medium">Your data is private</p>
                  <p>Never stored or shared</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Users className="h-6 w-6 text-green-400" />
                  <p className="font-medium">Trusted by 1,000+ users</p>
                  <p>Join the community</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <TrendingUp className="h-6 w-6 text-purple-400" />
                  <p className="font-medium">95% success rate</p>
                  <p>Proven results</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center mb-4">
              <div className="flex flex-row items-center gap-4 text-xs md:text-sm text-gray-400">
                <a href="/terms" className="hover:text-blue-400 transition-colors font-medium">Terms and Conditions</a>
                <span className="text-gray-500">|</span>
                <a href="/privacy" className="hover:text-purple-400 transition-colors font-medium">Privacy Policy</a>
                <span className="text-gray-500">|</span>
                <button type="button" onClick={openModal} className="hover:text-pink-400 transition-colors font-medium bg-transparent border-none p-0 m-0 focus:outline-none">Contact Us</button>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 EZ Resume. Powered by AI to help you land your dream job. ✨
            </p>
          </footer>
        </div>
      </div>
      <ContactModal open={open} onClose={closeModal} />

      {/* PDF Preview Modals */}
      {showResumePreview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-bold text-gray-800">Resume Preview</h3>
              <button
                onClick={() => setShowResumePreview(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
              <img 
                src="/resume-preview.png" 
                alt="Resume Preview" 
                className="w-full h-auto rounded-lg shadow-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling!.style.display = 'block';
                }}
              />
              <div className="hidden text-center py-12 text-gray-500">
                <p className="text-lg mb-4">Resume Preview</p>
                <p className="text-sm">Sample resume preview image will be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCoverLetterPreview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-bold text-gray-800">Cover Letter Preview</h3>
              <button
                onClick={() => setShowCoverLetterPreview(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
              <img 
                src="/cover-letter-preview.png" 
                alt="Cover Letter Preview" 
                className="w-full h-auto rounded-lg shadow-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling!.style.display = 'block';
                }}
              />
              <div className="hidden text-center py-12 text-gray-500">
                <p className="text-lg mb-4">Cover Letter Preview</p>
                <p className="text-sm">Sample cover letter preview image will be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 