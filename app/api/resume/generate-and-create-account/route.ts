import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { LaTeXTemplateProcessor } from '../../../../lib/latex-template-processor'
import * as fs from 'fs'
import * as crypto from 'crypto'
import nodemailer from 'nodemailer'

// Helper function to generate secure random password
function generateRandomPassword(): string {
  return crypto.randomBytes(12).toString('base64').slice(0, 12)
}

// Apply free tier limitations
function applyFreeTierLimitations(formData: any) {
  const limited = { ...formData }
  
  // Add watermark to free resumes
  limited.isFreeTier = true
  limited.watermark = "Generated with EZ-Resume Free"
  
  // Limit AI-generated content if present
  if (limited.workExperience) {
    limited.workExperience = limited.workExperience.map((job: any) => ({
      ...job,
      description: job.description?.slice(0, 3) || [] // Max 3 bullet points
    }))
  }
  
  return limited
}

// Send welcome email for auto-created accounts
async function sendWelcomeEmail(user: any) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  })

  const dashboardUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`
  
  const emailContent = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <h2 style="color: #3182ce;">Welcome to EZ-Resume! 🎉</h2>
      
      <p>Hi ${user.fullName},</p>
      
      <p>Great news! Your resume has been generated and your free EZ-Resume account has been created automatically.</p>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Your Account Details:</h3>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Dashboard:</strong> <a href="${dashboardUrl}">Access your resumes here</a></p>
        <p><em>Your resume is ready to download from your dashboard!</em></p>
      </div>
      
      <h3>What's Next?</h3>
      <ul>
        <li>📥 Download your resume from your dashboard</li>
        <li>📝 Create additional resumes anytime</li>
        <li>🎨 Explore premium templates (upgrade available)</li>
        <li>✍️ Generate cover letters to match your resumes</li>
      </ul>
      
      <div style="background: #e6fffa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #38b2ac;">
        <h3>🚀 Ready to unlock more features?</h3>
        <p>Upgrade to Professional for just $49 AUD (one-time payment) to get:</p>
        <ul>
          <li>✅ 9 industry-specific templates</li>
          <li>✅ Unlimited AI content generation</li>
          <li>✅ No watermarks on your resumes</li>
          <li>✅ Professional cover letter generator</li>
          <li>✅ Priority customer support</li>
        </ul>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/pricing" 
           style="background: #3182ce; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">
          Upgrade to Professional
        </a>
      </div>
      
      <p>Questions? Just reply to this email - we're here to help!</p>
      
      <p>Best of luck with your job search!</p>
      <p>The EZ-Resume Team</p>
      
      <hr style="margin: 30px 0;">
      <small style="color: #666;">
        This email was sent because you created a resume at EZ-Resume. 
        If you didn't create this account, please <a href="mailto:support@ez-resume.xyz">contact us</a>.
      </small>
    </div>
  `

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: user.email,
    subject: 'Welcome to EZ-Resume - Your account is ready!',
    html: emailContent,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { formData } = await request.json()
    const email = formData.email
    const fullName = formData.name
    
    if (!email || !fullName) {
      return NextResponse.json({ error: 'Email and name are required' }, { status: 400 })
    }

    // Check if user already exists
    let user = null
    let isNewUser = false
    
    try {
      const { data: existingUser, error: userError } = await supabase
        .from('profiles')
        .select('id, email, tier')
        .eq('email', email)
        .single()

      if (existingUser) {
        user = existingUser
      } else {
        // Create new user account automatically
        const { data: newUser, error: createError } = await supabase
          .from('profiles')
          .insert([{
            email: email,
            tier: 'free',
            paid_at: new Date().toISOString(),
          }])
          .select('id, email, tier')
          .single()

        if (createError) {
          console.error('Failed to create user profile:', createError)
          return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
        }

        user = newUser
        isNewUser = true
        
        // Send welcome email for new users
        try {
          await sendWelcomeEmail({ email, fullName })
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError)
          // Don't fail the whole process if email fails
        }
      }
    } catch (profileError) {
      console.error('Error handling user profile:', profileError)
      return NextResponse.json({ error: 'Failed to handle user account' }, { status: 500 })
    }

    // Apply free tier limitations
    const limitedData = applyFreeTierLimitations(formData)
    
    // Generate resume
    const processor = new LaTeXTemplateProcessor()
    const result = await processor.generateResume(limitedData, 'classic-professional', user.id)
    
    if (!result.success) {
      console.error('Resume generation failed:', result.error)
      return NextResponse.json({ error: 'Resume generation failed' }, { status: 500 })
    }

    // Save resume to user's account
    let savedResume = null
    try {
      const resumeData = {
        user_id: user.id,
        title: `${fullName}'s Resume`,
        industry: formData.industry || 'general',
        template_id: 'classic-professional',
        job_title: formData.jobTitle || null,
        content: {
          personalDetails: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            location: formData.location,
          },
          personalSummary: formData.personalSummary,
          workExperience: formData.workExperience,
          education: formData.education,
          skills: formData.skills,
          achievements: formData.achievements,
          template: 'classic',
          colorVariant: 0,
          selectedColors: null,
        },
        is_favorite: true, // Mark as favorite since it's the latest
      }

      const { data: resumeResult, error: resumeError } = await supabase
        .from('resumes')
        .insert([resumeData])
        .select('id')
        .single()

      if (resumeError) {
        console.error('Failed to save resume:', resumeError)
      } else {
        savedResume = resumeResult
      }
    } catch (dbError) {
      console.error('Database save error:', dbError)
      // Don't fail the whole process if database save fails
    }

    // Save PDF path to database for dashboard access
    if (result.pdfPath && savedResume) {
      try {
        await supabase
          .from('resumes')
          .update({ 
            pdf_path: result.pdfPath,
            updated_at: new Date().toISOString()
          })
          .eq('id', savedResume.id)
        
      } catch (updateError) {
        console.error('Failed to save PDF path:', updateError)
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        tier: user.tier,
        isNewUser
      },
      resumeId: savedResume?.id,
      message: isNewUser ? 'Account created and resume saved!' : 'Resume saved to your account!'
    })

  } catch (error) {
    console.error('Resume generation and account creation failed:', error)
    return NextResponse.json({ error: 'Resume generation failed' }, { status: 500 })
  }
} 