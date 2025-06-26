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
  documentType: 'resume' | 'cover-letter' | 'both'
  customerEmail: string
  customerName: string
}

export interface PaymentResponse {
  success: boolean
  clientSecret?: string
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