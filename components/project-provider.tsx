"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useAuth } from "@/components/simple-auth-provider"
import { projectApi } from "@/lib/api"
import { supabase } from "@/lib/supabase"

interface Project {
  id: string
  name: string
  description: string
  color: string
  members: number
  tasks: {
    total: number
    completed: number
  }
  due_date: string | null
  owner_id?: string
  created_at?: string
  updated_at?: string
}

interface ProjectContextType {
  projects: Project[]
  isLoading: boolean
  refreshProjects: () => Promise<void>
  addProject: (project: Project) => void
  removeProject: (projectId: string) => void
  updateProject: (projectId: string, updates: Partial<Project>) => void
  lastRefreshTime: Date | null
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null)

  const loadProjects = useCallback(async () => {
    if (!user) {
      console.log('🔴 ProjectProvider: No user, skipping project load')
      return
    }
    
    try {
      setIsLoading(true)
      console.log('🔄 ProjectProvider: Loading projects for user:', user.id)
      const data = await projectApi.getProjects()
      console.log('✅ ProjectProvider: Projects loaded successfully:', data.length, 'projects')
      setProjects(data)
      setLastRefreshTime(new Date())
    } catch (error) {
      console.error('❌ ProjectProvider: Error loading projects:', error.message || error)
      console.error('🔍 ProjectProvider: Error details:', error)
      // Don't clear projects on error to avoid flickering
    } finally {
      setIsLoading(false)
      console.log('🏁 ProjectProvider: Load operation completed')
    }
  }, [user])

  // Load projects whenever user changes or page loads
  useEffect(() => {
    if (user) {
      loadProjects()
    } else {
      setProjects([])
    }
  }, [user, loadProjects])

  // Real-time subscriptions for instant updates
  useEffect(() => {
    if (!user) return

    console.log('🔴 ProjectProvider: Setting up real-time subscriptions for user:', user.id)
    
    // Project changes subscription
    const projectsSubscription = supabase
      .channel('projects_realtime')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'projects',
        filter: `owner_id=eq.${user.id}`
      }, (payload) => {
        console.log('⚡ ProjectProvider: Project change detected:', payload.eventType, payload.new?.name || payload.old?.name)
        
        // Handle different events
        if (payload.eventType === 'INSERT' && payload.new) {
          const newProject = {
            ...payload.new,
            members: 1,
            tasks: { total: 0, completed: 0 }
          }
          addProject(newProject)
        } else if (payload.eventType === 'UPDATE' && payload.new) {
          const updatedProject = {
            ...payload.new,
            members: 1,
            tasks: { total: 0, completed: 0 }
          }
          updateProject(payload.new.id, updatedProject)
        } else if (payload.eventType === 'DELETE' && payload.old) {
          removeProject(payload.old.id)
        }
      })
      .subscribe((status) => {
        console.log('📡 ProjectProvider: Projects subscription status:', status)
      })

    // Task changes subscription to update progress
    const tasksSubscription = supabase
      .channel('tasks_realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks'
      }, async (payload) => {
        console.log('⚡ ProjectProvider: Task change detected:', payload.eventType, payload.new?.title || payload.old?.title)
        
        // When tasks change, refresh projects to get updated statistics
        const projectId = payload.new?.project_id || payload.old?.project_id
        if (projectId) {
          console.log('🔄 ProjectProvider: Refreshing projects due to task change in project:', projectId)
          // Refresh after a short delay to allow DB to settle
          setTimeout(() => {
            loadProjects()
          }, 500)
        }
      })
      .subscribe((status) => {
        console.log('📡 ProjectProvider: Tasks subscription status:', status)
      })

    return () => {
      console.log('🔴 ProjectProvider: Cleaning up real-time subscriptions')
      projectsSubscription.unsubscribe()
      tasksSubscription.unsubscribe()
    }
  }, [user, loadProjects])

  // Route change handler (kept for manual navigation)
  useEffect(() => {
    const handleRouteChange = () => {
      if (user) {
        console.log('🔄 ProjectProvider: Route change detected, refreshing projects')
        loadProjects()
      }
    }

    window.addEventListener('project-route-change', handleRouteChange)
    return () => window.removeEventListener('project-route-change', handleRouteChange)
  }, [user, loadProjects])

  const refreshProjects = async () => {
    await loadProjects()
  }

  const addProject = (project: Project) => {
    setProjects(prev => [project, ...prev])
  }

  const removeProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId))
  }

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, ...updates } : p
    ))
  }

  return (
    <ProjectContext.Provider value={{ 
      projects, 
      isLoading, 
      refreshProjects, 
      addProject, 
      removeProject, 
      updateProject,
      lastRefreshTime
    }}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProjects() {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectProvider")
  }
  return context
}