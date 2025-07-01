import React from 'react';
import { getTemplateById } from '../../data/templates/index';
import { FormData } from '../../types';

export default function ClassicHtml({ data, selectedColors }: { data: FormData; selectedColors?: { primary: string; secondary: string } }) {
  // Get the template configuration
  const template = getTemplateById('classic');
  
  // Extract styling values safely - handle both selectedColors and template styling formats
  const styling = {
    primaryColor: selectedColors?.primary || template?.styling?.primaryColor || '#1F8072',
    secondaryColor: selectedColors?.secondary || template?.styling?.secondaryColor || '#4B5563'
  };
  
  const fonts = template?.fonts || { header: 'Merriweather', section: 'Lato', body: 'Lato' };

  // Generate CSS safely without template literals
  const generateCSS = () => {
    const primaryColor = styling.primaryColor || '#1F8072';
    
    // A4 Print Styles - Optimized for single page
    return '* { box-sizing: border-box !important; }' +
      'html { width: 210mm !important; height: 297mm !important; margin: 0 !important; padding: 0 !important; font-size: 10pt !important; line-height: 1.3 !important; }' +
      'body { width: 210mm !important; height: 297mm !important; margin: 0 !important; padding: 12mm !important; background: white !important; color: #000 !important; font-family: "Lato", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif !important; font-size: 10pt !important; line-height: 1.3 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box !important; }' +
      'h1 { font-family: "Merriweather", Georgia, "Times New Roman", serif !important; font-size: 29pt !important; font-weight: 700 !important; line-height: 1.1 !important; margin: 0 0 4pt 0 !important; color: ' + primaryColor + ' !important; text-transform: uppercase !important; letter-spacing: 2pt !important; }' +
      'h2 { font-family: "Merriweather", Georgia, "Times New Roman", serif !important; font-size: 14pt !important; font-weight: 600 !important; line-height: 1.2 !important; margin: 0 0 10pt 0 !important; color: #666 !important; text-transform: uppercase !important; letter-spacing: 1pt !important; }' +
      'h3 { font-family: "Merriweather", Georgia, "Times New Roman", serif !important; font-size: 12pt !important; font-weight: 700 !important; line-height: 1.3 !important; margin: 18pt 0 4pt 0 !important; color: ' + primaryColor + ' !important; text-transform: uppercase !important; letter-spacing: 1pt !important; }' +
      'h3.first-section { margin-top: 12pt !important; }' +
      'p { font-size: 10pt !important; line-height: 1.3 !important; margin: 0 0 6pt 0 !important; }' +
      '.contact-info { font-size: 10pt !important; color: #666 !important; margin-bottom: 14pt !important; line-height: 1.5 !important; }' +
      '.contact-line { margin-bottom: 3pt !important; }' +
      '.header { margin-bottom: 8pt !important; }' +
      '.contact-separator { border-bottom: 2pt solid #ddd !important; margin: 12pt 0 12pt 0 !important; width: 100% !important; height: 0 !important; }' +
      '.job-item { margin-bottom: 12pt !important; page-break-inside: avoid !important; }' +
      '.job-title-line { margin-bottom: 2pt !important; }' +
      '.job-title-with-bullet { display: flex !important; align-items: center !important; gap: 8pt !important; }' +
      '.job-bullet { width: 6pt !important; height: 6pt !important; background: ' + primaryColor + ' !important; flex-shrink: 0 !important; }' +
      '.job-title { font-weight: 700 !important; font-size: 11pt !important; color: #333 !important; }' +
      '.job-company { color: ' + primaryColor + ' !important; font-weight: 600 !important; }' +
      '.job-location-dates { display: flex !important; justify-content: space-between !important; align-items: baseline !important; font-size: 10pt !important; color: #666 !important; margin-bottom: 8pt !important; margin-left: 14pt !important; }' +
      '.job-location { font-size: 10pt !important; color: ' + primaryColor + ' !important; font-weight: 600 !important; }' +
      '.job-dates { font-size: 10pt !important; color: #666 !important; font-style: italic !important; }' +
      '.bullet-list { margin: 0 !important; padding: 0 !important; display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 8pt 16pt !important; }' +
      '.bullet-item { margin-bottom: 6pt !important; padding-left: 12pt !important; position: relative !important; font-size: 9pt !important; line-height: 1.4 !important; break-inside: avoid !important; }' +
      '.bullet-item:before { content: "•" !important; position: absolute !important; left: 0 !important; top: 0 !important; color: ' + primaryColor + ' !important; font-weight: bold !important; }' +
      '.education-item { margin-bottom: 10pt !important; }' +
      '.education-title-with-bullet { display: flex !important; align-items: center !important; gap: 8pt !important; margin-bottom: 2pt !important; }' +
      '.education-bullet { width: 6pt !important; height: 6pt !important; background: ' + primaryColor + ' !important; flex-shrink: 0 !important; }' +
      '.education-degree { font-weight: 700 !important; font-size: 11pt !important; color: #333 !important; }' +
      '.education-school { font-size: 10pt !important; color: #666 !important; }' +
      '.education-dates { font-size: 10pt !important; color: #666 !important; font-style: italic !important; }' +
      '.education-details { font-size: 10pt !important; color: #666 !important; display: flex !important; justify-content: space-between !important; }' +
      '.skills-grid { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 6pt 16pt !important; margin-top: 6pt !important; }' +
      '.skill-item { margin-bottom: 4pt !important; padding-left: 12pt !important; position: relative !important; font-size: 9pt !important; line-height: 1.3 !important; }' +
      '.skill-item:before { content: "•" !important; position: absolute !important; left: 0 !important; top: 0 !important; color: ' + primaryColor + ' !important; }' +
      '@media print { * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } }';
  };

  // Validate and ensure data is properly structured
  if (!data || typeof data !== 'object') {
    return '<html><body><p>Error: Invalid data provided to template</p></body></html>';
  }

  // Normalize work experience - only use user data
  const workExperience = data.workExperience?.length
    ? data.workExperience.map(job => ({
        company: job.company,
        title: job.title,
        dates: job.startMonth && job.startYear
          ? job.startMonth + ' ' + job.startYear + ' – ' + (job.endMonth && job.endYear ? job.endMonth + ' ' + job.endYear : 'Present')
          : '',
        bullets: job.description
          ? job.description.split('.').filter(Boolean).map(s => s.trim() + '.').slice(0, 3) // Limit to 3 bullets
          : [],
      }))
    : [];

  // Normalize education - only use user data
  const education = data.education?.length
    ? data.education.map(edu => ({
        degree: edu.degree,
        institution: edu.school,
        dates: edu.endMonth && edu.endYear ? edu.endMonth + ' ' + edu.endYear : '',
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

  // Generate complete HTML as string - no JSX to avoid React rendering issues
  const htmlContent = 
    '<html>' +
      '<head>' +
        '<meta charset="utf-8" />' +
        '<meta name="viewport" content="width=device-width, initial-scale=1" />' +
        '<title>Resume - ' + name + '</title>' +
        '<link rel="preconnect" href="https://fonts.googleapis.com" />' +
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />' +
        '<link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />' +
        '<link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet" />' +
        '<link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet" />' +
        '<style>' + generateCSS() + '</style>' +
      '</head>' +
      '<body>' +
        '<!-- Header -->' +
        '<div class="header">' +
          '<h1>' + name + '</h1>' +
          (jobTitle ? '<h2>' + jobTitle + '</h2>' : '') +
          
          '<!-- Contact Information -->' +
          '<div class="contact-info">' +
            '<div class="contact-line">' +
              [phone, email, location].filter(Boolean).join('     |     ') +
            '</div>' +
          '</div>' +
          
          '<!-- Contact separator line -->' +
          '<div class="contact-separator"></div>' +
        '</div>' +

        '<!-- Professional Summary -->' +
        (summary ? 
          '<div>' +
            '<h3 class="first-section">Professional Summary</h3>' +
            '<p>' + summary + '</p>' +
          '</div>'
          : '') +

        '<!-- Work Experience -->' +
        (workExperience.length > 0 ? 
          '<div>' +
            '<h3>Professional Experience</h3>' +
            workExperience.map((job, index) => 
              '<div class="job-item">' +
                '<!-- Job title with bullet -->' +
                '<div class="job-title-line">' +
                  '<div class="job-title-with-bullet">' +
                    '<div class="job-bullet"></div>' +
                    '<span class="job-title">' + job.title + '</span>' +
                  '</div>' +
                '</div>' +
                
                '<!-- Company and Dates on separate line, aligned -->' +
                '<div class="job-location-dates">' +
                  '<span class="job-location">' + job.company + '</span>' +
                  '<span class="job-dates">' + job.dates + '</span>' +
                '</div>' +
                
                '<!-- Job description bullets -->' +
                (job.bullets.length > 0 ? 
                  '<div class="bullet-list">' +
                    job.bullets.map(bullet => 
                      '<div class="bullet-item">' +
                        bullet +
                      '</div>'
                    ).join('') +
                  '</div>'
                  : '') +
              '</div>'
            ).join('') +
          '</div>'
          : '') +

        '<!-- Education -->' +
        (education.length > 0 ? 
          '<div>' +
            '<h3>Education</h3>' +
            education.map((edu, index) => 
              '<div class="education-item">' +
                '<div class="education-title-with-bullet">' +
                  '<div class="education-bullet"></div>' +
                  '<span class="education-degree">' + edu.degree + '</span>' +
                '</div>' +
                '<div class="education-details">' +
                  '<span class="education-school">' + edu.institution + '</span>' +
                  '<span class="education-dates">' + edu.dates + '</span>' +
                '</div>' +
              '</div>'
            ).join('') +
          '</div>'
          : '') +

        '<!-- Skills -->' +
        (skills.length > 0 ? 
          '<div>' +
            '<h3>Key Skills</h3>' +
            '<div class="skills-grid">' +
              skills.map(skill => 
                '<div class="skill-item">' +
                  skill +
                '</div>'
              ).join('') +
            '</div>' +
          '</div>'
          : '') +
      '</body>' +
    '</html>';

  return htmlContent;
}