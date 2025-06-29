import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

export interface CreatePaymentIntentParams {
  amount: number
  currency: string
  metadata?: Record<string, string>
}

export interface CreateCheckoutSessionParams {
  amount: number
  currency: string
  customerEmail: string
  customerName: string
  metadata?: Record<string, string>
  successUrl: string
  cancelUrl: string
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

export async function createCheckoutSession(params: CreateCheckoutSessionParams) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: params.currency,
            product_data: {
              name: 'AI Resume & Cover Letter',
              description: 'Professional AI-generated resume and cover letter',
            },
            unit_amount: params.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      customer_email: params.customerEmail,
      metadata: params.metadata,
    })

    return {
      success: true,
      sessionId: session.id,
      url: session.url,
    }
  } catch (error) {
    console.error('Checkout session creation failed:', error)
    return {
      success: false,
      error: 'Failed to create checkout session',
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
  RESUME_ONLY: 1499, // $14.99 AUD in cents
  BOTH: 80, // $0.80 AUD in cents for bundle
}

export function getPriceForDocumentType(documentType: 'resume' | 'both'): number {
  switch (documentType) {
    case 'resume':
      return PRICING.RESUME_ONLY
    case 'both':
      return PRICING.BOTH
    default:
      return PRICING.RESUME_ONLY
  }
} 