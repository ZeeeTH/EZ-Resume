import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { ResumeTemplate } from '../../types/templates';
import { FormData } from '../../types';
import ClassicHtml from './ClassicHtml';
import ModernHtml from './ModernHtml';
import StructuredHtml from './StructuredHtml';
import JsonTemplateRenderer from './JsonTemplateRenderer';

interface TemplatePreviewProps {
  showTemplatePreview: boolean;
  previewTemplate: ResumeTemplate | null;
  selectedColorVariants: Record<string, number>;
  setShowTemplatePreview: (show: boolean) => void;
  setSelectedTemplate: (template: string) => void;
  setValue: (name: any, value: any, options?: any) => void;
}

// Sample FormData for legacy template previews - uses the EXACT same structure as the actual form
const getSampleFormData = (templateId: string): FormData => {
  const baseData: FormData = {
    name: "Elena Rodriguez",
    email: "elena.rodriguez@email.com", 
    phone: "(415) 762-3849",
    location: "San Francisco, CA",
    jobTitle: "Senior Product Manager",
    personalSummary: "Results-driven Product Manager with 8+ years of experience leading cross-functional teams to deliver innovative digital products. Proven track record of driving user engagement by 150% and revenue growth of $12M+ through strategic product roadmaps, data-driven decision making, and customer-centric design principles.",
    workExperience: [
      {
        title: "Senior Product Manager",
        company: "Stripe Technologies",
        startMonth: "Mar",
        startYear: "2021",
        endMonth: "",
        endYear: "",
        description: "Lead product strategy for payment infrastructure serving 2M+ merchants globally. Collaborated with engineering, design, and data science teams to launch 8 major features resulting in 40% increase in transaction volume. Managed $25M product budget and reduced customer churn by 30% through improved onboarding experience."
      },
      {
        title: "Product Manager",
        company: "Airbnb Inc",
        startMonth: "Aug",
        startYear: "2018",
        endMonth: "Feb",
        endYear: "2021",
        description: "Owned the host experience product for marketplace with 4M+ active hosts worldwide. Launched machine learning-powered pricing recommendations that increased host revenue by 22%. Led A/B testing program across 12 markets resulting in $8M incremental revenue."
      }
    ],
    education: [
      {
        degree: "Master of Business Administration (MBA)",
        school: "Stanford Graduate School of Business",
        startMonth: "Sep",
        startYear: "2013",
        endMonth: "Jun",
        endYear: "2015"
      },
      {
        degree: "Bachelor of Science in Computer Science",
        school: "University of California, Berkeley",
        startMonth: "Aug",
        startYear: "2009",
        endMonth: "May",
        endYear: "2013"
      }
    ],
    skills: "Product Strategy & Go-to-Market, Data Analysis & Product Analytics, Agile Project Management, Market Research & Customer Development, Leadership & Stakeholder Management, Financial Modeling & Business Planning, User Experience Design, Presentation & Communication",
    achievements: "Named 'Rising Star Product Manager' by Product School 2022. Led product that won 'Best Innovation Award' at TechCrunch Disrupt. Mentored 15+ junior product managers through company mentorship program. Guest speaker at ProductCon and Mind the Product conferences. Published thought leadership articles in Harvard Business Review and Medium with 50K+ combined views.",
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

  // Check if this is one of the new JSON-based templates (excluding classic/modern/structured)
  const newJsonTemplateIds = [
    'tech-modern',
    'developer-pro', 
    'senior-tech-executive',
    'medical-professional',
    'healthcare-modern',
    'allied-health-specialist'
  ];
  const isJsonTemplate = newJsonTemplateIds.includes(previewTemplate.id);

  // Generate the template HTML
  const getTemplateHTML = () => {
    try {
      if (isJsonTemplate) {
        // Use JsonTemplateRenderer for new JSON-based templates
        const selectedColorIndex = selectedColorVariants[previewTemplate.id] ?? 0;
        const selectedColors = previewTemplate.colorOptions?.palette[selectedColorIndex];
        
        const templateElement = React.createElement(JsonTemplateRenderer, {
          template: previewTemplate,
          selectedColors: selectedColors ? {
            primary: selectedColors.primary,
            secondary: selectedColors.secondary
          } : undefined
        });
        
        const htmlString = ReactDOMServer.renderToStaticMarkup(templateElement);
        
        return `<!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Template Preview</title>
            <style>
              body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
              * { box-sizing: border-box; }
            </style>
          </head>
          <body>
            ${htmlString}
          </body>
        </html>`;
      } else {
        // Use legacy template rendering for classic/modern/structured
        const sampleFormData = getSampleFormData(previewTemplate.id);
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
        
        // Get selected color from user's selection
        const selectedColorIndex = selectedColorVariants[previewTemplate.id] ?? 0;
        const selectedColors = previewTemplate.colorOptions?.palette[selectedColorIndex];
        
        // Ensure we have valid data for rendering
        if (!sampleFormData || !ResumeComponent) {
          return '<html><body><p>Error: Unable to load template data</p></body></html>';
        }
        
        // Since template components now return HTML strings directly, call them as functions
        return ResumeComponent({ 
          data: sampleFormData,
          selectedColors: selectedColors || undefined
        });
      }
    } catch (error) {
      console.error('Template rendering error:', error);
      return '<html><body><p>Error: Template failed to render</p></body></html>';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/80 p-8 overflow-hidden">
      <div className="relative flex justify-center items-center overflow-hidden" style={{ maxWidth: '100%', maxHeight: '100%' }}>
        <button
          onClick={() => setShowTemplatePreview(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-pink-400 text-2xl font-bold z-10 bg-white/90 rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-colors duration-200"
          aria-label="Close template preview"
        >
          ×
        </button>
        
        {/* A4 Preview Container - Fixed scale to ensure it fits */}
        <div 
          className="bg-white shadow-2xl overflow-hidden" 
          style={{ 
            width: '210mm', 
            height: '297mm',
            transform: 'scale(0.75)',
            transformOrigin: 'center center'
          }}
        >
          <iframe
            srcDoc={getTemplateHTML()}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block'
            }}
            title="Template Preview - Exact PDF Styling"
          />
        </div>
      </div>
    </div>
  );
}