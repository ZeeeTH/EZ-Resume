import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createCheckoutSession, getPriceForDocumentType } from '@/lib/stripe'
import { saveFormData } from '@/lib/formDataStore'

const paymentSchema = z.object({
  documentType: z.enum(['resume', 'cover-letter', 'both']),
  customerEmail: z.string().email('Please enter a valid email address'),
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  formData: z.any(), // Form data to be stored in metadata
})

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('Payment API called - checking environment variables...')
    console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY)
    console.log('NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL)
    
    // Parse and validate request body
    const body = await request.json()
    console.log('Request body received:', { documentType: body.documentType, customerEmail: body.customerEmail })
    
    const validatedData = paymentSchema.parse(body)

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY not found in environment variables')
      return NextResponse.json(
        { success: false, error: 'Payment service not configured' },
        { status: 500 }
      )
    }

    // Get price for document type
    const amount = getPriceForDocumentType(validatedData.documentType)
    console.log('Calculated amount:', amount)

    // Create checkout session with minimal metadata
    const checkoutResult = await createCheckoutSession({
      amount,
      currency: 'usd',
      customerEmail: validatedData.customerEmail,
      customerName: validatedData.customerName,
      metadata: {
        documentType: validatedData.documentType,
        customerEmail: validatedData.customerEmail,
        customerName: validatedData.customerName,
      },
      successUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://ez-resume.xyz'}/success?email=${encodeURIComponent(validatedData.customerEmail)}&documentType=${validatedData.documentType}&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://ez-resume.xyz'}`,
    })

    // Save form data by session ID for webhook use
    if (checkoutResult.success && checkoutResult.sessionId) {
      saveFormData(checkoutResult.sessionId, validatedData.formData);
    }

    console.log('Checkout result:', checkoutResult)

    if (!checkoutResult.success) {
      console.error('Checkout session creation failed:', checkoutResult.error)
      return NextResponse.json(
        { success: false, error: checkoutResult.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      sessionId: checkoutResult.sessionId,
      url: checkoutResult.url,
    })

  } catch (error) {
    console.error('Payment creation error:', error)

    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors)
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 