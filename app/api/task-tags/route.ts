import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { serverErrorLogger } from '@/lib/error-logger-server'

// Check if we have the service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create admin client that bypasses RLS
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
    const { taskId, tag } = body
    
    console.log('API Route: Adding task tag:', { taskId, tag })

    // Check if we have service role key
    if (!serviceRoleKey) {
      return NextResponse.json({ 
        error: 'Service role key not configured' 
      }, { status: 500 })
    }

    // Use admin client to bypass RLS policies
    const { data, error } = await supabaseAdmin
      .from('task_tags')
      .insert({ task_id: taskId, tag })
      .select()
      .single()

    if (error) {
      serverErrorLogger.logDatabase('API_addTaskTag', error, { taskId, tag })
      return NextResponse.json({ 
        error: error.message
      }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    serverErrorLogger.logApi('API_addTaskTag', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const taskId = url.searchParams.get('taskId')
    const tag = url.searchParams.get('tag')
    
    console.log('API Route: Removing task tag:', { taskId, tag })

    if (!taskId || !tag) {
      return NextResponse.json({ 
        error: 'Task ID and tag are required' 
      }, { status: 400 })
    }

    // Check if we have service role key
    if (!serviceRoleKey) {
      return NextResponse.json({ 
        error: 'Service role key not configured' 
      }, { status: 500 })
    }

    // Use admin client to bypass RLS policies
    const { error } = await supabaseAdmin
      .from('task_tags')
      .delete()
      .eq('task_id', taskId)
      .eq('tag', tag)

    if (error) {
      serverErrorLogger.logDatabase('API_removeTaskTag', error, { taskId, tag })
      return NextResponse.json({ 
        error: error.message
      }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    serverErrorLogger.logApi('API_removeTaskTag', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}