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
  let page = pdfDoc.addPage([612, 792]); // US Letter size

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

  // Font selection
  let font: any, boldFont: any;
  const family = (fontFamily || '').toLowerCase();
  if (family === 'georgia' || family.includes('times')) {
    font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    console.log('[PDF] Using Times Roman font (serif).');
  } else if (family.includes('helvetica') || family.includes('inter') || family.includes('arial')) {
    font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    console.log('[PDF] Using Helvetica font.');
  } else if (family.includes('courier')) {
    font = await pdfDoc.embedFont(StandardFonts.Courier);
    boldFont = await pdfDoc.embedFont(StandardFonts.CourierBold);
    console.log('[PDF] Using Courier font.');
  } else {
    font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    console.log('[PDF] Unknown fontFamily, defaulting to Helvetica.');
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

  // 3. Debug logging for template and section keys
  console.log('[PDF] Using template:', templateData.id);
  console.log('[PDF] Section keys available:', Object.keys(sectionsByKey));

  // Template-specific rendering
  if (template === 'structured') {
    // Structured: specific design with centered layout and two-column skills
    await renderStructuredTemplate();
  } else if (layoutConfig.sidebar && layoutConfig.main) {
    // Modern: sidebar + main
    await renderModernTemplate();
  } else if (layoutConfig.main) {
    // Classic: main only
    await renderClassicOrStructuredTemplate();
  } else {
    throw new Error('[PDF] No valid layout config found.');
  }

  async function renderStructuredTemplate() {
    // Header: Large centered name
    ensureSpace(50);
    page.drawText(resumeJson.name || 'Your Name', {
      x: 306 - (boldFont.widthOfTextAtSize(resumeJson.name || 'Your Name', 28) / 2),
      y: y,
      size: 28,
      font: boldFont,
      color: rgb(primaryRGB.r / 255, primaryRGB.g / 255, primaryRGB.b / 255)
    });
    y -= 35;

    // Smaller centered job title
    if (resumeJson.title) {
      const titleWidth = font.widthOfTextAtSize(resumeJson.title, 16);
      page.drawText(resumeJson.title, {
        x: 306 - (titleWidth / 2),
        y: y,
        size: 16,
        font: font,
        color: rgb(secondaryRGB.r / 255, secondaryRGB.g / 255, secondaryRGB.b / 255)
      });
      y -= 25;
    }

    // Left-aligned contact info
    if (resumeJson.contact) {
      const contactInfo = [
        resumeJson.contact.email,
        resumeJson.contact.phone,
        resumeJson.contact.location
      ].filter(Boolean).join(' • ');
      page.drawText(contactInfo, {
        x: margin,
        y: y,
        size: 12,
        font: font,
        color: rgb(secondaryRGB.r / 255, secondaryRGB.g / 255, secondaryRGB.b / 255)
      });
      y -= 30;
    }

    // Sections: Clean bold headers (no underlines), left-aligned
    for (const sectionKey of layoutConfig.main) {
      if (sectionKey === 'name' || sectionKey === 'title' || sectionKey === 'contact') continue;
      const section = getSectionByKey(sectionKey);
      if (!section) continue;
      ensureSpace(40);

      // Section title - clean bold header, no underline
      page.drawText(section.title.toUpperCase(), {
        x: margin,
        y: y,
        size: 16,
        font: boldFont,
        color: rgb(primaryRGB.r / 255, primaryRGB.g / 255, primaryRGB.b / 255)
      });
      y -= 25;

      // Section content
      if (section.content) {
        const lines = wrapText(section.content, 612 - 2 * margin, font, 12);
        for (const line of lines) {
          page.drawText(line, {
            x: margin,
            y: y,
            size: 12,
            font: font,
            color: rgb(0, 0, 0)
          });
          y -= 16;
        }
        y -= 10;
      }

      // Experience: Bold job titles, regular company names, right-aligned dates, bulleted descriptions
      if (section.jobs) {
        for (const job of section.jobs) {
          // Job title (bold, left-aligned)
          page.drawText(job.title, {
            x: margin,
            y: y,
            size: 14,
            font: boldFont,
            color: rgb(0, 0, 0)
          });

          // Right-aligned dates on same line as job title
          const dateWidth = font.widthOfTextAtSize(job.dates, 12);
          page.drawText(job.dates, {
            x: 612 - margin - dateWidth,
            y: y,
            size: 12,
            font: font,
            color: rgb(secondaryRGB.r / 255, secondaryRGB.g / 255, secondaryRGB.b / 255)
          });
          y -= 18;

          // Company name (regular text, left-aligned)
          page.drawText(job.company, {
            x: margin,
            y: y,
            size: 12,
            font: font,
            color: rgb(0, 0, 0)
          });
          y -= 18;

          // Bulleted descriptions
          if (job.bullets) {
            for (const bullet of job.bullets) {
              const lines = wrapText(`• ${bullet}`, 612 - 2 * margin - 10, font, 11);
              for (const line of lines) {
                page.drawText(line, {
                  x: margin + 10,
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
      }

      // Education: Degree (bold), institution (regular), right-aligned dates
      if (section.education) {
        for (const edu of section.education) {
          // Degree (bold, left-aligned)
          page.drawText(edu.degree, {
            x: margin,
            y: y,
            size: 14,
            font: boldFont,
            color: rgb(0, 0, 0)
          });

          // Right-aligned dates on same line as degree
          if (edu.dates) {
            const dateWidth = font.widthOfTextAtSize(edu.dates, 12);
            page.drawText(edu.dates, {
              x: 612 - margin - dateWidth,
              y: y,
              size: 12,
              font: font,
              color: rgb(secondaryRGB.r / 255, secondaryRGB.g / 255, secondaryRGB.b / 255)
            });
          }
          y -= 18;

          // Institution (regular text, left-aligned)
          page.drawText(edu.institution, {
            x: margin,
            y: y,
            size: 12,
            font: font,
            color: rgb(0, 0, 0)
          });
          y -= 20;
        }
      }

      // Skills: Each skill prefixed with ■ symbol, arranged in two-column grid layout
      if (section.categories) {
        for (const [cat, skills] of Object.entries(section.categories)) {
          // Category title
          page.drawText(cat, {
            x: margin,
            y: y,
            size: 14,
            font: boldFont,
            color: rgb(0, 0, 0)
          });
          y -= 20;

          if (Array.isArray(skills)) {
            // Two-column grid layout for skills with ■ symbols
            const columnWidth = (612 - 2 * margin - 20) / 2; // 20px gap between columns
            const leftColumnX = margin;
            const rightColumnX = margin + columnWidth + 20;
            let leftColumnY = y;
            let rightColumnY = y;
            let useLeftColumn = true;

            for (const skill of skills) {
              const skillText = `■ ${skill}`;
              const currentX = useLeftColumn ? leftColumnX : rightColumnX;
              const currentY = useLeftColumn ? leftColumnY : rightColumnY;

              page.drawText(skillText, {
                x: currentX,
                y: currentY,
                size: 11,
                font: font,
                color: rgb(0, 0, 0)
              });

              if (useLeftColumn) {
                leftColumnY -= 16;
                useLeftColumn = false;
              } else {
                rightColumnY -= 16;
                useLeftColumn = true;
              }
            }

            // Update y position to the lower of the two columns
            y = Math.min(leftColumnY, rightColumnY) - 10;
          }
          y -= 15;
        }
      }
    }
  }

  async function renderClassicOrStructuredTemplate() {
    // Header with name - large and centered, serif font
    ensureSpace(50);
    page.drawText(resumeJson.name || 'Your Name', {
      x: 306 - (boldFont.widthOfTextAtSize(resumeJson.name || 'Your Name', 28) / 2),
      y: y,
      size: 28,
      font: boldFont,
      color: rgb(primaryRGB.r / 255, primaryRGB.g / 255, primaryRGB.b / 255)
    });
    y -= 35;
    // Job title - centered and styled
    if (resumeJson.title) {
      const titleWidth = font.widthOfTextAtSize(resumeJson.title.toUpperCase(), 14);
      page.drawText(resumeJson.title.toUpperCase(), {
        x: 306 - (titleWidth / 2),
        y: y,
        size: 14,
        font: font,
        color: rgb(secondaryRGB.r / 255, secondaryRGB.g / 255, secondaryRGB.b / 255)
      });
      y -= 25;
    }
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
    for (const sectionKey of layoutConfig.main) {
      if (sectionKey === 'name' || sectionKey === 'title' || sectionKey === 'contact') continue;
      const section = getSectionByKey(sectionKey);
      if (!section) continue;
      ensureSpace(40);
      // Section title - underlined, left-aligned
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
      // Section content (summary, experience, education, skills)
      if (section.content) {
        const lines = wrapText(section.content, 612 - 2 * margin, font, 12);
        for (const line of lines) {
          page.drawText(line, {
            x: margin,
            y: y,
            size: 12,
            font: font,
            color: rgb(0, 0, 0)
          });
          y -= 16;
        }
        y -= 5;
      }
      if (section.jobs) {
        for (const job of section.jobs) {
          page.drawText(job.title, {
            x: margin,
            y: y,
            size: 12,
            font: boldFont,
            color: rgb(0, 0, 0)
          });
          y -= 15;
          page.drawText(`${job.company} | ${job.location} | ${job.dates}`, {
            x: margin,
            y: y,
            size: 10,
            font: font,
            color: rgb(secondaryRGB.r / 255, secondaryRGB.g / 255, secondaryRGB.b / 255)
          });
          y -= 15;
          if (job.bullets) {
            for (const bullet of job.bullets) {
              const lines = wrapText(`• ${bullet}`, 612 - 2 * margin - 10, font, 10);
              for (const line of lines) {
                page.drawText(line, {
                  x: margin + 10,
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
      }
      if (section.education) {
        for (const edu of section.education) {
          page.drawText(edu.degree, {
            x: margin,
            y: y,
            size: 10,
            font: boldFont,
            color: rgb(0, 0, 0)
          });
          y -= 12;
          page.drawText(edu.institution, {
            x: margin,
            y: y,
            size: 9,
            font: font,
            color: rgb(secondaryRGB.r / 255, secondaryRGB.g / 255, secondaryRGB.b / 255)
          });
          y -= 10;
          if (edu.dates) {
            page.drawText(edu.dates, {
              x: margin,
              y: y,
              size: 9,
              font: font,
              color: rgb(secondaryRGB.r / 255, secondaryRGB.g / 255, secondaryRGB.b / 255)
            });
            y -= 10;
          }
          y -= 5;
        }
      }
      if (section.categories) {
        for (const [cat, skills] of Object.entries(section.categories)) {
          page.drawText(cat, {
            x: margin,
            y: y,
            size: 11,
            font: boldFont,
            color: rgb(0, 0, 0)
          });
          y -= 15;
          if (Array.isArray(skills)) {
            const skillsText = skills.join(', ');
            const lines = wrapText(skillsText, 612 - 2 * margin - 10, font, 9);
            for (const line of lines) {
              page.drawText(line, {
                x: margin + 10,
                y: y,
                size: 9,
                font: font,
                color: rgb(0, 0, 0)
              });
              y -= 12;
            }
          }
          y -= 8;
        }
      }
    }
  }

  async function renderModernTemplate() {
    // Two-column layout with sidebar
    const sidebarWidth = 180;
    const mainContentWidth = 612 - sidebarWidth - (margin * 2);
    const sidebarX = margin;
    const mainContentX = margin + sidebarWidth + 20;

    // Header with name - spans full width
    ensureSpace(40);
    page.drawText(resumeJson.name || 'Your Name', {
      x: margin,
      y: y,
      size: 26,
      font: boldFont,
      color: rgb(primaryRGB.r / 255, primaryRGB.g / 255, primaryRGB.b / 255)
    });
    y -= 30;

    // Job title - spans full width
    if (resumeJson.title) {
      page.drawText(resumeJson.title, {
        x: margin,
        y: y,
        size: 14,
        font: font,
        color: rgb(secondaryRGB.r / 255, secondaryRGB.g / 255, secondaryRGB.b / 255)
      });
      y -= 20;
    }

    // Contact information - spans full width
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

    // Draw separator line
    page.drawLine({
      start: { x: margin, y: y - 10 },
      end: { x: 612 - margin, y: y - 10 },
      thickness: 1,
      color: rgb(primaryRGB.r / 255, primaryRGB.g / 255, primaryRGB.b / 255)
    });
    y -= 20;

    // Sidebar: render sections in layoutConfig.sidebar
    let sidebarY = y;
    for (const sectionKey of layoutConfig.sidebar) {
      const section = getSectionByKey(sectionKey);
      if (!section) continue;
      // Skills section
      if (section.categories) {
        page.drawText(section.title.toUpperCase(), {
          x: sidebarX,
          y: sidebarY,
          size: 14,
          font: boldFont,
          color: rgb(primaryRGB.r / 255, primaryRGB.g / 255, primaryRGB.b / 255)
        });
        sidebarY -= 20;
        for (const [category, skills] of Object.entries(section.categories)) {
          page.drawText(category, {
            x: sidebarX,
            y: sidebarY,
            size: 11,
            font: boldFont,
            color: rgb(0, 0, 0)
          });
          sidebarY -= 15;
          if (Array.isArray(skills)) {
            const skillsText = skills.join(', ');
            const lines = wrapText(skillsText, sidebarWidth - 10, font, 9);
            for (const line of lines) {
              page.drawText(line, {
                x: sidebarX,
                y: sidebarY,
                size: 9,
                font: font,
                color: rgb(0, 0, 0)
              });
              sidebarY -= 12;
            }
          }
          sidebarY -= 8;
        }
      }
      // Education section
      if (section.education) {
        page.drawText(section.title.toUpperCase(), {
          x: sidebarX,
          y: sidebarY,
          size: 14,
          font: boldFont,
          color: rgb(primaryRGB.r / 255, primaryRGB.g / 255, primaryRGB.b / 255)
        });
        sidebarY -= 20;
        for (const edu of section.education) {
          page.drawText(edu.degree, {
            x: sidebarX,
            y: sidebarY,
            size: 10,
            font: boldFont,
            color: rgb(0, 0, 0)
          });
          sidebarY -= 12;
          page.drawText(edu.institution, {
            x: sidebarX,
            y: sidebarY,
            size: 9,
            font: font,
            color: rgb(secondaryRGB.r / 255, secondaryRGB.g / 255, secondaryRGB.b / 255)
          });
          sidebarY -= 10;
          if (edu.dates) {
            page.drawText(edu.dates, {
              x: sidebarX,
              y: sidebarY,
              size: 9,
              font: font,
              color: rgb(secondaryRGB.r / 255, secondaryRGB.g / 255, secondaryRGB.b / 255)
            });
            sidebarY -= 10;
          }
          sidebarY -= 5;
        }
      }
      // Content section (summary, etc.)
      if (section.content) {
        page.drawText(section.title.toUpperCase(), {
          x: sidebarX,
          y: sidebarY,
          size: 14,
          font: boldFont,
          color: rgb(primaryRGB.r / 255, primaryRGB.g / 255, primaryRGB.b / 255)
        });
        sidebarY -= 20;
        const lines = wrapText(section.content, sidebarWidth - 10, font, 9);
        for (const line of lines) {
          page.drawText(line, {
            x: sidebarX,
            y: sidebarY,
            size: 9,
            font: font,
            color: rgb(0, 0, 0)
          });
          sidebarY -= 12;
        }
        sidebarY -= 8;
      }
    }

    // Main content: render sections in layoutConfig.main
    let mainY = y;
    for (const sectionKey of layoutConfig.main) {
      const section = getSectionByKey(sectionKey);
      if (!section) continue;
      // Section title
      page.drawText(section.title.toUpperCase(), {
        x: mainContentX,
        y: mainY,
        size: 14,
        font: boldFont,
        color: rgb(primaryRGB.r / 255, primaryRGB.g / 255, primaryRGB.b / 255)
      });
      mainY -= 20;
      // Section content
      if (section.content) {
        const lines = wrapText(section.content, mainContentWidth, font, 11);
        for (const line of lines) {
          page.drawText(line, {
            x: mainContentX,
            y: mainY,
            size: 11,
            font: font,
            color: rgb(0, 0, 0)
          });
          mainY -= 15;
        }
        mainY -= 10;
      }
      if (section.jobs) {
        for (const job of section.jobs) {
          page.drawText(job.title, {
            x: mainContentX,
            y: mainY,
            size: 12,
            font: boldFont,
            color: rgb(0, 0, 0)
          });
          mainY -= 15;
          page.drawText(`${job.company} | ${job.location} | ${job.dates}`, {
            x: mainContentX,
            y: mainY,
            size: 10,
            font: font,
            color: rgb(secondaryRGB.r / 255, secondaryRGB.g / 255, secondaryRGB.b / 255)
          });
          mainY -= 15;
          if (job.bullets) {
            for (const bullet of job.bullets) {
              const lines = wrapText(`• ${bullet}`, mainContentWidth - 10, font, 10);
              for (const line of lines) {
                page.drawText(line, {
                  x: mainContentX + 10,
                  y: mainY,
                  size: 10,
                  font: font,
                  color: rgb(0, 0, 0)
                });
                mainY -= 13;
              }
            }
          }
          mainY -= 8;
        }
      }
      if (section.education) {
        for (const edu of section.education) {
          page.drawText(edu.degree, {
            x: mainContentX,
            y: mainY,
            size: 10,
            font: boldFont,
            color: rgb(0, 0, 0)
          });
          mainY -= 12;
          page.drawText(edu.institution, {
            x: mainContentX,
            y: mainY,
            size: 9,
            font: font,
            color: rgb(secondaryRGB.r / 255, secondaryRGB.g / 255, secondaryRGB.b / 255)
          });
          mainY -= 10;
          if (edu.dates) {
            page.drawText(edu.dates, {
              x: mainContentX,
              y: mainY,
              size: 9,
              font: font,
              color: rgb(secondaryRGB.r / 255, secondaryRGB.g / 255, secondaryRGB.b / 255)
            });
            mainY -= 10;
          }
          mainY -= 5;
        }
      }
      if (section.categories) {
        for (const [cat, skills] of Object.entries(section.categories)) {
          page.drawText(cat, {
            x: mainContentX,
            y: mainY,
            size: 11,
            font: boldFont,
            color: rgb(0, 0, 0)
          });
          mainY -= 15;
          if (Array.isArray(skills)) {
            const skillsText = skills.join(', ');
            const lines = wrapText(skillsText, mainContentWidth - 10, font, 9);
            for (const line of lines) {
              page.drawText(line, {
                x: mainContentX + 10,
                y: mainY,
                size: 9,
                font: font,
                color: rgb(0, 0, 0)
              });
              mainY -= 12;
            }
          }
          mainY -= 8;
        }
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