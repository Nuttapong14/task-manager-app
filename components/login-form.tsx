"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/simple-auth-provider"
import { Mail, Lock, Sparkles, User } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState("")
  const { login, signup } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    // Client-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }
    
    if (isSignUp && name.trim().length < 2) {
      setError('Name must be at least 2 characters long')
      setIsLoading(false)
      return
    }
    
    try {
      if (isSignUp) {
        await signup(email, password, name)
      } else {
        await login(email, password)
      }
    } catch (error: any) {
      console.error("Auth failed:", error)
      
      // More specific error handling
      let errorMessage = error.message || `${isSignUp ? 'Sign up' : 'Login'} failed`
      
      // Handle common Supabase auth errors
      if (error.message?.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address'
      } else if (error.message?.includes('Email rate limit exceeded')) {
        errorMessage = 'Too many requests. Please wait before trying again.'
      } else if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password'
      } else if (error.message?.includes('User already registered')) {
        errorMessage = 'This email is already registered. Try signing in instead.'
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="glass-card border-white/10">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-white">Welcome to TaskFlow</CardTitle>
            <CardDescription className="text-white/70">
              {isSignUp ? "Create your account to get started" : "Beautiful collaborative task management"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white/90">
                    Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 glass-card border-white/20 text-white placeholder:text-white/50"
                      required
                    />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/90">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 glass-card border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/90">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 glass-card border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full glass-button text-white font-medium" disabled={isLoading}>
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  isSignUp ? "Create Account" : "Sign In"
                )}
              </Button>
            </form>
            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}
            <div className="mt-6 text-center space-y-2">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError("")
                  setEmail("")
                  setPassword("")
                  setName("")
                }}
                className="text-white/60 text-sm hover:text-white/80 transition-colors"
              >
                {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </button>
              {!isSignUp ? (
                <p className="text-white/60 text-sm">Demo credentials: any email/password</p>
              ) : (
                <p className="text-white/60 text-sm">Use a real email like: user@outlook.com</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
