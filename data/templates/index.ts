import { ResumeTemplate, TemplateMetadata } from '../../types/templates';
import modernTemplate from './modern.json';
import classicTemplate from './classic.json';
import minimalistTemplate from './minimalist.json';

// Import all templates
export const templates: ResumeTemplate[] = [
  modernTemplate as ResumeTemplate,
  classicTemplate as ResumeTemplate,
  minimalistTemplate as ResumeTemplate,
];

// Template metadata for the template picker
export const templateMetadata: TemplateMetadata[] = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'A sleek, contemporary design with clean lines and modern typography. Perfect for tech and creative industries.',
    category: 'modern',
    preview: '/templates/modern-preview.png',
    popularity: 9,
    tags: ['tech', 'creative', 'modern', 'professional']
  },
  {
    id: 'classic',
    name: 'Classic Professional',
    description: 'A traditional, conservative design that\'s perfect for corporate environments and traditional industries.',
    category: 'classic',
    preview: '/templates/classic-preview.png',
    popularity: 8,
    tags: ['corporate', 'traditional', 'conservative', 'business']
  },
  {
    id: 'minimalist',
    name: 'Minimalist Clean',
    description: 'A clean, minimalist design with plenty of white space. Perfect for creative professionals and modern workplaces.',
    category: 'minimalist',
    preview: '/templates/minimalist-preview.png',
    popularity: 7,
    tags: ['minimalist', 'clean', 'creative', 'modern']
  }
];

// Helper functions
export const getTemplateById = (id: string): ResumeTemplate | undefined => {
  return templates.find(template => template.id === id);
};

export const getTemplatesByCategory = (category: ResumeTemplate['category']): ResumeTemplate[] => {
  return templates.filter(template => template.category === category);
};

export const getPopularTemplates = (limit: number = 3): ResumeTemplate[] => {
  return templateMetadata
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit)
    .map(meta => getTemplateById(meta.id)!);
};

export const searchTemplates = (query: string): ResumeTemplate[] => {
  const lowercaseQuery = query.toLowerCase();
  return templates.filter(template => 
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.category.toLowerCase().includes(lowercaseQuery) ||
    templateMetadata.find(meta => meta.id === template.id)?.tags.some(tag => 
      tag.toLowerCase().includes(lowercaseQuery)
    )
  );
}; 