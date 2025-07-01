import React from 'react';
import { getTemplateById } from '../../data/templates/index';
import { FormData } from '../../types';

export default function StructuredHtml({ data, selectedColors }: { data: FormData; selectedColors?: { primary: string; secondary: string } }) {
  const template = getTemplateById('structured')!;
  const { fonts } = template;
  const defaultStyling = template.styling;
  
  // Extract styling values safely - handle both selectedColors and template styling formats
  const styling = {
    primaryColor: selectedColors?.primary || template?.styling?.primaryColor || '#374151',
    secondaryColor: selectedColors?.secondary || template?.styling?.secondaryColor || '#6B7280'
  };

  // Generate CSS safely without template literals
  const generateCSS = () => {
    const primaryColor = styling.primaryColor || '#374151';
    
    return '* { box-sizing: border-box !important; }' +
      'html { width: 210mm !important; height: 297mm !important; margin: 0 !important; padding: 0 !important; font-size: 12pt !important; line-height: 1.4 !important; }' +
      'body { width: 210mm !important; height: 297mm !important; margin: 0 !important; padding: 20mm !important; background: white !important; color: #000 !important; font-family: "Lato", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif !important; font-size: 12pt !important; line-height: 1.4 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box !important; }' +
      '.header { text-align: center !important; margin-bottom: 24pt !important; border-bottom: 2pt solid ' + primaryColor + ' !important; padding-bottom: 16pt !important; }' +
      'h1 { font-family: "Lora", Georgia, "Times New Roman", serif !important; font-size: 31pt !important; font-weight: 700 !important; line-height: 1.2 !important; margin: 0 0 6pt 0 !important; color: ' + primaryColor + ' !important; }' +
      'h2 { font-family: "Lato", Arial, sans-serif !important; font-size: 15pt !important; font-weight: 400 !important; line-height: 1.3 !important; margin: 0 0 12pt 0 !important; color: ' + primaryColor + ' !important; text-transform: uppercase !important; letter-spacing: 2pt !important; }' +
      '.divider { width: 100% !important; height: 1pt !important; background-color: ' + primaryColor + ' !important; margin: 12pt 0 !important; opacity: 0.5 !important; }' +
      '.contact-info { font-size: 12pt !important; color: ' + primaryColor + ' !important; display: flex !important; justify-content: center !important; align-items: center !important; gap: 8pt !important; flex-wrap: wrap !important; }' +
      'h3 { font-family: "Lato", Arial, sans-serif !important; font-size: 20pt !important; font-weight: 700 !important; line-height: 1.3 !important; margin: 24pt 0 12pt 0 !important; color: ' + primaryColor + ' !important; border-bottom: 3pt solid ' + primaryColor + ' !important; padding-bottom: 6pt !important; text-transform: uppercase !important; letter-spacing: 1pt !important; }' +
      'p { font-size: 12pt !important; line-height: 1.4 !important; margin: 0 0 8pt 0 !important; }' +
      '.summary { text-align: center !important; margin-bottom: 24pt !important; }' +
      '.summary p { font-size: 13pt !important; line-height: 1.6 !important; color: #333 !important; font-style: italic !important; max-width: 500pt !important; margin: 0 auto !important; }' +
      '.job-item { margin-bottom: 24pt !important; page-break-inside: avoid !important; }' +
      '.job-company { font-weight: 700 !important; font-size: 14pt !important; color: ' + primaryColor + ' !important; text-transform: uppercase !important; margin-bottom: 3pt !important; }' +
      '.job-header { display: flex !important; justify-content: space-between !important; align-items: baseline !important; margin-bottom: 8pt !important; }' +
      '.job-title { font-size: 13pt !important; font-weight: 600 !important; color: #333 !important; }' +
      '.job-dates { font-size: 12pt !important; color: #666 !important; font-style: italic !important; }' +
      '.bullet-list { margin: 0 !important; padding: 0 !important; }' +
      '.bullet-item { margin-bottom: 4pt !important; padding-left: 12pt !important; position: relative !important; font-size: 12pt !important; line-height: 1.5 !important; color: #333 !important; }' +
      '.bullet-item:before { content: "•" !important; position: absolute !important; left: 0 !important; top: 0 !important; color: #333 !important; }' +
      '.education-item { margin-bottom: 16pt !important; }' +
      '.education-header { display: flex !important; justify-content: space-between !important; align-items: baseline !important; margin-bottom: 3pt !important; }' +
      '.education-degree { font-weight: 700 !important; font-size: 14pt !important; color: ' + primaryColor + ' !important; text-transform: uppercase !important; }' +
      '.education-school { font-size: 13pt !important; color: #333 !important; }' +
      '.skills-grid { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 12pt !important; }' +
      '.skill-item { margin-bottom: 4pt !important; padding-left: 12pt !important; position: relative !important; font-size: 12pt !important; }' +
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
        dates: job.startMonth && job.startYear && job.endMonth && job.endYear
          ? job.startMonth + ' ' + job.startYear + ' – ' + job.endMonth + ' ' + job.endYear
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
        '<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet" />' +
        '<link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet" />' +
        '<style>' + generateCSS() + '</style>' +
      '</head>' +
      '<body>' +
        '<!-- Header -->' +
        '<div class="header">' +
          '<h1>' + name + '</h1>' +
          (jobTitle ? '<h2>' + jobTitle + '</h2>' : '') +
          '<div class="divider"></div>' +
          '<div class="contact-info">' +
            (phone ? '<span>' + phone + '</span>' : '') +
            (phone && email ? '<span>     |     </span>' : '') +
            (email ? '<span>' + email + '</span>' : '') +
            ((phone || email) && location ? '<span>     |     </span>' : '') +
            (location ? '<span>' + location + '</span>' : '') +
          '</div>' +
        '</div>' +

        '<!-- Summary -->' +
        (summary ? 
          '<div class="summary">' +
            '<p>' + summary + '</p>' +
          '</div>'
          : '') +

        '<!-- Professional Experience -->' +
        (workExperience && workExperience.length > 0 ? 
          '<div class="section">' +
            '<h3>Professional Experience</h3>' +
            workExperience.map((job, i) => 
              '<div class="job-item">' +
                '<div class="job-company">' + job.company + '</div>' +
                '<div class="job-header">' +
                  '<div class="job-title">' + job.title + '</div>' +
                  '<div class="job-dates">' + job.dates + '</div>' +
                '</div>' +
                '<div class="bullet-list">' +
                  job.bullets.map((bullet, idx) => 
                    '<div class="bullet-item">' +
                      bullet +
                    '</div>'
                  ).join('') +
                '</div>' +
              '</div>'
            ).join('') +
          '</div>'
          : '') +

        '<!-- Education -->' +
        (education && education.length > 0 ? 
          '<div class="section">' +
            '<h3>Education</h3>' +
            education.map((edu, i) => 
              '<div class="education-item">' +
                '<div class="education-header">' +
                  '<div class="education-degree">' + edu.degree + '</div>' +
                  '<div class="job-dates">' + edu.dates + '</div>' +
                '</div>' +
                '<div class="education-school">' + edu.institution + '</div>' +
              '</div>'
            ).join('') +
          '</div>'
          : '') +

        '<!-- Skills -->' +
        (skills && skills.length > 0 ? 
          '<div class="section">' +
            '<h3>Skills</h3>' +
            '<div class="skills-grid">' +
              skills.map((skill, i) => 
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