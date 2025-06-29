import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createCheckoutSession, getPriceForDocumentType } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

const paymentSchema = z.object({
  documentType: z.enum(['resume', 'both']),
  customerEmail: z.string().email('Please enter a valid email address'),
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  formData: z.any(), // Form data to be stored in metadata
})

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('Payment API called - checking environment variables...')
    console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY)
    console.log('NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL)
    console.log('SUPABASE_URL exists:', !!process.env.SUPABASE_URL)
    console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
    
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

    // Set price and currency
    const currency = 'aud';
    const amount = getPriceForDocumentType(validatedData.documentType);
    // Create checkout session with minimal metadata
    const checkoutResult = await createCheckoutSession({
      amount,
      currency,
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

    // Save form data by session ID for webhook use (Supabase)
    if (checkoutResult.success && checkoutResult.sessionId) {
      console.log('Attempting to save order data to Supabase...')
      console.log('Session ID:', checkoutResult.sessionId)
      console.log('Document type:', validatedData.documentType)
      console.log('Template:', validatedData.formData.template)
      
      // Test database connection and table structure
      try {
        const { data: testData, error: testError } = await supabase
          .from('orders')
          .select('*')
          .limit(1);
        
        if (testError) {
          console.error('Database connection test failed:', testError)
        } else {
          console.log('Database connection successful, table structure:', testData)
        }
      } catch (testErr) {
        console.error('Database connection test error:', testErr)
      }
      
      const { data: insertData, error: insertError } = await supabase.from('orders').insert([
        {
          session_id: checkoutResult.sessionId,
          document_type: validatedData.documentType,
          template: validatedData.formData.template,
          email: validatedData.customerEmail,
          name: validatedData.customerName,
          price: amount,
          currency: currency,
          form_data: validatedData.formData, // Store complete form data
        }
      ]);

      if (insertError) {
        console.error('Failed to insert order data into Supabase:', insertError)
        console.error('Error details:', {
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint
        })
      } else {
        console.log('Order data successfully saved to Supabase:', insertData)
      }
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