"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useAuth } from "@/components/simple-auth-provider"
import { taskApi } from "@/lib/api"
import { supabase } from "@/lib/supabase"

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "done"
  priority: "low" | "medium" | "high"
  project_id: string
  assignee_id?: string
  created_by?: string
  due_date?: string
  completed_at?: string
  created_at?: string
  updated_at?: string
  tags?: string[]
  comments?: number
  assignee?: {
    id: string
    name: string
    avatar?: string
  } | null
}

interface TaskContextType {
  tasks: Record<string, Task[]> // projectId -> tasks
  isLoading: boolean
  refreshTasks: (projectId: string) => Promise<void>
  loadTasksForProject: (projectId: string) => Promise<void>
  addTask: (projectId: string, task: Task) => void
  removeTask: (projectId: string, taskId: string) => void
  updateTask: (projectId: string, taskId: string, updates: Partial<Task>) => void
  lastRefreshTime: Date | null
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Record<string, Task[]>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null)

  // Load tasks for a specific project - memoized to prevent infinite loops
  const loadTasksForProject = useCallback(async (projectId: string) => {
    if (!user) {
      console.log('🔴 TaskProvider: No user, skipping task load for project:', projectId)
      return
    }
    if (!projectId) {
      console.log('🔴 TaskProvider: No projectId provided')
      return
    }
    
    try {
      setIsLoading(true)
      console.log('🔄 TaskProvider: Loading tasks for project:', projectId, 'user:', user.id)
      const data = await taskApi.getTasks(projectId)
      console.log('✅ TaskProvider: Tasks loaded successfully for project:', projectId, '- Count:', data.length)
      
      setTasks(prev => ({
        ...prev,
        [projectId]: data
      }))
      setLastRefreshTime(new Date())
    } catch (error) {
      console.error('❌ TaskProvider: Error loading tasks for project:', projectId)
      console.error('🔍 TaskProvider: Error details:', error.message || error)
      console.error('🔍 TaskProvider: Full error:', error)
      // Don't clear tasks on error to avoid flickering
    } finally {
      setIsLoading(false)
      console.log('🏁 TaskProvider: Load operation completed for project:', projectId)
    }
  }, [user])

  const refreshTasks = async (projectId: string) => {
    await loadTasksForProject(projectId)
  }

  const addTask = (projectId: string, task: Task) => {
    setTasks(prev => ({
      ...prev,
      [projectId]: [task, ...(prev[projectId] || [])]
    }))
  }

  const removeTask = (projectId: string, taskId: string) => {
    setTasks(prev => ({
      ...prev,
      [projectId]: (prev[projectId] || []).filter(t => t.id !== taskId)
    }))
  }

  const updateTask = (projectId: string, taskId: string, updates: Partial<Task>) => {
    setTasks(prev => ({
      ...prev,
      [projectId]: (prev[projectId] || []).map(t => 
        t.id === taskId ? { ...t, ...updates } : t
      )
    }))
  }

  // Real-time subscriptions for instant task updates
  useEffect(() => {
    if (!user) return

    console.log('🔴 TaskProvider: Setting up real-time subscription for user:', user.id)
    
    const subscription = supabase
      .channel('tasks_realtime')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'tasks'
      }, (payload) => {
        console.log('⚡ TaskProvider: Real-time task change detected:', payload.eventType, payload.new?.title || payload.old?.title)
        
        // Handle different events
        if (payload.eventType === 'INSERT' && payload.new) {
          const newTask = {
            ...payload.new,
            tags: [],
            comments: 0,
            assignee: null
          }
          addTask(payload.new.project_id, newTask)
        } else if (payload.eventType === 'UPDATE' && payload.new) {
          const updatedTask = {
            ...payload.new,
            tags: [],
            comments: 0,
            assignee: null
          }
          updateTask(payload.new.project_id, payload.new.id, updatedTask)
        } else if (payload.eventType === 'DELETE' && payload.old) {
          removeTask(payload.old.project_id, payload.old.id)
        }
      })
      .subscribe((status) => {
        console.log('📡 TaskProvider: Subscription status:', status)
      })

    return () => {
      console.log('🔴 TaskProvider: Cleaning up real-time subscription')
      subscription.unsubscribe()
    }
  }, [user])

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      isLoading, 
      refreshTasks, 
      loadTasksForProject,
      addTask, 
      removeTask, 
      updateTask,
      lastRefreshTime
    }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider")
  }
  return context
}