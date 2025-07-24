"use client"

// Mock Socket.IO client for real-time features
// In a real implementation, you would use socket.io-client

interface SocketEvent {
  type: string
  data: any
}

class MockSocket {
  private listeners: { [key: string]: Function[] } = {}

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }

  emit(event: string, data: any) {
    // Mock emit - in real implementation this would send to server
    console.log("Socket emit:", event, data)

    // Simulate real-time updates
    setTimeout(() => {
      if (this.listeners[event]) {
        this.listeners[event].forEach((callback) => callback(data))
      }
    }, 100)
  }

  off(event: string, callback?: Function) {
    if (callback && this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback)
    } else {
      delete this.listeners[event]
    }
  }
}

export const socket = new MockSocket()

// Real-time event types
export const SOCKET_EVENTS = {
  TASK_CREATED: "task:created",
  TASK_UPDATED: "task:updated",
  TASK_DELETED: "task:deleted",
  TASK_ASSIGNED: "task:assigned",
  PROJECT_UPDATED: "project:updated",
  USER_JOINED: "user:joined",
  USER_LEFT: "user:left",
  NOTIFICATION: "notification",
} as const
