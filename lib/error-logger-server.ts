// Server-side error logging utility (no React hooks)

interface ErrorLogEntry {
  timestamp: string
  type: 'DATABASE' | 'API' | 'COMPONENT' | 'NETWORK'
  operation: string
  error: any
  context?: any
  userId?: string
}

class ServerErrorLogger {
  log(type: ErrorLogEntry['type'], operation: string, error: any, context?: any) {
    const entry: ErrorLogEntry = {
      timestamp: new Date().toISOString(),
      type,
      operation,
      error: this.serializeError(error),
      context,
      userId: undefined // Server-side doesn't have user context easily
    }

    // Console log for server-side debugging
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

// Global server error logger instance
export const serverErrorLogger = new ServerErrorLogger()

export type { ErrorLogEntry }