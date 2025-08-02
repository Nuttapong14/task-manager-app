// Error logging utility for debugging database and application errors
import { useState, useEffect } from 'react'

interface ErrorLogEntry {
  timestamp: string
  type: 'DATABASE' | 'API' | 'COMPONENT' | 'NETWORK'
  operation: string
  error: any
  context?: any
  userId?: string
}

class ErrorLogger {
  private logs: ErrorLogEntry[] = []
  private maxLogs = 100

  log(type: ErrorLogEntry['type'], operation: string, error: any, context?: any) {
    const entry: ErrorLogEntry = {
      timestamp: new Date().toISOString(),
      type,
      operation,
      error: this.serializeError(error),
      context,
      userId: this.getCurrentUserId()
    }

    this.logs.unshift(entry)
    
    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs)
    }

    // Console log for immediate debugging
    console.error(`[${type}] ${operation}:`, {
      error: entry.error,
      context,
      timestamp: entry.timestamp
    })

    return entry
  }

  private serializeError(error: any): any {
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause
      }
    }
    
    if (typeof error === 'object' && error !== null) {
      return {
        ...error,
        toString: error.toString?.()
      }
    }
    
    return error
  }

  private getCurrentUserId(): string | undefined {
    // Try to get user ID from various sources
    if (typeof window !== 'undefined') {
      try {
        const user = localStorage.getItem('supabase.auth.token')
        if (user) {
          const parsed = JSON.parse(user)
          return parsed?.user?.id
        }
      } catch {
        // Ignore localStorage errors
      }
    }
    return undefined
  }

  getLogs(type?: ErrorLogEntry['type']): ErrorLogEntry[] {
    if (type) {
      return this.logs.filter(log => log.type === type)
    }
    return [...this.logs]
  }

  getRecentLogs(count: number = 10): ErrorLogEntry[] {
    return this.logs.slice(0, count)
  }

  clearLogs(): void {
    this.logs = []
    console.log('Error logs cleared')
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  // Convenience methods for different error types
  logDatabase(operation: string, error: any, context?: any) {
    return this.log('DATABASE', operation, error, context)
  }

  logApi(operation: string, error: any, context?: any) {
    return this.log('API', operation, error, context)
  }

  logComponent(operation: string, error: any, context?: any) {
    return this.log('COMPONENT', operation, error, context)
  }

  logNetwork(operation: string, error: any, context?: any) {
    return this.log('NETWORK', operation, error, context)
  }
}

// Global error logger instance
export const errorLogger = new ErrorLogger()

// React hook for accessing error logs in components
export function useErrorLogs(type?: ErrorLogEntry['type']) {
  const [logs, setLogs] = useState<ErrorLogEntry[]>([])
  
  useEffect(() => {
    const updateLogs = () => {
      setLogs(errorLogger.getLogs(type))
    }
    
    updateLogs()
    
    // Update logs every 5 seconds
    const interval = setInterval(updateLogs, 5000)
    
    return () => clearInterval(interval)
  }, [type])
  
  return logs
}

// Global error boundary helper
export function logAndRethrow(type: ErrorLogEntry['type'], operation: string, context?: any) {
  return function<T extends (...args: any[]) => any>(fn: T): T {
    return ((...args: any[]) => {
      try {
        const result = fn(...args)
        
        // Handle async functions
        if (result instanceof Promise) {
          return result.catch((error) => {
            errorLogger.log(type, operation, error, { args, context })
            throw error
          })
        }
        
        return result
      } catch (error) {
        errorLogger.log(type, operation, error, { args, context })
        throw error
      }
    }) as T
  }
}

export type { ErrorLogEntry }