import { supabase, type Project, type Task, type Profile, type ProjectMember } from './supabase'

// Project API functions
export const projectApi = {
  async getProjects() {
    console.log('API: Getting current user session...')
    const { data: { user } } = await supabase.auth.getUser()
    console.log('API: Current user:', user)
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    console.log('API: Projects query result:', { data, error })

    if (error) throw error
    
    // Transform data to match existing interface with default values
    return data?.map(project => ({
      ...project,
      members: 1, // Default to 1 (owner)
      tasks: {
        total: 0,
        completed: 0
      }
    })) || []
  },

  async getProject(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_members(
          id,
          role,
          profiles(id, name, email, avatar_url)
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    console.log('API: Creating project with data:', project)
    
    const { data: { user } } = await supabase.auth.getUser()
    console.log('API: Current user for creation:', user)
    
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single()

    console.log('API: Create project result:', { data, error })

    if (error) throw error
    return data
  },

  async updateProject(id: string, updates: Partial<Project>) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteProject(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Task API functions
export const taskApi = {
  async getTasks(projectId: string) {
    const { data, error } = await supabase
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

    if (error) throw error
    
    // Transform data to match existing interface
    return data?.map(task => ({
      ...task,
      tags: task.task_tags?.map(t => t.tag) || [],
      comments: task.comments?.[0]?.count || 0,
      assignee: task.assignee ? {
        id: task.assignee.id,
        name: task.assignee.name,
        avatar: task.assignee.avatar_url
      } : null
    })) || []
  },

  async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateTask(id: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteTask(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async addTaskTag(taskId: string, tag: string) {
    const { data, error } = await supabase
      .from('task_tags')
      .insert({ task_id: taskId, tag })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async removeTaskTag(taskId: string, tag: string) {
    const { error } = await supabase
      .from('task_tags')
      .delete()
      .eq('task_id', taskId)
      .eq('tag', tag)

    if (error) throw error
  }
}

// Profile API functions
export const profileApi = {
  async getProfile(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async updateProfile(id: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async searchProfiles(query: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, avatar_url')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(10)

    if (error) throw error
    return data || []
  }
}

// Project Member API functions
export const projectMemberApi = {
  async addMember(projectId: string, userId: string, role: 'admin' | 'editor' | 'viewer' = 'editor') {
    const { data, error } = await supabase
      .from('project_members')
      .insert({ project_id: projectId, user_id: userId, role })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async removeMember(projectId: string, userId: string) {
    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('project_id', projectId)
      .eq('user_id', userId)

    if (error) throw error
  },

  async updateMemberRole(projectId: string, userId: string, role: 'admin' | 'editor' | 'viewer') {
    const { data, error } = await supabase
      .from('project_members')
      .update({ role })
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// Comment API functions
export const commentApi = {
  async getComments(taskId: string) {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles(id, name, avatar_url)
      `)
      .eq('task_id', taskId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  },

  async createComment(taskId: string, content: string, userId: string) {
    const { data, error } = await supabase
      .from('comments')
      .insert({ task_id: taskId, content, user_id: userId })
      .select(`
        *,
        profiles(id, name, avatar_url)
      `)
      .single()

    if (error) throw error
    return data
  },

  async updateComment(id: string, content: string) {
    const { data, error } = await supabase
      .from('comments')
      .update({ content })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteComment(id: string) {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}