import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, Loader2, FileText, Mail, Sparkles, Star, Zap, Palette, ShieldCheck, Shield } from 'lucide-react';
import { ResumeTemplate } from '../../types/templates';
import { templateMetadata } from '../../data/templates';
import { templates } from '../../data/templates';
import TemplatePreview from './templatePreview';
import PdfPreview from './pdfPreview';

// Schemas and types
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
  template: z.string().min(1, 'Please select a template'),
  location: z.string().optional(),
  personalSummary: z.string().optional(),
  workExperience: z.array(workExperienceSchema).min(1, 'At least one work experience is required'),
  education: z.array(educationSchema).min(1, 'At least one education entry is required'),
}).refine((data) => {
  if (data.coverLetter) {
    return data.company && data.company.length >= 2;
  }
  return true;
}, {
  message: "Target company is required when generating a cover letter",
  path: ["company"]
});

type FormData = z.infer<typeof formSchema>;
type WorkExperience = z.infer<typeof workExperienceSchema>;
type Education = z.infer<typeof educationSchema>;

// Helper arrays for months and years
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 51 }, (_, i) => currentYear - i);

// Helper function
const isFieldMissing = (value: string | undefined) => !value || value.trim() === '';

export default function ResumeForm() {
  // Form state
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formProgress, setFormProgress] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [selectedColorVariants, setSelectedColorVariants] = useState<Record<string, number>>({
    classic: 0,
    modern: 0,
    structured: 0,
  });
  const [coverLetterChecked, setCoverLetterChecked] = useState(false);

  // PDF Preview Modal States
  const [showResumePreview, setShowResumePreview] = useState(false);
  const [showCoverLetterPreview, setShowCoverLetterPreview] = useState(false);
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<ResumeTemplate | null>(null);

  // Form setup
  const { control, ...formMethods } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coverLetter: false,
      template: 'classic',
      personalSummary: '',
      jobTitle: '',
      company: '',
      workExperience: [
        { title: '', company: '', startMonth: '', startYear: '', endMonth: '', endYear: '', description: '' }
      ],
      education: [
        { degree: '', school: '', startMonth: '', startYear: '', endMonth: '', endYear: '' }
      ]
    },
    mode: 'onChange'
  });
  
  const { register, handleSubmit, formState: { errors, isValid, isDirty, touchedFields }, trigger, setValue, watch } = formMethods;
  const workExpFieldArray = useFieldArray({ control, name: 'workExperience' });
  const eduFieldArray = useFieldArray({ control, name: 'education' });

  const watchedFields = watch();

  // Calculate form progress
  React.useEffect(() => {
    const requiredFields = ['name', 'email', 'skills', 'achievements', 'personalSummary'];
    const coverLetterFields = coverLetterChecked ? ['company'] : [];
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
    
    const workExp = watchedFields.workExperience || [];
    totalFields += workExp.length * 5;
    workExp.forEach((job: any) => {
      if (job.title?.trim()) filledFields++;
      if (job.company?.trim()) filledFields++;
      if (job.startMonth?.trim()) filledFields++;
      if (job.startYear?.trim()) filledFields++;
      if (job.description?.trim()) filledFields++;
    });
    
    const eduArr = watchedFields.education || [];
    totalFields += eduArr.length * 4;
    eduArr.forEach((edu: any) => {
      if (edu.degree?.trim()) filledFields++;
      if (edu.school?.trim()) filledFields++;
      if (edu.startMonth?.trim()) filledFields++;
      if (edu.startYear?.trim()) filledFields++;
    });
    
    const progress = totalFields === 0 ? 0 : Math.round((filledFields / totalFields) * 100);
    setFormProgress(progress);
  }, [watchedFields, coverLetterChecked]);

  const getFieldStatus = (fieldName: string) => {
    // Handle nested field paths like 'workExperience.0.company'
    if (fieldName.includes('.')) {
      const parts = fieldName.split('.');
      const mainField = parts[0] as keyof FormData;
      const index = parseInt(parts[1]);
      const subField = parts[2];
      
      const value = watchedFields[mainField];
      if (Array.isArray(value) && value[index]) {
        const fieldValue = value[index][subField as keyof typeof value[0]];
        const isFilled = fieldValue && fieldValue.toString().trim().length > 0;
        
        // Check for errors in the specific field
        const fieldError = errors[mainField] as any;
        const hasError = fieldError && fieldError[index] && fieldError[index][subField];
        
        if (hasError) return 'error';
        if (isFilled) return 'success';
        return 'default';
      }
      return 'default';
    }
    
    // Handle top-level fields
    const value = watchedFields[fieldName as keyof FormData];
    const hasError = errors[fieldName as keyof FormData];
    
    if (Array.isArray(value)) {
      const isFilled = value.length > 0 && value.some(item => 
        Object.values(item).some(val => val && val.toString().trim().length > 0)
      );
      if (hasError) return 'error';
      if (isFilled) return 'success';
      return 'default';
    }
    
    const isFilled = value && value.toString().trim().length > 0;
    
    if (hasError) return 'error';
    if (isFilled) return 'success';
    return 'default';
  };

  const onSubmit = async (data: FormData) => {
    setIsGenerating(true);
    setError('');

    try {
      const selectedTemplateData = templateMetadata.find(t => t.id === selectedTemplate);
      
      const apiData = {
        ...data,
        template: selectedTemplate,
        workExperience: data.workExperience,
        educationData: data.education,
        ...(selectedTemplateData?.colorOptions && {
          colorVariant: selectedColorVariants[selectedTemplate] ?? 0,
          selectedColors: selectedTemplateData.colorOptions.palette[selectedColorVariants[selectedTemplate] ?? 0]
        })
      };

      // Create Stripe checkout session
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentType: data.coverLetter ? 'both' : 'resume',
          customerEmail: data.email,
          customerName: data.name,
          formData: apiData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment session');
      }

      const { url } = await response.json();
      
      if (!url) {
        throw new Error('No checkout URL received');
      }

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err) {
      setError('Failed to create payment session. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper functions
  const isWorkValid = (job: WorkExperience) => {
    return (
      (job.title?.trim() ?? '') &&
      (job.company?.trim() ?? '') &&
      (job.startMonth?.trim() ?? '') &&
      (job.startYear?.trim() ?? '') &&
      (job.description?.trim() ?? '')
    );
  };

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

  const handleTemplatePreview = (template: ResumeTemplate) => {
    setPreviewTemplate(template);
    setShowTemplatePreview(true);
  };

  // Lock scroll when sample preview modal is open
  useEffect(() => {
    if (showTemplatePreview) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [showTemplatePreview]);

  return (
    <>
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
                  {formProgress === 100 && "🎉 Perfect! Your form is complete and ready to generate! 🚀"}
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
                        className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${getFieldStatus('name') === 'success' ? 'border-green-400' : 'border-white/20'}`}
                        placeholder="Enter your full name"
                        aria-describedby="name-error"
                      />
                      {getFieldStatus('name') === 'success' && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-400" />
                      )}
                    </div>
                    {touchedFields.name && errors.name && (
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
                        className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${getFieldStatus('email') === 'success' ? 'border-green-400' : 'border-white/20'}`}
                        placeholder="your.email@example.com"
                        aria-describedby="email-error"
                      />
                      {getFieldStatus('email') === 'success' && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-400" />
                      )}
                    </div>
                    {touchedFields.email && errors.email && (
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
                        className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${getFieldStatus('phone') === 'success' ? 'border-green-400' : 'border-white/20'}`}
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
                        className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${getFieldStatus('location') === 'success' ? 'border-green-400' : 'border-white/20'}`}
                        placeholder="City, State (optional)"
                      />
                      {getFieldStatus('location') === 'success' && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Target Job Title */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">Target Job Title (Optional)</h2>
                <div>
                  <input
                    {...register('jobTitle')}
                    id="jobTitle"
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${getFieldStatus('jobTitle') === 'success' ? 'border-green-400' : 'border-white/20'}`}
                    placeholder="e.g., Software Engineer, Marketing Manager"
                    aria-describedby="jobTitle-error"
                  />
                  {touchedFields.jobTitle && errors.jobTitle && (
                    <p id="jobTitle-error" className="mt-1 text-sm text-red-400 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.jobTitle.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Optional: This will appear under your name at the top of your resume. Leave blank if you prefer not to include it.
                  </p>
                </div>
              </div>

              {/* Personal Summary Section */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">Professional Summary</h2>
                <div>
                  <textarea
                    {...register('personalSummary')}
                    id="personalSummary"
                    rows={4}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${getFieldStatus('personalSummary') === 'success' ? 'border-green-400' : 'border-white/20'}`}
                    placeholder="Write a compelling professional summary that highlights your key strengths, experience, and career objectives. This should be 2-4 sentences that capture your professional identity and value proposition."
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Optional: A well-crafted summary can make your resume stand out and give recruiters a quick overview of your professional profile.
                  </p>
                </div>
              </div>

              {/* Work Experience Section */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Work Experience</h2>
                {workExpFieldArray.fields.map((job, idx) => (
                  <div
                    key={idx}
                    className={`bg-white/5 backdrop-blur-xl rounded-2xl p-6 mb-6 border shadow-2xl flex flex-col gap-4 transition-all duration-200 ${isWorkValid(watchedFields.workExperience?.[idx]) ? 'border-green-400' : 'border-white/10'}`}
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
                        className={`w-full bg-white/10 text-white rounded-lg px-4 py-3 placeholder-gray-400 border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${getFieldStatus(`workExperience.${idx}.title`) === 'success' ? 'border-green-400' : 'border-white/20'}`}
                        placeholder="e.g., Senior Software Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Company
                      </label>
                      <input
                        {...register(`workExperience.${idx}.company` as const)}
                        className={`w-full bg-white/10 text-white rounded-lg px-4 py-3 placeholder-gray-400 border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${getFieldStatus(`workExperience.${idx}.company`) === 'success' ? 'border-green-400' : 'border-white/20'}`}
                        placeholder="e.g., Google, Microsoft"
                      />
                    </div>
                    <div className="flex gap-6 w-full">
                      <div className="flex flex-col w-1/2">
                        <label className="text-sm font-medium text-gray-300 mb-2">Start Date</label>
                        <div className="flex gap-2">
                          <select
                            {...register(`workExperience.${idx}.startMonth` as const)}
                            className={`w-1/2 bg-[#6a4a90] text-white rounded-lg px-4 py-3 border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${getFieldStatus(`workExperience.${idx}.startMonth`) === 'success' ? 'border-green-400' : 'border-white/20'}`}
                          >
                            <option value="">Month</option>
                            {months.map((month, index) => (
                              <option key={index} value={month}>{month}</option>
                            ))}
                          </select>
                          <select
                            {...register(`workExperience.${idx}.startYear` as const)}
                            className={`w-1/2 bg-[#6a4a90] text-white rounded-lg px-4 py-3 border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${getFieldStatus(`workExperience.${idx}.startYear`) === 'success' ? 'border-green-400' : 'border-white/20'}`}
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
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Job Description *
                      </label>
                      <textarea
                        {...register(`workExperience.${idx}.description` as const)}
                        rows={4}
                        className={`w-full bg-white/10 text-white rounded-lg px-4 py-3 placeholder-gray-400 border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${getFieldStatus(`workExperience.${idx}.description`) === 'success' ? 'border-green-400' : 'border-white/20'}`}
                        placeholder="Describe your responsibilities and achievements..."
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addJob}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-lg border border-white/20 transition-all duration-200"
                >
                  + Add Another Job
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
                        Degree *
                      </label>
                      <input
                        {...register(`education.${idx}.degree` as const)}
                        className={`w-full bg-white/10 text-white rounded-lg px-4 py-3 placeholder-gray-400 border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${getFieldStatus(`education.${idx}.degree`) === 'success' ? 'border-green-400' : 'border-white/20'}`}
                        placeholder="e.g., Bachelor of Science in Computer Science"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        School/University *
                      </label>
                      <input
                        {...register(`education.${idx}.school` as const)}
                        className={`w-full bg-white/10 text-white rounded-lg px-4 py-3 placeholder-gray-400 border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${getFieldStatus(`education.${idx}.school`) === 'success' ? 'border-green-400' : 'border-white/20'}`}
                        placeholder="e.g., Stanford University"
                      />
                    </div>
                    <div className="flex gap-6 w-full">
                      <div className="flex flex-col w-1/2">
                        <label className="text-sm font-medium text-gray-300 mb-2">Start Date</label>
                        <div className="flex gap-2">
                          <select
                            {...register(`education.${idx}.startMonth` as const)}
                            className={`w-1/2 bg-[#6a4a90] text-white rounded-lg px-4 py-3 border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${getFieldStatus(`education.${idx}.startMonth`) === 'success' ? 'border-green-400' : 'border-white/20'}`}
                          >
                            <option value="">Month</option>
                            {months.map((month, index) => (
                              <option key={index} value={month}>{month}</option>
                            ))}
                          </select>
                          <select
                            {...register(`education.${idx}.startYear` as const)}
                            className={`w-1/2 bg-[#6a4a90] text-white rounded-lg px-4 py-3 border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${getFieldStatus(`education.${idx}.startYear`) === 'success' ? 'border-green-400' : 'border-white/20'}`}
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
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addEducation}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-lg border border-white/20 transition-all duration-200"
                >
                  + Add Another Education
                </button>
              </div>

              {/* Skills Section */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">Skills</h2>
                <div>
                  <textarea
                    {...register('skills')}
                    id="skills"
                    rows={3}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${getFieldStatus('skills') === 'success' ? 'border-green-400' : 'border-white/20'}`}
                    placeholder="e.g., JavaScript, React, Node.js, Python, SQL, AWS, Docker, Git, Agile methodologies, Team leadership"
                    aria-describedby="skills-error"
                  />
                  {touchedFields.skills && errors.skills && (
                    <p id="skills-error" className="mt-1 text-sm text-red-400 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.skills.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    List your key technical skills, tools, and competencies that are relevant to your target position.
                  </p>
                </div>
              </div>

              {/* Achievements Section */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">Key Achievements</h2>
                <div>
                  <textarea
                    {...register('achievements')}
                    id="achievements"
                    rows={4}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${getFieldStatus('achievements') === 'success' ? 'border-green-400' : 'border-white/20'}`}
                    placeholder="Describe your key achievements, projects, and accomplishments that demonstrate your value..."
                    aria-describedby="achievements-error"
                  />
                  {touchedFields.achievements && errors.achievements && (
                    <p id="achievements-error" className="mt-1 text-sm text-red-400 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.achievements.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Highlight your most significant accomplishments, projects, and contributions that showcase your impact and value.
                  </p>
                </div>
              </div>

              {/* Cover Letter Option */}
              <div className="mb-10">
                <div className="flex items-center space-x-3 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <input
                    {...register('coverLetter')}
                    type="checkbox"
                    id="coverLetter"
                    className="w-4 h-4 text-purple-500 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                    checked={coverLetterChecked}
                    onChange={(e) => {
                      setCoverLetterChecked(e.target.checked);
                      setValue('coverLetter', e.target.checked);
                    }}
                  />
                  <label htmlFor="coverLetter" className="text-sm text-gray-300">
                    Also generate a cover letter for this position
                  </label>
                </div>
                {coverLetterChecked && (
                  <div className="mt-6">
                    <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                      Target Company *
                    </label>
                    <div className="relative">
                      <input
                        {...register('company')}
                        id="company"
                        className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${getFieldStatus('company') === 'success' ? 'border-green-400' : 'border-white/20'}`}
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
                )}
              </div>

              {/* Template Selector */}
              <input type="hidden" {...register('template')} />
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Choose Your Template</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => {
                        setSelectedTemplate(template.id);
                        setValue('template', template.id, { shouldValidate: true, shouldDirty: true });
                        setSelectedColorVariants(prev => ({ ...prev, [template.id]: 0 }));
                      }}
                      className={`
                        relative cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 hover:scale-105 flex flex-col
                        ${selectedTemplate === template.id
                          ? 'border-green-400 bg-green-500/10 shadow-lg'
                          : 'border-white/20 bg-white/5 hover:border-purple-500/50'
                        }
                      `}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-white text-sm mb-2">{template.name}</h3>
                          {selectedTemplate === template.id && (
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          )}
                        </div>
                        <p className="text-gray-400 text-xs mb-4">{template.description}</p>
                        {/* Color Dots and Label */}
                        {template.colorOptions && (
                          <div className="pt-3 border-t border-white/10 mt-3">
                            <div className="flex items-center justify-center space-x-2">
                              {template.colorOptions.palette.map((color, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={e => {
                                    e.stopPropagation();
                                    setSelectedColorVariants(prev => ({ ...prev, [template.id]: index }));
                                  }}
                                  className={`w-6 h-6 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                                    selectedTemplate === template.id && selectedColorVariants[template.id] === index
                                      ? 'border-white shadow-lg'
                                      : 'border-white/30'
                                  }`}
                                  style={{ backgroundColor: color.primary }}
                                  title={color.label}
                                />
                              ))}
                            </div>
                            <p className="text-xs text-gray-400 text-center mt-1 min-h-[20px]">
                              {template.colorOptions.palette[selectedColorVariants[template.id] ?? 0]?.label || template.colorOptions.palette[0]?.label}
                            </p>
                          </div>
                        )}
                        {/* Preview Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTemplatePreview(template);
                          }}
                          className="mt-3 w-full bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 hover:text-pink-200 text-xs font-medium py-2 px-3 rounded-lg transition-all duration-200 border border-pink-500/30 hover:border-pink-500/50"
                        >
                          Preview Sample
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy Statement */}
              <div className="flex items-center space-x-3 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20 mb-8">
                <Shield className="h-7 w-7 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  <p className="font-medium mb-1">Your privacy is protected</p>
                  <p>We never share your personal data with third parties. Your information is only used to generate your resume and is deleted after processing.</p>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
                  <p className="text-red-400 text-sm flex items-center">
                    <span className="mr-2">⚠</span>
                    {error}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="text-center mb-2">
                <button
                  type="submit"
                  disabled={isGenerating || !isValid || formProgress < 100}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-lg shadow-lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span>Redirecting to secure checkout...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="h-6 w-6" />
                      <span>Generate My {coverLetterChecked ? 'Resume & Cover Letter' : 'Resume'} - ${coverLetterChecked ? '0.80 AUD' : '14.99 AUD'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-12">
              <div className="mb-6">
                <CheckCircle className="mx-auto h-16 w-16 text-green-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Resume Generated Successfully!</h3>
                <p className="text-gray-300">Your professional resume is ready to download.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setShowResumePreview(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Preview Resume
                </button>
                <button
                  onClick={() => setShowCoverLetterPreview(true)}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Preview Cover Letter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Template Preview Modal */}
      <TemplatePreview
        showTemplatePreview={showTemplatePreview}
        previewTemplate={previewTemplate}
        selectedColorVariants={selectedColorVariants}
        setShowTemplatePreview={setShowTemplatePreview}
        setSelectedTemplate={setSelectedTemplate}
        setValue={setValue}
      />

      {/* PDF Preview Modals */}
      <PdfPreview
        showResumePreview={showResumePreview}
        showCoverLetterPreview={showCoverLetterPreview}
        setShowResumePreview={setShowResumePreview}
        setShowCoverLetterPreview={setShowCoverLetterPreview}
      />
    </>
  );
}