import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createCheckoutSession, getPremiumUpgradePrice } from '@/lib/stripe'

const paymentSchema = z.object({
  customerEmail: z.string().email('Please enter a valid email address'),
  upgradeType: z.enum(['premium']).default('premium'),
})

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = paymentSchema.parse(body)

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY not found in environment variables')
      return NextResponse.json(
        { success: false, error: 'Payment service not configured' },
        { status: 500 }
      )
    }

    // Set price and currency for premium upgrade
    const currency = 'aud';
    const amount = getPremiumUpgradePrice();
    
    // Prepare metadata for account upgrade
    const metadata = {
      email: validatedData.customerEmail,
      upgradeType: validatedData.upgradeType,
    };

    // Create checkout session for account upgrade
    const checkoutResult = await createCheckoutSession({
      amount,
      currency,
      customerEmail: validatedData.customerEmail,
      customerName: 'Account Upgrade', // Generic name for upgrade
      metadata: metadata,
      successUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://ez-resume.xyz'}/success?email=${encodeURIComponent(validatedData.customerEmail)}&upgradeType=${validatedData.upgradeType}&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://ez-resume.xyz'}`,
    })

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