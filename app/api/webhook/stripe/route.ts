import { NextRequest, NextResponse } from 'next/server'
import { constructWebhookEvent } from '@/lib/stripe'
import { sendEmailWithPdfAttachments } from '@/lib/email'

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
      const { documentType, customerEmail, customerName } = session.metadata

      console.log('Checkout completed for:', {
        customerEmail,
        customerName,
        documentType,
        sessionId: session.id,
      })

      try {
        // For now, we'll use sample data since we can't store full form data in metadata
        // In production, you might want to use a database or temporary storage
        const sampleFormData = {
          name: customerName,
          email: customerEmail,
          phone: '+1 (555) 123-4567',
          location: 'City, State',
          personalSummary: 'Professional summary for AI-generated resume',
          jobTitle: 'Software Engineer',
          company: 'Tech Company',
          skills: 'JavaScript, React, Node.js, TypeScript',
          achievements: 'Led development of key features, improved performance by 30%',
          coverLetter: documentType === 'both' || documentType === 'cover-letter',
          template: 'classic',
          workExperience: [{
            title: 'Software Engineer',
            company: 'Tech Company',
            startMonth: 'January',
            startYear: '2023',
            endMonth: 'December',
            endYear: '2024',
            description: 'Developed and maintained web applications using modern technologies'
          }],
          education: [{
            degree: 'Bachelor of Science in Computer Science',
            school: 'University',
            startMonth: 'September',
            startYear: '2019',
            endMonth: 'May',
            endYear: '2023'
          }]
        }

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
              ...sampleFormData,
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
              ...sampleFormData,
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