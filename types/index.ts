import { z } from 'zod';

export interface GenerateDocumentRequest {
  name: string
  email: string
  phone?: string
  jobTitle: string
  company: string
  experience: string
  education: string
  skills: string
  documentType: 'resume' | 'cover-letter' | 'both'
}

export interface GenerateDocumentResponse {
  success: boolean
  error?: string
  documents?: {
    resume?: string
    coverLetter?: string
  }
}

export interface PaymentRequest {
  documentType: 'resume' | 'both'
  customerEmail: string
  customerName: string
  formData: any
}

export interface PaymentResponse {
  success: boolean
  sessionId?: string
  url?: string
  error?: string
}

export interface WebhookEvent {
  type: string
  data: {
    object: any
  }
}

export interface EmailData {
  to: string
  name: string
  documentType: 'resume' | 'cover-letter' | 'both'
  resume?: string
  coverLetter?: string
}

export interface WebhookData {
  sessionId: string
  documentType: 'resume' | 'both'
  customerEmail: string
  customerName: string
  formData: any
}

export interface OrderData {
  session_id: string
  document_type: 'resume' | 'both'
  template: string
  email: string
  name: string
  price: number
  currency: string
  timestamp?: string
  form_data?: any
}

export const workExperienceSchema = z.object({
  title: z.string().min(2, 'Job title is required'),
  company: z.string().min(2, 'Company is required'),
  startMonth: z.string().min(1, 'Start month is required'),
  startYear: z.string().min(1, 'Start year is required'),
  endMonth: z.string().optional(),
  endYear: z.string().optional(),
  description: z.string().min(10, 'Description is required'),
});

export const educationSchema = z.object({
  degree: z.string().min(2, 'Degree is required'),
  school: z.string().min(2, 'School is required'),
  startMonth: z.string().min(1, 'Start month is required'),
  startYear: z.string().min(1, 'Start year is required'),
  endMonth: z.string().optional(),
  endYear: z.string().optional(),
});

export const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  industry: z.string().optional(),
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

export type FormData = z.infer<typeof formSchema>;
export type WorkExperience = z.infer<typeof workExperienceSchema>;
export type Education = z.infer<typeof educationSchema>; 