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
  fonts?: {
    header?: string;
    section?: string;
    body?: string;
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
}

export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  popularity: number;
  category: string;
  industries: string[]; // which industries this template serves
  tier: 'free' | 'premium'; // template tier
  isUniversal: boolean; // true for templates that work for all industries
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
} 