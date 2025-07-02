import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { CheckCircle, Loader2, FileText, Mail, Sparkles, Star, Zap, Palette, ShieldCheck, Shield, Crown, User } from 'lucide-react';
import { ResumeTemplate } from '../../types/templates';
import { templateMetadata, templates } from '../../data/templates';
import TemplatePreview from './templatePreview';
// import PdfPreview from './pdfPreview';
// import MyResumePreview from './MyResumePreview';
import { formSchema, workExperienceSchema, educationSchema, FormData, WorkExperience, Education } from '../../types';
import IndustryDropdown from './IndustrySelector/IndustryDropdown';
import UpgradeModal from './IndustrySelector/UpgradeModal';
import TemplateCard from './IndustrySelector/TemplateCard';
import { getTemplatesForUser, getLockedTemplatesForIndustry, hasPremiumTemplates } from '../../data/templates';
import AIGenerateButton from './AIGenerateButton';
import SkillsSuggestions from './SkillsSuggestions';
import AuthModal from './AuthModal';
import UserMenu from './UserMenu';
import { AIContentResponse } from '../../lib/ai-utils';
import { useAuth } from '../../contexts/AuthContext';
import { useAIUsage } from '../../hooks/useAIUsage';

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
  const [showMyResumePreview, setShowMyResumePreview] = useState(false);
  
  // Authentication
  const { user, profile, updateProfile } = useAuth()
  const { checkUsageLimit, incrementUsage, tier, getCurrentUsage } = useAIUsage()

  // Industry selector state
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // AI generation states
  const [aiLoading, setAiLoading] = useState({
    skills: false,
    summary: false,
    bulletPoint: false
  });
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [aiError, setAiError] = useState<string>('');

  // Form setup
  const { control, ...formMethods } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coverLetter: false,
      template: 'classic',
      personalSummary: '',
      jobTitle: '',
      industry: '',
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

  // Sync industry selection with form and profile
  useEffect(() => {
    const currentIndustry = watchedFields.industry;
    if (currentIndustry !== selectedIndustry) {
      setSelectedIndustry(currentIndustry || '');
    }
  }, [watchedFields.industry]);

  // Load user's saved industry preference
  useEffect(() => {
    if (profile?.selected_industry && !selectedIndustry) {
      setSelectedIndustry(profile.selected_industry);
      setValue('industry', profile.selected_industry);
    }
  }, [profile, selectedIndustry, setValue]);

  // Ensure classic template is selected by default
  useEffect(() => {
    if (!selectedTemplate || selectedTemplate === '') {
      setSelectedTemplate('classic');
      setValue('template', 'classic');
    }
  }, [selectedTemplate, setValue]);

  // Industry selector handlers
  const handleIndustrySelect = async (industryId: string) => {
    setSelectedIndustry(industryId);
    setValue('industry', industryId);
    trigger('industry'); // Trigger validation for the field
    
    // Save to user profile if authenticated
    if (user && profile) {
      await updateProfile({ selected_industry: industryId });
    }
    
    // Keep classic template selected when industry changes
    if (selectedTemplate === '') {
      setSelectedTemplate('classic');
      setValue('template', 'classic');
    }
  };

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
  };

  const handleTemplateUpgradeClick = () => {
    setShowUpgradeModal(true);
  };

  const handleUpgrade = () => {
    // This would integrate with your payment system
    console.log('Upgrade clicked - integrate with payment system');
    setShowUpgradeModal(false);
  };

  // AI Generation Functions
  const generateAIContent = async (contentType: 'skills' | 'summary' | 'bulletPoints', context?: string, userInput?: string) => {
    // Require authentication
    if (!user) {
      setShowAuthModal(true);
      return null;
    }

    // Check usage limits
    const usageCheck = checkUsageLimit(contentType);
    if (!usageCheck.allowed) {
      setShowUpgradeModal(true);
      return null;
    }

    setAiError('');
    const loadingKey = contentType === 'bulletPoints' ? 'bulletPoint' : contentType;
    setAiLoading(prev => ({ ...prev, [loadingKey]: true }));

    try {
      const response = await fetch('/api/generate-ai-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentType,
          jobTitle: watchedFields.jobTitle || 'Professional',
          context,
          userInput,
          yearsExperience: '3-5', // Could be dynamic based on work experience
          selectedIndustry,
          userTier: tier,
          currentUsage: getCurrentUsage(contentType)
        }),
      });

      const result: AIContentResponse = await response.json();

      if (result.success && result.content) {
        // Update usage tracking for free users
        await incrementUsage(contentType);
        return result.content;
      } else if (result.upgradePrompt) {
        setShowUpgradeModal(true);
        return null;
      } else {
        setAiError(result.message || 'AI generation failed');
        return null;
      }
    } catch (error) {
      setAiError('Network error. Please try again.');
      return null;
    } finally {
      setAiLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const generateSkills = async () => {
    const content = await generateAIContent('skills');
    if (content) {
      const skillsArray = content.split(',').map(skill => skill.trim());
      setSuggestedSkills(skillsArray);
    }
  };

  const generateSummary = async () => {
    const content = await generateAIContent('summary');
    if (content) {
      setValue('personalSummary', content);
      trigger('personalSummary');
    }
  };

  const generateBulletPoint = async (jobIndex: number, currentDescription: string) => {
    const job = watchedFields.workExperience?.[jobIndex];
    if (!job) return;

    const context = `Job Title: ${job.title}, Company: ${job.company}`;
    const content = await generateAIContent('bulletPoints', context, currentDescription);
    
    if (content) {
      const currentDesc = job.description || '';
      const newDescription = currentDesc ? `${currentDesc}\n• ${content}` : `• ${content}`;
      setValue(`workExperience.${jobIndex}.description`, newDescription);
      trigger(`workExperience.${jobIndex}.description`);
    }
  };

  const addSkillFromSuggestion = (skill: string) => {
    const currentSkills = watchedFields.skills || '';
    const skillsArray = currentSkills.split(',').map(s => s.trim()).filter(s => s);
    
    if (!skillsArray.includes(skill)) {
      const newSkills = skillsArray.length > 0 ? `${currentSkills}, ${skill}` : skill;
      setValue('skills', newSkills);
      trigger('skills');
    }
  };

  const clearSkillsSuggestions = () => {
    setSuggestedSkills([]);
  };

  // Lock scroll when preview modals are open
  useEffect(() => {
    if (showTemplatePreview || showMyResumePreview) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [showTemplatePreview, showMyResumePreview]);

  return (
    <>
      {/* Main Form Card */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
          {!isSuccess ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Authentication Header */}
              <div className="flex items-center justify-between mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">EZ</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">Resume Builder</h1>
                    <p className="text-xs text-gray-400">Create your professional resume with AI assistance</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {user ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="hidden sm:flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                      <UserMenu onUpgradeClick={() => setShowUpgradeModal(true)} />
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowAuthModal(true)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span>Sign In</span>
                    </button>
                  )}
                </div>
              </div>

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

              {/* Industry Selection */}
              <input type="hidden" {...register('industry')} />
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">What industry are you in?</h2>
                <div>
                  <IndustryDropdown
                    userTier={tier}
                    onIndustrySelect={handleIndustrySelect}
                    selectedIndustry={selectedIndustry}
                    onUpgradeClick={handleUpgradeClick}
                    fieldStatus={getFieldStatus('industry')}
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Optional: Selecting your industry helps us optimize your resume with industry-specific keywords and formatting.
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
                  
                  {/* AI Generate Button for Summary */}
                  <div className="mt-3">
                    <AIGenerateButton
                      contentType="summary"
                      onGenerate={generateSummary}
                      loading={aiLoading.summary}
                      selectedIndustry={selectedIndustry}
                      onUpgradeClick={handleUpgradeClick}
                      onAuthRequired={() => setShowAuthModal(true)}
                    />
                  </div>

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
                      
                                             {/* AI Generate Button for Bullet Points */}
                       <div className="mt-3">
                         <AIGenerateButton
                           contentType="bulletPoints"
                           onGenerate={() => generateBulletPoint(idx, watchedFields.workExperience?.[idx]?.description || '')}
                           loading={aiLoading.bulletPoint}
                           selectedIndustry={selectedIndustry}
                           onUpgradeClick={handleUpgradeClick}
                           onAuthRequired={() => setShowAuthModal(true)}
                         />
                         <p className="text-xs text-gray-400 mt-1">
                           AI will add a professional bullet point to your existing description
                         </p>
                       </div>
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

                  {/* AI Generate Button for Skills */}
                  <div className="mt-3">
                    <AIGenerateButton
                      contentType="skills"
                      onGenerate={generateSkills}
                      loading={aiLoading.skills}
                      selectedIndustry={selectedIndustry}
                      onUpgradeClick={handleUpgradeClick}
                      onAuthRequired={() => setShowAuthModal(true)}
                    />
                  </div>

                  {/* Skills Suggestions */}
                  <SkillsSuggestions
                    suggestedSkills={suggestedSkills}
                    onAddSkill={addSkillFromSuggestion}
                    onClearSuggestions={clearSkillsSuggestions}
                    selectedIndustry={selectedIndustry}
                  />

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
                
                {/* Template Selection */}
                {!selectedIndustry ? (
                  /* No industry selected - Show only Classic template centered */
                  <div className="flex justify-center gap-4 mb-6">
                    {getTemplatesForUser(selectedIndustry, tier).map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        isSelected={selectedTemplate === template.id}
                        onClick={() => {
                          setSelectedTemplate(template.id);
                          setValue('template', template.id, { shouldValidate: true, shouldDirty: true });
                          setSelectedColorVariants(prev => ({ ...prev, [template.id]: 0 }));
                        }}
                        selectedColorVariant={selectedColorVariants[template.id] ?? 0}
                        onColorSelect={(colorIndex) => {
                          setSelectedColorVariants(prev => ({ ...prev, [template.id]: colorIndex }));
                        }}
                        onPreview={() => handleTemplatePreview(template)}
                      />
                    ))}
                  </div>
                ) : (
                  /* Industry selected - Show all templates (available + locked) in same row */
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
                    {/* Available templates (Classic) */}
                    {getTemplatesForUser(selectedIndustry, tier).map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        isSelected={selectedTemplate === template.id}
                        onClick={() => {
                          setSelectedTemplate(template.id);
                          setValue('template', template.id, { shouldValidate: true, shouldDirty: true });
                          setSelectedColorVariants(prev => ({ ...prev, [template.id]: 0 }));
                        }}
                        selectedColorVariant={selectedColorVariants[template.id] ?? 0}
                        onColorSelect={(colorIndex) => {
                          setSelectedColorVariants(prev => ({ ...prev, [template.id]: colorIndex }));
                        }}
                        onPreview={() => handleTemplatePreview(template)}
                      />
                    ))}
                    
                    {/* Locked premium templates (for free users) in same row */}
                    {tier === 'free' && getLockedTemplatesForIndustry(selectedIndustry).map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        isSelected={false}
                        onClick={handleTemplateUpgradeClick}
                        isLocked={true}
                      />
                    ))}
                    
                    {/* Premium templates (for paid users) in same row */}
                    {tier === 'paid' && getLockedTemplatesForIndustry(selectedIndustry).map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        isSelected={selectedTemplate === template.id}
                        onClick={() => {
                          setSelectedTemplate(template.id);
                          setValue('template', template.id, { shouldValidate: true, shouldDirty: true });
                          setSelectedColorVariants(prev => ({ ...prev, [template.id]: 0 }));
                        }}
                        selectedColorVariant={selectedColorVariants[template.id] ?? 0}
                        onColorSelect={(colorIndex) => {
                          setSelectedColorVariants(prev => ({ ...prev, [template.id]: colorIndex }));
                        }}
                        onPreview={() => handleTemplatePreview(template)}
                      />
                    ))}
                  </div>
                )}

                {/* Industry Selection Prompt - Only show when no industry selected and classic is centered */}
                {!selectedIndustry && (
                  <div className="text-center py-6 bg-white/5 rounded-lg border border-white/10 mt-6">
                    <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">
                      Select your industry above to unlock premium templates designed for your field
                    </p>
                  </div>
                )}
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

              {aiError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
                  <p className="text-red-400 text-sm flex items-center">
                    <span className="mr-2">🤖</span>
                    AI Error: {aiError}
                    <button
                      onClick={() => setAiError('')}
                      className="ml-auto text-red-300 hover:text-red-200"
                    >
                      ×
                    </button>
                  </p>
                </div>
              )}

              {/* Preview My Resume Button */}
              {formProgress >= 75 && (
                <div className="text-center mb-4">
                  <button
                    type="button"
                    onClick={() => setShowMyResumePreview(true)}
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 font-semibold py-3 px-6 rounded-lg transition-all duration-200 border border-blue-500/30 hover:border-blue-500/50 flex items-center justify-center space-x-2 mx-auto"
                  >
                    <FileText className="h-5 w-5" />
                    <span>📋 Preview My Resume (A4 PDF Format)</span>
                  </button>
                  <p className="text-xs text-gray-400 mt-2">
                    See exactly how your PDF will look with your data
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
                {/* Bypass Payment Buttons (Test Only) */}
                <div className="flex flex-col md:flex-row gap-2 mt-3">
                  <button
                    type="button"
                    disabled={isGenerating}
                    className="w-full bg-yellow-500/90 hover:bg-yellow-600 text-black font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-lg shadow-lg border-2 border-yellow-700"
                    onClick={async () => {
                      setIsGenerating(true);
                      setError('');
                      try {
                        const sample = require('../../data/templates/classic.json').sampleData;
                        const selectedTemplateData = templateMetadata.find(t => t.id === 'classic');
                        const apiData = {
                          name: sample.name,
                          email: 'zetheryy@gmail.com',
                          phone: sample.contact.phone,
                          jobTitle: sample.title,
                          location: sample.contact.location,
                          personalSummary: sample.sections.find((s: any) => s.title === 'Summary')?.content || '',
                          skills: Object.values(sample.sections.find((s: any) => s.title === 'Skills')?.categories || {}).flat().join(', '),
                          achievements: '',
                          coverLetter: false,
                          template: 'classic',
                          ...(selectedTemplateData?.colorOptions && {
                            colorVariant: selectedColorVariants['classic'] ?? 0,
                            selectedColors: selectedTemplateData.colorOptions.palette[selectedColorVariants['classic'] ?? 0]
                          }),
                          workExperience: (sample.sections.find((s: any) => s.title === 'Professional Experience')?.jobs || []).map((job: any) => ({
                            title: job.title,
                            company: job.company,
                            startMonth: job.dates.split(' ')[0],
                            startYear: job.dates.split(' ')[1],
                            endMonth: job.dates.split('–')[1]?.trim().split(' ')[0] || '',
                            endYear: job.dates.split('–')[1]?.trim().split(' ')[1] || '',
                            description: job.bullets.join(' '),
                          })),
                          education: (sample.sections.find((s: any) => s.title === 'Education')?.education || []).map((edu: any) => ({
                            degree: edu.degree,
                            school: edu.institution,
                            startMonth: '',
                            startYear: '',
                            endMonth: '',
                            endYear: edu.dates,
                          })),
                        };
                        const response = await fetch('/api/generate', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(apiData)
                        });
                        if (!response.ok) throw new Error('Failed to generate resume');
                        setIsSuccess(true);
                      } catch (err) {
                        setError('Failed to generate resume. Please try again.');
                      } finally {
                        setIsGenerating(false);
                      }
                    }}
                  >
                    <Sparkles className="h-6 w-6 mr-2" />
                    Bypass (Classic)
                  </button>
                  <button
                    type="button"
                    disabled={isGenerating}
                    className="w-full bg-yellow-500/90 hover:bg-yellow-600 text-black font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-lg shadow-lg border-2 border-yellow-700"
                    onClick={async () => {
                      setIsGenerating(true);
                      setError('');
                      try {
                        const sample = require('../../data/templates/modern.json').sampleData;
                        const selectedTemplateData = templateMetadata.find(t => t.id === 'modern');
                        const apiData = {
                          name: sample.name,
                          email: 'zetheryy@gmail.com',
                          phone: sample.contact.phone,
                          jobTitle: sample.title,
                          location: sample.contact.location,
                          personalSummary: sample.sections.find((s: any) => s.title === 'Summary')?.content || '',
                          skills: Object.values(sample.sections.find((s: any) => s.title === 'Skills')?.categories || {}).flat().join(', '),
                          achievements: '',
                          coverLetter: false,
                          template: 'modern',
                          ...(selectedTemplateData?.colorOptions && {
                            colorVariant: selectedColorVariants['modern'] ?? 0,
                            selectedColors: selectedTemplateData.colorOptions.palette[selectedColorVariants['modern'] ?? 0]
                          }),
                          workExperience: (sample.sections.find((s: any) => s.title === 'Professional Experience')?.jobs || []).map((job: any) => ({
                            title: job.title,
                            company: job.company,
                            startMonth: job.dates.split(' ')[0],
                            startYear: job.dates.split(' ')[1],
                            endMonth: job.dates.split('–')[1]?.trim().split(' ')[0] || '',
                            endYear: job.dates.split('–')[1]?.trim().split(' ')[1] || '',
                            description: job.bullets.join(' '),
                          })),
                          education: (sample.sections.find((s: any) => s.title === 'Education')?.education || []).map((edu: any) => ({
                            degree: edu.degree,
                            school: edu.institution,
                            startMonth: '',
                            startYear: '',
                            endMonth: '',
                            endYear: edu.dates,
                          })),
                        };
                        const response = await fetch('/api/generate', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(apiData)
                        });
                        if (!response.ok) throw new Error('Failed to generate resume');
                        setIsSuccess(true);
                      } catch (err) {
                        setError('Failed to generate resume. Please try again.');
                      } finally {
                        setIsGenerating(false);
                      }
                    }}
                  >
                    <Sparkles className="h-6 w-6 mr-2" />
                    Bypass (Modern)
                  </button>
                  <button
                    type="button"
                    disabled={isGenerating}
                    className="w-full bg-yellow-500/90 hover:bg-yellow-600 text-black font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-lg shadow-lg border-2 border-yellow-700"
                    onClick={async () => {
                      setIsGenerating(true);
                      setError('');
                      try {
                        const sample = require('../../data/templates/structured.json').sampleData;
                        const selectedTemplateData = templateMetadata.find(t => t.id === 'structured');
                        const apiData = {
                          name: sample.name,
                          email: 'zetheryy@gmail.com',
                          phone: sample.contact.phone,
                          jobTitle: sample.title,
                          location: sample.contact.location,
                          personalSummary: sample.sections.find((s: any) => s.title === 'Summary')?.content || '',
                          skills: Object.values(sample.sections.find((s: any) => s.title === 'Skills')?.categories || {}).flat().join(', '),
                          achievements: '',
                          coverLetter: false,
                          template: 'structured',
                          ...(selectedTemplateData?.colorOptions && {
                            colorVariant: selectedColorVariants['structured'] ?? 0,
                            selectedColors: selectedTemplateData.colorOptions.palette[selectedColorVariants['structured'] ?? 0]
                          }),
                          workExperience: (sample.sections.find((s: any) => s.title === 'Professional Experience')?.jobs || []).map((job: any) => ({
                            title: job.title,
                            company: job.company,
                            startMonth: job.dates.split(' ')[0],
                            startYear: job.dates.split(' ')[1],
                            endMonth: job.dates.split('–')[1]?.trim().split(' ')[0] || '',
                            endYear: job.dates.split('–')[1]?.trim().split(' ')[1] || '',
                            description: job.bullets.join(' '),
                          })),
                          education: (sample.sections.find((s: any) => s.title === 'Education')?.education || []).map((edu: any) => ({
                            degree: edu.degree,
                            school: edu.institution,
                            startMonth: '',
                            startYear: '',
                            endMonth: '',
                            endYear: edu.dates,
                          })),
                        };
                        const response = await fetch('/api/generate', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(apiData)
                        });
                        if (!response.ok) throw new Error('Failed to generate resume');
                        setIsSuccess(true);
                      } catch (err) {
                        setError('Failed to generate resume. Please try again.');
                      } finally {
                        setIsGenerating(false);
                      }
                    }}
                  >
                    <Sparkles className="h-6 w-6 mr-2" />
                    Bypass (Structured)
                  </button>
                </div>
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
      {/* <PdfPreview
        showResumePreview={showResumePreview}
        showCoverLetterPreview={showCoverLetterPreview}
        setShowResumePreview={setShowResumePreview}
        setShowCoverLetterPreview={setShowCoverLetterPreview}
      /> */}

      {/* My Resume PDF Preview */}
      {showMyResumePreview && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/80 p-4">
          <div className="relative max-w-full max-h-full overflow-hidden">
            <button
              onClick={() => setShowMyResumePreview(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-400 text-2xl font-bold z-10 bg-white/90 rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-colors duration-200"
              aria-label="Close PDF preview"
            >
              ×
            </button>
            
            {/* A4 Preview Container */}
            <div 
              className="bg-white shadow-2xl mx-auto overflow-hidden p-8" 
              style={{ 
                width: '210mm', 
                height: '297mm',
                maxWidth: 'calc(100vw - 2rem)',
                maxHeight: 'calc(100vh - 6rem)',
                transform: 'scale(0.8)',
                transformOrigin: 'center center'
              }}
            >
              <div className="text-center border-b border-black pb-4 mb-6">
                <h1 className="text-2xl font-bold mb-2">{watchedFields.name || 'Your Name'}</h1>
                {watchedFields.jobTitle && <div className="text-sm">{watchedFields.jobTitle}</div>}
                <div className="text-sm">{watchedFields.email || 'email@example.com'}</div>
                {watchedFields.phone && <div className="text-sm">{watchedFields.phone}</div>}
                {watchedFields.location && <div className="text-sm">{watchedFields.location}</div>}
              </div>
              
              {watchedFields.personalSummary && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold uppercase border-b border-black pb-1 mb-3">Professional Summary</h2>
                  <p className="text-sm">{watchedFields.personalSummary}</p>
                </div>
              )}

              {watchedFields.workExperience?.length && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold uppercase border-b border-black pb-1 mb-3">Work Experience</h2>
                  {watchedFields.workExperience.map((job, index) => (
                    <div key={index} className="mb-4">
                      <div className="font-semibold text-sm mb-1">
                        {job.title || 'Job Title'} at {job.company || 'Company'}
                      </div>
                      <div className="italic text-xs mb-2 text-gray-600">
                        {job.startMonth} {job.startYear} - {job.endMonth || 'Present'} {job.endYear}
                      </div>
                      <div className="text-xs">{job.description || 'Job description'}</div>
                    </div>
                  ))}
                </div>
              )}

              {watchedFields.skills && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold uppercase border-b border-black pb-1 mb-3">Skills</h2>
                  <div className="text-sm">{watchedFields.skills}</div>
                </div>
              )}
            </div>
            
            {/* Preview label */}
            <div className="text-white text-center mt-2 text-sm opacity-75">
              📋 PDF Preview - This is how your PDF will look
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handleUpgrade}
        selectedIndustry={selectedIndustry}
      />

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="signup"
      />
    </>
  );
}