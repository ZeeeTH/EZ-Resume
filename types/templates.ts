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

export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  popularity: number;
  category: string;
} 