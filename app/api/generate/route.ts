import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import nodemailer from 'nodemailer'
import { getTemplateById } from '../../../data/templates'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Email transporter configuration
const createTransporter = () => {
  // Primary configuration
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

  // Fallback configuration
  const fallbackConfig = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  }

  return nodemailer.createTransport(primaryConfig)
}

const transporter = createTransporter()

// Simple in-memory rate limiting (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 3 // 3 requests per minute per IP

interface WorkExperience {
  title: string
  company: string
  startMonth: string
  startYear: string
  endMonth: string
  endYear: string
  description: string
}
interface Education {
  degree: string
  school: string
  startMonth: string
  startYear: string
  endMonth: string
  endYear: string
}
interface FormData {
  name: string
  email: string
  phone?: string
  jobTitle?: string
  company?: string
  skills: string
  achievements: string
  coverLetter: boolean
  template: string
  location?: string
  workExperience: WorkExperience[]
  education: Education[]
  colorVariant?: number
  selectedColors?: {
    label: string
    primary: string
    secondary: string
  }
}

// Input validation and sanitization
function validateAndSanitizeInput(data: unknown): FormData | null {
  try {
    if (!data || typeof data !== 'object') {
      return null
    }
    const d = data as Record<string, unknown>

    // Validate and sanitize string fields
    const sanitizeString = (str: unknown, maxLength: number = 1000): string => {
      if (typeof str !== 'string') return ''
      return str.trim().slice(0, maxLength)
    }

    const sanitizeEmail = (email: unknown): string => {
      if (typeof email !== 'string') return ''
      const sanitized = email.trim().toLowerCase()
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(sanitized) ? sanitized : ''
    }

    const sanitizePhone = (phone: unknown): string => {
      if (typeof phone !== 'string') return ''
      return phone.replace(/[^\d\s\-\+\(\)]/g, '').trim().slice(0, 20)
    }

    // Validate required fields
    const name = sanitizeString(d.name, 100)
    const email = sanitizeEmail(d.email)
    const skills = sanitizeString(d.skills, 1000)
    const achievements = sanitizeString(d.achievements, 2000)
    if (!name || !email || !skills || !achievements) {
      return null
    }

    // Validate and sanitize arrays
    const workExperience = Array.isArray(d.workExperience)
      ? d.workExperience.slice(0, 10).map((exp: unknown) => {
          const e = exp as { title?: string; company?: string; startMonth?: string; startYear?: string; endMonth?: string; endYear?: string; description?: string }
          return {
            title: sanitizeString(e.title, 100),
            company: sanitizeString(e.company, 100),
            startMonth: sanitizeString(e.startMonth, 20),
            startYear: sanitizeString(e.startYear, 10),
            endMonth: sanitizeString(e.endMonth, 20),
            endYear: sanitizeString(e.endYear, 10),
            description: sanitizeString(e.description, 2000)
          }
        })
      : []
    const education = Array.isArray(d.education)
      ? d.education.slice(0, 5).map((edu: unknown) => {
          const e = edu as { degree?: string; school?: string; startMonth?: string; startYear?: string; endMonth?: string; endYear?: string }
          return {
            degree: sanitizeString(e.degree, 200),
            school: sanitizeString(e.school, 200),
            startMonth: sanitizeString(e.startMonth, 20),
            startYear: sanitizeString(e.startYear, 10),
            endMonth: sanitizeString(e.endMonth, 20),
            endYear: sanitizeString(e.endYear, 10)
          }
        })
      : []
    if (workExperience.length === 0 || education.length === 0) {
      return null
    }
    return {
      name,
      email,
      phone: sanitizePhone(d.phone),
      jobTitle: sanitizeString(d.jobTitle, 100),
      company: sanitizeString(d.company, 100),
      skills,
      achievements,
      coverLetter: Boolean(d.coverLetter),
      template: sanitizeString(d.template, 50) || 'modern',
      location: sanitizeString(d.location, 100),
      workExperience,
      education,
      colorVariant: typeof d.colorVariant === 'number' ? d.colorVariant : undefined,
      selectedColors: d.selectedColors && typeof d.selectedColors === 'object' && 
        'label' in d.selectedColors && 'primary' in d.selectedColors && 'secondary' in d.selectedColors
        ? d.selectedColors as { label: string; primary: string; secondary: string }
        : undefined
    }
  } catch (error) {
    console.error('Input validation error:', error)
    return null
  }
}

// Rate limiting function
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  record.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    console.log('API route called - starting resume generation')
    
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    console.log('Client IP:', ip)
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      console.log('Rate limit exceeded for IP:', ip)
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Check request size
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 1024 * 1024) { // 1MB limit
      console.log('Request too large:', contentLength)
      return NextResponse.json(
        { success: false, error: 'Request too large' },
        { status: 413 }
      )
    }

    // Parse and validate input
    const rawData = await request.json()
    console.log('Raw data received, validating...')
    const formData = validateAndSanitizeInput(rawData)

    if (!formData) {
      console.log('Input validation failed')
      return NextResponse.json(
        { success: false, error: 'Invalid input data' },
        { status: 400 }
      )
    }
    console.log('Input validation passed')

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.log('OpenAI API key missing')
      return NextResponse.json(
        { success: false, error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }
    console.log('OpenAI API key found')

    // Check if Gmail credentials are configured
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.log('Gmail credentials missing - User:', !!process.env.GMAIL_USER, 'Pass:', !!process.env.GMAIL_PASS)
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 500 }
      )
    }
    console.log('Gmail credentials found')

    // Generate resume content using OpenAI
    console.log('Generating resume with OpenAI...')
    const resumePrompt = createResumePrompt(formData)
    const resumeResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional resume writer. Return ONLY the JSON object as instructed.'
        },
        {
          role: 'user',
          content: resumePrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const aiResumeContent = resumeResponse.choices[0]?.message?.content || ''
    console.log('OpenAI response received, length:', aiResumeContent.length)

    // Parse JSON response
    let resumeJson
    try {
      resumeJson = JSON.parse(aiResumeContent)
      console.log('Resume JSON parsed successfully')
    } catch (error) {
      console.error('Failed to parse resume JSON:', error)
      console.error('Raw content:', aiResumeContent)
      return NextResponse.json(
        { success: false, error: 'Failed to generate resume content' },
        { status: 500 }
      )
    }

    // Create PDFs using AI-generated content
    console.log('Creating PDF with template:', formData.template)
    const resumePdf = await createResumePDF(resumeJson, formData.template, formData.selectedColors)
    console.log('Resume PDF created, size:', resumePdf.length)
    
    let coverLetterPdf: Uint8Array | null = null

    if (formData.coverLetter && formData.jobTitle && formData.company) {
      console.log('Generating cover letter...')
      const coverLetterPrompt = createCoverLetterPrompt(formData)
      const coverLetterResponse = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional cover letter writer. Create a compelling, personalized cover letter based on the provided information. Return ONLY the cover letter content, no additional text.'
          },
          {
            role: 'user',
            content: coverLetterPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      })

      const aiCoverLetterContent = coverLetterResponse.choices[0]?.message?.content || ''
      coverLetterPdf = await createCoverLetterPDF(aiCoverLetterContent, formData)
      console.log('Cover letter PDF created, size:', coverLetterPdf.length)
    }

    // Send email with PDFs attached
    console.log('Sending email to:', formData.email)
    try {
      console.log('Verifying email transporter...')
      await transporter.verify()
      console.log('Email transporter verified successfully')
      
      console.log('Sending email with PDFs...')
      await sendEmailWithTwoPdfs(formData.email, resumePdf, coverLetterPdf, formData.name, formData.coverLetter)
      console.log('Email sent successfully')
    } catch (emailError: any) {
      console.error('Email sending failed:', emailError)
      console.error('Error code:', emailError.code)
      console.error('Error message:', emailError.message)
      
      // Provide more specific error messages
      let errorMessage = 'Failed to send email. Please try again.'
      if (emailError.code === 'EAUTH') {
        errorMessage = 'Email authentication failed. Please check Gmail settings.'
      } else if (emailError.code === 'ECONNECTION') {
        errorMessage = 'Email connection failed. Please try again later.'
      } else if (emailError.message?.includes('Invalid login')) {
        errorMessage = 'Gmail authentication failed. Please check your app password.'
      }
      
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 500 }
      )
    }

    console.log('Resume generation completed successfully')
    return NextResponse.json({
      success: true,
      message: 'Resume (and cover letter) generated and sent successfully!'
    })

  } catch (error) {
    console.error('Error generating resume:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred while processing your request' },
      { status: 500 }
    )
  }
}

function createResumePrompt(formData: FormData): string {
  return `
You are a top-tier resume writer and hiring expert. Create a compelling, polished, and ATS-optimized resume for the following candidate, suitable for their target industry and job level.

Transform the input into a professional resume with structured, impactful content. Do NOT copy and paste the raw input — rewrite it using clear action verbs, quantified achievements, and role-relevant language.

---
CANDIDATE INFORMATION:
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Location: ${formData.location || 'Not provided'}
Target Job Title: ${formData.jobTitle || 'Not specified'}
Target Company: ${formData.company || 'Not specified'}

Professional Summary:
${formData.achievements}

Work Experience:
${formData.workExperience.map((job, idx) => `
${idx + 1}. ${job.title} — ${job.company}
   Duration: ${job.startMonth} ${job.startYear} to ${job.endMonth} ${job.endYear}
   Description: ${job.description}`).join('\n')}

Education:
${formData.education.map(edu => `- ${edu.degree} — ${edu.school}, ${edu.startMonth} ${edu.startYear} to ${edu.endMonth} ${edu.endYear}`).join('\n')}

Skills:
${formData.skills}

Additional Experience:
${formatWorkExperienceForPrompt(formData.workExperience)}

Education Details:
${formatEducationForPrompt(formData.education)}

---
OUTPUT INSTRUCTIONS:
Return the resume as a single JSON object with the following structure. Do not include any extra text or explanation:

{
  "name": "[FULL_NAME]",
  "contact": {
    "email": "[EMAIL]",
    "phone": "[PHONE]",
    "location": "[LOCATION]"
  },
  "sections": [
    {
      "title": "Professional Summary",
      "content": "[REWRITTEN_SUMMARY]"
    },
    {
      "title": "Professional Experience",
      "jobs": [
        {
          "title": "[JOB_TITLE]",
          "company": "[COMPANY]",
          "location": "[CITY, STATE]",
          "dates": "[START_DATE] – [END_DATE]",
          "bullets": [
            "[ACHIEVEMENT_BULLET_1]",
            "[ACHIEVEMENT_BULLET_2]"
          ]
        }
      ]
    },
    {
      "title": "Education",
      "education": [
        {
          "degree": "[DEGREE]",
          "institution": "[SCHOOL]",
          "dates": "[START_DATE] – [END_DATE]",
          "details": "[FOCUS/HONORS/DETAILS]"
        }
      ]
    },
    {
      "title": "Skills",
      "categories": {
        "Technical Skills": ["..."],
        "Tools & Platforms": ["..."],
        "Soft Skills": ["..."],
        "Industry-Specific Skills": ["..."]
      }
    }
  ]
}

IMPORTANT: Return ONLY the JSON object above, with all fields filled in and rewritten for maximum impact. Do not include any extra text, markdown, or explanation.

**Professional Summary Requirements:**
- The summary must be concise, 3-5 sentences, no more than 400 characters, and elegantly worded for maximum professional impact.
- Use a polished, confident, and modern tone.
- All bullet points in the resume must start with a capital letter.
`;
}

function createCoverLetterPrompt(formData: FormData): string {
  return `
You are an elite cover letter writer and career expert. Your goal is to craft a compelling, personalized cover letter that showcases the candidate's unique value proposition and demonstrates genuine interest in the target role. Write in a professional yet engaging tone that connects the candidate's experience to the specific job requirements.

---

CANDIDATE INFORMATION:
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Location: ${formData.location || 'Not provided'}

Target Position: ${formData.jobTitle || 'Not specified'}
Target Company: ${formData.company || 'Not specified'}

Professional Summary: ${formData.achievements}

Work Experience:
${formData.workExperience.map((job, index) => `
${index + 1}. ${job.title} at ${job.company} (${job.startMonth} ${job.startYear} - ${job.endMonth} ${job.endYear})
   ${job.description}
`).join('\n')}

Education:
${formData.education.map(edu => `${edu.degree} from ${edu.school} (${edu.startMonth} ${edu.startYear} - ${edu.endMonth} ${edu.endYear})`).join('\n')}

Skills: ${formData.skills}

Additional Experience: ${formatWorkExperienceForPrompt(formData.workExperience)}

---

🎯 COVER LETTER GUIDELINES:

**Structure:**
1. **Opening Paragraph (2-3 sentences):**
   - Express genuine interest in the specific position and company
   - Mention how you learned about the opportunity
   - Include a compelling hook that connects your background to the role

2. **Body Paragraphs (2-3 paragraphs):**
   - Highlight 2-3 most relevant achievements or experiences
   - Connect your skills and accomplishments to the job requirements
   - Use specific examples and quantifiable results when possible
   - Demonstrate understanding of the company's needs and challenges

3. **Closing Paragraph (2-3 sentences):**
   - Reiterate interest and enthusiasm
   - Request an interview or next steps
   - Include a professional call-to-action

**Writing Style:**
- Use active voice and confident, professional language
- Avoid generic phrases and clichés
- Be specific about why you're interested in this particular role
- Show enthusiasm without being overly formal or robotic
- Keep paragraphs concise and impactful
- Use industry-appropriate terminology

**Key Elements:**
- Personalize the content to the specific role and company
- Highlight transferable skills and relevant experience
- Address potential concerns (career changes, gaps, etc.) proactively
- Demonstrate cultural fit and alignment with company values
- Include a professional signature with contact information

---

Return a well-formatted cover letter that follows these guidelines. The letter should be approximately 250-350 words and ready to be included in a professional PDF document.
`;
}

function formatMonthYear(dateStr: string): string {
  if (!dateStr) return '';
  const monthNames = [
    '', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  if (dateStr.includes('–')) {
    const [start, end] = dateStr.split('–').map(s => s.trim());
    return `${formatMonthYear(start)} – ${formatMonthYear(end)}`;
  }
  if (/present|current/i.test(dateStr)) return dateStr;
  const parts = dateStr.split('-');
  if (parts.length >= 2) {
    const year = parts[0];
    const month = parseInt(parts[1], 10);
    if (month >= 1 && month <= 12) {
      return `${monthNames[month]} ${year}`;
    }
    return year;
  }
  return dateStr;
}

async function createResumePDF(resumeJson: any, template: string = 'modern', selectedColors?: { label: string; primary: string; secondary: string }): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([612, 792]); // US Letter size
  
  // Get template styling
  const templateData = getTemplateById(template) || getTemplateById('modern')!
  const { primaryColor, secondaryColor, fontFamily, spacing, layout } = templateData.styling
  
  // Use selected colors if available (for classic template), otherwise use template defaults
  const finalPrimaryColor = selectedColors?.primary || primaryColor
  const finalSecondaryColor = selectedColors?.secondary || secondaryColor
  
  // Parse colors
  const primaryRGB = hexToRgb(finalPrimaryColor) || { r: 37, g: 99, b: 235 }
  const secondaryRGB = hexToRgb(finalSecondaryColor) || { r: 100, g: 116, b: 139 }
  
  // Choose fonts based on template
  let font: any, boldFont: any;
  switch (fontFamily.toLowerCase()) {
    case 'times new roman':
      font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
      break;
    case 'helvetica':
      font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      break;
    default: // Inter/Modern
      font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  }
  
  // Spacing configuration
  const spacingConfig = {
    compact: { lineHeight: 12, sectionSpacing: 15, margin: 40 },
    standard: { lineHeight: 16, sectionSpacing: 20, margin: 50 },
    spacious: { lineHeight: 20, sectionSpacing: 25, margin: 60 }
  };
  
  const config = spacingConfig[spacing] || spacingConfig.standard;
  let y = 750 - config.margin;
  const margin = config.margin;
  
  function ensureSpace(neededSpace = 20) {
    if (y - neededSpace < margin) {
      page = pdfDoc.addPage([612, 792]);
      y = 750 - config.margin;
    }
  }

  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  // Template-specific rendering
  if (template === 'classic') {
    // CLASSIC TEMPLATE: Traditional, formal layout
    await renderClassicTemplate();
  } else if (template === 'structured') {
    // STRUCTURED TEMPLATE: Clean, lots of white space
    await renderStructuredTemplate();
  } else {
    // MODERN TEMPLATE: Contemporary, bold design
    await renderModernTemplate();
  }

  async function renderClassicTemplate() {
    // Header with name - large and centered
    ensureSpace(50);
    page.drawText(resumeJson.name || 'Your Name', {
      x: 306 - (boldFont.widthOfTextAtSize(resumeJson.name || 'Your Name', 28) / 2),
      y: y,
      size: 28,
      font: boldFont,
      color: rgb(primaryRGB.r / 255, primaryRGB.g / 255, primaryRGB.b / 255)
    });
    y -= 35;

    // Contact information - centered
    if (resumeJson.contact) {
      const contactInfo = [
        resumeJson.contact.email,
        resumeJson.contact.phone,
        resumeJson.contact.location
      ].filter(Boolean).join(' • ');
      
      const contactWidth = font.widthOfTextAtSize(contactInfo, 12);
      page.drawText(contactInfo, {
        x: 306 - (contactWidth / 2),
        y: y,
        size: 12,
        font: font,
        color: rgb(secondaryRGB.r / 255, secondaryRGB.g / 255, secondaryRGB.b / 255)
      });
      y -= 30;
    }

    // Sections with traditional formatting
    if (resumeJson.sections) {
      for (const section of resumeJson.sections) {
        ensureSpace(40);
        
        // Section title - underlined
        const titleWidth = boldFont.widthOfTextAtSize(section.title.toUpperCase(), 16);
        page.drawText(section.title.toUpperCase(), {
          x: margin,
          y: y,
          size: 16,
          font: boldFont,
          color: rgb(primaryRGB.r / 255, primaryRGB.g / 255, primaryRGB.b / 255)
        });
        
        // Draw underline
        page.drawLine({
          start: { x: margin, y: y - 2 },
          end: { x: margin + titleWidth, y: y - 2 },
          thickness: 1,
          color: rgb(primaryRGB.r / 255, primaryRGB.g / 255, primaryRGB.b / 255)
        });
        y -= 25;

        // Section content
        if (section.title === 'Professional Summary') {
          const lines = wrapText(section.content, 500, font, 12);
          for (const line of lines) {
            ensureSpace(15);
            page.drawText(line, {
              x: margin,
              y: y,
              size: 12,
              font: font,
              color: rgb(0, 0, 0)
            });
            y -= 15;
          }
          y -= 10;
        } else if (section.title === 'Professional Experience' && section.jobs) {
          for (const job of section.jobs) {
            ensureSpace(50);
            
            // Job title and company on same line
            const jobTitle = job.title;
            const companyInfo = `${job.company} | ${job.location} | ${job.dates}`;
            
            page.drawText(jobTitle, {
              x: margin,
              y: y,
              size: 14,
              font: boldFont,
              color: rgb(0, 0, 0)
            });
            y -= 18;
            
            page.drawText(companyInfo, {
              x: margin,
              y: y,
              size: 11,
              font: font,
              color: rgb(secondaryRGB.r / 255, secondaryRGB.g / 255, secondaryRGB.b / 255)
            });
            y -= 15;

            // Job bullets with traditional indentation
            if (job.bullets) {
              for (const bullet of job.bullets) {
                const lines = wrapText(`• ${bullet}`, 480, font, 11);
                for (const line of lines) {
                  ensureSpace(14);
                  page.drawText(line, {
                    x: margin + 15,
                    y: y,
                    size: 11,
                    font: font,
                    color: rgb(0, 0, 0)
                  });
                  y -= 14;
                }
              }
            }
            y -= 8;
          }
        } else if (section.title === 'Education' && section.education) {
          for (const edu of section.education) {
            ensureSpace(35);
            
            page.drawText(edu.degree, {
              x: margin,
              y: y,
              size: 14,
              font: boldFont,
              color: rgb(0, 0, 0)
            });
            y -= 18;
            
            page.drawText(`${edu.institution} | ${edu.dates}`, {
              x: margin,
              y: y,
              size: 11,
              font: font,
              color: rgb(secondaryRGB.r / 255, secondaryRGB.g / 255, secondaryRGB.b / 255)
            });
            y -= 15;
          }
        } else if (section.title === 'Skills' && section.categories) {
          for (const [category, skills] of Object.entries(section.categories)) {
            ensureSpace(25);
            
            page.drawText(`${category}:`, {
              x: margin,
              y: y,
              size: 12,
              font: boldFont,
              color: rgb(0, 0, 0)
            });
            y -= 16;
            
            if (Array.isArray(skills)) {
              const skillsText = skills.join(', ');
              const lines = wrapText(skillsText, 500, font, 11);
              for (const line of lines) {
                ensureSpace(13);
                page.drawText(line, {
                  x: margin + 10,
                  y: y,
                  size: 11,
                  font: font,
                  color: rgb(0, 0, 0)
                });
                y -= 13;
              }
            }
            y -= 5;
          }
        }
        y -= config.sectionSpacing;
      }
    }
  }

  async function renderStructuredTemplate() {
    // Header with name - small and subtle
    ensureSpace(30);
    page.drawText(resumeJson.name || 'Your Name', {
      x: margin,
      y: y,
      size: 20,
      font: boldFont,
      color: rgb(primaryRGB.r / 255, primaryRGB.g / 255, primaryRGB.b / 255)
    });
    y -= 25;

    // Contact information - minimal
    if (resumeJson.contact) {
      const contactInfo = [
        resumeJson.contact.email,
        resumeJson.contact.phone,
        resumeJson.contact.location
      ].filter(Boolean).join(' • ');
      
      page.drawText(contactInfo, {
        x: margin,
        y: y,
        size: 9,
        font: font,
        color: rgb(secondaryRGB.r / 255, secondaryRGB.g / 255, secondaryRGB.b / 255)
      });
      y -= 20;
    }

    // Sections with minimal formatting
    if (resumeJson.sections) {
      for (const section of resumeJson.sections) {
        ensureSpace(30);
        
        // Section title - small and subtle
        page.drawText(section.title, {
          x: margin,
          y: y,
          size: 12,
          font: boldFont,
          color: rgb(primaryRGB.r / 255, primaryRGB.g / 255, primaryRGB.b / 255)
        });
        y -= 20;

        // Section content
        if (section.title === 'Professional Summary') {
          const lines = wrapText(section.content, 500, font, 10);
          for (const line of lines) {
            ensureSpace(12);
            page.drawText(line, {
              x: margin,
              y: y,
              size: 10,
              font: font,
              color: rgb(0, 0, 0)
            });
            y -= 12;
          }
          y -= 15;
        } else if (section.title === 'Professional Experience' && section.jobs) {
          for (const job of section.jobs) {
            ensureSpace(40);
            
            // Job title
            page.drawText(job.title, {
              x: margin,
              y: y,
              size: 11,
              font: boldFont,
              color: rgb(0, 0, 0)
            });
            y -= 14;
            
            // Company and dates on same line
            page.drawText(`${job.company} | ${job.dates}`, {
              x: margin,
              y: y,
              size: 9,
              font: font,
              color: rgb(secondaryRGB.r / 255, secondaryRGB.g / 255, secondaryRGB.b / 255)
            });
            y -= 12;

            // Job bullets - minimal
            if (job.bullets) {
              for (const bullet of job.bullets) {
                const lines = wrapText(`• ${bullet}`, 500, font, 9);
                for (const line of lines) {
                  ensureSpace(10);
                  page.drawText(line, {
                    x: margin + 8,
                    y: y,
                    size: 9,
                    font: font,
                    color: rgb(0, 0, 0)
                  });
                  y -= 10;
                }
              }
            }
            y -= 10;
          }
        } else if (section.title === 'Education' && section.education) {
          for (const edu of section.education) {
            ensureSpace(25);
            
            page.drawText(edu.degree, {
              x: margin,
              y: y,
              size: 11,
              font: boldFont,
              color: rgb(0, 0, 0)
            });
            y -= 14;
            
            page.drawText(`${edu.institution} | ${edu.dates}`, {
              x: margin,
              y: y,
              size: 9,
              font: font,
              color: rgb(secondaryRGB.r / 255, secondaryRGB.g / 255, secondaryRGB.b / 255)
            });
            y -= 12;
          }
        } else if (section.title === 'Skills' && section.categories) {
          for (const [category, skills] of Object.entries(section.categories)) {
            ensureSpace(20);
            
            page.drawText(category, {
              x: margin,
              y: y,
              size: 10,
              font: boldFont,
              color: rgb(0, 0, 0)
            });
            y -= 14;
            
            if (Array.isArray(skills)) {
              const skillsText = skills.join(', ');
              const lines = wrapText(skillsText, 500, font, 9);
              for (const line of lines) {
                ensureSpace(10);
                page.drawText(line, {
                  x: margin,
                  y: y,
                  size: 9,
                  font: font,
                  color: rgb(0, 0, 0)
                });
                y -= 10;
              }
            }
            y -= 8;
          }
        }
        y -= config.sectionSpacing;
      }
    }
  }

  async function renderModernTemplate() {
    // Header with name - bold and prominent
    ensureSpace(40);
    page.drawText(resumeJson.name || 'Your Name', {
      x: margin,
      y: y,
      size: 26,
      font: boldFont,
      color: rgb(primaryRGB.r / 255, primaryRGB.g / 255, primaryRGB.b / 255)
    });
    y -= 30;

    // Contact information - modern layout
    if (resumeJson.contact) {
      const contactInfo = [
        resumeJson.contact.email,
        resumeJson.contact.phone,
        resumeJson.contact.location
      ].filter(Boolean).join(' • ');
      
      page.drawText(contactInfo, {
        x: margin,
        y: y,
        size: 11,
        font: font,
        color: rgb(secondaryRGB.r / 255, secondaryRGB.g / 255, secondaryRGB.b / 255)
      });
      y -= 25;
    }

    // Sections with modern formatting
    if (resumeJson.sections) {
      for (const section of resumeJson.sections) {
        ensureSpace(35);
        
        // Section title - modern with accent
        page.drawText(section.title, {
          x: margin,
          y: y,
          size: 16,
          font: boldFont,
          color: rgb(primaryRGB.r / 255, primaryRGB.g / 255, primaryRGB.b / 255)
        });
        
        // Draw accent line
        page.drawLine({
          start: { x: margin, y: y - 3 },
          end: { x: margin + 50, y: y - 3 },
          thickness: 2,
          color: rgb(primaryRGB.r / 255, primaryRGB.g / 255, primaryRGB.b / 255)
        });
        y -= 25;

        // Section content
        if (section.title === 'Professional Summary') {
          const lines = wrapText(section.content, 500, font, 11);
          for (const line of lines) {
            ensureSpace(15);
            page.drawText(line, {
              x: margin,
              y: y,
              size: 11,
              font: font,
              color: rgb(0, 0, 0)
            });
            y -= 15;
          }
          y -= 10;
        } else if (section.title === 'Professional Experience' && section.jobs) {
          for (const job of section.jobs) {
            ensureSpace(45);
            
            // Job title and company
            page.drawText(job.title, {
              x: margin,
              y: y,
              size: 13,
              font: boldFont,
              color: rgb(0, 0, 0)
            });
            y -= 16;
            
            page.drawText(`${job.company} | ${job.location} | ${job.dates}`, {
              x: margin,
              y: y,
              size: 10,
              font: font,
              color: rgb(secondaryRGB.r / 255, secondaryRGB.g / 255, secondaryRGB.b / 255)
            });
            y -= 15;

            // Job bullets with modern styling
            if (job.bullets) {
              for (const bullet of job.bullets) {
                const lines = wrapText(`• ${bullet}`, 480, font, 10);
                for (const line of lines) {
                  ensureSpace(13);
                  page.drawText(line, {
                    x: margin + 12,
                    y: y,
                    size: 10,
                    font: font,
                    color: rgb(0, 0, 0)
                  });
                  y -= 13;
                }
              }
            }
            y -= 8;
          }
        } else if (section.title === 'Education' && section.education) {
          for (const edu of section.education) {
            ensureSpace(30);
            
            page.drawText(edu.degree, {
              x: margin,
              y: y,
              size: 13,
              font: boldFont,
              color: rgb(0, 0, 0)
            });
            y -= 16;
            
            page.drawText(`${edu.institution} | ${edu.dates}`, {
              x: margin,
              y: y,
              size: 10,
              font: font,
              color: rgb(secondaryRGB.r / 255, secondaryRGB.g / 255, secondaryRGB.b / 255)
            });
            y -= 15;
          }
        } else if (section.title === 'Skills' && section.categories) {
          for (const [category, skills] of Object.entries(section.categories)) {
            ensureSpace(25);
            
            page.drawText(category, {
              x: margin,
              y: y,
              size: 12,
              font: boldFont,
              color: rgb(0, 0, 0)
            });
            y -= 16;
            
            if (Array.isArray(skills)) {
              const skillsText = skills.join(', ');
              const lines = wrapText(skillsText, 500, font, 10);
              for (const line of lines) {
                ensureSpace(12);
                page.drawText(line, {
                  x: margin,
                  y: y,
                  size: 10,
                  font: font,
                  color: rgb(0, 0, 0)
                });
                y -= 12;
              }
            }
            y -= 8;
          }
        }
        y -= config.sectionSpacing;
      }
    }
  }

  return await pdfDoc.save();
}

async function createCoverLetterPDF(content: string, formData: FormData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // US Letter size
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let yPosition = height - 50;
  const margin = 50;
  const lineHeight = 16;

  // Header with name
  const fullName = formData.name;
  page.drawText(fullName, {
    x: margin,
    y: yPosition,
    size: 24,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  yPosition -= 30;

  // Contact info
  const contactInfo = [
    formData.email,
    formData.phone,
    formData.location
  ].filter(Boolean).join(' • ');

  page.drawText(contactInfo, {
    x: margin,
    y: yPosition,
    size: 12,
    font: font,
    color: rgb(0.4, 0.4, 0.4),
  });

  yPosition -= 40;

  // Date
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  page.drawText(dateString, {
    x: margin,
    y: yPosition,
    size: 12,
    font: font,
    color: rgb(0.3, 0.3, 0.3),
  });

  yPosition -= 40;

  // Cover Letter Title
  page.drawText('COVER LETTER', {
    x: margin,
    y: yPosition,
    size: 18,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.2),
  });
  yPosition -= 30;

  // Cover Letter Content
  const lines = content.split('\n');
  for (const line of lines) {
    if (line.trim() && yPosition > margin + 50) {
      const wrappedLines = wrapText(line.trim(), width - 2 * margin, font, 12);
      for (const wrappedLine of wrappedLines) {
        if (yPosition > margin + 50) {
          page.drawText(wrappedLine, {
            x: margin,
            y: yPosition,
            size: 12,
            font: font,
            color: rgb(0.3, 0.3, 0.3),
          });
          yPosition -= lineHeight;
        }
      }
      yPosition -= 5;
    }
  }

  return await pdfDoc.save();
}

// Helper function to wrap text
function wrapText(text: string, maxWidth: number, font: any, fontSize: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);
    
    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}

async function sendEmailWithTwoPdfs(
  email: string,
  resumePdf: Uint8Array,
  coverLetterPdf: Uint8Array | null,
  name: string,
  coverLetter: boolean
): Promise<void> {
  const subject = coverLetterPdf
    ? 'Your New Resume is Ready!'
    : 'Your New Resume is Ready!';

  const text = coverLetterPdf
    ? 'Your professionally formatted resume and cover letter are attached as PDFs.'
    : 'Your professionally formatted resume is attached as a PDF.';

  // Create FirstLast filename format
  const firstName = name.split(' ')[0] || 'Resume';
  const lastName = name.split(' ').slice(1).join('') || 'Document';
  const fileName = `${firstName}${lastName}`;

  const attachments = [
    {
      filename: `${fileName}_Resume.pdf`,
      content: Buffer.from(resumePdf),
      contentType: 'application/pdf',
    },
  ];
  if (coverLetterPdf) {
    attachments.push({
      filename: `${fileName}_CoverLetter.pdf`,
      content: Buffer.from(coverLetterPdf),
      contentType: 'application/pdf',
    });
  }

  await transporter.sendMail({
    to: email,
    subject: subject,
    text: text,
    html: buildEmailHtml({ name, coverLetter }),
    attachments,
  });
}

// Helper function to capitalize the first letter of each bullet point
function capitalizeFirst(str: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatWorkExperienceForPrompt(workExperience: WorkExperience[]): string {
  return workExperience.map((job, idx) => `Job #${idx + 1}:\nTitle: ${job.title}\nCompany: ${job.company}\nStart: ${job.startMonth} ${job.startYear}\nEnd: ${job.endMonth ? job.endMonth + ' ' + job.endYear : 'Present'}\nDescription: ${job.description}`).join('\n\n');
}

function formatEducationForPrompt(education: Education[]): string {
  return education.map(edu => `- ${edu.degree} — ${edu.school}, ${edu.startMonth} ${edu.startYear} to ${edu.endMonth} ${edu.endYear}`).join('\n');
}

// Add this helper to generate the HTML email body
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
      .brand { text-align: center; margin-bottom: 24px; }
      .brand-logo { width: 48px; height: 48px; margin-bottom: 8px; }
      .brand-title { font-size: 1.5rem; font-weight: 700; background: linear-gradient(90deg, #6366f1, #a21caf, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
      h1 { font-size: 1.25rem; font-weight: 600; color: #3b3663; margin-bottom: 12px; text-align: center; }
      p { font-size: 1rem; line-height: 1.6; margin: 0 0 16px 0; text-align: center; }
      .button { display: inline-block; background: linear-gradient(90deg, #6366f1, #a21caf, #ec4899); color: #fff !important; font-weight: 600; padding: 12px 28px; border-radius: 8px; text-decoration: none; margin: 24px 0; font-size: 1rem; letter-spacing: 0.02em; box-shadow: 0 2px 8px 0 rgba(80, 63, 205, 0.10); }
      .footer { margin-top: 32px; font-size: 0.9rem; color: #8887a0; text-align: center; }
      @media (max-width: 600px) { .container { padding: 16px 4vw; } }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="brand">
        <!-- <img src="https://yourdomain.com/logo.png" alt="EZ Resume" class="brand-logo" /> -->
        <div class="brand-title">EZ Resume</div>
      </div>
      <h1>🎉 Your New Resume is Ready!</h1>
      <p>Hi <b>${name}</b>,</p>
      <p>Thank you for using <b>EZ Resume</b>! Your professionally formatted resume${coverLetterText} is attached to this email as a PDF.</p>
      <a class="button" href="#" style="pointer-events: none;">Download is attached</a>
      <p><b>What's next?</b><br>- Review your resume and cover letter.<br>- Reply to this email if you need a revision or have questions.<br>- Good luck with your job search!</p>
      <div class="footer">&copy; ${year} EZ Resume &mdash; <a href="https://ezresume.com" style="color:#a21caf;text-decoration:none;">ezresume.com</a></div>
    </div>
  </body>
</html>`;
} 