import { NextRequest, NextResponse } from 'next/server';
import { LaTeXTemplateProcessor } from '../../../lib/latex-template-processor';
import * as fs from 'fs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userData, templateName = 'classic-professional', userId } = body;

    // Validate required data
    if (!userData) {
      return NextResponse.json(
        { error: 'User data is required' },
        { status: 400 }
      );
    }

    // Initialize the LaTeX processor
    const processor = new LaTeXTemplateProcessor();

    // Generate the resume PDF for preview
    const result = await processor.generateResume(userData, templateName, userId);

    if (!result.success) {
      console.error('LaTeX preview generation failed:', result.error);
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

    // Clean up the generated file after a short delay
    setTimeout(() => {
      fs.unlink(result.pdfPath!, (err) => {
        if (err) console.error('Failed to cleanup preview PDF file:', err);
      });
    }, 1000);

    // Return PDF for inline preview
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });

  } catch (error) {
    console.error('LaTeX preview API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
} 