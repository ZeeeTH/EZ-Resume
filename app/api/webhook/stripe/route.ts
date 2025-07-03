import { NextRequest, NextResponse } from 'next/server'
import { constructWebhookEvent } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      console.error('Missing stripe signature header')
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    let event
    try {
      event = constructWebhookEvent(body, signature)
    } catch (error) {
      console.error('Webhook signature verification failed:', error)
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 }
      )
    }

    // Handle checkout session completion (account upgrade)
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const metadata = session.metadata || {}
      const sessionId = session.id

      // Extract user info from metadata
      const customerEmail = metadata.email
      const upgradeType = metadata.upgradeType || 'premium' // Default to premium upgrade

      if (!customerEmail) {
        console.error('Missing customer email in metadata:', { customerEmail })
        return NextResponse.json({ error: 'Missing customer email in metadata' }, { status: 400 })
      }

      try {
        // Find existing user by email and upgrade their account
        const { data: existingUser, error: userError } = await supabase
          .from('profiles')
          .select('id, tier')
          .eq('email', customerEmail)
          .single();

        if (userError) {
          console.error('Failed to find user:', userError);
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }

        // Update user's tier to paid/premium
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            tier: 'paid',
            paid_at: new Date().toISOString(),
            subscription_status: 'active'
          })
          .eq('id', existingUser.id);

        if (updateError) {
          console.error('Failed to upgrade user account:', updateError);
          return NextResponse.json(
            { error: 'Failed to upgrade account' },
            { status: 500 }
          );
        }

        console.log(`User ${existingUser.id} upgraded to paid tier successfully`);
        return NextResponse.json({ received: true });

      } catch (error) {
        console.error('Error processing account upgrade:', error);
        return NextResponse.json(
          { error: 'Error processing account upgrade' },
          { status: 500 }
        );
      }
    }

    // Handle other webhook events
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
} 