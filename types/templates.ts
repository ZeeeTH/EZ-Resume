export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'classic' | 'creative' | 'minimalist' | 'professional';
  preview: string; // URL to preview image
  sections: {
    header: {
      name: string;
      email: string;
      phone: string;
      location: string;
      linkedin?: string;
      website?: string;
    };
    summary: string;
    experience: Array<{
      company: string;
      position: string;
      startDate: string;
      endDate?: string;
      current: boolean;
      description: string[];
    }>;
    education: Array<{
      institution: string;
      degree: string;
      field: string;
      startDate: string;
      endDate?: string;
      current: boolean;
      gpa?: string;
      honors?: string[];
    }>;
    skills: {
      technical: string[];
      soft: string[];
      languages?: string[];
    };
    projects?: Array<{
      name: string;
      description: string;
      technologies: string[];
      url?: string;
    }>;
    certifications?: Array<{
      name: string;
      issuer: string;
      date: string;
      url?: string;
    }>;
    achievements?: string[];
  };
  styling: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    spacing: 'compact' | 'standard' | 'spacious';
    layout: 'single-column' | 'two-column' | 'modern-grid';
  };
}

export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  category: ResumeTemplate['category'];
  preview: string;
  popularity: number; // 1-10 scale
  tags: string[];
} 