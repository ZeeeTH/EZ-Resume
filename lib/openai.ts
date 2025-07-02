import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Import client-side utilities
import { FREE_TIER_LIMITS, checkAIUsage, AIContentResponse } from './ai-utils';

// Industry-specific AI prompts
const industryPrompts = {
  technology: {
    bulletPoint: (jobTitle: string, context: string, userInput: string) => `
Generate a professional resume bullet point for a ${jobTitle} in the Australian technology industry.

Context: ${context}
User's experience: ${userInput}

Requirements:
- Focus on technical impact and quantifiable results
- Use action verbs like: developed, architected, optimized, deployed, implemented, automated, scaled
- Include technical metrics where possible (performance gains, user numbers, system improvements)
- Emphasize innovation, problem-solving, and scalability
- Use Australian English spelling and terminology
- Make it ATS-friendly for Australian tech companies
- Keep it concise and impactful (1-2 lines max)

Generate ONE professional bullet point that would impress Australian tech hiring managers.
`,

    skills: (jobTitle: string) => `
Generate 8-10 relevant technical skills for a ${jobTitle} in the Australian technology industry.

Requirements:
- Include current, in-demand technologies for ${jobTitle}
- Mix of programming languages, frameworks, tools, and methodologies
- Focus on skills valued by Australian tech companies
- Include both technical and soft skills relevant to the role
- Format as a simple comma-separated list
- No explanations, just the skills

Example format: React, Node.js, Python, AWS, Docker, etc.
`,

    summary: (jobTitle: string, yearsExperience: string) => `
Write a professional summary for a ${jobTitle} with ${yearsExperience} years of experience applying for roles in the Australian technology industry.

Requirements:
- 3-4 sentences maximum
- Highlight technical expertise and leadership abilities
- Include measurable achievements where appropriate
- Emphasize innovation and technical problem-solving
- Use confident, professional tone suitable for Australian business culture
- Make it compelling for tech recruiters and hiring managers
- Use Australian English spelling

Focus on what makes this candidate valuable to Australian tech companies.
`
  },

  healthcare: {
    bulletPoint: (jobTitle: string, context: string, userInput: string) => `
Generate a professional resume bullet point for a ${jobTitle} in the Australian healthcare system.

Context: ${context}
User's experience: ${userInput}

Requirements:
- Focus on patient care excellence and clinical outcomes
- Use action verbs like: administered, coordinated, implemented, evaluated, monitored, treated, managed
- Emphasize patient safety, quality improvements, and healthcare protocols
- Include relevant metrics (patient volumes, satisfaction scores, efficiency improvements)
- Reference Australian healthcare standards and compliance
- Use professional medical terminology appropriate for the role
- Make it suitable for Australian hospitals, clinics, and healthcare organizations
- Keep it concise and professional (1-2 lines max)

Generate ONE bullet point that demonstrates clinical expertise and patient care commitment.
`,

    skills: (jobTitle: string) => `
Generate 8-10 relevant skills for a ${jobTitle} in the Australian healthcare system.

Requirements:
- Include clinical skills, healthcare software, and certifications relevant to ${jobTitle}
- Reference Australian healthcare systems and standards where appropriate
- Include both hard skills (medical procedures, software) and soft skills (communication, empathy)
- Focus on skills valued by Australian healthcare employers
- Format as a simple comma-separated list
- Consider AHPRA registration requirements if applicable

Example format: Patient Assessment, Electronic Health Records, Clinical Documentation, etc.
`,

    summary: (jobTitle: string, yearsExperience: string) => `
Write a professional summary for a ${jobTitle} with ${yearsExperience} years of experience in the Australian healthcare system.

Requirements:
- 3-4 sentences maximum
- Highlight clinical expertise and patient care philosophy
- Emphasize commitment to healthcare excellence and patient safety
- Reference Australian healthcare values and standards
- Use compassionate but professional tone
- Make it compelling for Australian healthcare recruiters
- Use Australian English spelling

Focus on dedication to quality patient care and professional healthcare standards.
`
  },

  finance: {
    bulletPoint: (jobTitle: string, context: string, userInput: string) => `
Generate a professional resume bullet point for a ${jobTitle} in the Australian finance and banking industry.

Context: ${context}
User's experience: ${userInput}

Requirements:
- Focus on financial performance, risk management, and strategic impact
- Use action verbs like: analyzed, managed, optimized, forecasted, reduced, increased, streamlined, audited
- Include specific financial metrics (ROI, cost savings, revenue growth, risk reduction percentages)
- Emphasize regulatory compliance and ethical financial practices
- Reference Australian financial regulations and standards where relevant
- Use precise financial terminology
- Make it suitable for major Australian banks and financial institutions
- Keep it professional and quantified (1-2 lines max)

Generate ONE bullet point that demonstrates financial expertise and measurable results.
`,

    skills: (jobTitle: string) => `
Generate 8-10 relevant skills for a ${jobTitle} in the Australian finance and banking industry.

Requirements:
- Include financial software, analytical methods, and industry knowledge for ${jobTitle}
- Reference Australian financial regulations and compliance requirements
- Include both technical skills (Excel, financial modeling) and soft skills (communication, ethics)
- Focus on skills valued by Australian financial institutions
- Consider major Australian banks' requirements (CBA, Westpac, ANZ, NAB)
- Format as a simple comma-separated list

Example format: Financial Analysis, Risk Management, Excel, Bloomberg Terminal, etc.
`,

    summary: (jobTitle: string, yearsExperience: string) => `
Write a professional summary for a ${jobTitle} with ${yearsExperience} years of experience in the Australian finance and banking industry.

Requirements:
- 3-4 sentences maximum
- Highlight analytical expertise and strategic thinking
- Emphasize attention to detail and ethical financial practices
- Reference understanding of Australian financial regulations
- Use conservative, professional tone suitable for banking culture
- Make it compelling for Australian financial sector recruiters
- Use Australian English spelling

Focus on financial acumen and commitment to regulatory compliance and ethical practices.
`
  },

  // Fallback for unspecified or universal
  universal: {
    bulletPoint: (jobTitle: string, context: string, userInput: string) => `
Generate a professional resume bullet point for a ${jobTitle}.
Context: ${context}
User's experience: ${userInput}
Make it professional, quantified where possible, and suitable for Australian employers.
Use Australian English spelling and professional tone.
`,
    skills: (jobTitle: string) => `
Generate 8-10 relevant professional skills for a ${jobTitle}.
Include both hard and soft skills appropriate for the role.
Format as comma-separated list.
`,
    summary: (jobTitle: string, yearsExperience: string) => `
Write a 3-4 sentence professional summary for a ${jobTitle} with ${yearsExperience} years of experience.
Highlight key strengths and achievements. Use Australian English spelling.
`
  }
};

// Get prompts for specific industry
export const getPromptsForIndustry = (industry: string) => {
  return industryPrompts[industry as keyof typeof industryPrompts] || industryPrompts.universal;
};

// Enhanced AI content generation for individual fields
export interface AIContentParams {
  contentType: 'bulletPoints' | 'skills' | 'summary';
  jobTitle: string;
  context?: string;
  userInput?: string;
  yearsExperience?: string;
  selectedIndustry?: string;
  userTier: 'free' | 'paid';
  currentUsage: number;
}



export async function generateAIContent(params: AIContentParams): Promise<AIContentResponse> {
  const { contentType, jobTitle, context, userInput, yearsExperience, selectedIndustry, userTier, currentUsage } = params;

  // Check usage limits for free users
  const usageCheck = checkAIUsage(contentType, currentUsage, userTier);
  
  if (!usageCheck.allowed) {
    return {
      success: false,
      error: 'usage_limit',
      message: `You've reached your ${contentType} generation limit. Upgrade to Professional ($49 AUD) for unlimited AI assistance.`,
      upgradePrompt: true
    };
  }

  // Get industry-specific prompt
  const industryPromptSet = getPromptsForIndustry(selectedIndustry || '');
  const promptType = contentType === 'bulletPoints' ? 'bulletPoint' : contentType;

  // Generate the prompt based on type
  let prompt: string;
  switch (promptType) {
    case 'bulletPoint':
      prompt = industryPromptSet.bulletPoint(jobTitle, context || '', userInput || '');
      break;
    case 'skills':
      prompt = industryPromptSet.skills(jobTitle);
      break;
    case 'summary':
      prompt = industryPromptSet.summary(jobTitle, yearsExperience || '3-5');
      break;
    default:
      return {
        success: false,
        error: 'invalid_type',
        message: 'Invalid content type requested.'
      };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional resume writer with expertise in creating compelling, ATS-friendly content. Always format responses in a clean, professional manner suitable for Australian employers."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: contentType === 'bulletPoints' ? 150 : contentType === 'skills' ? 200 : 300,
    });

    const content = completion.choices[0]?.message?.content || `Failed to generate ${contentType}`;

    return {
      success: true,
      content,
      remaining: userTier === 'paid' ? 'unlimited' : Math.max(0, (usageCheck.remaining as number) - 1),
      industry: selectedIndustry
    };

  } catch (error) {
    console.error('AI generation error:', error);
    return {
      success: false,
      error: 'api_error',
      message: 'AI generation failed. Please try again.'
    };
  }
}

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

  if (params.documentType === 'both') {
    results.coverLetter = await generateCoverLetter(params)
  }

  return results
} 