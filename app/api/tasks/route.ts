import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { serverErrorLogger } from '@/lib/error-logger-server'

// Check if we have the service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Tasks API Route: Environment check:', {
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

export async function GET(request: NextRequest) {
  try {
    console.log('API Route: Getting tasks')

    // Check if we have service role key
    if (!serviceRoleKey) {
      console.warn('API Route: No service role key found for GET tasks')
      return NextResponse.json({ 
        error: 'Service role key not configured. Please add SUPABASE_SERVICE_ROLE_KEY to .env.local' 
      }, { status: 500 })
    }

    // Get project ID from query parameter
    const url = new URL(request.url)
    const projectId = url.searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json({ 
        error: 'Project ID is required' 
      }, { status: 400 })
    }

    console.log('API Route: Getting tasks for project:', projectId)

    // Use admin client to bypass RLS policies
    const { data, error } = await supabaseAdmin
      .from('tasks')
      .select(`
        *,
        assignee:profiles!tasks_assignee_id_fkey(id, name, avatar_url),
        created_by_profile:profiles!tasks_created_by_fkey(id, name),
        task_tags(tag),
        comments(count)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    console.log('API Route: Get tasks result:', { data: data?.length, error })

    if (error) {
      serverErrorLogger.logDatabase('API_getTasks', error, { projectId })
      return NextResponse.json({ 
        error: error.message,
        details: 'Database operation failed. Check server logs for details.',
        hint: error.code === '42P17' ? 'RLS policy recursion detected' : undefined
      }, { status: 400 })
    }

    // Transform data to match existing interface
    const transformedData = data?.map(task => ({
      ...task,
      tags: task.task_tags?.map(t => t.tag) || [],
      comments: task.comments?.[0]?.count || 0,
      assignee: task.assignee ? {
        id: task.assignee.id,
        name: task.assignee.name,
        avatar: task.assignee.avatar_url
      } : null
    })) || []

    return NextResponse.json(transformedData)
  } catch (error) {
    serverErrorLogger.logApi('API_getTasks', error)
    console.error('API Route Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('API Route: Creating task with data:', body)

    // Check if we have service role key
    if (!serviceRoleKey) {
      console.warn('API Route: No service role key found, using anon key (may fail due to RLS)')
      return NextResponse.json({ 
        error: 'Service role key not configured. Please add SUPABASE_SERVICE_ROLE_KEY to .env.local' 
      }, { status: 500 })
    }

    // Use admin client to bypass RLS policies
    const { data, error } = await supabaseAdmin
      .from('tasks')
      .insert(body)
      .select()
      .single()

    console.log('API Route: Create task result:', { data, error })

    if (error) {
      serverErrorLogger.logDatabase('API_createTask', error, { body, hasServiceKey: !!serviceRoleKey })
      return NextResponse.json({ 
        error: error.message,
        details: 'Database operation failed. Check server logs for details.',
        hint: error.code === '42P17' ? 'RLS policy recursion detected - service role key needed' : undefined
      }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    serverErrorLogger.logApi('API_createTask', error, { body: request.body })
    console.error('API Route Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('API Route: Updating task')

    // Check if we have service role key
    if (!serviceRoleKey) {
      console.warn('API Route: No service role key found for PUT tasks')
      return NextResponse.json({ 
        error: 'Service role key not configured. Please add SUPABASE_SERVICE_ROLE_KEY to .env.local' 
      }, { status: 500 })
    }

    // Get task ID from query parameter
    const url = new URL(request.url)
    const taskId = url.searchParams.get('id')

    if (!taskId) {
      return NextResponse.json({ 
        error: 'Task ID is required' 
      }, { status: 400 })
    }

    const body = await request.json()
    console.log('API Route: Updating task with data:', { taskId, updates: body })

    // Use admin client to bypass RLS policies
    const { data, error } = await supabaseAdmin
      .from('tasks')
      .update(body)
      .eq('id', taskId)
      .select()
      .single()

    console.log('API Route: Update task result:', { data, error })

    if (error) {
      serverErrorLogger.logDatabase('API_updateTask', error, { taskId, body })
      return NextResponse.json({ 
        error: error.message,
        details: 'Database operation failed. Check server logs for details.',
        hint: error.code === '42P17' ? 'RLS policy recursion detected' : undefined
      }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    serverErrorLogger.logApi('API_updateTask', error)
    console.error('API Route Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('API Route: Deleting task')

    // Check if we have service role key
    if (!serviceRoleKey) {
      console.warn('API Route: No service role key found for DELETE tasks')
      return NextResponse.json({ 
        error: 'Service role key not configured. Please add SUPABASE_SERVICE_ROLE_KEY to .env.local' 
      }, { status: 500 })
    }

    // Get task ID from query parameter
    const url = new URL(request.url)
    const taskId = url.searchParams.get('id')

    if (!taskId) {
      return NextResponse.json({ 
        error: 'Task ID is required' 
      }, { status: 400 })
    }

    console.log('API Route: Deleting task:', taskId)

    // Use admin client to bypass RLS policies
    const { error } = await supabaseAdmin
      .from('tasks')
      .delete()
      .eq('id', taskId)

    console.log('API Route: Delete task result:', { error })

    if (error) {
      serverErrorLogger.logDatabase('API_deleteTask', error, { taskId })
      return NextResponse.json({ 
        error: error.message,
        details: 'Database operation failed. Check server logs for details.',
        hint: error.code === '42P17' ? 'RLS policy recursion detected' : undefined
      }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    serverErrorLogger.logApi('API_deleteTask', error)
    console.error('API Route Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}