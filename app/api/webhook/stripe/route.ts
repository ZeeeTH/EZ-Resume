import { NextRequest, NextResponse } from 'next/server'
import { constructWebhookEvent } from '@/lib/stripe'
import { generateDocuments } from '@/lib/openai'
import { sendDocumentEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const event = constructWebhookEvent(body, signature)

    // Handle payment success
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object
      const { documentType, customerEmail, customerName } = paymentIntent.metadata

      // For now, we'll generate documents immediately after payment
      // In a production app, you might want to queue this or handle it differently
      try {
        // Note: In a real application, you'd need to collect the form data
        // This is a simplified example - you'd typically store the form data
        // when the payment intent is created and retrieve it here
        
        console.log('Payment succeeded for:', {
          customerEmail,
          customerName,
          documentType,
          paymentIntentId: paymentIntent.id,
        })

        // You would typically:
        // 1. Retrieve the stored form data
        // 2. Generate documents
        // 3. Send email
        
        return NextResponse.json({ received: true })
      } catch (error) {
        console.error('Error processing payment success:', error)
        return NextResponse.json(
          { error: 'Error processing payment' },
          { status: 500 }
        )
      }
    }

    // Handle other webhook events
    console.log('Received webhook event:', event.type)

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
} 