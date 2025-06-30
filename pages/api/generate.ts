import type { NextApiRequest, NextApiResponse } from 'next';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ResumeHtml from '../../app/components/ResumeHtml';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const formData = req.body;
    // Render the resume HTML using the new ResumeHtml component
    const resumeHtml = ReactDOMServer.renderToStaticMarkup(
      React.createElement(ResumeHtml, { data: formData })
    );

    // Call the Puppeteer PDF service
    const response = await fetch('https://puppeteer-pdf-service-981431761351.us-central1.run.app/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html: resumeHtml }),
    });

    if (!response.ok) {
      res.status(500).send('Failed to generate PDF');
      return;
    }

    const pdfBuffer = Buffer.from(await response.arrayBuffer());
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
    res.status(200).send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: (error as Error).message });
  }
} 