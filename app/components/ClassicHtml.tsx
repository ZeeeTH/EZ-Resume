import React from 'react';
import { getTemplateById } from '../../data/templates/index';
import { FormData } from '../../types';

export default function ClassicHtml({ data }: { data: FormData }) {
  const template = getTemplateById('classic')!;
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet" />
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
            
            /* Typography */
            h1 {
              font-family: 'Merriweather', Georgia, 'Times New Roman', serif !important;
              font-size: 24pt !important;
              font-weight: 700 !important;
              line-height: 1.2 !important;
              margin: 0 0 6pt 0 !important;
              color: ${styling.primaryColor} !important;
            }
            
            h2 {
              font-family: 'Lato', Arial, sans-serif !important;
              font-size: 16pt !important;
              font-weight: 400 !important;
              line-height: 1.3 !important;
              margin: 0 0 4pt 0 !important;
              color: ${styling.secondaryColor} !important;
            }
            
            h3 {
              font-family: 'Lato', Arial, sans-serif !important;
              font-size: 16pt !important;
              font-weight: 700 !important;
              line-height: 1.3 !important;
              margin: 20pt 0 8pt 0 !important;
              color: ${styling.primaryColor} !important;
              border-bottom: 2pt solid ${styling.primaryColor} !important;
              padding-bottom: 4pt !important;
              text-transform: uppercase !important;
              letter-spacing: 1pt !important;
            }
            
            p {
              font-size: 12pt !important;
              line-height: 1.4 !important;
              margin: 0 0 8pt 0 !important;
            }
            
            .contact-info {
              font-size: 12pt !important;
              color: ${styling.secondaryColor} !important;
              margin-bottom: 16pt !important;
            }
            
            .job-item {
              margin-bottom: 20pt !important;
              page-break-inside: avoid !important;
            }
            
            .job-header {
              display: flex !important;
              justify-content: space-between !important;
              align-items: baseline !important;
              margin-bottom: 2pt !important;
            }
            
            .job-company {
              font-weight: 600 !important;
              font-size: 13pt !important;
              color: ${styling.primaryColor} !important;
            }
            
            .job-dates {
              font-size: 12pt !important;
              color: ${styling.secondaryColor} !important;
              font-style: italic !important;
            }
            
            .job-title {
              font-size: 13pt !important;
              font-weight: 600 !important;
              margin-bottom: 6pt !important;
              color: #333 !important;
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
              line-height: 1.4 !important;
            }
            
            .bullet-item:before {
              content: "•" !important;
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              color: ${styling.primaryColor} !important;
            }
            
            .education-item {
              margin-bottom: 12pt !important;
            }
            
            .education-header {
              display: flex !important;
              justify-content: space-between !important;
              align-items: baseline !important;
            }
            
            .education-degree {
              font-weight: 600 !important;
              font-size: 13pt !important;
              color: ${styling.primaryColor} !important;
              margin-bottom: 2pt !important;
            }
            
            .education-school {
              font-size: 12pt !important;
              color: #333 !important;
            }
            
            .skills-grid {
              display: grid !important;
              grid-template-columns: 1fr 1fr !important;
              gap: 20pt !important;
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
          <div className="contact-info">
            {phone && <span>{phone}</span>}
            {phone && email && <span> • </span>}
            {email && <span>{email}</span>}
            {(phone || email) && location && <span> • </span>}
            {location && <span>{location}</span>}
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div className="section">
            <h3>Summary</h3>
            <p>{summary}</p>
          </div>
        )}

        {/* Professional Experience */}
        {workExperience && workExperience.length > 0 && (
          <div className="section">
            <h3>Professional Experience</h3>
            {workExperience.map((job, i) => (
              <div key={i} className="job-item">
                <div className="job-header">
                  <div className="job-company">{job.company}</div>
                  <div className="job-dates">{job.dates}</div>
                </div>
                <div className="job-title">{job.title}</div>
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
                  <div>
                    <div className="education-degree">{edu.degree}</div>
                    <div className="education-school">{edu.institution}</div>
                  </div>
                  <div className="job-dates">{edu.dates}</div>
                </div>
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