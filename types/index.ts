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