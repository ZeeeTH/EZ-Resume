import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { supabase } from '@/lib/supabase'

// Email transporter configuration
const createTransporter = () => {
  const primaryConfig = {
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
    secure: true,
    port: 465,
    tls: {
      rejectUnauthorized: false
    }
  }

  return nodemailer.createTransport(primaryConfig)
}

export async function GET(request: NextRequest) {
  try {
    console.log('Test API called - checking Supabase connection...')
    
    // Test environment variables
    console.log('SUPABASE_URL exists:', !!process.env.SUPABASE_URL)
    console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
    
    // Test database connection
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Supabase test failed:', error)
      return NextResponse.json({
        success: false,
        error: 'Supabase connection failed',
        details: error
      }, { status: 500 })
    }
    
    console.log('Supabase test successful, data:', data)

  return NextResponse.json({
    success: true,
      message: 'Supabase connection working',
      data: data
    })
    
  } catch (error) {
    console.error('Test API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email address is required'
      }, { status: 400 })
    }

    // Check if Gmail credentials are configured
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      return NextResponse.json({
        success: false,
        error: 'Email service not configured'
      }, { status: 500 })
    }

    // Sample data that matches the real form data structure
    const sampleFormData = {
      name: 'John Smith',
      email: email,
      phone: '(555) 123-4567',
      jobTitle: 'Senior Software Engineer',
      company: 'Tech Corp',
      skills: 'JavaScript, React, Node.js, Python, AWS',
      achievements: 'Led team of 5 developers, increased performance by 40%, implemented CI/CD pipeline',
      coverLetter: true,
      template: 'modern',
      location: 'San Francisco, CA',
      personalSummary: 'Experienced software engineer with 5+ years building scalable web applications. Passionate about clean code and user experience.',
      workExperience: [
        {
          title: 'Senior Software Engineer',
          company: 'Tech Corp',
          startMonth: 'January',
          startYear: '2022',
          endMonth: 'Present',
          endYear: '',
          description: 'Led development of microservices architecture, mentored junior developers, improved system performance by 40%'
        },
        {
          title: 'Software Engineer',
          company: 'Startup Inc',
          startMonth: 'March',
          startYear: '2020',
          endMonth: 'December',
          endYear: '2021',
          description: 'Built full-stack web applications using React and Node.js, implemented CI/CD pipeline, reduced deployment time by 60%'
        }
      ],
      education: [
        {
          degree: 'Bachelor of Science in Computer Science',
          school: 'University of Technology',
          startMonth: 'September',
          startYear: '2016',
          endMonth: 'May',
          endYear: '2020'
        }
      ]
    }

    // Create sample PDFs (you can replace these with actual PDF generation later)
    const sampleResumePdf = Buffer.from('Sample Resume PDF content')
    const sampleCoverLetterPdf = Buffer.from('Sample Cover Letter PDF content')

    // Send the actual email using the same function as the main generate route
    await sendEmailWithTwoPdfs(
      sampleFormData.email, 
      sampleResumePdf, 
      sampleCoverLetterPdf, 
      sampleFormData.name, 
      sampleFormData.coverLetter
    )

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${email}`
    })

  } catch (error) {
    console.error('Test email sending failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to send test email'
    }, { status: 500 })
  }
}

// Copy the actual email sending function from the main generate route
async function sendEmailWithTwoPdfs(
  email: string,
  resumePdf: Buffer,
  coverLetterPdf: Buffer | null,
  name: string,
  coverLetter: boolean
): Promise<void> {
  const transporter = createTransporter()
  
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: coverLetter ? 'Your Professional Documents - EZ Resume' : 'Your Professional Resume - EZ Resume',
    html: buildEmailHtml({ name, coverLetter }),
    attachments: [
      {
        filename: `${name.replace(/\s+/g, '_')}_Resume.pdf`,
        content: resumePdf,
        contentType: 'application/pdf'
      },
      ...(coverLetter && coverLetterPdf ? [{
        filename: `${name.replace(/\s+/g, '_')}_Cover_Letter.pdf`,
        content: coverLetterPdf,
        contentType: 'application/pdf'
      }] : [])
    ]
  }

  await transporter.sendMail(mailOptions)
}

function buildEmailHtml({ name, coverLetter }: { name: string; coverLetter: boolean }) {
  const year = new Date().getFullYear();
  const coverLetterText = coverLetter ? ' and cover letter' : '';
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Your New Resume from EZ Resume</title>
    <meta name="color-scheme" content="light only">
    <style>
      body { background: #f8fafc; color: #22223b; font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; }
      .container { background: #fff; max-width: 480px; margin: 32px auto; border-radius: 16px; box-shadow: 0 4px 24px 0 rgba(80, 63, 205, 0.08); padding: 32px 24px; border: 1px solid #ece9f7; text-align: center; }
      .brand { text-align: center; margin-bottom: 8px; }
      .brand-title { font-size: 1.5rem; font-weight: 700; background: linear-gradient(90deg, #6366f1, #a21caf, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
      .gradient-accent { width: 60px; height: 4px; margin: 0 auto 18px auto; border-radius: 2px; background: linear-gradient(90deg, #6366f1, #a21caf, #ec4899); }
      h1 { font-size: 1.25rem; font-weight: 600; color: #3b3663; margin-bottom: 12px; text-align: center; }
      p { font-size: 1rem; line-height: 1.6; margin: 0 0 16px 0; text-align: center; }
      .button { display: inline-block; background: linear-gradient(90deg, #6366f1, #a21caf, #ec4899); color: #fff !important; font-weight: 600; padding: 12px 28px; border-radius: 8px; text-decoration: none; margin: 24px 0; font-size: 1rem; letter-spacing: 0.02em; box-shadow: 0 2px 8px 0 rgba(80, 63, 205, 0.10); border: none; pointer-events: none; }
      .whats-next { font-size: 1.05rem; font-weight: 600; margin: 18px 0 8px 0; color: #3b3663; }
      .next-steps { font-size: 0.98rem; color: #444; margin-bottom: 1.2rem; }
      .footer { margin-top: 32px; font-size: 0.9rem; color: #8887a0; text-align: center; }
      .footer a { color:#a21caf;text-decoration:none; }
      @media (max-width: 600px) { .container { padding: 16px 4vw; } }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="brand">
        <div class="brand-title">EZ Resume</div>
      </div>
      <div class="gradient-accent"></div>
      <h1>🎉 Your New Resume is Ready!</h1>
      <p>Hi <b>${name}</b>,</p>
      <p>Thank you for using <b>EZ Resume</b>! Your professionally formatted resume${coverLetterText} is attached to this email as a PDF.</p>
      <a class="button" href="#" tabindex="-1">Download is attached</a>
      <div class="whats-next">What's next?</div>
      <div class="next-steps">
        - Review your resume${coverLetter ? ' and cover letter' : ''}.<br>
        - Reply to this email if you need a revision or have questions.<br>
        - Good luck with your job search!
      </div>
      <div class="footer">&copy; ${year} EZ Resume &mdash; <a href="https://ez-resume.xyz">ez-resume.xyz</a></div>
    </div>
  </body>
</html>`;
} 