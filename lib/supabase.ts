import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          role: 'admin' | 'editor' | 'viewer'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          avatar_url?: string | null
          role?: 'admin' | 'editor' | 'viewer'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          role?: 'admin' | 'editor' | 'viewer'
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          color: string
          owner_id: string
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          color?: string
          owner_id: string
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          color?: string
          owner_id?: string
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      project_members: {
        Row: {
          id: string
          project_id: string
          user_id: string
          role: 'admin' | 'editor' | 'viewer'
          joined_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          role?: 'admin' | 'editor' | 'viewer'
          joined_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          role?: 'admin' | 'editor' | 'viewer'
          joined_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          status: 'todo' | 'in-progress' | 'done'
          priority: 'low' | 'medium' | 'high'
          project_id: string
          assignee_id: string | null
          created_by: string | null
          due_date: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: 'todo' | 'in-progress' | 'done'
          priority?: 'low' | 'medium' | 'high'
          project_id: string
          assignee_id?: string | null
          created_by?: string | null
          due_date?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: 'todo' | 'in-progress' | 'done'
          priority?: 'low' | 'medium' | 'high'
          project_id?: string
          assignee_id?: string | null
          created_by?: string | null
          due_date?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      task_tags: {
        Row: {
          id: string
          task_id: string
          tag: string
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          tag: string
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          tag?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          task_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          task_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string | null
          data: any | null
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message?: string | null
          data?: any | null
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string | null
          data?: any | null
          read?: boolean
          created_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          project_id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          details: any | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          details?: any | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          details?: any | null
          created_at?: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type ProjectMember = Database['public']['Tables']['project_members']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']