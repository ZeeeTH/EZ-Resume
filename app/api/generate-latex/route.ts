import { NextRequest, NextResponse } from 'next/server';
import { LaTeXTemplateProcessor } from '../../../lib/latex-template-processor';
import { FormData } from '../../../types';
import * as fs from 'fs';
import * as path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userData, templateName = 'classic-professional', userId, downloadMode = false } = body;

    // Validate required data
    if (!userData) {
      return NextResponse.json(
        { error: 'User data is required' },
        { status: 400 }
      );
    }

    // Validate form data structure
    const requiredFields = ['name', 'email', 'skills'];
    for (const field of requiredFields) {
      if (!userData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Initialize the LaTeX processor
    const processor = new LaTeXTemplateProcessor();

    // Check if template exists
    const availableTemplates = processor.getAvailableTemplates();
    if (!availableTemplates.includes(templateName)) {
      return NextResponse.json(
        { 
          error: `Template '${templateName}' not found. Available templates: ${availableTemplates.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Generate the resume PDF
    const result = await processor.generateResume(userData, templateName, userId);

    if (!result.success) {
      console.error('LaTeX generation failed:', result.error);
      return NextResponse.json(
        { error: result.error || 'PDF generation failed' },
        { status: 500 }
      );
    }

    if (!result.pdfPath || !fs.existsSync(result.pdfPath)) {
      return NextResponse.json(
        { error: 'Generated PDF file not found' },
        { status: 500 }
      );
    }

    // Read the PDF file
    const pdfBuffer = fs.readFileSync(result.pdfPath);

    // Clean up the generated file
    fs.unlink(result.pdfPath, (err) => {
      if (err) console.error('Failed to cleanup PDF file:', err);
    });

    if (downloadMode) {
      // Return PDF for download
      const fileName = result.filename || 'resume.pdf';
      
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'Content-Length': pdfBuffer.length.toString(),
        },
      });
    } else {
      // Return PDF for preview
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline',
          'Content-Length': pdfBuffer.length.toString(),
        },
      });
    }

  } catch (error) {
    console.error('LaTeX API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

// GET endpoint to list available templates
export async function GET() {
  try {
    const processor = new LaTeXTemplateProcessor();
    const templates = processor.getAvailableTemplates();
    
    return NextResponse.json({
      success: true,
      templates: templates.map(name => ({
        id: name,
        name: name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: getTemplateDescription(name)
      }))
    });
  } catch (error) {
    console.error('Error listing templates:', error);
    return NextResponse.json(
      { error: 'Failed to list templates' },
      { status: 500 }
    );
  }
}

function getTemplateDescription(templateName: string): string {
  const descriptions: Record<string, string> = {
    'classic-professional': 'Traditional professional layout with clean typography and elegant design',
    'modern-professional': 'Contemporary design with modern colors and improved readability',
    'tech-focused': 'Technology-oriented template with modern styling for tech professionals',
    'creative': 'Creative layout with unique design elements for creative professionals',
    'academic': 'Academic-focused template suitable for research and education positions'
  };
  
  return descriptions[templateName] || 'Professional resume template with clean design';
} 