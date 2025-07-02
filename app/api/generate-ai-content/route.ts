import { NextRequest, NextResponse } from 'next/server';
import { generateAIContent, AIContentParams } from '../../../lib/openai';

export async function POST(request: NextRequest) {
  try {
    const params: AIContentParams = await request.json();

    // Validate required parameters
    if (!params.contentType || !params.jobTitle) {
      return NextResponse.json(
        { success: false, error: 'invalid_params', message: 'Content type and job title are required' },
        { status: 400 }
      );
    }

    // Generate AI content
    const result = await generateAIContent(params);

    return NextResponse.json(result, { 
      status: result.success ? 200 : 400 
    });

  } catch (error) {
    console.error('AI content generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'api_error', 
        message: 'Failed to generate AI content' 
      },
      { status: 500 }
    );
  }
} 