import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { serverErrorLogger } from '@/lib/error-logger-server'

// Check if we have the service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('API Route: Environment check:', {
  hasUrl: !!supabaseUrl,
  hasServiceRoleKey: !!serviceRoleKey,
  hasAnonKey: !!anonKey
})

// Create admin client that bypasses RLS (if we have service role key)
const supabaseAdmin = createClient(
  supabaseUrl!,
  serviceRoleKey || anonKey!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, color, due_date, owner_id } = body

    console.log('API Route: Creating project with data:', body)

    // Check if we have service role key
    if (!serviceRoleKey) {
      console.warn('API Route: No service role key found, using anon key (may fail due to RLS)')
      return NextResponse.json({ 
        error: 'Service role key not configured. Please add SUPABASE_SERVICE_ROLE_KEY to .env.local' 
      }, { status: 500 })
    }

    // Use admin client to bypass RLS policies
    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert({
        name,
        description,
        color,
        due_date,
        owner_id
      })
      .select()
      .single()

    console.log('API Route: Result:', { data, error })

    if (error) {
      serverErrorLogger.logDatabase('API_createProject', error, { body, hasServiceKey: !!serviceRoleKey })
      return NextResponse.json({ 
        error: error.message,
        details: 'Database operation failed. Check server logs for details.',
        hint: error.code === '42P17' ? 'RLS policy recursion detected - service role key needed' : undefined
      }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    serverErrorLogger.logApi('API_createProject', error, { body: request.body })
    console.error('API Route Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // For now, just return empty array
    // You can implement proper project fetching here later
    return NextResponse.json([])
  } catch (error) {
    serverErrorLogger.logApi('API_getProjects', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}