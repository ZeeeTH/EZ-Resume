import { NextResponse } from 'next/server'

export async function GET() {
  const envCheck = {
    openai: !!process.env.OPENAI_API_KEY,
    gmail_user: !!process.env.GMAIL_USER,
    gmail_pass: !!process.env.GMAIL_PASS,
    node_env: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  }

  return NextResponse.json({
    success: true,
    environment: envCheck,
    message: 'Environment check completed'
  })
} 