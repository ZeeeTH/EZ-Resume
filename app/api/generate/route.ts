import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import nodemailer from 'nodemailer'
import { getTemplateById } from '../../../data/templates'
import { Inter_24pt_Regular_ttf } from '../../../lib/fonts/inter_24pt-regular.js';
import { Inter_24pt_Bold_ttf } from '../../../lib/fonts/inter_24pt-bold.js';
import { Inter_24pt_Italic_ttf } from '../../../lib/fonts/inter_24pt-italic.js';
import { Inter_24pt_Medium_ttf } from '../../../lib/fonts/inter_24pt-medium.js';
import { georgia_ttf } from '../../../lib/fonts/georgia.js';
import { georgiab_ttf } from '../../../lib/fonts/georgiab.js';
import { georgiai_ttf } from '../../../lib/fonts/georgiai.js';

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
  personalSummary?: string
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
      personalSummary: sanitizeString(d.personalSummary, 1000),
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
    console.log('Form data received:', JSON.stringify(formData, null, 2))
    
    const resumePrompt = createResumePrompt(formData)
    console.log('Resume prompt created, length:', resumePrompt.length)
    
    const resumeResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional resume writer. Return only valid JSON as specified in the prompt.'
        },
        {
          role: 'user',
          content: resumePrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const resumeContent = resumeResponse.choices[0]?.message?.content || ''
    console.log('Resume content generated, length:', resumeContent.length)
    console.log('Resume content preview:', resumeContent.substring(0, 200))

    let resumeJson
    try {
      resumeJson = JSON.parse(resumeContent)
      console.log('Resume JSON parsed successfully:', JSON.stringify(resumeJson, null, 2))
    } catch (parseError) {
      console.error('Failed to parse resume JSON:', parseError)
      console.error('Raw content that failed to parse:', resumeContent)
      return NextResponse.json(
        { success: false, error: 'Failed to generate resume content' },
        { status: 500 }
      )
    }

    // Ensure job title is included in the resume JSON if provided by user
    if (!resumeJson.title && formData.jobTitle && formData.jobTitle.trim()) {
      resumeJson.title = formData.jobTitle.trim()
    }

    // Create PDFs using AI-generated content
    console.log('Creating PDF with template:', formData.template)
    console.log('Resume JSON for PDF:', JSON.stringify(resumeJson, null, 2))
    
    const resumePdf = await createResumePDF(resumeJson, formData.template, formData.selectedColors)
    console.log('Resume PDF created, size:', resumePdf.length)
    
    if (resumePdf.length === 0) {
      console.error('❌ Resume PDF is empty!')
    } else {
      console.log('✅ Resume PDF created successfully with content')
    }
    
    let coverLetterPdf: Uint8Array | null = null

    if (formData.coverLetter && formData.company) {
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
${formData.personalSummary || formData.achievements}

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
${formData.achievements}

Education Details:
${formatEducationForPrompt(formData.education)}

---
OUTPUT INSTRUCTIONS:
Return the resume as a single JSON object with the following structure. Do not include any extra text or explanation:

{
  "name": "[FULL_NAME]",
  "title": "[TARGET_JOB_TITLE]",
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

IMPORTANT: Return ONLY the JSON object above, with all fields filled in and rewritten for maximum impact. Do not include any extra text, markdown, or explanation. Only include the "title" field if a job title is provided.

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

Professional Summary: ${formData.personalSummary || formData.achievements}

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
  
  // Register fontkit for custom font support
  pdfDoc.registerFontkit(fontkit);
  
  let page = pdfDoc.addPage([612, 792]); // US Letter size

  // Embed custom fonts for 1:1 matching (from base64)
  const interRegular = await pdfDoc.embedFont(loadFontBytesBase64(Inter_24pt_Regular_ttf));
  const interBold = await pdfDoc.embedFont(loadFontBytesBase64(Inter_24pt_Bold_ttf));
  const interItalic = await pdfDoc.embedFont(loadFontBytesBase64(Inter_24pt_Italic_ttf));
  const interMedium = await pdfDoc.embedFont(loadFontBytesBase64(Inter_24pt_Medium_ttf));
  const georgiaRegular = await pdfDoc.embedFont(loadFontBytesBase64(georgia_ttf));
  const georgiaBold = await pdfDoc.embedFont(loadFontBytesBase64(georgiab_ttf));
  const georgiaItalic = await pdfDoc.embedFont(loadFontBytesBase64(georgiai_ttf));

  // Get template styling
  const templateData = getTemplateById(template) || getTemplateById('modern')!;
  const { primaryColor, secondaryColor, fontFamily, spacing } = templateData.styling;

  // 1. Normalize layout config
  let layoutConfig = templateData.layout;
  if (!layoutConfig) {
    console.warn('[PDF] No layout config found in template, using fallback.');
    layoutConfig = { main: [] };
  } else if (!('sidebar' in layoutConfig) && 'main' in layoutConfig) {
    // Classic/structured: main only
    layoutConfig = { main: layoutConfig.main };
    console.log('[PDF] Layout config: main only (classic/structured)');
  } else if ('sidebar' in layoutConfig && 'main' in layoutConfig) {
    // Modern: sidebar + main
    layoutConfig = { sidebar: layoutConfig.sidebar, main: layoutConfig.main };
    console.log('[PDF] Layout config: sidebar + main (modern)');
  } else {
    console.warn('[PDF] Malformed layout config, using fallback.');
    layoutConfig = { main: [] };
  }
  console.log('[PDF] Layout config:', layoutConfig);

  // Use selected colors if available (for classic template), otherwise use template defaults
  const finalPrimaryColor = selectedColors?.primary || primaryColor;
  const finalSecondaryColor = selectedColors?.secondary || secondaryColor;

  // Parse colors
  const primaryRGB = hexToRgb(finalPrimaryColor) || { r: 37, g: 99, b: 235 };
  const secondaryRGB = hexToRgb(finalSecondaryColor) || { r: 100, g: 116, b: 139 };
  console.log('[PDF] Final colors:', { finalPrimaryColor, finalSecondaryColor, primaryRGB, secondaryRGB });

  // Spacing configuration
  const spacingConfig = {
    compact: { lineHeight: 12, sectionSpacing: 15, margin: 40 },
    standard: { lineHeight: 16, sectionSpacing: 20, margin: 50 },
    spacious: { lineHeight: 20, sectionSpacing: 25, margin: 60 }
  };
  const config = spacingConfig[spacing] || spacingConfig.standard;
  let y = 750 - config.margin;
  const margin = config.margin;
  console.log('[PDF] Spacing config:', config);

  function ensureSpace(neededSpace = 20) {
    if (y - neededSpace < margin) {
      page = pdfDoc.addPage([612, 792]);
      y = 750 - config.margin;
      console.log('[PDF] Added new page for space.');
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

  // 2. Build case-insensitive section map
  const sectionsByKey: Record<string, any> = {};
  if (resumeJson.sections) {
    for (const section of resumeJson.sections) {
      if (section && section.title) {
        // Map both original title and lowercase title
        sectionsByKey[section.title] = section;
        sectionsByKey[section.title.toLowerCase()] = section;
      }
    }
  }

  // 2. Helper for case-insensitive section matching
  function getSectionByKey(key: string) {
    // 1. Comprehensive alias mapping for common variations
    const aliasMap: { [key: string]: string[] } = {
      'summary': ['professional summary', 'profile', 'objective', 'summary', 'personal summary'],
      'experience': ['professional experience', 'work experience', 'employment', 'experience', 'work history'],
      'education': ['education', 'academic background', 'academic', 'qualifications'],
      'skills': ['skills', 'competencies', 'abilities', 'technical skills', 'expertise'],
      'contact': ['contact', 'contact information', 'contact details'],
      'name': ['name', 'full name'],
      'title': ['title', 'job title', 'position']
    };

    // 2. Helper function to normalize text for fuzzy matching
    function normalizeText(text: string): string {
      return text
        .toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim();
    }

    // 3. Helper function to remove common prefixes
    function removePrefixes(text: string): string {
      const prefixes = ['professional', 'work', 'academic', 'personal'];
      let normalized = text.toLowerCase();
      for (const prefix of prefixes) {
        if (normalized.startsWith(prefix + ' ')) {
          normalized = normalized.substring(prefix.length + 1);
        }
      }
      return normalized;
    }

    // 4. Helper function to handle singular/plural forms
    function getSingularPluralForms(text: string): string[] {
      const forms = [text];
      if (text.endsWith('s')) {
        forms.push(text.slice(0, -1)); // Remove 's' for singular
      } else {
        forms.push(text + 's'); // Add 's' for plural
      }
      return forms;
    }

    // 5. Try exact match first
    let section = sectionsByKey[key];
    if (section) {
      console.log(`[PDF] Exact match found for key: '${key}'`);
      return section;
    }

    // 6. Try alias mapping
    const aliases = aliasMap[key];
    if (aliases) {
      for (const alias of aliases) {
        section = sectionsByKey[alias];
        if (section) {
          console.log(`[PDF] Alias match found for key: '${key}' -> '${alias}'`);
          return section;
        }
      }
    }

    // 7. Try fuzzy matching with normalized keys
    const normalizedKey = normalizeText(key);
    const normalizedKeyNoPrefix = removePrefixes(normalizedKey);
    
    // Get all possible forms of the key
    const keyForms = [
      normalizedKey,
      normalizedKeyNoPrefix,
      ...getSingularPluralForms(normalizedKey),
      ...getSingularPluralForms(normalizedKeyNoPrefix)
    ];

    // Try matching against all section titles
    for (const sectionTitle of Object.keys(sectionsByKey)) {
      const normalizedTitle = normalizeText(sectionTitle);
      const normalizedTitleNoPrefix = removePrefixes(normalizedTitle);
      
      const titleForms = [
        normalizedTitle,
        normalizedTitleNoPrefix,
        ...getSingularPluralForms(normalizedTitle),
        ...getSingularPluralForms(normalizedTitleNoPrefix)
      ];

      // Check if any key form matches any title form
      for (const keyForm of keyForms) {
        for (const titleForm of titleForms) {
          if (keyForm === titleForm) {
            section = sectionsByKey[sectionTitle];
            if (section) {
              console.log(`[PDF] Fuzzy match found for key: '${key}' -> '${sectionTitle}'`);
              return section;
            }
          }
        }
      }
    }

    // 8. Fallback: try partial matching
    for (const sectionTitle of Object.keys(sectionsByKey)) {
      const normalizedTitle = normalizeText(sectionTitle);
      const normalizedKey = normalizeText(key);
      
      if (normalizedTitle.includes(normalizedKey) || normalizedKey.includes(normalizedTitle)) {
        section = sectionsByKey[sectionTitle];
        if (section) {
          console.log(`[PDF] Partial match found for key: '${key}' -> '${sectionTitle}'`);
          return section;
        }
      }
    }

    // 9. Final fallback: try case-insensitive exact match
    for (const sectionTitle of Object.keys(sectionsByKey)) {
      if (sectionTitle.toLowerCase() === key.toLowerCase()) {
        section = sectionsByKey[sectionTitle];
        if (section) {
          console.log(`[PDF] Case-insensitive match found for key: '${key}' -> '${sectionTitle}'`);
          return section;
        }
      }
    }

    console.log(`[PDF] No match found for key: '${key}'`);
    return null;
  }

  // Only support structured template for now
  if (template === 'structured') {
    await renderStructuredTemplate({
      pdfDoc,
      page,
      resumeJson,
      layoutConfig,
      primaryRGB,
      secondaryRGB,
      margin,
      yStart: y,
      ensureSpace,
      fonts: {
        interRegular,
        interBold,
        interItalic,
        interMedium,
        georgiaRegular,
        georgiaBold,
        georgiaItalic,
      },
      getSectionByKey,
    });
  } else {
    throw new Error('Only the structured template is currently supported for PDF generation.');
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

async function renderStructuredTemplate({
  pdfDoc,
  page,
  resumeJson,
  layoutConfig,
  primaryRGB,
  secondaryRGB,
  margin,
  yStart,
  ensureSpace,
  fonts,
  getSectionByKey,
}: {
  pdfDoc: any,
  page: any,
  resumeJson: any,
  layoutConfig: any,
  primaryRGB: any,
  secondaryRGB: any,
  margin: number,
  yStart: number,
  ensureSpace: (neededSpace?: number) => void,
  fonts: {
    interRegular: any,
    interBold: any,
    interItalic: any,
    interMedium: any,
    georgiaRegular: any,
    georgiaBold: any,
    georgiaItalic: any,
  },
  getSectionByKey: (key: string) => any,
}) {
  let y = yStart;
  try {
    // HEADER
    ensureSpace(80);
    // Name: Georgia Bold, 36pt, centered
    const nameFontSize = 36;
    const name = resumeJson.name || 'Your Name';
    page.drawText(name, {
      x: 306 - (fonts.georgiaBold.widthOfTextAtSize(name, nameFontSize) / 2),
      y,
      size: nameFontSize,
      font: fonts.georgiaBold,
      color: rgb(0.14, 0.15, 0.17), // #23272B
    });
    y -= 38;
    // Job Title: Inter Medium, 16pt, all caps, centered
    if (resumeJson.title) {
      const jobTitle = resumeJson.title.toUpperCase();
      const jobFontSize = 16;
      const jobFont = fonts.interMedium;
      const jobWidth = jobFont.widthOfTextAtSize(jobTitle, jobFontSize);
      page.drawText(jobTitle, {
        x: 306 - (jobWidth / 2),
        y,
        size: jobFontSize,
        font: jobFont,
        color: rgb(0.14, 0.15, 0.17),
      });
      y -= 24;
    }
    // Line below job title
    page.drawLine({
      start: { x: margin, y: y },
      end: { x: 612 - margin, y: y },
      thickness: 1.2,
      color: rgb(0.14, 0.15, 0.17),
    });
    y -= 18;
    // Contact info: Inter Regular, 12pt, centered
    if (resumeJson.contact) {
      const contactInfo = [
        resumeJson.contact.phone,
        resumeJson.contact.email,
        resumeJson.contact.location
      ].filter(Boolean).join(' • ');
      const contactFontSize = 12;
      const contactWidth = fonts.interRegular.widthOfTextAtSize(contactInfo, contactFontSize);
      page.drawText(contactInfo, {
        x: 306 - (contactWidth / 2),
        y,
        size: contactFontSize,
        font: fonts.interRegular,
        color: rgb(0.14, 0.15, 0.17),
      });
      y -= 18;
    }
    // Line below contact
    page.drawLine({
      start: { x: margin, y: y },
      end: { x: 612 - margin, y: y },
      thickness: 1.2,
      color: rgb(0.14, 0.15, 0.17),
    });
    y -= 28;
    // Summary (italic, centered)
    const summarySection = getSectionByKey('summary');
    if (summarySection && summarySection.content) {
      const summaryFontSize = 13;
      const lines = wrapText(summarySection.content, 612 - 2 * margin, fonts.interItalic, summaryFontSize);
      for (const line of lines) {
        const lineWidth = fonts.interItalic.widthOfTextAtSize(line, summaryFontSize);
        page.drawText(line, {
          x: 306 - (lineWidth / 2),
          y,
          size: summaryFontSize,
          font: fonts.interItalic,
          color: rgb(0.14, 0.15, 0.17),
        });
        y -= 18;
      }
      y -= 10;
    }
    // Render all other sections
    for (const sectionKey of layoutConfig.main) {
      if (['name', 'title', 'contact', 'summary'].includes(sectionKey)) continue;
      const section = getSectionByKey(sectionKey);
      if (!section) continue;
      ensureSpace(60);
      // Section Header: Inter Bold, 18pt, all caps, left, underline/line below
      const sectionTitle = section.title.toUpperCase();
      const sectionFontSize = 18;
      page.drawText(sectionTitle, {
        x: margin,
        y,
        size: sectionFontSize,
        font: fonts.interBold,
        color: rgb(0.14, 0.15, 0.17),
      });
      // Line below section header
      const titleWidth = fonts.interBold.widthOfTextAtSize(sectionTitle, sectionFontSize);
      page.drawLine({
        start: { x: margin, y: y - 2 },
        end: { x: margin + titleWidth + 10, y: y - 2 },
        thickness: 2,
        color: rgb(0.14, 0.15, 0.17),
      });
      y -= 28;
      // Experience Section
      if (section.jobs) {
        for (const job of section.jobs) {
          // Company: Inter Bold, 13pt, all caps
          const companyText = job.company.toUpperCase();
          page.drawText(companyText, {
            x: margin,
            y,
            size: 13,
            font: fonts.interBold,
            color: rgb(0.14, 0.15, 0.17),
          });
          y -= 16;
          // Job Title: Inter Regular, 13pt, left; Dates: Inter Italic, 12pt, right
          page.drawText(job.title, {
            x: margin,
            y,
            size: 13,
            font: fonts.interRegular,
            color: rgb(0.14, 0.15, 0.17),
          });
          if (job.dates) {
            const dateFontSize = 12;
            const dateWidth = fonts.interItalic.widthOfTextAtSize(job.dates, dateFontSize);
            page.drawText(job.dates, {
              x: 612 - margin - dateWidth,
              y,
              size: dateFontSize,
              font: fonts.interItalic,
              color: rgb(0.14, 0.15, 0.17),
            });
          }
          y -= 16;
          // Bullets: Inter Regular, 12pt, bullet, indented
          if (job.bullets) {
            for (const bullet of job.bullets) {
              const lines = wrapText(`• ${bullet}`, 612 - 2 * margin - 10, fonts.interRegular, 12);
              for (const line of lines) {
                page.drawText(line, {
                  x: margin + 10,
                  y,
                  size: 12,
                  font: fonts.interRegular,
                  color: rgb(0.14, 0.15, 0.17),
                });
                y -= 15;
              }
            }
          }
          y -= 6;
        }
      }
      // Education Section
      if (section.education) {
        for (const edu of section.education) {
          // Degree: Inter Bold, 13pt, all caps
          const degreeText = edu.degree.toUpperCase();
          page.drawText(degreeText, {
            x: margin,
            y,
            size: 13,
            font: fonts.interBold,
            color: rgb(0.14, 0.15, 0.17),
          });
          // Dates: Inter Italic, 12pt, right
          if (edu.dates) {
            const dateFontSize = 12;
            const dateWidth = fonts.interItalic.widthOfTextAtSize(edu.dates, dateFontSize);
            page.drawText(edu.dates, {
              x: 612 - margin - dateWidth,
              y,
              size: dateFontSize,
              font: fonts.interItalic,
              color: rgb(0.14, 0.15, 0.17),
            });
          }
          y -= 16;
          // Institution: Inter Regular, 13pt
          page.drawText(edu.institution, {
            x: margin,
            y,
            size: 13,
            font: fonts.interRegular,
            color: rgb(0.14, 0.15, 0.17),
          });
          y -= 22;
        }
      }
      // Skills Section: two columns, Inter Regular, 12pt, bullets
      if (section.categories) {
        // Draw a line under the section header (already done above)
        // Flatten all skills into a single array for two columns
        const allSkills: string[] = [];
        for (const skills of Object.values(section.categories)) {
          if (Array.isArray(skills)) allSkills.push(...skills);
        }
        const colCount = 2;
        const colWidth = (612 - 2 * margin - 20) / colCount;
        const colX = [margin, margin + colWidth + 20];
        const colY = [y, y];
        for (let i = 0; i < allSkills.length; i++) {
          const col = i % 2;
          const skill = `• ${allSkills[i]}`;
          page.drawText(skill, {
            x: colX[col],
            y: colY[col],
            size: 12,
            font: fonts.interRegular,
            color: rgb(0.14, 0.15, 0.17),
          });
          colY[col] -= 16;
        }
        y = Math.min(...colY) - 10;
        // Draw a line under the skills section
        page.drawLine({
          start: { x: margin, y },
          end: { x: 612 - margin, y },
          thickness: 1.2,
          color: rgb(0.14, 0.15, 0.17),
        });
        y -= 10;
      }
    }
  } catch (error) {
    console.error('[PDF] Error in renderStructuredTemplate:', error);
    throw error;
  }
}

function loadFontBytesBase64(base64: string) {
  return Buffer.from(base64, 'base64');
} 