import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { SimpleAuthProvider } from '@/components/simple-auth-provider'
import { ProjectProvider } from '@/components/project-provider'
import { TaskProvider } from '@/components/task-provider'
import { ErrorDebugPanel } from '@/components/error-debug-panel'
import { ErrorBoundary } from '@/components/error-boundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TaskFlow - Collaborative Task Manager',
  description:
    'Beautiful real-time collaborative task management with glassmorphism design',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider
            attribute='class'
            defaultTheme='dark'
            enableSystem
            disableTransitionOnChange
          >
            <SimpleAuthProvider>
              <ProjectProvider>
                <TaskProvider>
                  <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                    <div className='relative'>{children}</div>
                  </div>
                  <Toaster />
                  <ErrorDebugPanel />
                </TaskProvider>
              </ProjectProvider>
            </SimpleAuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
