import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createPaymentIntent, getPriceForDocumentType } from '@/lib/stripe'
import { PaymentRequest, PaymentResponse } from '@/types'

const paymentSchema = z.object({
  documentType: z.enum(['resume', 'cover-letter', 'both']),
  customerEmail: z.string().email('Please enter a valid email address'),
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
})

export async function POST(request: NextRequest): Promise<NextResponse<PaymentResponse>> {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = paymentSchema.parse(body)

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { success: false, error: 'Payment service not configured' },
        { status: 500 }
      )
    }

    // Get price for document type
    const amount = getPriceForDocumentType(validatedData.documentType)

    // Create payment intent
    const paymentResult = await createPaymentIntent({
      amount,
      currency: 'usd',
      metadata: {
        documentType: validatedData.documentType,
        customerEmail: validatedData.customerEmail,
        customerName: validatedData.customerName,
      },
    })

    if (!paymentResult.success) {
      return NextResponse.json(
        { success: false, error: paymentResult.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      clientSecret: paymentResult.clientSecret ?? undefined,
    })

  } catch (error) {
    console.error('Payment creation error:', error)

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