import type { NextApiRequest, NextApiResponse } from 'next';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ResumeHtml from '../../app/components/ResumeHtml';
import CoverLetterHtml from '../../app/components/CoverLetterHtml';
import nodemailer from 'nodemailer';
import OpenAI from 'openai';
import ClassicHtml from '../../app/components/ClassicHtml';
import ModernHtml from '../../app/components/ModernHtml';
import StructuredHtml from '../../app/components/StructuredHtml';

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
        <div class="brand-title">EZ Resume</div>
      </div>
      <h1>🎉 Your New Resume is Ready!</h1>
      <p>Hi <b>${name}</b>,</p>
      <p>Thank you for using <b>EZ Resume</b>! Your professionally formatted resume${coverLetterText} is attached to this email as a PDF.</p>
      <a class="button" href="#" style="pointer-events: none;">Download is attached</a>
      <p><b>What's next?</b><br>- Review your resume${coverLetter ? ' and cover letter' : ''}.<br>- Reply to this email if you need a revision or have questions.<br>- Good luck with your job search!</p>
      <div class="footer">&copy; ${year} EZ Resume &mdash; <a href="https://ezresume.com" style="color:#a21caf;text-decoration:none;">ezresume.com</a></div>
    </div>
  </body>
</html>`;
}

async function generateCoverLetterText(formData: any): Promise<string> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = `Create a compelling cover letter for ${formData.name} applying for a ${formData.jobTitle} position at ${formData.company}.

Personal Information:
- Name: ${formData.name}
- Email: ${formData.email}
${formData.phone ? `- Phone: ${formData.phone}` : ''}

Target Position: ${formData.jobTitle} at ${formData.company}

Work Experience: ${formData.workExperience?.map((job: any) => `${job.title} at ${job.company} (${job.startMonth} ${job.startYear} - ${job.endMonth} ${job.endYear}): ${job.description}`).join('; ') || ''}

Education: ${formData.education?.map((edu: any) => `${edu.degree} from ${edu.school} (${edu.startMonth} ${edu.startYear} - ${edu.endMonth} ${edu.endYear})`).join('; ') || ''}

Skills: ${formData.skills}

Please create a professional cover letter that:
1. Opens with a strong hook that shows enthusiasm for the position
2. Explains why the candidate is interested in the specific company
3. Highlights relevant experience and skills that match the job requirements
4. Demonstrates understanding of the role and company
5. Closes with a call to action and contact information
6. Is personalized and specific to the target company
7. Maintains a professional yet engaging tone

Format the cover letter in a standard business letter format with proper spacing and structure.`;
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a professional cover letter writer.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 1500,
  });
  return completion.choices[0]?.message?.content || 'Failed to generate cover letter';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const formData = req.body;
    // Render the resume HTML using the correct template component
    let ResumeComponent: any;
    switch (formData.template) {
      case 'modern':
        ResumeComponent = ModernHtml;
        break;
      case 'structured':
        ResumeComponent = StructuredHtml;
        break;
      case 'classic':
      default:
        ResumeComponent = ClassicHtml;
        break;
    }
    const resumeHtml = ReactDOMServer.renderToStaticMarkup(
      React.createElement(ResumeComponent, { data: formData })
    );

    // Call the Puppeteer PDF service for resume
    const resumeResponse = await fetch('https://puppeteer-pdf-service-981431761351.us-central1.run.app/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html: resumeHtml }),
    });

    if (!resumeResponse.ok) {
      res.status(500).json({ error: 'Failed to generate PDF' });
      return;
    }

    const resumePdfBuffer = Buffer.from(await resumeResponse.arrayBuffer());

    let coverLetterPdfBuffer: Buffer | null = null;
    let coverLetterText = '';
    if (formData.coverLetter && formData.company && formData.jobTitle) {
      // Generate cover letter text
      coverLetterText = await generateCoverLetterText(formData);
      // Render cover letter HTML
      const coverLetterHtml = ReactDOMServer.renderToStaticMarkup(
        React.createElement(CoverLetterHtml, { content: coverLetterText, data: formData })
      );
      // Call the Puppeteer PDF service for cover letter
      const coverLetterResponse = await fetch('https://puppeteer-pdf-service-981431761351.us-central1.run.app/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: coverLetterHtml }),
      });
      if (coverLetterResponse.ok) {
        coverLetterPdfBuffer = Buffer.from(await coverLetterResponse.arrayBuffer());
      }
    }

    // Create FirstLast filename format
    const name = formData.name || 'Resume';
    const firstName = name.split(' ')[0] || 'Resume';
    const lastName = name.split(' ').slice(1).join('') || 'Document';
    const fileName = `${firstName}${lastName}`;

    // Send the PDF(s) as an email attachment to the user
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const attachments = [
      {
        filename: `${fileName}_Resume.pdf`,
        content: resumePdfBuffer,
        contentType: 'application/pdf',
      },
    ];
    if (coverLetterPdfBuffer) {
      attachments.push({
        filename: `${fileName}_CoverLetter.pdf`,
        content: coverLetterPdfBuffer,
        contentType: 'application/pdf',
      });
    }

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: formData.email,
      subject: formData.coverLetter ? 'Your Professional Documents - EZ Resume' : 'Your Professional Resume - EZ Resume',
      html: buildEmailHtml({ name, coverLetter: !!coverLetterPdfBuffer }),
      attachments,
    });

    res.status(200).json({ success: true, message: 'Resume generated and emailed successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: (error as Error).message });
  }
} 