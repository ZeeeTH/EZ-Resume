import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { ResumeTemplate } from '../../types/templates';
import { FormData } from '../../types';
import ClassicHtml from './ClassicHtml';
import ModernHtml from './ModernHtml';
import StructuredHtml from './StructuredHtml';

interface TemplatePreviewProps {
  showTemplatePreview: boolean;
  previewTemplate: ResumeTemplate | null;
  selectedColorVariants: Record<string, number>;
  setShowTemplatePreview: (show: boolean) => void;
  setSelectedTemplate: (template: string) => void;
  setValue: (name: any, value: any, options?: any) => void;
}

// Sample FormData for template previews - uses the EXACT same structure as the actual form
const getSampleFormData = (templateId: string): FormData => {
  const baseData: FormData = {
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
        description: "Led development of microservices architecture serving 2M+ users. Mentored team of 5 engineers and improved system performance by 40%. Implemented automated testing pipelines reducing bugs by 60%."
      },
      {
        title: "Software Engineer",
        company: "StartupXYZ",
        startMonth: "Jun",
        startYear: "2018",
        endMonth: "Dec",
        endYear: "2019",
        description: "Built responsive web applications using React and Node.js. Collaborated with design team to implement user-friendly interfaces. Optimized database queries improving response times by 35%."
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
    achievements: "Built award-winning mobile app with 100K+ downloads. Speaker at 3 tech conferences. Open source contributor with 500+ GitHub stars.",
    coverLetter: false,
    template: templateId,
    company: ""
  };

  // Customize sample data based on template
  if (templateId === 'modern') {
    return {
      ...baseData,
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
          description: "Lead designer for B2B SaaS platform. Conducted user research and designed features that increased user engagement by 60%. Built design system used across 5 teams."
        },
        {
          title: "UX Designer",
          company: "InnovateLab",
          startMonth: "Aug",
          startYear: "2019",
          endMonth: "Feb",
          endYear: "2021",
          description: "Designed mobile-first experiences for fintech startup. Created design system and component library. Led user testing sessions with 100+ participants."
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
      achievements: "Won 'Best UX Design' award 2022. Led design for app featured in App Store. Mentored 10+ junior designers.",
      template: templateId
    };
  } else if (templateId === 'structured') {
    return {
      ...baseData,
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
          description: "Built ML models that improved customer retention by 25%. Led cross-functional team to implement predictive analytics platform. Managed datasets with 50M+ records."
        },
        {
          title: "Data Scientist",
          company: "DataTech Solutions",
          startMonth: "May",
          startYear: "2019",
          endMonth: "Dec",
          endYear: "2021",
          description: "Developed recommendation algorithms and A/B testing frameworks. Created dashboards that provided insights to executive team. Published 3 research papers."
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
      achievements: "Published 8 research papers. Led data science team that won company innovation award. Created ML course with 5K+ students.",
      template: templateId
    };
  }

  return baseData;
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

  // Get sample data with proper FormData structure
  const sampleFormData = getSampleFormData(previewTemplate.id);

  // Generate the exact same HTML that would be sent to PDF service
  const getReactComponentHTML = () => {
    let ResumeComponent: any;
    switch (previewTemplate.id) {
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
    
    // This is EXACTLY the same as what's done in the PDF generation API
    return ReactDOMServer.renderToStaticMarkup(
      React.createElement(ResumeComponent, { data: sampleFormData })
    );
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
            srcDoc={getReactComponentHTML()}
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