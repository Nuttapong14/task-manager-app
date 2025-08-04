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

export async function GET(request: NextRequest) {
  try {
    console.log('API Route: Getting projects')

    // Check if we have service role key
    if (!serviceRoleKey) {
      console.warn('API Route: No service role key found for GET projects')
      return NextResponse.json({ 
        error: 'Service role key not configured. Please add SUPABASE_SERVICE_ROLE_KEY to .env.local' 
      }, { status: 500 })
    }

    // Get user ID from query parameter for security
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')

    let query = supabaseAdmin
      .from('projects')
      .select(`
        *,
        tasks(id, status)
      `)
      .order('created_at', { ascending: false })

    // If userId is provided, filter by owner_id
    if (userId) {
      console.log('API Route: Filtering projects for user:', userId)
      query = query.eq('owner_id', userId)
    } else {
      console.log('API Route: Getting all projects (no user filter)')
    }

    const { data, error } = await query

    console.log('API Route: Get projects result:', { data: data?.length, error })

    if (error) {
      serverErrorLogger.logDatabase('API_getProjects', error)
      return NextResponse.json({ 
        error: error.message,
        details: 'Database operation failed. Check server logs for details.',
        hint: error.code === '42P17' ? 'RLS policy recursion detected' : undefined
      }, { status: 400 })
    }

    // Transform data to match existing interface with real task statistics
    const transformedData = data?.map(project => {
      const tasks = project.tasks || []
      const totalTasks = tasks.length
      const completedTasks = tasks.filter(task => task.status === 'done').length
      
      return {
        ...project,
        members: 1, // Default to 1 (owner)
        tasks: {
          total: totalTasks,
          completed: completedTasks
        }
      }
    }) || []

    return NextResponse.json(transformedData)
  } catch (error) {
    serverErrorLogger.logApi('API_getProjects', error)
    console.error('API Route Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('API Route: Deleting project')

    // Check if we have service role key
    if (!serviceRoleKey) {
      console.warn('API Route: No service role key found for DELETE projects')
      return NextResponse.json({ 
        error: 'Service role key not configured. Please add SUPABASE_SERVICE_ROLE_KEY to .env.local' 
      }, { status: 500 })
    }

    // Get project ID from query parameter
    const url = new URL(request.url)
    const projectId = url.searchParams.get('id')

    if (!projectId) {
      return NextResponse.json({ 
        error: 'Project ID is required' 
      }, { status: 400 })
    }

    console.log('API Route: Deleting project:', projectId)

    // Use admin client to bypass RLS policies
    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', projectId)

    console.log('API Route: Delete result:', { error })

    if (error) {
      serverErrorLogger.logDatabase('API_deleteProject', error, { projectId })
      return NextResponse.json({ 
        error: error.message,
        details: 'Database operation failed. Check server logs for details.',
        hint: error.code === '42P17' ? 'RLS policy recursion detected' : undefined
      }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    serverErrorLogger.logApi('API_deleteProject', error)
    console.error('API Route Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('API Route: Updating project')

    // Check if we have service role key
    if (!serviceRoleKey) {
      console.warn('API Route: No service role key found for PUT projects')
      return NextResponse.json({ 
        error: 'Service role key not configured. Please add SUPABASE_SERVICE_ROLE_KEY to .env.local' 
      }, { status: 500 })
    }

    // Get project ID from query parameter
    const url = new URL(request.url)
    const projectId = url.searchParams.get('id')

    if (!projectId) {
      return NextResponse.json({ 
        error: 'Project ID is required' 
      }, { status: 400 })
    }

    const body = await request.json()
    console.log('API Route: Updating project with data:', { projectId, updates: body })

    // Use admin client to bypass RLS policies
    const { data, error } = await supabaseAdmin
      .from('projects')
      .update(body)
      .eq('id', projectId)
      .select()
      .single()

    console.log('API Route: Update result:', { data, error })

    if (error) {
      serverErrorLogger.logDatabase('API_updateProject', error, { projectId, body })
      return NextResponse.json({ 
        error: error.message,
        details: 'Database operation failed. Check server logs for details.',
        hint: error.code === '42P17' ? 'RLS policy recursion detected' : undefined
      }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    serverErrorLogger.logApi('API_updateProject', error)
    console.error('API Route Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}