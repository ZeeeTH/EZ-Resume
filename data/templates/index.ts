import modernTemplate from './modern.json';
import classicTemplate from './classic.json';
import structuredTemplate from './structured.json';
import techModernTemplate from './tech-modern.json';
import developerProTemplate from './developer-pro.json';
import seniorTechExecutiveTemplate from './tech-executive.json';
import medicalProfessionalTemplate from './medical-professional.json';
import healthcareModernTemplate from './healthcare-modern.json';
import alliedHealthTemplate from './allied-health-specialist.json';

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  popularity: number;
  category: string;
  industries: string[]; // which industries this template serves
  tier: 'free' | 'premium'; // template tier
  isUniversal: boolean; // true for templates that work for all industries
  styling: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    spacing: 'compact' | 'standard' | 'spacious';
    layout: 'modern' | 'classic' | 'structured';
  };
  colorOptions?: {
    allowUserColorOverride: boolean;
    defaultPrimaryColor: string;
    defaultSecondaryColor: string;
    palette: Array<{
      label: string;
      primary: string;
      secondary: string;
    }>;
  };
  sampleData: {
    name: string;
    title?: string;
    contact: {
      email: string;
      phone: string;
      location: string;
      website?: string;
      linkedin?: string;
      twitter?: string;
    };
    sections: Array<{
      title: string;
      content?: string;
      jobs?: Array<{
        title: string;
        company: string;
        location: string;
        dates: string;
        bullets: string[];
      }>;
      education?: Array<{
        degree: string;
        institution: string;
        location?: string;
        dates: string;
        gpa?: string;
      }>;
      categories?: Record<string, string[]>;
    }>;
  };
  fonts: {
    header: string;
    section: string;
    body: string;
  };
  layout?: any;
}

export const templates: ResumeTemplate[] = [
  // Free Universal Template
  {
    ...classicTemplate,
    industries: ['universal'],
    tier: 'free',
    isUniversal: true,
    styling: {
      ...classicTemplate.styling,
      spacing: classicTemplate.styling.spacing as 'compact' | 'standard' | 'spacious',
      layout: classicTemplate.styling.layout as 'modern' | 'classic' | 'structured',
    },
    fonts: {
      header: 'Merriweather, Georgia, serif',
      section: 'Lato, Arial, sans-serif',
      body: 'Lato, Arial, sans-serif',
    },
  },

  // Technology Templates
  {
    ...techModernTemplate,
    industries: ['technology'],
    tier: 'premium',
    isUniversal: false,
    styling: {
      ...techModernTemplate.styling,
      spacing: techModernTemplate.styling.spacing as 'compact' | 'standard' | 'spacious',
      layout: techModernTemplate.styling.layout as 'modern' | 'classic' | 'structured',
    },
    fonts: {
      header: 'Inter, Arial, sans-serif',
      section: 'Inter, Arial, sans-serif',
      body: 'Inter, Arial, sans-serif',
    },
  } as ResumeTemplate,
  {
    ...developerProTemplate,
    industries: ['technology'],
    tier: 'premium',
    isUniversal: false,
    styling: {
      ...developerProTemplate.styling,
      spacing: developerProTemplate.styling.spacing as 'compact' | 'standard' | 'spacious',
      layout: developerProTemplate.styling.layout as 'modern' | 'classic' | 'structured',
    },
    fonts: {
      header: 'Roboto, Arial, sans-serif',
      section: 'Roboto, Arial, sans-serif',
      body: 'Source Code Pro, monospace',
    },
  } as ResumeTemplate,
  {
    ...seniorTechExecutiveTemplate,
    industries: ['technology'],
    tier: 'premium',
    isUniversal: false,
    styling: {
      ...seniorTechExecutiveTemplate.styling,
      spacing: seniorTechExecutiveTemplate.styling.spacing as 'compact' | 'standard' | 'spacious',
      layout: seniorTechExecutiveTemplate.styling.layout as 'modern' | 'classic' | 'structured',
    },
    fonts: {
      header: 'Georgia, serif',
      section: 'Lato, Arial, sans-serif',
      body: 'Lato, Arial, sans-serif',
    },
  } as ResumeTemplate,

  // Healthcare Templates
  {
    ...medicalProfessionalTemplate,
    industries: ['healthcare'],
    tier: 'premium',
    isUniversal: false,
    styling: {
      ...medicalProfessionalTemplate.styling,
      spacing: medicalProfessionalTemplate.styling.spacing as 'compact' | 'standard' | 'spacious',
      layout: medicalProfessionalTemplate.styling.layout as 'modern' | 'classic' | 'structured',
    },
    fonts: {
      header: 'Times New Roman, serif',
      section: 'Lato, Arial, sans-serif',
      body: 'Lato, Arial, sans-serif',
    },
  } as ResumeTemplate,
  {
    ...healthcareModernTemplate,
    industries: ['healthcare'],
    tier: 'premium',
    isUniversal: false,
    styling: {
      ...healthcareModernTemplate.styling,
      spacing: healthcareModernTemplate.styling.spacing as 'compact' | 'standard' | 'spacious',
      layout: healthcareModernTemplate.styling.layout as 'modern' | 'classic' | 'structured',
    },
    fonts: {
      header: 'Merriweather, Georgia, serif',
      section: 'Lato, Arial, sans-serif',
      body: 'Lato, Arial, sans-serif',
    },
  },
  {
    ...alliedHealthTemplate,
    industries: ['healthcare'],
    tier: 'premium',
    isUniversal: false,
    styling: {
      ...alliedHealthTemplate.styling,
      spacing: alliedHealthTemplate.styling.spacing as 'compact' | 'standard' | 'spacious',
      layout: alliedHealthTemplate.styling.layout as 'modern' | 'classic' | 'structured',
    },
    fonts: {
      header: 'Lato, Arial, sans-serif',
      section: 'Lato, Arial, sans-serif',
      body: 'Lato, Arial, sans-serif',
    },
  } as ResumeTemplate,
  {
    ...structuredTemplate,
    id: 'investment-pro',
    name: 'Investment Pro',
    description: 'Metrics-focused layout with quantified achievements emphasis. Ideal for analysts and investment professionals.',
    industries: ['finance'],
    tier: 'premium',
    isUniversal: false,
    category: 'Finance',
    styling: {
      ...structuredTemplate.styling,
      primaryColor: '#DC2626',
      secondaryColor: '#991B1B',
      spacing: structuredTemplate.styling.spacing as 'compact' | 'standard' | 'spacious',
      layout: structuredTemplate.styling.layout as 'modern' | 'classic' | 'structured',
    },
    fonts: {
      header: 'Georgia, serif',
      section: 'Arial, sans-serif',
      body: 'Arial, sans-serif',
    },
  },
];

export const templateMetadata = [
  // Free Universal Template
  {
    id: 'classic',
    name: 'Classic Professional',
    description: `Traditional single-column resume suitable for any industry. Clean section breaks with professional formatting that works everywhere.`,
    popularity: 4,
    category: 'Universal',
    industries: ['universal'],
    tier: 'free',
    isUniversal: true,
    colorOptions: {
      allowUserColorOverride: true,
      defaultPrimaryColor: "#374151",
      defaultSecondaryColor: "#6B7280",
      palette: [
        { label: "Greyscale", primary: "#374151", secondary: "#6B7280" },
        { label: "Emerald", primary: "#1F8072", secondary: "#4B5563" },
        { label: "Classic Blue", primary: "#1E3A8A", secondary: "#475569" }
      ]
    }
  },

  // Technology Templates
  {
    id: 'tech-modern',
    name: 'Tech Modern',
    description: `Sleek, minimalist design with prominent technical skills section and modern typography. Perfect for software developers.`,
    popularity: 5,
    category: 'Technology',
    industries: ['technology'],
    tier: 'premium',
    isUniversal: false,
    colorOptions: {
      allowUserColorOverride: true,
      defaultPrimaryColor: "#2563EB",
      defaultSecondaryColor: "#1E40AF",
      palette: [
        { label: "Tech Blue", primary: "#2563EB", secondary: "#1E40AF" },
        { label: "Code Green", primary: "#059669", secondary: "#047857" },
        { label: "Dark Mode", primary: "#374151", secondary: "#1F2937" }
      ]
    }
  },
  {
    id: 'developer-pro',
    name: 'Developer Pro',
    description: `Advanced two-column layout with dedicated skills sidebar and project showcase area. Ideal for senior developers and tech leads.`,
    popularity: 4,
    category: 'Technology',
    industries: ['technology'],
    tier: 'premium',
    isUniversal: false,
    colorOptions: {
      allowUserColorOverride: true,
      defaultPrimaryColor: "#7C3AED",
      defaultSecondaryColor: "#5B21B6",
      palette: [
        { label: "Code Purple", primary: "#7C3AED", secondary: "#5B21B6" },
        { label: "Terminal Green", primary: "#10B981", secondary: "#059669" },
        { label: "GitHub Dark", primary: "#1F2937", secondary: "#111827" }
      ]
    }
  },

  // Healthcare Templates
  {
    id: 'medical-professional',
    name: 'Medical Professional',
    description: `Conservative layout emphasizing medical credentials and clinical experience with certification focus. Ideal for doctors and nurses.`,
    popularity: 3,
    category: 'Healthcare',
    industries: ['healthcare'],
    tier: 'premium',
    isUniversal: false,
    colorOptions: {
      allowUserColorOverride: true,
      defaultPrimaryColor: "#1E40AF",
      defaultSecondaryColor: "#1E3A8A",
      palette: [
        { label: "Medical Blue", primary: "#1E40AF", secondary: "#1E3A8A" },
        { label: "Health Green", primary: "#059669", secondary: "#047857" },
        { label: "Navy Professional", primary: "#1E3A8A", secondary: "#1E40AF" }
      ]
    }
  },
  {
    id: 'healthcare-modern',
    name: 'Healthcare Modern',
    description: `Contemporary yet professional design with clean sections for clinical experience and patient care achievements. Modern healthcare.`,
    popularity: 3,
    category: 'Healthcare',
    industries: ['healthcare'],
    tier: 'premium',
    isUniversal: false,
    colorOptions: {
      allowUserColorOverride: true,
      defaultPrimaryColor: "#059669",
      defaultSecondaryColor: "#047857",
      palette: [
        { label: "Clinical Green", primary: "#059669", secondary: "#047857" },
        { label: "Medical Teal", primary: "#0D9488", secondary: "#0F766E" },
        { label: "Healthcare Blue", primary: "#2563EB", secondary: "#1D4ED8" }
      ]
    }
  },

  // Finance Templates
  {
    id: 'finance-classic',
    name: 'Finance Classic',
    description: `Ultra-professional, traditional banking layout with emphasis on quantified achievements and financial metrics. Investment banking.`,
    popularity: 4,
    category: 'Finance',
    industries: ['finance'],
    tier: 'premium',
    isUniversal: false,
    colorOptions: {
      allowUserColorOverride: true,
      defaultPrimaryColor: "#1F2937",
      defaultSecondaryColor: "#374151",
      palette: [
        { label: "Banking Grey", primary: "#1F2937", secondary: "#374151" },
        { label: "Finance Navy", primary: "#1E3A8A", secondary: "#1E40AF" },
        { label: "Executive Black", primary: "#111827", secondary: "#1F2937" }
      ]
    }
  },
  {
    id: 'investment-pro',
    name: 'Investment Pro',
    description: `Metrics-driven layout optimized for quantified results and portfolio performance. Perfect for analysts and investment pros.`,
    popularity: 3,
    category: 'Finance',
    industries: ['finance'],
    tier: 'premium',
    isUniversal: false,
    colorOptions: {
      allowUserColorOverride: true,
      defaultPrimaryColor: "#DC2626",
      defaultSecondaryColor: "#B91C1C",
      palette: [
        { label: "Market Red", primary: "#DC2626", secondary: "#B91C1C" },
        { label: "Bull Green", primary: "#059669", secondary: "#047857" },
        { label: "Wall Street Navy", primary: "#1E3A8A", secondary: "#1E40AF" }
      ]
    }
  },
];

export function getTemplateById(id: string): ResumeTemplate | undefined {
  return templates.find(template => template.id === id);
}

export function getTemplateMetadata() {
  return templateMetadata;
}

export function getPopularTemplates(limit: number = 3): ResumeTemplate[] {
  return templates
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

export function getTemplatesByCategory(category: string): ResumeTemplate[] {
  return templates.filter(template => template.category === category);
}

export const searchTemplates = (query: string): ResumeTemplate[] => {
  const lowercaseQuery = query.toLowerCase();
  return templates.filter(template => 
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.category.toLowerCase().includes(lowercaseQuery)
  );
};

// Industry-specific template filtering functions
export const getTemplatesForUser = (selectedIndustry: string, userTier: 'free' | 'paid'): ResumeTemplate[] => {
  let availableTemplates: ResumeTemplate[] = [];
  // Always include the free Classic template
  const universalTemplate = templates.find(template => template.isUniversal && template.tier === 'free');
  if (universalTemplate) {
    availableTemplates.push(universalTemplate);
  }
  // Add up to 2 industry-specific premium templates for paid users
  if (userTier === 'paid' && selectedIndustry && selectedIndustry !== '') {
    const industryTemplates = templates.filter(template => 
      template.industries.includes(selectedIndustry) && 
      template.tier === 'premium'
    ).slice(0, 2); // Only allow 2 premium templates per industry
    availableTemplates = [...availableTemplates, ...industryTemplates];
  }
  return availableTemplates;
};

export const getLockedTemplatesForIndustry = (selectedIndustry: string): ResumeTemplate[] => {
  if (!selectedIndustry || selectedIndustry === '') {
    return [];
  }
  // Only return up to 2 premium templates per industry
  return templates.filter(template => 
    template.industries.includes(selectedIndustry) && 
    template.tier === 'premium'
  ).slice(0, 2);
};

export const getTemplatesByIndustry = (industry: string): ResumeTemplate[] => {
  return templates.filter(template => 
    template.industries.includes(industry) || template.isUniversal
  );
};

export const hasPremiumTemplates = (industry: string): boolean => {
  return templates.some(template => 
    template.industries.includes(industry) && template.tier === 'premium'
  );
};

export const getAllPremiumTemplates = (): ResumeTemplate[] => {
  return templates.filter(template => template.tier === 'premium');
};

export const getFreeTemplates = (): ResumeTemplate[] => {
  return templates.filter(template => template.tier === 'free');
}; 