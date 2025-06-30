import React from 'react';
import { FormData } from '../../types';

export default function ResumeHtml({ data }: { data: FormData }) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Resume - {data.name}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />
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
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif !important;
              font-size: 12pt !important;
              line-height: 1.4 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              box-sizing: border-box !important;
            }
            
            h1 {
              font-size: 28pt !important;
              font-weight: 700 !important;
              line-height: 1.2 !important;
              margin: 0 0 6pt 0 !important;
              color: #222 !important;
            }
            
            h2 {
              font-size: 18pt !important;
              font-weight: 400 !important;
              line-height: 1.3 !important;
              margin: 0 0 8pt 0 !important;
              color: #222 !important;
            }
            
            h3 {
              font-size: 16pt !important;
              font-weight: 700 !important;
              line-height: 1.3 !important;
              margin: 20pt 0 8pt 0 !important;
              color: #222 !important;
            }
            
            p {
              font-size: 12pt !important;
              line-height: 1.4 !important;
              margin: 0 0 8pt 0 !important;
            }
            
            .contact-info {
              font-size: 12pt !important;
              margin-bottom: 12pt !important;
            }
            
            .section {
              margin-bottom: 20pt !important;
            }
            
            .job-item {
              margin-bottom: 12pt !important;
            }
            
            .job-title {
              font-weight: 600 !important;
              margin-bottom: 2pt !important;
            }
            
            .job-company {
              font-weight: 600 !important;
            }
            
            .job-dates {
              font-size: 11pt !important;
              color: #666 !important;
              margin-bottom: 4pt !important;
            }
            
            .skills-list {
              list-style: disc inside !important;
              columns: 2 !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            
            .skills-list li {
              margin-bottom: 4pt !important;
              font-size: 12pt !important;
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
        <h1>{data.name}</h1>
        {data.jobTitle && <h2>{data.jobTitle}</h2>}
        
        <div className="contact-info">
          {data.phone && <span>{data.phone}</span>}
          {data.phone && data.email && <span> • </span>}
          {data.email && <span>{data.email}</span>}
          {(data.phone || data.email) && data.location && <span> • </span>}
          {data.location && <span>{data.location}</span>}
        </div>

        {data.personalSummary && (
          <div className="section">
            <p style={{ fontStyle: 'italic' }}>{data.personalSummary}</p>
          </div>
        )}

        <div className="section">
          <h3>Skills</h3>
          <ul className="skills-list">
            {data.skills.split(',').map((skill, i) => (
              <li key={i}>{skill.trim()}</li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h3>Achievements</h3>
          <p>{data.achievements}</p>
        </div>

        <div className="section">
          <h3>Work Experience</h3>
          {data.workExperience.map((exp, i) => (
            <div key={i} className="job-item">
              <div className="job-title">{exp.title} at {exp.company}</div>
              <div className="job-dates">{exp.startMonth} {exp.startYear} - {exp.endMonth} {exp.endYear}</div>
              <div>{exp.description}</div>
            </div>
          ))}
        </div>

        <div className="section">
          <h3>Education</h3>
          {data.education.map((edu, i) => (
            <div key={i} className="job-item">
              <div className="job-title">{edu.degree} at {edu.school}</div>
              <div className="job-dates">{edu.startMonth} {edu.startYear} - {edu.endMonth} {edu.endYear}</div>
            </div>
          ))}
        </div>
      </body>
    </html>
  );
} 