"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "admin" | "editor" | "viewer"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function SimpleAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('SimpleAuthProvider: Initializing...')
    
    // Add timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.log('SimpleAuthProvider: Loading timeout reached, forcing loading to false')
      setIsLoading(false)
    }, 5000) // 5 second timeout
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('SimpleAuthProvider: Getting initial session...')
        const { data: { session }, error } = await supabase.auth.getSession()
        console.log('SimpleAuthProvider: Initial session result:', { session: !!session, error })
        
        if (session?.user) {
          console.log('SimpleAuthProvider: Setting user from initial session')
          setUserFromSupabaseUser(session.user)
        } else {
          console.log('SimpleAuthProvider: No session found, user will be null')
        }
      } catch (error) {
        console.error('SimpleAuthProvider: Error getting initial session:', error)
      } finally {
        clearTimeout(loadingTimeout)
        setIsLoading(false)
        console.log('SimpleAuthProvider: Initial load complete')
      }
    }

    getInitialSession()

    // Listen for auth changes
    console.log('SimpleAuthProvider: Setting up auth state listener...')
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('SimpleAuthProvider: Auth state changed:', event, !!session)
      
      clearTimeout(loadingTimeout)
      
      if (session?.user) {
        setUserFromSupabaseUser(session.user)
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => {
      console.log('SimpleAuthProvider: Cleaning up auth listener')
      clearTimeout(loadingTimeout)
      subscription.unsubscribe()
    }
  }, [])

  const setUserFromSupabaseUser = (supabaseUser: any) => {
    console.log('SimpleAuthProvider: Creating user object from Supabase user:', supabaseUser.id)
    
    // Create user directly from Supabase auth data (no database queries)
    const userData: User = {
      id: supabaseUser.id,
      name: supabaseUser.user_metadata?.name || 
            supabaseUser.email?.split('@')[0] || 
            'User',
      email: supabaseUser.email!,
      avatar: supabaseUser.user_metadata?.avatar_url,
      role: 'editor'
    }
    
    console.log('SimpleAuthProvider: Setting user:', userData)
    setUser(userData)
  }

  const login = async (email: string, password: string) => {
    console.log('SimpleAuthProvider: Attempting login...')
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      console.error('SimpleAuthProvider: Login error:', error)
      throw error
    }
    console.log('SimpleAuthProvider: Login successful')
  }

  const signup = async (email: string, password: string, name: string) => {
    console.log('SimpleAuthProvider: Attempting signup...')
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    })
    
    if (error) {
      console.error('SimpleAuthProvider: Signup error:', error)
      throw error
    }
    
    // Check if email confirmation is required
    if (data?.user && !data.session) {
      console.log('SimpleAuthProvider: Email confirmation required')
      throw new Error('Please check your email and click the confirmation link to complete registration.')
    }
    
    console.log('SimpleAuthProvider: Signup successful')
  }

  const logout = async () => {
    console.log('SimpleAuthProvider: Attempting logout...')
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('SimpleAuthProvider: Logout error:', error)
      throw error
    }
    setUser(null)
    console.log('SimpleAuthProvider: Logout successful')
  }

  console.log('SimpleAuthProvider: Rendering with user:', !!user, 'loading:', isLoading)

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within a SimpleAuthProvider")
  }
  return context
}