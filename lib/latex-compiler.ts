import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { spawn } from 'child_process';

export interface LaTeXCompilationOptions {
  engine?: 'pdflatex' | 'xelatex' | 'lualatex';
  passes?: number;
  timeout?: number;
}

export interface LaTeXCompilationResult {
  success: boolean;
  pdfPath?: string;
  error?: string;
  log?: string;
}

export class LaTeXCompiler {
  private templateDir: string;
  private outputDir: string;

  constructor() {
    this.templateDir = path.join(process.cwd(), 'latex-templates');
    this.outputDir = path.join(process.cwd(), 'generated-pdfs');
    
    // Ensure directories exist
    this.ensureDirectories();
  }

  private ensureDirectories(): void {
    if (!fs.existsSync(this.templateDir)) {
      fs.mkdirSync(this.templateDir, { recursive: true });
    }
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async compileToPDF(
    templateContent: string, 
    outputFileName: string,
    options: LaTeXCompilationOptions = {}
  ): Promise<LaTeXCompilationResult> {
    const {
      engine = 'pdflatex',
      passes = 2,
      timeout = 30000
    } = options;

    // Create temporary directory for compilation
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'latex-compile-'));
    const texFile = path.join(tempDir, 'document.tex');
    const pdfFile = path.join(tempDir, 'document.pdf');
    const logFile = path.join(tempDir, 'document.log');

    try {
      // Write LaTeX content to temporary file
      fs.writeFileSync(texFile, templateContent, 'utf8');

      // Compile LaTeX document (multiple passes for references)
      for (let pass = 0; pass < passes; pass++) {
        const result = await this.runLatexCommand(engine, texFile, tempDir, timeout);
        if (!result.success && pass === passes - 1) {
          return {
            success: false,
            error: result.error,
            log: result.log
          };
        }
      }

      // Check if PDF was generated
      if (!fs.existsSync(pdfFile)) {
        const log = fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf8') : '';
        return {
          success: false,
          error: 'PDF generation failed - no output file created',
          log
        };
      }

      // Copy PDF to output directory
      const finalPdfPath = path.join(this.outputDir, `${outputFileName}.pdf`);
      fs.copyFileSync(pdfFile, finalPdfPath);

      return {
        success: true,
        pdfPath: finalPdfPath
      };

    } catch (error) {
      return {
        success: false,
        error: `LaTeX compilation failed: ${(error as Error).message}`
      };
    } finally {
      // Clean up temporary directory
      try {
        if (fs.existsSync(tempDir)) {
          fs.rmSync(tempDir, { recursive: true, force: true });
        }
      } catch (cleanupError) {
        // Log cleanup error but don't fail the operation
        console.warn('Failed to cleanup temporary directory:', cleanupError);
      }
    }
  }

  private runLatexCommand(
    engine: string, 
    texFile: string, 
    workingDir: string,
    timeout: number
  ): Promise<{ success: boolean; error?: string; log?: string }> {
    return new Promise((resolve) => {
      const args = [
        '-interaction=nonstopmode',
        '-output-directory=' + workingDir,
        texFile
      ];

      // On Windows, use full path to MiKTeX
      let enginePath = engine;
      if (process.platform === 'win32') {
        const os = require('os');
        const username = os.userInfo().username;
        enginePath = `C:\\Users\\${username}\\AppData\\Local\\Programs\\MiKTeX\\miktex\\bin\\x64\\${engine}.exe`;
      }

      const childProcess = spawn(enginePath, args, {
        cwd: workingDir,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      childProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      childProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      const timer = setTimeout(() => {
        childProcess.kill();
        resolve({
          success: false,
          error: 'LaTeX compilation timed out'
        });
      }, timeout);

      childProcess.on('close', (code) => {
        clearTimeout(timer);
        
        const logFile = path.join(workingDir, 'document.log');
        const log = fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf8') : '';

        if (code === 0) {
          resolve({ success: true });
        } else {
          resolve({
            success: false,
            error: `LaTeX compilation failed with code ${code}`,
            log: log || stderr
          });
        }
      });

      childProcess.on('error', (error) => {
        clearTimeout(timer);
        resolve({
          success: false,
          error: `Failed to start LaTeX process: ${error.message}`
        });
      });
    });
  }

  /**
   * Escape LaTeX special characters in text
   */
  escapeLatex(text: string | undefined | null): string {
    if (!text) return '';
    
    return text
      .replace(/\\/g, '\\textbackslash{}')
      .replace(/\{/g, '\\{')
      .replace(/\}/g, '\\}')
      .replace(/\$/g, '\\$')
      .replace(/&/g, '\\&')
      .replace(/%/g, '\\%')
      .replace(/#/g, '\\#')
      .replace(/\^/g, '\\textasciicircum{}')
      .replace(/_/g, '\\_')
      .replace(/~/g, '\\textasciitilde{}');
  }

  /**
   * Process URLs for LaTeX hyperlinks
   */
  processUrl(url: string | undefined | null): string {
    if (!url) return '';
    
    // Ensure URL has protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    return this.escapeLatex(url);
  }

  /**
   * Get nested value from object using dot notation
   */
  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Replace template variables in LaTeX content
   */
  injectUserData(template: string, userData: any): string {
    // Replace simple {{VARIABLE}} placeholders
    let result = template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
      const value = this.getNestedValue(userData, key);
      if (typeof value === 'string') {
        return this.escapeLatex(value);
      }
      return value || '';
    });

    // Handle array iterations like {{#WORK_EXPERIENCE}}...{{/WORK_EXPERIENCE}}
    result = result.replace(/\{\{#([A-Z_]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (match, arrayKey, itemTemplate) => {
      const array = userData[arrayKey] || userData[arrayKey.toLowerCase()];
      if (!Array.isArray(array)) return '';
      
      return array.map(item => {
        return itemTemplate.replace(/\{\{([^}]+)\}\}/g, (itemMatch, itemKey) => {
          if (itemKey === '.') return this.escapeLatex(item);
          const value = this.getNestedValue(item, itemKey);
          if (typeof value === 'string') {
            return this.escapeLatex(value);
          }
          return value || '';
        });
      }).join('\n');
    });

    return result;
  }
} 