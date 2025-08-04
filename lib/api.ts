import { supabase, type Project, type Task, type Profile, type ProjectMember } from './supabase'
import { errorLogger } from './error-logger'

// Project API functions
export const projectApi = {
  async getProjects() {
    console.log('🌐 API: Getting projects via API route to bypass RLS...')
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      console.log('👤 API: Current user for projects fetch:', user?.id)

      // Build URL with user filter if authenticated
      const url = user ? `/api/projects?userId=${user.id}` : '/api/projects'
      console.log('🔗 API: Fetching from URL:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      console.log('📡 API: Response status:', response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ API: Projects fetch failed:', errorData)
        throw new Error(errorData.error || 'Failed to fetch projects')
      }

      const data = await response.json()
      console.log('✅ API: Projects loaded via API route - Count:', data.length)
      return data
    } catch (error) {
      console.error('💥 API: Error fetching projects:', error.message || error)
      throw error
    }
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
    try {
      console.log('API: Creating project via API route with data:', project)
      
      const { data: { user } } = await supabase.auth.getUser()
      console.log('API: Current user for creation:', user)
      
      // Use API route to bypass RLS issues
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project)
      })

      if (!response.ok) {
        const errorData = await response.json()
        const error = new Error(errorData.error || 'Failed to create project')
        errorLogger.logDatabase('createProject_API', error, { project, user: user?.id, status: response.status })
        throw error
      }

      const data = await response.json()
      console.log('API: Create project result:', data)
      return data
    } catch (error) {
      errorLogger.logDatabase('createProject', error, { project })
      throw error
    }
  },

  async updateProject(id: string, updates: Partial<Project>) {
    try {
      console.log('API: Updating project via API route:', id, updates)
      
      const response = await fetch(`/api/projects?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API: Project update failed:', errorData)
        throw new Error(errorData.error || 'Failed to update project')
      }

      const data = await response.json()
      console.log('API: Project updated via API route:', data)
      return data
    } catch (error) {
      console.error('API: Error updating project:', error)
      throw error
    }
  },

  async deleteProject(id: string) {
    try {
      console.log('API: Deleting project via API route:', id)
      
      const response = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API: Project deletion failed:', errorData)
        throw new Error(errorData.error || 'Failed to delete project')
      }

      const data = await response.json()
      console.log('API: Project deleted via API route:', data)
      return data
    } catch (error) {
      console.error('API: Error deleting project:', error)
      throw error
    }
  }
}

// Task API functions
export const taskApi = {
  async getTasks(projectId: string) {
    console.log('🌐 API: Getting tasks via API route for project:', projectId)
    
    try {
      const url = `/api/tasks?projectId=${projectId}`
      console.log('🔗 API: Fetching tasks from URL:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      console.log('📡 API: Tasks response status:', response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ API: Tasks fetch failed:', errorData)
        throw new Error(errorData.error || 'Failed to fetch tasks')
      }

      const data = await response.json()
      console.log('✅ API: Tasks loaded via API route - Count:', data.length)
      return data
    } catch (error) {
      console.error('💥 API: Error fetching tasks:', error.message || error)
      throw error
    }
  },

  async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
    console.log('API: Creating task via API route:', task)
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task)
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API: Task creation failed:', errorData)
        throw new Error(errorData.error || 'Failed to create task')
      }

      const data = await response.json()
      console.log('API: Task created via API route:', data)
      return data
    } catch (error) {
      console.error('API: Error creating task:', error)
      throw error
    }
  },

  async updateTask(id: string, updates: Partial<Task>) {
    console.log('API: Updating task via API route:', id, updates)
    
    try {
      const response = await fetch(`/api/tasks?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API: Task update failed:', errorData)
        throw new Error(errorData.error || 'Failed to update task')
      }

      const data = await response.json()
      console.log('API: Task updated via API route:', data)
      return data
    } catch (error) {
      console.error('API: Error updating task:', error)
      throw error
    }
  },

  async deleteTask(id: string) {
    console.log('API: Deleting task via API route:', id)
    
    try {
      const response = await fetch(`/api/tasks?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API: Task deletion failed:', errorData)
        throw new Error(errorData.error || 'Failed to delete task')
      }

      const data = await response.json()
      console.log('API: Task deleted via API route:', data)
      return data
    } catch (error) {
      console.error('API: Error deleting task:', error)
      throw error
    }
  },

  async addTaskTag(taskId: string, tag: string) {
    console.log('API: Adding task tag via API route:', taskId, tag)
    
    try {
      const response = await fetch('/api/task-tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId, tag })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API: Task tag addition failed:', errorData)
        throw new Error(errorData.error || 'Failed to add task tag')
      }

      const data = await response.json()
      console.log('API: Task tag added via API route:', data)
      return data
    } catch (error) {
      console.error('API: Error adding task tag:', error)
      throw error
    }
  },

  async removeTaskTag(taskId: string, tag: string) {
    console.log('API: Removing task tag via API route:', taskId, tag)
    
    try {
      const response = await fetch(`/api/task-tags?taskId=${taskId}&tag=${encodeURIComponent(tag)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API: Task tag removal failed:', errorData)
        throw new Error(errorData.error || 'Failed to remove task tag')
      }

      const data = await response.json()
      console.log('API: Task tag removed via API route:', data)
      return data
    } catch (error) {
      console.error('API: Error removing task tag:', error)
      throw error
    }
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