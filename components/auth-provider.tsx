"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { supabase, type Profile } from "@/lib/supabase"
import type { User as SupabaseUser } from "@supabase/supabase-js"

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await setUserFromSession(session.user)
      }
      setIsLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await setUserFromSession(session.user)
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const setUserFromSession = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('Setting user from session:', supabaseUser.id)
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single()

      console.log('Profile fetch result:', { profile, error })

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create it
          console.log('Profile not found, creating new profile')
          const userName = supabaseUser.user_metadata?.name || 
                          supabaseUser.email?.split('@')[0] || 
                          'User'
          
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: supabaseUser.id,
              email: supabaseUser.email!,
              name: userName,
              role: 'editor'
            })
            .select()
            .single()

          console.log('Profile creation result:', { newProfile, insertError })

          if (insertError) {
            console.error('Error creating profile:', insertError)
            // FALLBACK: Create a minimal user object from supabase user data
            setUser({
              id: supabaseUser.id,
              name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
              email: supabaseUser.email!,
              role: 'editor'
            })
            return
          }

          if (newProfile) {
            setUser({
              id: newProfile.id,
              name: newProfile.name,
              email: newProfile.email,
              avatar: newProfile.avatar_url || undefined,
              role: newProfile.role
            })
          }
        } else {
          console.error('Error fetching profile:', error)
          // FALLBACK: Create a minimal user object from supabase user data
          setUser({
            id: supabaseUser.id,
            name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
            email: supabaseUser.email!,
            role: 'editor'
          })
        }
        return
      }

      if (profile) {
        console.log('Setting user from profile:', profile)
        setUser({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar_url || undefined,
          role: profile.role
        })
      }
    } catch (error) {
      console.error('Error setting user from session:', error)
      // FALLBACK: Create a minimal user object from supabase user data
      setUser({
        id: supabaseUser.id,
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
        email: supabaseUser.email!,
        role: 'editor'
      })
    }
  }

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signup = async (email: string, password: string, name: string) => {
    console.log('Attempting signup with:', { email, passwordLength: password.length, name })
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    })
    
    console.log('Supabase signup response:', { data, error })
    
    if (error) {
      console.error('Supabase signup error details:', {
        message: error.message,
        status: error.status,
        name: error.name
      })
      throw error
    }
    
    // Check if email confirmation is required
    if (data?.user && !data.session) {
      console.log('User created but no session - email confirmation required')
      throw new Error('Please check your email and click the confirmation link to complete registration.')
    }
    
    console.log('Signup successful:', data?.user?.id)
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
