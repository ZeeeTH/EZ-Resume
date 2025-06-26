import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { generateDocuments } from '@/lib/openai'
import { sendDocumentEmail } from '@/lib/email'
import { GenerateDocumentRequest, GenerateDocumentResponse } from '@/types'

const generateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  jobTitle: z.string().min(3, 'Job title must be at least 3 characters'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  experience: z.string().min(50, 'Please provide at least 50 characters of experience'),
  education: z.string().min(20, 'Please provide at least 20 characters of education'),
  skills: z.string().min(20, 'Please provide at least 20 characters of skills'),
  documentType: z.enum(['resume', 'cover-letter', 'both']),
})

export async function POST(request: NextRequest): Promise<NextResponse<GenerateDocumentResponse>> {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = generateSchema.parse(body)

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Check if Gmail credentials are configured
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 500 }
      )
    }

    // Generate documents using OpenAI
    const documents = await generateDocuments(validatedData)

    // Check if document generation was successful
    if (!documents.resume && !documents.coverLetter) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate documents' },
        { status: 500 }
      )
    }

    // Send email with generated documents
    const emailSent = await sendDocumentEmail({
      to: validatedData.email,
      name: validatedData.name,
      documentType: validatedData.documentType,
      resume: documents.resume,
      coverLetter: documents.coverLetter,
    })

    if (!emailSent) {
      return NextResponse.json(
        { success: false, error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      documents,
    })

  } catch (error) {
    console.error('Document generation error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 