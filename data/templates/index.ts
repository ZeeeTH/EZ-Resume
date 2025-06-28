import modernTemplate from './modern.json';
import classicTemplate from './classic.json';
import structuredTemplate from './structured.json';

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  popularity: number;
  category: string;
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
}

export const templates: ResumeTemplate[] = [
  {
    ...classicTemplate,
    fonts: {
      header: 'Merriweather, Georgia, serif',
      section: 'Lato, Arial, sans-serif',
      body: 'Lato, Arial, sans-serif',
    },
  },
  {
    ...modernTemplate,
    fonts: {
      header: 'Montserrat, Arial, sans-serif',
      section: 'Montserrat, Arial, sans-serif',
      body: 'Inter, Arial, sans-serif',
    },
  },
  {
    ...structuredTemplate,
    fonts: {
      header: 'Lora, Georgia, serif',
      section: 'Lato, Arial, sans-serif',
      body: 'Lato, Arial, sans-serif',
    },
  },
];

export const templateMetadata = [
  {
    id: 'classic',
    name: 'Classic',
    description: `Traditional single-column resume with clean section breaks, subtle icons, and serif headings. Ideal for finance and professional roles.`,
    popularity: 4,
    category: 'Traditional',
    colorOptions: {
      allowUserColorOverride: true,
      defaultPrimaryColor: "#374151",
      defaultSecondaryColor: "#6B7280",
      palette: [
        { label: "Greyscale", primary: "#374151", secondary: "#6B7280" },
        { label: "Emerald", primary: "#1F8072", secondary: "#4B5563" },
        { label: "Classic Blue", primary: "#1E3A8A", secondary: "#475569" },
        { label: "Burgundy", primary: "#7C2D12", secondary: "#78350F" },
        { label: "Slate Gray", primary: "#334155", secondary: "#64748B" }
      ]
    }
  },
  {
    id: 'modern',
    name: 'Modern',
    description: `Two-column layout with bold color accents and modern style. Ideal for tech, marketing, and creative roles.`,
    popularity: 5,
    category: 'Professional',
    colorOptions: {
      allowUserColorOverride: true,
      defaultPrimaryColor: "#374151",
      defaultSecondaryColor: "#6B7280",
      palette: [
        { label: "Greyscale", primary: "#374151", secondary: "#6B7280" },
        { label: "Pale Orange", primary: "#F59E0B", secondary: "#92400E" },
        { label: "Teal", primary: "#0D9488", secondary: "#134E4A" }
      ]
    }
  },
  {
    id: 'structured',
    name: 'Structured',
    description: `A polished, single-column layout with centered headings, subtle lines, and formal structure. Ideal for academic, administrative, and professional roles.`,
    popularity: 3,
    category: 'Clean',
    colorOptions: {
      allowUserColorOverride: true,
      defaultPrimaryColor: "#374151",
      defaultSecondaryColor: "#6B7280",
      palette: [
        { label: "Greyscale", primary: "#374151", secondary: "#6B7280" },
        { label: "Soft Deep Blue", primary: "#1E40AF", secondary: "#475569" },
        { label: "Sage Green", primary: "#6B7280", secondary: "#4B5563" }
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