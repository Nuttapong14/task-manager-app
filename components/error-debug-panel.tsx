'use client'

import { useState } from 'react'
import { errorLogger, useErrorLogs } from '@/lib/error-logger'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Bug, Download, Trash2, RefreshCw } from 'lucide-react'

export function ErrorDebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<string>('all')
  const logs = useErrorLogs(selectedType === 'all' ? undefined : selectedType as any)

  const handleClearLogs = () => {
    errorLogger.clearLogs()
  }

  const handleExportLogs = () => {
    const logsJson = errorLogger.exportLogs()
    const blob = new Blob([logsJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `error-logs-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getTypeColor = (type: string) => {
    const colors = {
      DATABASE: 'bg-red-100 text-red-800',
      API: 'bg-blue-100 text-blue-800',
      COMPONENT: 'bg-yellow-100 text-yellow-800',
      NETWORK: 'bg-purple-100 text-purple-800'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 z-50 bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
        >
          <Bug className="w-4 h-4 mr-2" />
          Debug ({logs.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Error Debug Panel</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportLogs}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearLogs}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Filter buttons */}
          <div className="flex gap-2 flex-wrap">
            {['all', 'DATABASE', 'API', 'COMPONENT', 'NETWORK'].map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(type)}
              >
                {type === 'all' ? 'All' : type}
                {type !== 'all' && (
                  <Badge 
                    variant="secondary" 
                    className="ml-2"
                  >
                    {errorLogger.getLogs(type as any).length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          {/* Error logs */}
          <ScrollArea className="h-[500px]">
            <div className="space-y-3">
              {logs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No errors logged yet
                </div>
              ) : (
                logs.map((log, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getTypeColor(log.type)}>
                          {log.type}
                        </Badge>
                        <span className="font-medium">{log.operation}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                      <div className="mb-2">
                        <strong>Error:</strong>
                      </div>
                      <pre className="whitespace-pre-wrap text-red-600">
                        {typeof log.error === 'string' 
                          ? log.error 
                          : JSON.stringify(log.error, null, 2)
                        }
                      </pre>
                      
                      {log.context && (
                        <div className="mt-3">
                          <strong>Context:</strong>
                          <pre className="whitespace-pre-wrap text-blue-600 mt-1">
                            {JSON.stringify(log.context, null, 2)}
                          </pre>
                        </div>
                      )}
                      
                      {log.userId && (
                        <div className="mt-2 text-gray-600">
                          <strong>User ID:</strong> {log.userId}
                        </div>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}