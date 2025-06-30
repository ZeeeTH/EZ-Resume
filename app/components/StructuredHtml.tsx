import React from 'react';
import { getTemplateById } from '../../data/templates/index';
import { FormData } from '../../types';

export default function StructuredHtml({ data }: { data: FormData }) {
  const template = getTemplateById('structured')!;
  const { styling, fonts } = template;
  
  // Normalize work experience - only use user data
  const workExperience = data.workExperience?.length
    ? data.workExperience.map(job => ({
        company: job.company,
        title: job.title,
        dates: job.startMonth && job.startYear && job.endMonth && job.endYear
          ? `${job.startMonth} ${job.startYear} – ${job.endMonth} ${job.endYear}`
          : '',
        bullets: job.description
          ? job.description.split('.').filter(Boolean).map(s => s.trim() + '.')
          : [],
      }))
    : [];

  // Normalize education - only use user data
  const education = data.education?.length
    ? data.education.map(edu => ({
        degree: edu.degree,
        institution: edu.school,
        dates: edu.endMonth && edu.endYear ? `${edu.endMonth} ${edu.endYear}` : '',
      }))
    : [];

  // Normalize skills - only use user data
  const skills = data.skills
    ? data.skills.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  // Only use user data, no fallbacks to sample data
  const name = data.name || '';
  const jobTitle = data.jobTitle || '';
  const phone = data.phone || '';
  const email = data.email || '';
  const location = data.location || '';
  const summary = data.personalSummary || '';

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Resume - {name}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{
          __html: `
            /* A4 Print Styles - Exact dimensions for consistent PDF output */
            * {
              box-sizing: border-box !important;
            }
            
            html {
              width: 210mm !important;
              height: 297mm !important;
              margin: 0 !important;
              padding: 0 !important;
              font-size: 12pt !important;
              line-height: 1.4 !important;
            }
            
            body {
              width: 210mm !important;
              height: 297mm !important;
              margin: 0 !important;
              padding: 20mm !important;
              background: white !important;
              color: #000 !important;
              font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif !important;
              font-size: 12pt !important;
              line-height: 1.4 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              box-sizing: border-box !important;
            }
            
            /* Header Styles */
            .header {
              text-align: center !important;
              margin-bottom: 24pt !important;
              border-bottom: 2pt solid ${styling.primaryColor} !important;
              padding-bottom: 16pt !important;
            }
            
            h1 {
              font-family: 'Lora', Georgia, 'Times New Roman', serif !important;
              font-size: 28pt !important;
              font-weight: 700 !important;
              line-height: 1.2 !important;
              margin: 0 0 6pt 0 !important;
              color: ${styling.primaryColor} !important;
            }
            
            h2 {
              font-family: 'Lato', Arial, sans-serif !important;
              font-size: 14pt !important;
              font-weight: 400 !important;
              line-height: 1.3 !important;
              margin: 0 0 12pt 0 !important;
              color: ${styling.primaryColor} !important;
              text-transform: uppercase !important;
              letter-spacing: 2pt !important;
            }
            
            .divider {
              width: 100% !important;
              height: 1pt !important;
              background-color: ${styling.primaryColor} !important;
              margin: 12pt 0 !important;
              opacity: 0.5 !important;
            }
            
            .contact-info {
              font-size: 12pt !important;
              color: ${styling.primaryColor} !important;
              display: flex !important;
              justify-content: center !important;
              align-items: center !important;
              gap: 8pt !important;
              flex-wrap: wrap !important;
            }
            
            /* Section Styles */
            h3 {
              font-family: 'Lato', Arial, sans-serif !important;
              font-size: 18pt !important;
              font-weight: 700 !important;
              line-height: 1.3 !important;
              margin: 24pt 0 12pt 0 !important;
              color: ${styling.primaryColor} !important;
              border-bottom: 3pt solid ${styling.primaryColor} !important;
              padding-bottom: 6pt !important;
              text-transform: uppercase !important;
              letter-spacing: 1pt !important;
            }
            
            p {
              font-size: 12pt !important;
              line-height: 1.4 !important;
              margin: 0 0 8pt 0 !important;
            }
            
            .summary {
              text-align: center !important;
              margin-bottom: 24pt !important;
            }
            
            .summary p {
              font-size: 13pt !important;
              line-height: 1.6 !important;
              color: #333 !important;
              font-style: italic !important;
              max-width: 500pt !important;
              margin: 0 auto !important;
            }
            
            /* Job Styles */
            .job-item {
              margin-bottom: 24pt !important;
              page-break-inside: avoid !important;
            }
            
            .job-company {
              font-weight: 700 !important;
              font-size: 14pt !important;
              color: ${styling.primaryColor} !important;
              text-transform: uppercase !important;
              margin-bottom: 3pt !important;
            }
            
            .job-header {
              display: flex !important;
              justify-content: space-between !important;
              align-items: baseline !important;
              margin-bottom: 8pt !important;
            }
            
            .job-title {
              font-size: 13pt !important;
              font-weight: 600 !important;
              color: #333 !important;
            }
            
            .job-dates {
              font-size: 12pt !important;
              color: #666 !important;
              font-style: italic !important;
            }
            
            .bullet-list {
              margin: 0 !important;
              padding: 0 !important;
            }
            
            .bullet-item {
              margin-bottom: 4pt !important;
              padding-left: 12pt !important;
              position: relative !important;
              font-size: 12pt !important;
              line-height: 1.5 !important;
              color: #333 !important;
            }
            
            .bullet-item:before {
              content: "•" !important;
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              color: #333 !important;
            }
            
            /* Education Styles */
            .education-item {
              margin-bottom: 16pt !important;
            }
            
            .education-header {
              display: flex !important;
              justify-content: space-between !important;
              align-items: baseline !important;
              margin-bottom: 3pt !important;
            }
            
            .education-degree {
              font-weight: 700 !important;
              font-size: 14pt !important;
              color: ${styling.primaryColor} !important;
              text-transform: uppercase !important;
            }
            
            .education-school {
              font-size: 13pt !important;
              color: #333 !important;
            }
            
            /* Skills Styles */
            .skills-grid {
              display: grid !important;
              grid-template-columns: 1fr 1fr !important;
              gap: 12pt !important;
            }
            
            .skill-item {
              margin-bottom: 4pt !important;
              padding-left: 12pt !important;
              position: relative !important;
              font-size: 12pt !important;
            }
            
            .skill-item:before {
              content: "•" !important;
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              color: ${styling.primaryColor} !important;
            }
            
            @media print {
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          `
        }} />
      </head>
      <body>
        {/* Header */}
        <div className="header">
          <h1>{name}</h1>
          {jobTitle && <h2>{jobTitle}</h2>}
          <div className="divider"></div>
          <div className="contact-info">
            {phone && <span>{phone}</span>}
            {phone && email && <span>•</span>}
            {email && <span>{email}</span>}
            {(phone || email) && location && <span>•</span>}
            {location && <span>{location}</span>}
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div className="summary">
            <p>{summary}</p>
          </div>
        )}

        {/* Professional Experience */}
        {workExperience && workExperience.length > 0 && (
          <div className="section">
            <h3>Professional Experience</h3>
            {workExperience.map((job, i) => (
              <div key={i} className="job-item">
                <div className="job-company">{job.company}</div>
                <div className="job-header">
                  <div className="job-title">{job.title}</div>
                  <div className="job-dates">{job.dates}</div>
                </div>
                <div className="bullet-list">
                  {job.bullets.map((bullet, idx) => (
                    <div key={idx} className="bullet-item">
                      {bullet}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div className="section">
            <h3>Education</h3>
            {education.map((edu, i) => (
              <div key={i} className="education-item">
                <div className="education-header">
                  <div className="education-degree">{edu.degree}</div>
                  <div className="job-dates">{edu.dates}</div>
                </div>
                <div className="education-school">{edu.institution}</div>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="section">
            <h3>Skills</h3>
            <div className="skills-grid">
              {skills.map((skill, i) => (
                <div key={i} className="skill-item">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}
      </body>
    </html>
  );
}