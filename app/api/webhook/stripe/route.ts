import { NextRequest, NextResponse } from 'next/server'
import { constructWebhookEvent } from '@/lib/stripe'
import { sendEmailWithPdfAttachments } from '@/lib/email'
import { getFormData, deleteFormData } from '@/lib/formDataStore'
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

    // Handle checkout session completion
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const metadata = session.metadata || {}
      const customerName = metadata.customerName
      const sessionId = session.id
      // Retrieve order data from Supabase
      const { data, error } = await supabase
        .from('orders')
        .select('document_type, template, email, name')
        .eq('session_id', sessionId)
        .single()

      if (error || !data) {
        console.error('No order data found for session:', sessionId, error)
        return NextResponse.json({ error: 'No order data found' }, { status: 400 })
      }
      const documentType = data.document_type
      const template = data.template
      const customerEmail = data.email
      const customerName = data.name

      if (!documentType || !customerEmail || !customerName) {
        console.error('Missing required metadata in Stripe session')
        return NextResponse.json({ error: 'Missing required metadata' }, { status: 400 })
      }

      console.log('Checkout completed for:', {
        customerEmail,
        customerName,
        documentType,
        sessionId,
      })

      try {
        // Generate documents based on the payment type
        let resumePdf: Uint8Array | null = null
        let coverLetterPdf: Uint8Array | null = null

        if (documentType === 'resume' || documentType === 'both') {
          // Generate resume
          const resumeResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://ez-resume.xyz'}/api/generate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...template,
              coverLetter: false, // Only generate resume for this call
            }),
          })

          if (resumeResponse.ok) {
            const resumeResult = await resumeResponse.arrayBuffer()
            resumePdf = new Uint8Array(resumeResult)
            console.log('Resume PDF generated, size:', resumePdf.length)
          } else {
            console.error('Failed to generate resume:', await resumeResponse.text())
          }
        }

        if (documentType === 'cover-letter' || documentType === 'both') {
          // Generate cover letter
          const coverLetterResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://ez-resume.xyz'}/api/generate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...template,
              coverLetter: true,
            }),
          })

          if (coverLetterResponse.ok) {
            const coverLetterResult = await coverLetterResponse.arrayBuffer()
            coverLetterPdf = new Uint8Array(coverLetterResult)
            console.log('Cover letter PDF generated, size:', coverLetterPdf.length)
          } else {
            console.error('Failed to generate cover letter:', await coverLetterResponse.text())
          }
        }

        // Send email with PDF attachments
        if (resumePdf || coverLetterPdf) {
          const emailSent = await sendEmailWithPdfAttachments({
            to: customerEmail,
            name: customerName,
            documentType: documentType as 'resume' | 'cover-letter' | 'both',
            resumePdf: resumePdf || undefined,
            coverLetterPdf: coverLetterPdf || undefined,
          })
          
          if (emailSent) {
            console.log('Email with PDF attachments sent successfully to:', customerEmail)
          } else {
            console.error('Failed to send email with PDF attachments')
          }
        } else {
          console.error('No documents generated to send')
        }

        // Clean up form data after use
        deleteFormData(sessionId)

        // After successful email, mark as fulfilled
        await supabase
          .from('orders')
          .update({ fulfilled: true, fulfilled_at: new Date().toISOString() })
          .eq('session_id', sessionId)

        return NextResponse.json({ received: true })
      } catch (error) {
        console.error('Error processing checkout completion:', error)
        return NextResponse.json(
          { error: 'Error processing checkout' },
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