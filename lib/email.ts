import nodemailer from 'nodemailer'
import handlebars from 'handlebars'

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

// Email templates
const resumeEmailTemplate = handlebars.compile(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Your Professional Resume</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .content { background: #f9fafb; padding: 30px; border-radius: 8px; }
        .document { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #3b82f6; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        .gradient-line { height: 3px; background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); border-radius: 2px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="content">
            <div class="gradient-line"></div>
            <h1 style="margin-top: 0; color: #1f2937; font-size: 28px; font-weight: 700;">Your Professional Resume is Ready!</h1>
            
            <p>Hi {{name}},</p>
            <p>Your professional resume has been generated successfully! Here it is:</p>
            
            <div class="document">
                <pre style="white-space: pre-wrap; font-family: 'Courier New', monospace; font-size: 14px;">{{resume}}</pre>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
                <li>Review and customize the content as needed</li>
                <li>Format it in your preferred document editor</li>
                <li>Save it as a PDF for professional submission</li>
                <li>Tailor it further for specific job applications</li>
            </ul>
            
            <p>Good luck with your job search!</p>
            
            <p>Best regards,<br>The EZ Resume Team</p>
        </div>
        <div class="footer">
            <p>This email was sent from EZ Resume - AI-Powered Resume Generator</p>
        </div>
    </div>
</body>
</html>
`)

const coverLetterEmailTemplate = handlebars.compile(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Your Professional Cover Letter</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .content { background: #f9fafb; padding: 30px; border-radius: 8px; }
        .document { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #3b82f6; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        .gradient-line { height: 3px; background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); border-radius: 2px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="content">
            <div class="gradient-line"></div>
            <h1 style="margin-top: 0; color: #1f2937; font-size: 28px; font-weight: 700;">Your Professional Cover Letter is Ready!</h1>
            
            <p>Hi {{name}},</p>
            <p>Your professional cover letter has been generated successfully! Here it is:</p>
            
            <div class="document">
                <pre style="white-space: pre-wrap; font-family: 'Courier New', monospace; font-size: 14px;">{{coverLetter}}</pre>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
                <li>Review and customize the content as needed</li>
                <li>Format it in your preferred document editor</li>
                <li>Save it as a PDF for professional submission</li>
                <li>Personalize it further for specific companies</li>
            </ul>
            
            <p>Good luck with your job search!</p>
            
            <p>Best regards,<br>The EZ Resume Team</p>
        </div>
        <div class="footer">
            <p>This email was sent from EZ Resume - AI-Powered Resume Generator</p>
        </div>
    </div>
</body>
</html>
`)

const bothDocumentsEmailTemplate = handlebars.compile(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Your Professional Documents</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .content { background: #f9fafb; padding: 30px; border-radius: 8px; }
        .document { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #3b82f6; }
        .document h3 { margin-top: 0; color: #3b82f6; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        .gradient-line { height: 3px; background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); border-radius: 2px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="content">
            <div class="gradient-line"></div>
            <h1 style="margin-top: 0; color: #1f2937; font-size: 28px; font-weight: 700;">Your Professional Documents are Ready!</h1>
            
            <p>Hi {{name}},</p>
            <p>Your professional resume and cover letter have been generated successfully! Here they are:</p>
            
            <div class="document">
                <h3>📄 Resume</h3>
                <pre style="white-space: pre-wrap; font-family: 'Courier New', monospace; font-size: 14px;">{{resume}}</pre>
            </div>
            
            <div class="document">
                <h3>📝 Cover Letter</h3>
                <pre style="white-space: pre-wrap; font-family: 'Courier New', monospace; font-size: 14px;">{{coverLetter}}</pre>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
                <li>Review and customize both documents as needed</li>
                <li>Format them in your preferred document editor</li>
                <li>Save them as PDFs for professional submission</li>
                <li>Tailor them further for specific job applications</li>
            </ul>
            
            <p>Good luck with your job search!</p>
            
            <p>Best regards,<br>The EZ Resume Team</p>
        </div>
        <div class="footer">
            <p>This email was sent from EZ Resume - AI-Powered Resume Generator</p>
        </div>
    </div>
</body>
</html>
`)

export interface SendEmailParams {
  to: string
  name: string
  documentType: 'resume' | 'cover-letter' | 'both'
  resume?: string
  coverLetter?: string
}

export async function sendDocumentEmail(params: SendEmailParams): Promise<boolean> {
  try {
    let html: string
    let subject: string

    switch (params.documentType) {
      case 'resume':
        html = resumeEmailTemplate({
          name: params.name,
          resume: params.resume,
        })
        subject = 'Your Professional Resume - EZ Resume'
        break
      case 'cover-letter':
        html = coverLetterEmailTemplate({
          name: params.name,
          coverLetter: params.coverLetter,
        })
        subject = 'Your Professional Cover Letter - EZ Resume'
        break
      case 'both':
        html = bothDocumentsEmailTemplate({
          name: params.name,
          resume: params.resume,
          coverLetter: params.coverLetter,
        })
        subject = 'Your Professional Documents - EZ Resume'
        break
      default:
        throw new Error('Invalid document type')
    }

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: params.to,
      subject,
      html,
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('Email sending failed:', error)
    return false
  }
} 