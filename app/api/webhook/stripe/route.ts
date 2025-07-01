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

    // Handle checkout session completion
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const metadata = session.metadata || {}
      const sessionId = session.id
      // Retrieve order data from Supabase
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('document_type, template, email, name')
        .eq('session_id', sessionId)
        .single()

      if (orderError || !orderData) {
        console.error('No order data found for session:', sessionId, orderError)
        return NextResponse.json({ error: 'No order data found' }, { status: 400 })
      }
      
      // Retrieve form data from separate table
      const { data: formData, error: formError } = await supabase
        .from('form_submissions')
        .select('*')
        .eq('session_id', sessionId)
        .single()

      if (formError || !formData) {
        console.error('No form data found for session:', sessionId, formError)
        return NextResponse.json({ error: 'No form data found' }, { status: 400 })
      }
      
      const documentType = orderData.document_type
      const customerEmail = orderData.email
      const customerName = orderData.name

      if (!documentType || !customerEmail || !customerName) {
        console.error('Missing required data in order')
        return NextResponse.json({ error: 'Missing required data' }, { status: 400 })
      }

      // Construct form data from individual fields
      const processedFormData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        jobTitle: formData.job_title,
        company: formData.company,
        skills: formData.skills,
        achievements: formData.achievements,
        location: formData.location,
        personalSummary: formData.personal_summary,
        coverLetter: formData.cover_letter,
        template: formData.template,
        colorVariant: formData.color_variant,
        selectedColors: formData.selected_colors ? JSON.parse(formData.selected_colors) : undefined,
        workExperience: JSON.parse(formData.work_experience),
        education: JSON.parse(formData.education),
      };

      // Debug color selection specifically
      console.log('=== Webhook Color Debug ===');
      console.log('Raw selected_colors from DB:', formData.selected_colors);
      console.log('Parsed selectedColors:', JSON.stringify(processedFormData.selectedColors, null, 2));
      console.log('Color variant:', formData.color_variant);
      console.log('Template:', formData.template);
      console.log('=== End Webhook Color Debug ===');

      console.log('Checkout completed for:', {
          customerEmail,
          customerName,
          documentType,
        sessionId,
      })
      
      console.log('Form data constructed from database:', JSON.stringify(processedFormData, null, 2))
      console.log('Form data type:', typeof processedFormData)
      console.log('Form data keys:', Object.keys(processedFormData || {}))

      try {
        // Generate documents based on the payment type
        console.log('Generating documents with form data:', JSON.stringify(processedFormData, null, 2))

        // Call generate API only once - it will handle both resume and cover letter if needed
        const generateResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://ez-resume.xyz'}/api/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(processedFormData),
        })

        console.log('Document generation response status:', generateResponse.status)
        
        if (generateResponse.ok) {
          // The generate API sends the email directly with both documents if needed
          console.log('Documents generated and email sent successfully')
        } else {
          const errorText = await generateResponse.text()
          console.error('Failed to generate documents:', errorText)
        }

        // Mark order as fulfilled
        console.log('Document generation completed, marking order as fulfilled')
        
        // Mark order as fulfilled
        await supabase
          .from('orders')
          .update({ fulfilled: true, fulfilled_at: new Date().toISOString() })
          .eq('session_id', sessionId)

        // Delete form data after successful processing
        console.log('Deleting form data after successful processing')
        const { error: deleteError } = await supabase
          .from('form_submissions')
          .delete()
          .eq('session_id', sessionId)

        if (deleteError) {
          console.error('Failed to delete form data:', deleteError)
        } else {
          console.log('Form data successfully deleted')
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