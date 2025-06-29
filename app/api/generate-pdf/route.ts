import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import puppeteer from 'puppeteer'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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
   ${job.description}`).join('\n')}

Education:
${formData.education.map(edu => `${edu.degree} from ${edu.school} (${edu.startMonth} ${edu.startYear} - ${edu.endMonth} ${edu.endYear})`).join('\n')}

Skills: ${formData.skills}

Additional Experience: ${formData.achievements}

---

OUTPUT INSTRUCTIONS:
Create a compelling cover letter that:
1. Opens with a strong hook that shows enthusiasm for the position
2. Explains why the candidate is interested in the specific company
3. Highlights relevant experience and skills that match the job requirements
4. Demonstrates understanding of the role and company
5. Closes with a call to action and contact information
6. Is personalized and specific to the target company
7. Maintains a professional yet engaging tone

Return ONLY the cover letter content, no additional text or formatting instructions.
`;
}

async function createResumePDF(resumeJson: any, template: string = 'modern', selectedColors?: { label: string; primary: string; secondary: string }): Promise<Uint8Array> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  try {
    const page = await browser.newPage()
    
    // Set viewport
    await page.setViewport({ width: 1200, height: 1600 })
    
    // Generate HTML based on template
    let html = ''
    
    if (template === 'classic') {
      html = generateClassicTemplate(resumeJson, selectedColors)
    } else if (template === 'structured') {
      html = generateStructuredTemplate(resumeJson, selectedColors)
    } else {
      html = generateModernTemplate(resumeJson, selectedColors)
    }
    
    await page.setContent(html, { waitUntil: 'networkidle0' })
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      }
    })
    
    return pdf
  } finally {
    await browser.close()
  }
}

async function createCoverLetterPDF(content: string, formData: FormData): Promise<Uint8Array> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  try {
    const page = await browser.newPage()
    
    // Set viewport
    await page.setViewport({ width: 1200, height: 1600 })
    
    const html = generateCoverLetterTemplate(content, formData)
    
    await page.setContent(html, { waitUntil: 'networkidle0' })
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.75in',
        right: '0.75in',
        bottom: '0.75in',
        left: '0.75in'
      }
    })
    
    return pdf
  } finally {
    await browser.close()
  }
}

function generateClassicTemplate(resumeJson: any, selectedColors?: { label: string; primary: string; secondary: string }): string {
  const colors = selectedColors || { primary: '#2c3e50', secondary: '#34495e' }
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${resumeJson.name} - Resume</title>
      <style>
        body {
          font-family: 'Times New Roman', serif;
          line-height: 1.4;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid ${colors.primary};
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .name {
          font-size: 28px;
          font-weight: bold;
          color: ${colors.primary};
          margin-bottom: 10px;
        }
        .title {
          font-size: 18px;
          color: ${colors.secondary};
          margin-bottom: 10px;
        }
        .contact {
          font-size: 14px;
          color: #666;
        }
        .section {
          margin-bottom: 25px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: ${colors.primary};
          border-bottom: 1px solid ${colors.primary};
          padding-bottom: 5px;
          margin-bottom: 15px;
        }
        .job {
          margin-bottom: 20px;
        }
        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 10px;
        }
        .job-title {
          font-weight: bold;
          font-size: 16px;
        }
        .job-company {
          font-weight: bold;
          color: ${colors.secondary};
        }
        .job-dates {
          font-style: italic;
          color: #666;
        }
        .job-bullets {
          margin-left: 20px;
        }
        .job-bullets li {
          margin-bottom: 5px;
        }
        .education-item {
          margin-bottom: 15px;
        }
        .education-degree {
          font-weight: bold;
        }
        .education-school {
          color: ${colors.secondary};
        }
        .education-dates {
          font-style: italic;
          color: #666;
        }
        .skills-category {
          margin-bottom: 15px;
        }
        .skills-title {
          font-weight: bold;
          color: ${colors.secondary};
          margin-bottom: 5px;
        }
        .skills-list {
          margin-left: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="name">${resumeJson.name}</div>
        ${resumeJson.title ? `<div class="title">${resumeJson.title}</div>` : ''}
        <div class="contact">
          ${resumeJson.contact.email} | ${resumeJson.contact.phone} | ${resumeJson.contact.location}
        </div>
      </div>
      
      ${resumeJson.sections.map((section: any) => {
        if (section.title === 'Professional Summary') {
          return `
            <div class="section">
              <div class="section-title">${section.title}</div>
              <div>${section.content}</div>
            </div>
          `
        } else if (section.title === 'Professional Experience') {
          return `
            <div class="section">
              <div class="section-title">${section.title}</div>
              ${section.jobs.map((job: any) => `
                <div class="job">
                  <div class="job-header">
                    <div>
                      <span class="job-title">${job.title}</span> - 
                      <span class="job-company">${job.company}</span>
                    </div>
                    <div class="job-dates">${job.dates}</div>
                  </div>
                  <ul class="job-bullets">
                    ${job.bullets.map((bullet: string) => `<li>${bullet}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
          `
        } else if (section.title === 'Education') {
          return `
            <div class="section">
              <div class="section-title">${section.title}</div>
              ${section.education.map((edu: any) => `
                <div class="education-item">
                  <div class="education-degree">${edu.degree}</div>
                  <div class="education-school">${edu.institution}</div>
                  <div class="education-dates">${edu.dates}</div>
                  ${edu.details ? `<div>${edu.details}</div>` : ''}
                </div>
              `).join('')}
            </div>
          `
        } else if (section.title === 'Skills') {
          return `
            <div class="section">
              <div class="section-title">${section.title}</div>
              ${Object.entries(section.categories).map(([category, skills]: [string, any]) => `
                <div class="skills-category">
                  <div class="skills-title">${category}</div>
                  <div class="skills-list">${skills.join(', ')}</div>
                </div>
              `).join('')}
            </div>
          `
        }
        return ''
      }).join('')}
    </body>
    </html>
  `
}

function generateStructuredTemplate(resumeJson: any, selectedColors?: { label: string; primary: string; secondary: string }): string {
  const colors = selectedColors || { primary: '#1a365d', secondary: '#2d3748' }
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${resumeJson.name} - Resume</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.5;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
          color: white;
          padding: 30px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .name {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .title {
          font-size: 20px;
          opacity: 0.9;
          margin-bottom: 15px;
        }
        .contact {
          font-size: 14px;
          opacity: 0.8;
        }
        .section {
          margin-bottom: 30px;
          background: #f8f9fa;
          padding: 20px;
          border-radius: 6px;
          border-left: 4px solid ${colors.primary};
        }
        .section-title {
          font-size: 20px;
          font-weight: bold;
          color: ${colors.primary};
          margin-bottom: 15px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .job {
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e9ecef;
        }
        .job:last-child {
          border-bottom: none;
        }
        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 12px;
        }
        .job-title {
          font-weight: bold;
          font-size: 18px;
          color: ${colors.secondary};
        }
        .job-company {
          font-weight: bold;
          color: ${colors.primary};
        }
        .job-dates {
          font-style: italic;
          color: #6c757d;
          font-size: 14px;
        }
        .job-bullets {
          margin-left: 20px;
        }
        .job-bullets li {
          margin-bottom: 8px;
          line-height: 1.4;
        }
        .education-item {
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e9ecef;
        }
        .education-item:last-child {
          border-bottom: none;
        }
        .education-degree {
          font-weight: bold;
          font-size: 16px;
          color: ${colors.secondary};
        }
        .education-school {
          color: ${colors.primary};
          font-weight: bold;
        }
        .education-dates {
          font-style: italic;
          color: #6c757d;
          font-size: 14px;
        }
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }
        .skills-category {
          background: white;
          padding: 15px;
          border-radius: 4px;
          border: 1px solid #e9ecef;
        }
        .skills-title {
          font-weight: bold;
          color: ${colors.primary};
          margin-bottom: 8px;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.5px;
        }
        .skills-list {
          color: #495057;
          line-height: 1.4;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="name">${resumeJson.name}</div>
        ${resumeJson.title ? `<div class="title">${resumeJson.title}</div>` : ''}
        <div class="contact">
          ${resumeJson.contact.email} | ${resumeJson.contact.phone} | ${resumeJson.contact.location}
        </div>
      </div>
      
      ${resumeJson.sections.map((section: any) => {
        if (section.title === 'Professional Summary') {
          return `
            <div class="section">
              <div class="section-title">${section.title}</div>
              <div>${section.content}</div>
            </div>
          `
        } else if (section.title === 'Professional Experience') {
          return `
            <div class="section">
              <div class="section-title">${section.title}</div>
              ${section.jobs.map((job: any) => `
                <div class="job">
                  <div class="job-header">
                    <div>
                      <span class="job-title">${job.title}</span> - 
                      <span class="job-company">${job.company}</span>
                    </div>
                    <div class="job-dates">${job.dates}</div>
                  </div>
                  <ul class="job-bullets">
                    ${job.bullets.map((bullet: string) => `<li>${bullet}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
          `
        } else if (section.title === 'Education') {
          return `
            <div class="section">
              <div class="section-title">${section.title}</div>
              ${section.education.map((edu: any) => `
                <div class="education-item">
                  <div class="education-degree">${edu.degree}</div>
                  <div class="education-school">${edu.institution}</div>
                  <div class="education-dates">${edu.dates}</div>
                  ${edu.details ? `<div>${edu.details}</div>` : ''}
                </div>
              `).join('')}
            </div>
          `
        } else if (section.title === 'Skills') {
          return `
            <div class="section">
              <div class="section-title">${section.title}</div>
              <div class="skills-grid">
                ${Object.entries(section.categories).map(([category, skills]: [string, any]) => `
                  <div class="skills-category">
                    <div class="skills-title">${category}</div>
                    <div class="skills-list">${skills.join(', ')}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          `
        }
        return ''
      }).join('')}
    </body>
    </html>
  `
}

function generateModernTemplate(resumeJson: any, selectedColors?: { label: string; primary: string; secondary: string }): string {
  const colors = selectedColors || { primary: '#667eea', secondary: '#764ba2' }
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${resumeJson.name} - Resume</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #2d3748;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
          color: white;
          padding: 40px;
          border-radius: 12px;
          margin-bottom: 30px;
          text-align: center;
        }
        .name {
          font-size: 36px;
          font-weight: 300;
          margin-bottom: 10px;
          letter-spacing: 1px;
        }
        .title {
          font-size: 18px;
          opacity: 0.9;
          margin-bottom: 20px;
          font-weight: 300;
        }
        .contact {
          font-size: 14px;
          opacity: 0.8;
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .section {
          margin-bottom: 35px;
        }
        .section-title {
          font-size: 22px;
          font-weight: 600;
          color: ${colors.primary};
          margin-bottom: 20px;
          position: relative;
          padding-bottom: 8px;
        }
        .section-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 50px;
          height: 3px;
          background: linear-gradient(90deg, ${colors.primary}, ${colors.secondary});
          border-radius: 2px;
        }
        .job {
          margin-bottom: 30px;
          padding: 20px;
          background: #f7fafc;
          border-radius: 8px;
          border-left: 4px solid ${colors.primary};
        }
        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 15px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .job-title {
          font-weight: 600;
          font-size: 18px;
          color: ${colors.secondary};
        }
        .job-company {
          font-weight: 600;
          color: ${colors.primary};
        }
        .job-dates {
          font-style: italic;
          color: #718096;
          font-size: 14px;
          background: white;
          padding: 4px 8px;
          border-radius: 4px;
        }
        .job-bullets {
          margin-left: 20px;
        }
        .job-bullets li {
          margin-bottom: 8px;
          line-height: 1.5;
          position: relative;
        }
        .job-bullets li::marker {
          color: ${colors.primary};
        }
        .education-item {
          margin-bottom: 25px;
          padding: 20px;
          background: #f7fafc;
          border-radius: 8px;
          border-left: 4px solid ${colors.secondary};
        }
        .education-degree {
          font-weight: 600;
          font-size: 16px;
          color: ${colors.secondary};
          margin-bottom: 5px;
        }
        .education-school {
          color: ${colors.primary};
          font-weight: 600;
          margin-bottom: 5px;
        }
        .education-dates {
          font-style: italic;
          color: #718096;
          font-size: 14px;
        }
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        .skills-category {
          background: #f7fafc;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
        .skills-title {
          font-weight: 600;
          color: ${colors.primary};
          margin-bottom: 12px;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 1px;
        }
        .skills-list {
          color: #4a5568;
          line-height: 1.6;
        }
        .summary {
          background: #f7fafc;
          padding: 25px;
          border-radius: 8px;
          border-left: 4px solid ${colors.primary};
          font-size: 16px;
          line-height: 1.6;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="name">${resumeJson.name}</div>
        ${resumeJson.title ? `<div class="title">${resumeJson.title}</div>` : ''}
        <div class="contact">
          <span>${resumeJson.contact.email}</span>
          <span>${resumeJson.contact.phone}</span>
          <span>${resumeJson.contact.location}</span>
        </div>
      </div>
      
      ${resumeJson.sections.map((section: any) => {
        if (section.title === 'Professional Summary') {
          return `
            <div class="section">
              <div class="section-title">${section.title}</div>
              <div class="summary">${section.content}</div>
            </div>
          `
        } else if (section.title === 'Professional Experience') {
          return `
            <div class="section">
              <div class="section-title">${section.title}</div>
              ${section.jobs.map((job: any) => `
                <div class="job">
                  <div class="job-header">
                    <div>
                      <span class="job-title">${job.title}</span> - 
                      <span class="job-company">${job.company}</span>
                    </div>
                    <div class="job-dates">${job.dates}</div>
                  </div>
                  <ul class="job-bullets">
                    ${job.bullets.map((bullet: string) => `<li>${bullet}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
          `
        } else if (section.title === 'Education') {
          return `
            <div class="section">
              <div class="section-title">${section.title}</div>
              ${section.education.map((edu: any) => `
                <div class="education-item">
                  <div class="education-degree">${edu.degree}</div>
                  <div class="education-school">${edu.institution}</div>
                  <div class="education-dates">${edu.dates}</div>
                  ${edu.details ? `<div>${edu.details}</div>` : ''}
                </div>
              `).join('')}
            </div>
          `
        } else if (section.title === 'Skills') {
          return `
            <div class="section">
              <div class="section-title">${section.title}</div>
              <div class="skills-grid">
                ${Object.entries(section.categories).map(([category, skills]: [string, any]) => `
                  <div class="skills-category">
                    <div class="skills-title">${category}</div>
                    <div class="skills-list">${skills.join(', ')}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          `
        }
        return ''
      }).join('')}
    </body>
    </html>
  `
}

function generateCoverLetterTemplate(content: string, formData: FormData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Cover Letter - ${formData.name}</title>
      <style>
        body {
          font-family: 'Times New Roman', serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
        }
        .header {
          margin-bottom: 30px;
        }
        .sender-info {
          margin-bottom: 20px;
        }
        .sender-name {
          font-weight: bold;
          font-size: 16px;
        }
        .sender-details {
          font-size: 14px;
          color: #666;
          line-height: 1.4;
        }
        .date {
          margin-bottom: 20px;
          font-size: 14px;
        }
        .recipient-info {
          margin-bottom: 30px;
        }
        .recipient-name {
          font-weight: bold;
          font-size: 16px;
        }
        .recipient-details {
          font-size: 14px;
          color: #666;
          line-height: 1.4;
        }
        .salutation {
          margin-bottom: 20px;
          font-size: 16px;
        }
        .content {
          font-size: 14px;
          line-height: 1.8;
          text-align: justify;
          margin-bottom: 30px;
        }
        .closing {
          margin-bottom: 40px;
        }
        .signature {
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 5px;
        }
        .signature-title {
          font-size: 14px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="sender-info">
          <div class="sender-name">${formData.name}</div>
          <div class="sender-details">
            ${formData.email}<br>
            ${formData.phone || ''}<br>
            ${formData.location || ''}
          </div>
        </div>
        
        <div class="date">${new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</div>
        
        <div class="recipient-info">
          <div class="recipient-name">Hiring Manager</div>
          <div class="recipient-details">
            ${formData.company || 'Company Name'}<br>
            ${formData.jobTitle ? `${formData.jobTitle} Position` : 'Position'}<br>
            Company Address<br>
            City, State ZIP
          </div>
        </div>
      </div>
      
      <div class="salutation">Dear Hiring Manager,</div>
      
      <div class="content">
        ${content.split('\n').map(paragraph => 
          paragraph.trim() ? `<p>${paragraph}</p>` : ''
        ).join('')}
      </div>
      
      <div class="closing">
        <div>Sincerely,</div>
        <div class="signature">${formData.name}</div>
        ${formData.jobTitle ? `<div class="signature-title">${formData.jobTitle}</div>` : ''}
      </div>
    </body>
    </html>
  `
}

export async function POST(request: NextRequest) {
  try {
    console.log('PDF Generation API called')
    
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

    // Generate resume content using OpenAI
    console.log('Generating resume with OpenAI...')
    const resumePrompt = createResumePrompt(formData)
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
    console.log('Resume content generated, parsing JSON...')
    
    let resumeJson
    try {
      resumeJson = JSON.parse(resumeContent)
    } catch (parseError) {
      console.error('Failed to parse resume JSON:', parseError)
      return NextResponse.json(
        { success: false, error: 'Failed to generate resume content' },
        { status: 500 }
      )
    }

    // Ensure job title is included in the resume JSON if provided by user
    if (!resumeJson.title && formData.jobTitle && formData.jobTitle.trim()) {
      resumeJson.title = formData.jobTitle.trim()
    }

    // Create PDFs
    console.log('Creating PDF with template:', formData.template)
    const resumePdf = await createResumePDF(resumeJson, formData.template, formData.selectedColors)
    console.log('Resume PDF created, size:', resumePdf.length)
    
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

    // Return PDF data
    if (formData.coverLetter && coverLetterPdf) {
      return new NextResponse(coverLetterPdf, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${formData.name.replace(/\s+/g, '_')}_CoverLetter.pdf"`
        }
      })
    } else {
      return new NextResponse(resumePdf, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${formData.name.replace(/\s+/g, '_')}_Resume.pdf"`
        }
      })
    }

  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred while generating the PDF' },
      { status: 500 }
    )
  }
} 