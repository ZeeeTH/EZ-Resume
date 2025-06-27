import modernTemplate from './modern.json';
import classicTemplate from './classic.json';
import minimalistTemplate from './minimalist.json';

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
    layout: 'modern' | 'classic' | 'minimalist';
  };
  sampleData: {
    name: string;
    contact: {
      email: string;
      phone: string;
      location: string;
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
        dates: string;
      }>;
      categories?: Record<string, string[]>;
    }>;
  };
}

export const templates: ResumeTemplate[] = [
  modernTemplate as ResumeTemplate,
  classicTemplate as ResumeTemplate,
  minimalistTemplate as ResumeTemplate,
];

export const templateMetadata = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with bold typography and clean lines',
    popularity: 5,
    category: 'Professional',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional format with formal typography and professional layout',
    popularity: 4,
    category: 'Traditional',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean design with maximum white space and subtle typography',
    popularity: 3,
    category: 'Clean',
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