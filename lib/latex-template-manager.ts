import * as fs from 'fs';
import * as path from 'path';

export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  industry?: string;
  tier: 'free' | 'premium';
  author?: string;
  version?: string;
  tags?: string[];
  previewImage?: string;
  features?: string[];
}

export interface TemplateConfig extends TemplateMetadata {
  filePath: string;
  isActive: boolean;
  lastModified?: Date;
}

export class LaTeXTemplateManager {
  private templatesDir: string;
  private configFile: string;
  private templates: Map<string, TemplateConfig> = new Map();

  constructor() {
    this.templatesDir = path.join(process.cwd(), 'latex-templates');
    this.configFile = path.join(this.templatesDir, 'templates.json');
    this.ensureDirectories();
    this.loadTemplateConfigs();
  }

  private ensureDirectories(): void {
    if (!fs.existsSync(this.templatesDir)) {
      fs.mkdirSync(this.templatesDir, { recursive: true });
    }
  }

  private loadTemplateConfigs(): void {
    // Load existing configuration
    if (fs.existsSync(this.configFile)) {
      try {
        const configData = fs.readFileSync(this.configFile, 'utf8');
        const configs: TemplateConfig[] = JSON.parse(configData);
        
        configs.forEach(config => {
          this.templates.set(config.id, config);
        });
      } catch (error) {
        console.error('Failed to load template configurations:', error);
      }
    }

    // Scan for template files and update configurations
    this.scanTemplateFiles();
  }

  private scanTemplateFiles(): void {
    if (!fs.existsSync(this.templatesDir)) return;

    const files = fs.readdirSync(this.templatesDir)
      .filter(file => file.endsWith('.tex'));

    files.forEach(file => {
      const templateId = path.basename(file, '.tex');
      const filePath = path.join(this.templatesDir, file);
      const stats = fs.statSync(filePath);

      if (!this.templates.has(templateId)) {
        // Create default configuration for new templates
        const defaultConfig: TemplateConfig = {
          id: templateId,
          name: this.formatTemplateName(templateId),
          description: this.generateDefaultDescription(templateId),
          tier: 'free',
          filePath: filePath,
          isActive: true,
          lastModified: stats.mtime
        };
        
        this.templates.set(templateId, defaultConfig);
      } else {
        // Update file path and modification time
        const existing = this.templates.get(templateId)!;
        existing.filePath = filePath;
        existing.lastModified = stats.mtime;
      }
    });

    // Save updated configurations
    this.saveTemplateConfigs();
  }

  private formatTemplateName(templateId: string): string {
    return templateId
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  private generateDefaultDescription(templateId: string): string {
    const descriptions: Record<string, string> = {
      'classic-professional': 'Traditional professional layout with clean typography and elegant design',
      'modern-professional': 'Contemporary design with modern colors and improved readability',
      'tech-focused': 'Technology-oriented template with modern styling for tech professionals',
      'creative': 'Creative layout with unique design elements for creative professionals',
      'academic': 'Academic-focused template suitable for research and education positions',
      'healthcare': 'Professional healthcare template with medical industry focus',
      'finance': 'Corporate finance template with conservative professional styling',
      'marketing': 'Creative marketing template with modern visual elements'
    };

    return descriptions[templateId] || 'Professional resume template with clean design';
  }

  private saveTemplateConfigs(): void {
    try {
      const configs = Array.from(this.templates.values());
      fs.writeFileSync(this.configFile, JSON.stringify(configs, null, 2), 'utf8');
    } catch (error) {
      console.error('Failed to save template configurations:', error);
    }
  }

  /**
   * Get all available templates
   */
  getAvailableTemplates(filters?: {
    tier?: 'free' | 'premium';
    industry?: string;
    activeOnly?: boolean;
  }): TemplateConfig[] {
    let templates = Array.from(this.templates.values());

    if (filters) {
      if (filters.activeOnly !== false) {
        templates = templates.filter(t => t.isActive);
      }
      
      if (filters.tier) {
        templates = templates.filter(t => t.tier === filters.tier);
      }
      
      if (filters.industry) {
        templates = templates.filter(t => 
          t.industry === filters.industry || 
          t.tags?.includes(filters.industry)
        );
      }
    }

    return templates.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get template by ID
   */
  getTemplate(templateId: string): TemplateConfig | null {
    return this.templates.get(templateId) || null;
  }

  /**
   * Get template content
   */
  getTemplateContent(templateId: string): string | null {
    const template = this.templates.get(templateId);
    if (!template || !template.isActive) return null;

    try {
      return fs.readFileSync(template.filePath, 'utf8');
    } catch (error) {
      console.error(`Failed to read template ${templateId}:`, error);
      return null;
    }
  }

  /**
   * Create or update template
   */
  createTemplate(templateId: string, content: string, metadata?: Partial<TemplateMetadata>): boolean {
    try {
      const filePath = path.join(this.templatesDir, `${templateId}.tex`);
      fs.writeFileSync(filePath, content, 'utf8');

      const config: TemplateConfig = {
        id: templateId,
        name: metadata?.name || this.formatTemplateName(templateId),
        description: metadata?.description || this.generateDefaultDescription(templateId),
        industry: metadata?.industry,
        tier: metadata?.tier || 'free',
        author: metadata?.author,
        version: metadata?.version || '1.0.0',
        tags: metadata?.tags || [],
        previewImage: metadata?.previewImage,
        features: metadata?.features || [],
        filePath: filePath,
        isActive: true,
        lastModified: new Date()
      };

      this.templates.set(templateId, config);
      this.saveTemplateConfigs();
      return true;
    } catch (error) {
      console.error(`Failed to create template ${templateId}:`, error);
      return false;
    }
  }

  /**
   * Update template metadata
   */
  updateTemplateMetadata(templateId: string, metadata: Partial<TemplateMetadata>): boolean {
    const template = this.templates.get(templateId);
    if (!template) return false;

    try {
      Object.assign(template, metadata);
      this.saveTemplateConfigs();
      return true;
    } catch (error) {
      console.error(`Failed to update template metadata ${templateId}:`, error);
      return false;
    }
  }

  /**
   * Activate/deactivate template
   */
  setTemplateActive(templateId: string, isActive: boolean): boolean {
    const template = this.templates.get(templateId);
    if (!template) return false;

    template.isActive = isActive;
    this.saveTemplateConfigs();
    return true;
  }

  /**
   * Delete template
   */
  deleteTemplate(templateId: string): boolean {
    const template = this.templates.get(templateId);
    if (!template) return false;

    try {
      if (fs.existsSync(template.filePath)) {
        fs.unlinkSync(template.filePath);
      }
      
      this.templates.delete(templateId);
      this.saveTemplateConfigs();
      return true;
    } catch (error) {
      console.error(`Failed to delete template ${templateId}:`, error);
      return false;
    }
  }

  /**
   * Get templates by industry
   */
  getTemplatesByIndustry(industry: string, userTier: 'free' | 'premium' = 'free'): TemplateConfig[] {
    return this.getAvailableTemplates({
      industry,
      tier: userTier === 'premium' ? undefined : 'free',
      activeOnly: true
    });
  }

  /**
   * Get template statistics
   */
  getTemplateStats(): {
    total: number;
    active: number;
    inactive: number;
    byTier: { free: number; premium: number };
    byIndustry: Record<string, number>;
  } {
    const templates = Array.from(this.templates.values());
    
    const stats = {
      total: templates.length,
      active: templates.filter(t => t.isActive).length,
      inactive: templates.filter(t => !t.isActive).length,
      byTier: {
        free: templates.filter(t => t.tier === 'free').length,
        premium: templates.filter(t => t.tier === 'premium').length
      },
      byIndustry: {} as Record<string, number>
    };

    templates.forEach(template => {
      if (template.industry) {
        stats.byIndustry[template.industry] = (stats.byIndustry[template.industry] || 0) + 1;
      }
    });

    return stats;
  }

  /**
   * Export template configuration
   */
  exportTemplateConfig(templateId: string): string | null {
    const template = this.templates.get(templateId);
    if (!template) return null;

    const content = this.getTemplateContent(templateId);
    if (!content) return null;

    const exportData = {
      metadata: {
        id: template.id,
        name: template.name,
        description: template.description,
        industry: template.industry,
        tier: template.tier,
        author: template.author,
        version: template.version,
        tags: template.tags,
        features: template.features
      },
      content: content
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Import template from configuration
   */
  importTemplateConfig(configData: string): boolean {
    try {
      const data = JSON.parse(configData);
      const { metadata, content } = data;

      if (!metadata.id || !content) {
        throw new Error('Invalid template configuration');
      }

      return this.createTemplate(metadata.id, content, metadata);
    } catch (error) {
      console.error('Failed to import template configuration:', error);
      return false;
    }
  }

  /**
   * Validate template syntax
   */
  validateTemplate(templateId: string): { valid: boolean; errors: string[] } {
    const content = this.getTemplateContent(templateId);
    if (!content) {
      return { valid: false, errors: ['Template not found'] };
    }

    const errors: string[] = [];

    // Basic LaTeX syntax validation
    const documentClassMatch = content.match(/\\documentclass/);
    if (!documentClassMatch) {
      errors.push('Missing \\documentclass declaration');
    }

    const beginDocMatch = content.match(/\\begin\{document\}/);
    if (!beginDocMatch) {
      errors.push('Missing \\begin{document}');
    }

    const endDocMatch = content.match(/\\end\{document\}/);
    if (!endDocMatch) {
      errors.push('Missing \\end{document}');
    }

    // Check for unmatched braces
    const openBraces = (content.match(/\{/g) || []).length;
    const closeBraces = (content.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push(`Unmatched braces: ${openBraces} open, ${closeBraces} close`);
    }

    // Check for required template variables
    const requiredVars = ['personalDetails.fullName', 'personalDetails.email'];
    requiredVars.forEach(varName => {
      if (!content.includes(`{{${varName}}}`)) {
        errors.push(`Missing required variable: {{${varName}}}`);
      }
    });

    return { valid: errors.length === 0, errors };
  }

  /**
   * Refresh template list from file system
   */
  refresh(): void {
    this.templates.clear();
    this.loadTemplateConfigs();
  }
} 