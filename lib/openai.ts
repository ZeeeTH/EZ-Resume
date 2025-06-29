import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface GenerateDocumentParams {
  name: string
  email: string
  phone?: string
  jobTitle: string
  company: string
  experience: string
  education: string
  skills: string
  documentType: 'resume' | 'both'
  formData: any
  template: string
  colorVariant?: number
  selectedColors?: any
}

export async function generateResume(params: GenerateDocumentParams): Promise<string> {
  const prompt = `Create a professional resume for ${params.name} applying for a ${params.jobTitle} position at ${params.company}.

Personal Information:
- Name: ${params.name}
- Email: ${params.email}
${params.phone ? `- Phone: ${params.phone}` : ''}

Target Position: ${params.jobTitle} at ${params.company}

Work Experience: ${params.experience}

Education: ${params.education}

Skills: ${params.skills}

Please create a professional, well-formatted resume that:
1. Highlights relevant experience and achievements
2. Uses strong action verbs and quantifiable results
3. Is tailored to the specific job title and company
4. Follows modern resume formatting standards
5. Is concise but comprehensive
6. Includes all provided information in an organized manner

Format the resume in a clean, professional layout with clear sections.`

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a professional resume writer with expertise in creating compelling, ATS-friendly resumes. Always format responses in a clean, professional manner."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 2000,
  })

  return completion.choices[0]?.message?.content || 'Failed to generate resume'
}

export async function generateCoverLetter(params: GenerateDocumentParams): Promise<string> {
  const prompt = `Create a compelling cover letter for ${params.name} applying for a ${params.jobTitle} position at ${params.company}.

Personal Information:
- Name: ${params.name}
- Email: ${params.email}
${params.phone ? `- Phone: ${params.phone}` : ''}

Target Position: ${params.jobTitle} at ${params.company}

Work Experience: ${params.experience}

Education: ${params.education}

Skills: ${params.skills}

Please create a professional cover letter that:
1. Opens with a strong hook that shows enthusiasm for the position
2. Explains why the candidate is interested in the specific company
3. Highlights relevant experience and skills that match the job requirements
4. Demonstrates understanding of the role and company
5. Closes with a call to action and contact information
6. Is personalized and specific to the target company
7. Maintains a professional yet engaging tone

Format the cover letter in a standard business letter format with proper spacing and structure.`

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a professional cover letter writer with expertise in creating compelling, personalized cover letters that help candidates stand out."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 1500,
  })

  return completion.choices[0]?.message?.content || 'Failed to generate cover letter'
}

export async function generateDocuments(params: GenerateDocumentParams): Promise<{
  resume?: string
  coverLetter?: string
}> {
  const results: { resume?: string; coverLetter?: string } = {}

  if (params.documentType === 'resume' || params.documentType === 'both') {
    results.resume = await generateResume(params)
  }

  if (params.documentType === 'cover-letter' || params.documentType === 'both') {
    results.coverLetter = await generateCoverLetter(params)
  }

  return results
} 