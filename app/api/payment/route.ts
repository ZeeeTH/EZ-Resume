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
    
    // Test Supabase connection immediately
    console.log('Testing Supabase connection...')
    try {
      const { data: testData, error: testError } = await supabase
        .from('orders')
        .select('count')
        .limit(1);
      
      if (testError) {
        console.error('❌ Supabase connection failed:', testError)
        console.error('Error details:', {
          message: testError.message,
          details: testError.details,
          hint: testError.hint,
          code: testError.code
        })
      } else {
        console.log('✅ Supabase connection successful')
      }
    } catch (connectionErr) {
      console.error('❌ Supabase connection error:', connectionErr)
    }
    
    // Parse and validate request body
    const body = await request.json()
    console.log('Request body received:', { documentType: body.documentType, customerEmail: body.customerEmail })
    console.log('Full request body:', JSON.stringify(body, null, 2))
    
    const validatedData = paymentSchema.parse(body)
    console.log('Validated data:', JSON.stringify(validatedData, null, 2))

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
      
      // Save order data
      const orderData = {
        session_id: checkoutResult.sessionId,
        document_type: validatedData.documentType,
        template: validatedData.formData.template,
        email: validatedData.customerEmail,
        name: validatedData.customerName,
        price: amount,
        currency: currency,
      };
      
      const { data: orderResult, error: orderError } = await supabase.from('orders').insert([orderData]);

      if (orderError) {
        console.error('Failed to insert order data into Supabase:', orderError)
      } else {
        console.log('Order data successfully saved to Supabase:', orderResult)
      }
      
      // Save form data to separate table
      const formData = {
        session_id: checkoutResult.sessionId,
        name: validatedData.customerName,
        email: validatedData.customerEmail,
        phone: validatedData.formData.phone || null,
        job_title: validatedData.formData.jobTitle || null,
        company: validatedData.formData.company || null,
        skills: validatedData.formData.skills,
        achievements: validatedData.formData.achievements,
        location: validatedData.formData.location || null,
        personal_summary: validatedData.formData.personalSummary || null,
        cover_letter: validatedData.formData.coverLetter || false,
        template: validatedData.formData.template,
        color_variant: validatedData.formData.colorVariant || 0,
        selected_colors: validatedData.formData.selectedColors ? JSON.stringify(validatedData.formData.selectedColors) : null,
        work_experience: JSON.stringify(validatedData.formData.workExperience),
        education: JSON.stringify(validatedData.formData.education),
      };
      
      console.log('Attempting to insert form data:', JSON.stringify(formData, null, 2))
      
      const { data: formResult, error: formError } = await supabase.from('form_submissions').insert([formData]);

      if (formError) {
        console.error('Failed to insert form data into Supabase:', formError)
        console.error('Error details:', {
          message: formError.message,
          details: formError.details,
          hint: formError.hint
        })
      } else {
        console.log('Form data successfully saved to Supabase:', formResult)
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