import React from 'react';
import { ResumeTemplate } from '../../types/templates';

interface TemplatePreviewProps {
  showTemplatePreview: boolean;
  previewTemplate: ResumeTemplate | null;
  selectedColorVariants: Record<string, number>;
  setShowTemplatePreview: (show: boolean) => void;
  setSelectedTemplate: (template: string) => void;
  setValue: (name: any, value: any, options?: any) => void;
}

// Sample data for template previews
const sampleData = {
  classic: {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com", 
    phone: "(555) 123-4567",
    location: "New York, NY",
    jobTitle: "Senior Software Engineer",
    personalSummary: "Experienced software engineer with 8+ years developing scalable web applications. Passionate about clean code, user experience, and mentoring junior developers.",
    workExperience: [
      {
        title: "Senior Software Engineer",
        company: "TechCorp Inc",
        startMonth: "Jan",
        startYear: "2020",
        endMonth: "",
        endYear: "",
        description: "Led development of microservices architecture serving 2M+ users. Mentored team of 5 engineers and improved system performance by 40%."
      },
      {
        title: "Software Engineer",
        company: "StartupXYZ",
        startMonth: "Jun",
        startYear: "2018",
        endMonth: "Dec",
        endYear: "2019",
        description: "Built responsive web applications using React and Node.js. Collaborated with design team to implement user-friendly interfaces."
      }
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        school: "University of Technology",
        startMonth: "Sep",
        startYear: "2014",
        endMonth: "May",
        endYear: "2018"
      }
    ],
    skills: "JavaScript, React, Node.js, Python, PostgreSQL, AWS, Docker, Git, Agile Development",
    achievements: "Built award-winning mobile app with 100K+ downloads. Speaker at 3 tech conferences. Open source contributor with 500+ GitHub stars."
  },
  modern: {
    name: "Alex Chen",
    email: "alex.chen@email.com",
    phone: "(555) 987-6543", 
    location: "San Francisco, CA",
    jobTitle: "Product Designer",
    personalSummary: "Creative product designer with expertise in user research, prototyping, and design systems. 6+ years creating intuitive digital experiences.",
    workExperience: [
      {
        title: "Senior Product Designer",
        company: "Design Studio",
        startMonth: "Mar",
        startYear: "2021",
        endMonth: "",
        endYear: "",
        description: "Lead designer for B2B SaaS platform. Conducted user research and designed features that increased user engagement by 60%."
      },
      {
        title: "UX Designer",
        company: "InnovateLab",
        startMonth: "Aug",
        startYear: "2019",
        endMonth: "Feb",
        endYear: "2021",
        description: "Designed mobile-first experiences for fintech startup. Created design system used across 5 product teams."
      }
    ],
    education: [
      {
        degree: "Master of Fine Arts in Interaction Design",
        school: "Art Institute",
        startMonth: "Sep",
        startYear: "2017",
        endMonth: "May",
        endYear: "2019"
      }
    ],
    skills: "Figma, Sketch, Adobe Creative Suite, Prototyping, User Research, Design Systems, HTML/CSS",
    achievements: "Won 'Best UX Design' award 2022. Led design for app featured in App Store. Mentored 10+ junior designers."
  },
  structured: {
    name: "Michael Rodriguez",
    email: "michael.rodriguez@email.com",
    phone: "(555) 456-7890",
    location: "Chicago, IL", 
    jobTitle: "Data Scientist",
    personalSummary: "Results-driven data scientist with expertise in machine learning, statistical analysis, and data visualization. 7+ years turning data into actionable business insights.",
    workExperience: [
      {
        title: "Senior Data Scientist",
        company: "Analytics Corp",
        startMonth: "Jan",
        startYear: "2022",
        endMonth: "",
        endYear: "",
        description: "Built ML models that improved customer retention by 25%. Led cross-functional team to implement predictive analytics platform."
      },
      {
        title: "Data Scientist",
        company: "DataTech Solutions",
        startMonth: "May",
        startYear: "2019",
        endMonth: "Dec",
        endYear: "2021",
        description: "Developed recommendation algorithms and A/B testing frameworks. Created dashboards that provided insights to executive team."
      }
    ],
    education: [
      {
        degree: "PhD in Statistics",
        school: "State University",
        startMonth: "Sep",
        startYear: "2015",
        endMonth: "May",
        endYear: "2019"
      }
    ],
    skills: "Python, R, SQL, TensorFlow, Pandas, Tableau, AWS, Machine Learning, Statistical Modeling",
    achievements: "Published 8 research papers. Led data science team that won company innovation award. Created ML course with 5K+ students."
  }
};

export default function TemplatePreview({
  showTemplatePreview,
  previewTemplate,
  selectedColorVariants,
  setShowTemplatePreview,
  setSelectedTemplate,
  setValue
}: TemplatePreviewProps) {
  if (!showTemplatePreview || !previewTemplate) {
    return null;
  }

  // Get sample data for the current template
  const templateSampleData = sampleData[previewTemplate.id as keyof typeof sampleData] || sampleData.classic;

  // Generate the exact PDF HTML with sample data
  const getPDFHTML = () => {
    switch (previewTemplate.id) {
      case 'modern':
        return getModernPDFHTML(templateSampleData);
      case 'structured':
        return getStructuredPDFHTML(templateSampleData);
      case 'classic':
      default:
        return getClassicPDFHTML(templateSampleData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/80 p-4">
      <div className="relative max-w-full max-h-full overflow-hidden">
        <button
          onClick={() => setShowTemplatePreview(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-pink-400 text-2xl font-bold z-10 bg-white/90 rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-colors duration-200"
          aria-label="Close template preview"
        >
          ×
        </button>
        
        {/* Template Selection Buttons */}
        <div className="absolute top-2 left-2 z-10 flex gap-2">
          <button
            onClick={() => {
              setSelectedTemplate(previewTemplate.id);
              setValue('template', previewTemplate.id, { shouldValidate: true, shouldDirty: true });
              setShowTemplatePreview(false);
            }}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            ✓ Select This Template
          </button>
        </div>
        
        {/* A4 Preview Container - Exact PDF dimensions */}
        <div 
          className="bg-white shadow-2xl mx-auto overflow-hidden" 
          style={{ 
            width: '210mm', 
            height: '297mm',
            maxWidth: 'calc(100vw - 2rem)',
            maxHeight: 'calc(100vh - 6rem)',
            transform: 'scale(0.7)',
            transformOrigin: 'center center'
          }}
        >
          <iframe
            srcDoc={getPDFHTML()}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block'
            }}
            title="Template Preview - Exact PDF Styling"
          />
        </div>
        
        {/* Preview label */}
        <div className="text-white text-center mt-2 text-sm opacity-75">
          📄 {previewTemplate.name} Template - This is exactly how your PDF will look
        </div>
      </div>
    </div>
  );
}

// PDF Template Functions - EXACT same as used in PDF generation
function getClassicPDFHTML(data: any): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume Preview</title>
  <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0 !important;
      padding: 0 !important;
      box-sizing: border-box !important;
    }
    
    @page {
      size: A4;
      margin: 0;
    }
    
    body {
      font-family: 'Crimson Text', serif !important;
      font-size: 10pt !important;
      line-height: 1.3 !important;
      color: #000 !important;
      background: white !important;
      width: 210mm !important;
      height: 297mm !important;
      padding: 15mm !important;
      overflow: hidden !important;
    }
    
    .header {
      text-align: center !important;
      margin-bottom: 8mm !important;
      border-bottom: 1pt solid #000 !important;
      padding-bottom: 4mm !important;
    }
    
    .name {
      font-size: 18pt !important;
      font-weight: 600 !important;
      margin-bottom: 2mm !important;
    }
    
    .contact {
      font-size: 9pt !important;
      margin-bottom: 1mm !important;
    }
    
    .section {
      margin-bottom: 6mm !important;
    }
    
    .section-title {
      font-size: 12pt !important;
      font-weight: 600 !important;
      text-transform: uppercase !important;
      border-bottom: 0.5pt solid #000 !important;
      margin-bottom: 3mm !important;
      padding-bottom: 1mm !important;
    }
    
    .job {
      margin-bottom: 4mm !important;
    }
    
    .job-header {
      font-weight: 600 !important;
      margin-bottom: 1mm !important;
    }
    
    .job-details {
      font-style: italic !important;
      font-size: 9pt !important;
      margin-bottom: 2mm !important;
    }
    
    .education-item {
      margin-bottom: 3mm !important;
    }
    
    .degree {
      font-weight: 600 !important;
    }
    
    .school {
      font-style: italic !important;
    }
    
    .skills {
      font-size: 9pt !important;
      line-height: 1.4 !important;
    }
    
    @media print {
      body { print-color-adjust: exact !important; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="name">${data.name}</div>
    ${data.jobTitle ? `<div class="contact">${data.jobTitle}</div>` : ''}
    <div class="contact">${data.email}</div>
    ${data.phone ? `<div class="contact">${data.phone}</div>` : ''}
    ${data.location ? `<div class="contact">${data.location}</div>` : ''}
  </div>

  ${data.personalSummary ? `
  <div class="section">
    <div class="section-title">Professional Summary</div>
    <p>${data.personalSummary}</p>
  </div>
  ` : ''}

  ${data.workExperience?.length ? `
  <div class="section">
    <div class="section-title">Professional Experience</div>
         ${data.workExperience.map((job: any) => `
       <div class="job">
         <div class="job-header">${job.title} at ${job.company}</div>
         <div class="job-details">${job.startMonth} ${job.startYear} - ${job.endMonth || 'Present'} ${job.endYear || ''}</div>
         <div style="margin-top: 2mm; font-size: 9pt;">${job.description}</div>
       </div>
     `).join('')}
  </div>
  ` : ''}

  ${data.education?.length ? `
  <div class="section">
    <div class="section-title">Education</div>
         ${data.education.map((edu: any) => `
       <div class="education-item">
         <div class="degree">${edu.degree}</div>
         <div class="school">${edu.school}, ${edu.startMonth} ${edu.startYear} - ${edu.endMonth || 'Present'} ${edu.endYear || ''}</div>
       </div>
     `).join('')}
  </div>
  ` : ''}

  ${data.skills ? `
  <div class="section">
    <div class="section-title">Skills</div>
    <div class="skills">${data.skills}</div>
  </div>
  ` : ''}

  ${data.achievements ? `
  <div class="section">
    <div class="section-title">Key Achievements</div>
    <div class="skills">${data.achievements}</div>
  </div>
  ` : ''}
</body>
</html>`;
}

function getModernPDFHTML(data: any): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume Preview</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0 !important;
      padding: 0 !important;
      box-sizing: border-box !important;
    }
    
    @page {
      size: A4;
      margin: 0;
    }
    
    body {
      font-family: 'Inter', sans-serif !important;
      font-size: 9pt !important;
      line-height: 1.4 !important;
      color: #000 !important;
      background: white !important;
      width: 210mm !important;
      height: 297mm !important;
      display: flex !important;
      overflow: hidden !important;
    }
    
    .sidebar {
      width: 70mm !important;
      background: #2563eb !important;
      color: white !important;
      padding: 15mm 10mm !important;
    }
    
    .main-content {
      flex: 1 !important;
      padding: 15mm 15mm !important;
    }
    
    .sidebar .name {
      font-size: 16pt !important;
      font-weight: 700 !important;
      margin-bottom: 3mm !important;
    }
    
    .sidebar .title {
      font-size: 10pt !important;
      font-weight: 300 !important;
      margin-bottom: 8mm !important;
    }
    
    .sidebar .section {
      margin-bottom: 8mm !important;
    }
    
    .sidebar .section-title {
      font-size: 10pt !important;
      font-weight: 600 !important;
      text-transform: uppercase !important;
      margin-bottom: 3mm !important;
      border-bottom: 1pt solid rgba(255,255,255,0.3) !important;
      padding-bottom: 1mm !important;
    }
    
    .sidebar .contact-item {
      font-size: 8pt !important;
      margin-bottom: 2mm !important;
    }
    
    .main-content .section {
      margin-bottom: 8mm !important;
    }
    
    .main-content .section-title {
      font-size: 12pt !important;
      font-weight: 600 !important;
      color: #2563eb !important;
      text-transform: uppercase !important;
      margin-bottom: 4mm !important;
      border-bottom: 1pt solid #2563eb !important;
      padding-bottom: 1mm !important;
    }
    
    .job {
      margin-bottom: 5mm !important;
    }
    
    .job-header {
      font-weight: 600 !important;
      margin-bottom: 1mm !important;
    }
    
    .job-details {
      color: #666 !important;
      font-size: 8pt !important;
      margin-bottom: 2mm !important;
    }
    
    .skills {
      font-size: 8pt !important;
    }
    
    @media print {
      body { print-color-adjust: exact !important; }
    }
  </style>
</head>
<body>
  <div class="sidebar">
    <div class="header">
      <div class="name">${data.name}</div>
      <div class="title">${data.jobTitle || 'Professional'}</div>
    </div>
    
    <div class="section">
      <div class="section-title">Contact</div>
      <div class="contact-item">${data.email}</div>
      ${data.phone ? `<div class="contact-item">${data.phone}</div>` : ''}
      ${data.location ? `<div class="contact-item">${data.location}</div>` : ''}
    </div>

    ${data.skills ? `
    <div class="section">
      <div class="section-title">Skills</div>
      <div class="skills">${data.skills}</div>
    </div>
    ` : ''}
  </div>

  <div class="main-content">
    ${data.personalSummary ? `
    <div class="section">
      <div class="section-title">Summary</div>
      <p>${data.personalSummary}</p>
    </div>
    ` : ''}

    ${data.workExperience?.length ? `
    <div class="section">
      <div class="section-title">Experience</div>
             ${data.workExperience.map((job: any) => `
         <div class="job">
           <div class="job-header">${job.title} at ${job.company}</div>
           <div class="job-details">${job.startMonth} ${job.startYear} - ${job.endMonth || 'Present'} ${job.endYear || ''}</div>
           <div style="margin-top: 2mm; font-size: 8pt;">${job.description}</div>
         </div>
       `).join('')}
    </div>
    ` : ''}

    ${data.education?.length ? `
    <div class="section">
      <div class="section-title">Education</div>
             ${data.education.map((edu: any) => `
         <div class="education-item">
           <div class="degree">${edu.degree}</div>
           <div class="school">${edu.school}</div>
         </div>
       `).join('')}
    </div>
    ` : ''}

    ${data.achievements ? `
    <div class="section">
      <div class="section-title">Achievements</div>
      <div>${data.achievements}</div>
    </div>
    ` : ''}
  </div>
</body>
</html>`;
}

function getStructuredPDFHTML(data: any): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume Preview</title>
  <link href="https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0 !important;
      padding: 0 !important;
      box-sizing: border-box !important;
    }
    
    @page {
      size: A4;
      margin: 0;
    }
    
    body {
      font-family: 'Source Serif Pro', serif !important;
      font-size: 10pt !important;
      line-height: 1.3 !important;
      color: #000 !important;
      background: white !important;
      width: 210mm !important;
      height: 297mm !important;
      padding: 20mm !important;
      overflow: hidden !important;
    }
    
    .header {
      text-align: center !important;
      margin-bottom: 10mm !important;
      padding-bottom: 5mm !important;
      border-bottom: 2pt solid #000 !important;
    }
    
    .name {
      font-size: 20pt !important;
      font-weight: 700 !important;
      margin-bottom: 3mm !important;
    }
    
    .contact {
      font-size: 9pt !important;
      margin-bottom: 1mm !important;
    }
    
    .section {
      margin-bottom: 8mm !important;
    }
    
    .section-title {
      font-size: 12pt !important;
      font-weight: 600 !important;
      text-transform: uppercase !important;
      letter-spacing: 1pt !important;
      border-bottom: 1pt solid #000 !important;
      margin-bottom: 4mm !important;
      padding-bottom: 1mm !important;
    }
    
    .job {
      margin-bottom: 5mm !important;
    }
    
    .job-header {
      font-weight: 600 !important;
      margin-bottom: 1mm !important;
    }
    
    .job-details {
      font-style: italic !important;
      font-size: 9pt !important;
      margin-bottom: 2mm !important;
    }
    
    .education-item {
      margin-bottom: 3mm !important;
    }
    
    .degree {
      font-weight: 600 !important;
    }
    
    .school {
      font-style: italic !important;
    }
    
    .skills {
      font-size: 9pt !important;
    }
    
    @media print {
      body { print-color-adjust: exact !important; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="name">${data.name}</div>
    ${data.jobTitle ? `<div class="contact">${data.jobTitle}</div>` : ''}
    <div class="contact">${data.email}</div>
    ${data.phone ? `<div class="contact">${data.phone}</div>` : ''}
    ${data.location ? `<div class="contact">${data.location}</div>` : ''}
  </div>

  ${data.personalSummary ? `
  <div class="section">
    <div class="section-title">Professional Summary</div>
    <p>${data.personalSummary}</p>
  </div>
  ` : ''}

  ${data.workExperience?.length ? `
  <div class="section">
    <div class="section-title">Professional Experience</div>
         ${data.workExperience.map((job: any) => `
       <div class="job">
         <div class="job-header">${job.title} at ${job.company}</div>
         <div class="job-details">${job.startMonth} ${job.startYear} - ${job.endMonth || 'Present'} ${job.endYear || ''}</div>
         <div style="margin-top: 2mm;">${job.description}</div>
       </div>
     `).join('')}
   </div>
   ` : ''}
 
   ${data.education?.length ? `
   <div class="section">
     <div class="section-title">Education</div>
     ${data.education.map((edu: any) => `
       <div class="education-item">
         <div class="degree">${edu.degree}</div>
         <div class="school">${edu.school}, ${edu.startMonth} ${edu.startYear} - ${edu.endMonth || 'Present'} ${edu.endYear || ''}</div>
       </div>
     `).join('')}
  </div>
  ` : ''}

  ${data.skills ? `
  <div class="section">
    <div class="section-title">Skills</div>
    <div class="skills">${data.skills}</div>
  </div>
  ` : ''}

  ${data.achievements ? `
  <div class="section">
    <div class="section-title">Key Achievements</div>
    <div class="skills">${data.achievements}</div>
  </div>
  ` : ''}
</body>
</html>`;
}