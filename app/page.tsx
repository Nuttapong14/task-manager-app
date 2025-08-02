"use client"

import { useAuth } from "@/components/simple-auth-provider"
import { LoginForm } from "@/components/login-form"
import { Dashboard } from "@/components/dashboard"
import { motion } from "framer-motion"

export default function Home() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full"
        />
      </div>
    )
  }

  return user ? <Dashboard /> : <LoginForm />
}
