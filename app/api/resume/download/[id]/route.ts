import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import * as fs from 'fs'
import * as path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resumeId = params.id
    
    if (!resumeId) {
      return NextResponse.json({ error: 'Resume ID is required' }, { status: 400 })
    }

    // Get resume details from database
    const { data: resume, error } = await supabase
      .from('resumes')
      .select('id, title, pdf_path, user_id')
      .eq('id', resumeId)
      .single()

    if (error || !resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    // Check if PDF path exists
    if (!resume.pdf_path) {
      return NextResponse.json({ error: 'PDF not found' }, { status: 404 })
    }

    // Check if file exists on disk
    if (!fs.existsSync(resume.pdf_path)) {
      return NextResponse.json({ error: 'PDF file not found on server' }, { status: 404 })
    }

    // Read the PDF file
    const pdfBuffer = fs.readFileSync(resume.pdf_path)
    
    // Create response with PDF content
    const response = new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${resume.title || 'resume'}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    })

    return response

  } catch (error) {
    console.error('Error downloading resume:', error)
    return NextResponse.json({ error: 'Failed to download resume' }, { status: 500 })
  }
} 