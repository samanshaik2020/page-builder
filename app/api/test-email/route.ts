import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables for admin operations')
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function POST(request: NextRequest) {
  try {
    const { email, testType = 'invite' } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    console.log(`Testing ${testType} email for:`, email)

    let result
    let error

    switch (testType) {
      case 'invite':
        // Test user invitation
        const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
        })
        result = inviteData
        error = inviteError
        break

      case 'signup':
        // Test signup confirmation
        const { data: signupData, error: signupError } = await supabaseAdmin.auth.signUp({
          email,
          password: 'temporary-password-123!',
          options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
          }
        })
        result = signupData
        error = signupError
        break

      case 'reset':
        // Test password reset
        const { data: resetData, error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password`
        })
        result = resetData
        error = resetError
        break

      default:
        return NextResponse.json(
          { error: 'Invalid test type. Use: invite, signup, or reset' },
          { status: 400 }
        )
    }

    if (error) {
      console.error(`${testType} email test failed:`, {
        message: error.message,
        status: error.status,
        details: error
      })

      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          details: {
            status: error.status,
            code: error.code || 'unknown'
          }
        },
        { status: 400 }
      )
    }

    console.log(`${testType} email test successful:`, result)

    return NextResponse.json({
      success: true,
      message: `${testType} email sent successfully`,
      data: result
    })

  } catch (err) {
    console.error('Email test error:', err)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: err instanceof Error ? err.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Email test endpoint',
    usage: {
      method: 'POST',
      body: {
        email: 'test@example.com',
        testType: 'invite | signup | reset'
      }
    },
    environment: {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      serviceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    }
  })
}
