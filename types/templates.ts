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
  sampleData?: any; // Flexible sample data structure
  layout?: {
    main?: string[];
    sidebar?: string[];
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