import { LaTeXCompiler, LaTeXCompilationResult } from './latex-compiler';
import { FormData } from '../types';
import * as fs from 'fs';
import * as path from 'path';

export interface ProcessedUserData {
  personalDetails: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
  };
  professionalSummary?: string;
  workExperience: Array<{
    jobTitle: string;
    company: string;
    location?: string;
    startDate: string;
    endDate: string;
    description: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location?: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: string;
  achievements?: string;
}

export interface TemplateGenerationResult {
  success: boolean;
  pdfPath?: string;
  filename?: string;
  error?: string;
}

export class LaTeXTemplateProcessor {
  private compiler: LaTeXCompiler;
  private templatesDir: string;

  constructor() {
    this.compiler = new LaTeXCompiler();
    this.templatesDir = path.join(process.cwd(), 'latex-templates');
    this.ensureTemplatesDirectory();
  }

  private ensureTemplatesDirectory(): void {
    if (!fs.existsSync(this.templatesDir)) {
      fs.mkdirSync(this.templatesDir, { recursive: true });
    }
  }

  async generateResume(
    userData: FormData, 
    templateName: string = 'classic-professional',
    userId?: string
  ): Promise<TemplateGenerationResult> {
    try {
      // Process user data for LaTeX
      const processedData = this.processUserData(userData);

      // Load LaTeX template
      const templatePath = path.join(this.templatesDir, `${templateName}.tex`);
      if (!fs.existsSync(templatePath)) {
        return {
          success: false,
          error: `Template not found: ${templateName}`
        };
      }

      let templateContent = fs.readFileSync(templatePath, 'utf8');

      // Inject user data into template
      templateContent = this.compiler.injectUserData(templateContent, processedData);

      // Generate unique filename
      const timestamp = Date.now();
      const filename = `resume_${userId || 'user'}_${timestamp}`;

      // Compile to PDF
      const result: LaTeXCompilationResult = await this.compiler.compileToPDF(
        templateContent,
        filename
      );

      if (result.success && result.pdfPath) {
        return {
          success: true,
          pdfPath: result.pdfPath,
          filename: `${filename}.pdf`
        };
      } else {
        return {
          success: false,
          error: result.error || 'Unknown compilation error'
        };
      }

    } catch (error) {
      return {
        success: false,
        error: `Template processing failed: ${(error as Error).message}`
      };
    }
  }

  private processUserData(userData: FormData): ProcessedUserData & { skillsList: string[] } {
    // Create processed data structure for LaTeX templates
    const processed: ProcessedUserData & { skillsList: string[] } = {
      personalDetails: {
        fullName: this.compiler.escapeLatex(userData.name),
        email: this.compiler.escapeLatex(userData.email),
        phone: this.compiler.escapeLatex(userData.phone),
        location: this.compiler.escapeLatex(userData.location),
      },
      workExperience: [],
      education: [],
      skills: this.compiler.escapeLatex(userData.skills),
      achievements: this.compiler.escapeLatex(userData.achievements),
      skillsList: []
    };

    // Process professional summary
    if (userData.personalSummary) {
      processed.professionalSummary = this.compiler.escapeLatex(userData.personalSummary);
    }

    // Process work experience
    if (userData.workExperience) {
      processed.workExperience = userData.workExperience.map(job => {
        // Create date strings
        const startDate = job.startMonth && job.startYear ? 
          `${job.startMonth} ${job.startYear}` : 
          job.startYear || '';
        
        const endDate = job.endMonth && job.endYear ? 
          `${job.endMonth} ${job.endYear}` : 
          job.endYear || 'Present';

        // Split description into bullet points if it's a single string
        let description: string[] = [];
        if (typeof job.description === 'string') {
          // Split by common delimiters and clean up
          description = job.description
            .split(/[•\n\r]|(?:\d+\.\s)/)
            .map(item => item.trim())
            .filter(item => item.length > 0)
            .map(item => this.compiler.escapeLatex(item));
        } else if (Array.isArray(job.description)) {
          description = job.description.map(item => this.compiler.escapeLatex(item));
        }

        return {
          jobTitle: this.compiler.escapeLatex(job.title),
          company: this.compiler.escapeLatex(job.company),
          startDate: this.compiler.escapeLatex(startDate),
          endDate: this.compiler.escapeLatex(endDate),
          description
        };
      });
    }

    // Process education
    if (userData.education) {
      processed.education = userData.education.map(edu => {
        const graduationDate = edu.endMonth && edu.endYear ? 
          `${edu.endMonth} ${edu.endYear}` : 
          edu.endYear || '';

        return {
          degree: this.compiler.escapeLatex(edu.degree),
          institution: this.compiler.escapeLatex(edu.school),
          graduationDate: this.compiler.escapeLatex(graduationDate)
        };
      });
    }

    // Process skills into a list
    if (userData.skills) {
      processed.skillsList = userData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0)
        .map(skill => this.compiler.escapeLatex(skill));
    }

    return processed;
  }

  /**
   * Get available LaTeX templates
   */
  getAvailableTemplates(): string[] {
    if (!fs.existsSync(this.templatesDir)) {
      return [];
    }

    return fs.readdirSync(this.templatesDir)
      .filter(file => file.endsWith('.tex'))
      .map(file => path.basename(file, '.tex'));
  }

  /**
   * Create a new template file
   */
  createTemplate(templateName: string, content: string): boolean {
    try {
      const templatePath = path.join(this.templatesDir, `${templateName}.tex`);
      fs.writeFileSync(templatePath, content, 'utf8');
      return true;
    } catch (error) {
      console.error('Failed to create template:', error);
      return false;
    }
  }
} 