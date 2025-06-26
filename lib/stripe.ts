import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export interface CreatePaymentIntentParams {
  amount: number
  currency: string
  metadata?: Record<string, string>
}

export async function createPaymentIntent(params: CreatePaymentIntentParams) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: params.amount,
      currency: params.currency,
      metadata: params.metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    }
  } catch (error) {
    console.error('Payment intent creation failed:', error)
    return {
      success: false,
      error: 'Failed to create payment intent',
    }
  }
}

export async function confirmPayment(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    
    if (paymentIntent.status === 'succeeded') {
      return {
        success: true,
        paymentIntent,
      }
    } else {
      return {
        success: false,
        error: 'Payment not completed',
        status: paymentIntent.status,
      }
    }
  } catch (error) {
    console.error('Payment confirmation failed:', error)
    return {
      success: false,
      error: 'Failed to confirm payment',
    }
  }
}

export function constructWebhookEvent(payload: string, signature: string) {
  try {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    throw new Error('Invalid webhook signature')
  }
}

// Pricing configuration
export const PRICING = {
  RESUME_ONLY: 1999, // $19.99 in cents
  COVER_LETTER_ONLY: 1499, // $14.99 in cents
  BOTH: 2999, // $29.99 in cents
}

export function getPriceForDocumentType(documentType: 'resume' | 'cover-letter' | 'both'): number {
  switch (documentType) {
    case 'resume':
      return PRICING.RESUME_ONLY
    case 'cover-letter':
      return PRICING.COVER_LETTER_ONLY
    case 'both':
      return PRICING.BOTH
    default:
      return PRICING.RESUME_ONLY
  }
} 