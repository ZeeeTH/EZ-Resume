import React from 'react';
import { getTemplateById } from '../../data/templates/index';
import { FormData } from '../../types';

export default function ModernHtml({ data }: { data: FormData }) {
  const template = getTemplateById('modern')!;
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
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
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
              padding: 0 !important;
              background: white !important;
              color: #000 !important;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif !important;
              font-size: 12pt !important;
              line-height: 1.4 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              box-sizing: border-box !important;
              display: flex !important;
            }
            
            /* Two-column layout */
            .sidebar {
              width: 35% !important;
              background-color: ${styling.primaryColor} !important;
              color: white !important;
              padding: 20mm !important;
              display: flex !important;
              flex-direction: column !important;
              height: 297mm !important;
              box-sizing: border-box !important;
            }
            
            .main-content {
              width: 65% !important;
              padding: 20mm !important;
              box-sizing: border-box !important;
              height: 297mm !important;
              overflow: hidden !important;
            }
            
            /* Sidebar Typography */
            .sidebar h1 {
              font-family: 'Montserrat', Arial, sans-serif !important;
              font-size: 24pt !important;
              font-weight: 700 !important;
              line-height: 1.1 !important;
              margin: 0 0 12pt 0 !important;
              color: white !important;
            }
            
            .sidebar h2 {
              font-family: 'Montserrat', Arial, sans-serif !important;
              font-size: 14pt !important;
              font-weight: 400 !important;
              line-height: 1.3 !important;
              margin: 0 0 16pt 0 !important;
              color: white !important;
              text-transform: uppercase !important;
              letter-spacing: 2pt !important;
              opacity: 0.9 !important;
            }
            
            .sidebar h3 {
              font-family: 'Montserrat', Arial, sans-serif !important;
              font-size: 16pt !important;
              font-weight: 700 !important;
              line-height: 1.3 !important;
              margin: 24pt 0 12pt 0 !important;
              color: white !important;
              text-transform: uppercase !important;
              letter-spacing: 1pt !important;
            }
            
            .divider {
              width: 50pt !important;
              height: 3pt !important;
              background-color: white !important;
              margin: 16pt 0 !important;
            }
            
            .contact-item {
              margin-bottom: 10pt !important;
              font-size: 12pt !important;
              opacity: 0.9 !important;
              word-break: break-word !important;
            }
            
            /* Main content Typography */
            .main-content h3 {
              font-family: 'Montserrat', Arial, sans-serif !important;
              font-size: 16pt !important;
              font-weight: 700 !important;
              line-height: 1.3 !important;
              margin: 24pt 0 12pt 0 !important;
              color: ${styling.primaryColor} !important;
              border-bottom: 3pt solid ${styling.primaryColor} !important;
              padding-bottom: 6pt !important;
              text-transform: uppercase !important;
              letter-spacing: 1pt !important;
            }
            
            .main-content h3:first-child {
              margin-top: 0 !important;
            }
            
            p {
              font-size: 12pt !important;
              line-height: 1.4 !important;
              margin: 0 0 8pt 0 !important;
            }
            
            .job-item {
              margin-bottom: 24pt !important;
              page-break-inside: avoid !important;
            }
            
            .job-header {
              display: flex !important;
              justify-content: space-between !important;
              align-items: baseline !important;
              margin-bottom: 3pt !important;
            }
            
            .job-company {
              font-weight: 700 !important;
              font-size: 14pt !important;
              color: ${styling.primaryColor} !important;
            }
            
            .job-dates {
              font-size: 12pt !important;
              color: #666 !important;
              font-style: italic !important;
            }
            
            .job-title {
              font-size: 13pt !important;
              font-weight: 600 !important;
              margin-bottom: 8pt !important;
              color: #333 !important;
            }
            
            .bullet-list {
              margin: 0 !important;
              padding: 0 !important;
            }
            
            .bullet-item {
              margin-bottom: 5pt !important;
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
              color: ${styling.primaryColor} !important;
              font-weight: bold !important;
            }
            
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
            }
            
            .education-school {
              font-size: 13pt !important;
              color: #333 !important;
            }
            
            .skills-container {
              display: flex !important;
              flex-wrap: wrap !important;
              gap: 8pt !important;
            }
            
            .skill-tag {
              background-color: ${styling.primaryColor} !important;
              color: white !important;
              padding: 5pt 10pt !important;
              border-radius: 12pt !important;
              font-size: 11pt !important;
              font-weight: 500 !important;
              margin-bottom: 6pt !important;
            }
            
            .summary-text {
              font-size: 13pt !important;
              line-height: 1.6 !important;
              margin: 0 !important;
              opacity: 0.9 !important;
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
        {/* Sidebar */}
        <div className="sidebar">
          {/* Name and Title */}
          <div>
            <h1>{name}</h1>
            {jobTitle && <h2>{jobTitle}</h2>}
            <div className="divider"></div>
          </div>
          
          {/* Contact Info */}
          <div>
            {phone && <div className="contact-item">{phone}</div>}
            {email && <div className="contact-item">{email}</div>}
            {location && <div className="contact-item">{location}</div>}
          </div>
          
          {/* Summary */}
          {summary && (
            <div>
              <h3>Summary</h3>
              <p className="summary-text">{summary}</p>
            </div>
          )}
        </div>
        
        {/* Main Content */}
        <div className="main-content">
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
              <div className="skills-container">
                {skills.map((skill, i) => (
                  <span key={i} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </body>
    </html>
  );
}