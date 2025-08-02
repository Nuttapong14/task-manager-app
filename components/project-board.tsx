"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TaskModal } from "@/components/task-modal"
import { NewTaskModal } from "@/components/new-task-modal"
import { ArrowLeft, Plus, MoreHorizontal, Calendar, Flag, MessageSquare, Trash2 } from "lucide-react"

interface Comment {
  id: string
  user: string
  content: string
  timestamp: Date
}

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "done"
  priority: "low" | "medium" | "high"
  assignee: {
    name: string
    avatar: string
  }
  dueDate: string
  tags: string[]
  comments: Comment[]
}

interface Project {
  id: string
  name: string
  description: string
  color: string
  members: number
  tasks: {
    total: number
    completed: number
  }
  dueDate: string
}

interface ProjectBoardProps {
  project: Project
  onBack: () => void
}

// Tasks will be loaded from the database

const columns = [
  { id: "todo", title: "To Do", color: "from-gray-500 to-gray-600" },
  { id: "in-progress", title: "In Progress", color: "from-blue-500 to-blue-600" },
  { id: "done", title: "Done", color: "from-green-500 to-green-600" },
]

const priorityColors = {
  low: "bg-green-500/20 text-green-400 border-green-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  high: "bg-red-500/20 text-red-400 border-red-500/30",
}

// Helper functions for localStorage
const getStorageKey = (projectId: string) => `taskflow_tasks_${projectId}`

const loadTasksFromStorage = (projectId: string): Task[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(getStorageKey(projectId))
    if (!stored) return []
    const parsed = JSON.parse(stored)
    // Convert timestamp strings back to Date objects for comments
    return parsed.map((task: any) => ({
      ...task,
      comments: task.comments.map((comment: any) => ({
        ...comment,
        timestamp: new Date(comment.timestamp)
      }))
    }))
  } catch (error) {
    console.error('Error loading tasks from storage:', error)
    return []
  }
}

const saveTasksToStorage = (projectId: string, tasks: Task[]) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(getStorageKey(projectId), JSON.stringify(tasks))
  } catch (error) {
    console.error('Error saving tasks to storage:', error)
  }
}

export function ProjectBoard({ project, onBack }: ProjectBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showNewTask, setShowNewTask] = useState(false)
  const [newTaskColumn, setNewTaskColumn] = useState<string>("todo")

  // Load tasks when component mounts or project changes
  useEffect(() => {
    const loadedTasks = loadTasksFromStorage(project.id)
    setTasks(loadedTasks)
  }, [project.id])

  // Save tasks whenever tasks change
  useEffect(() => {
    if (tasks.length > 0 || tasks.length === 0) { // Save even empty arrays to clear storage
      saveTasksToStorage(project.id, tasks)
    }
  }, [tasks, project.id])

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status)
  }

  const handleNewTask = (columnId: string) => {
    console.log('=== OPENING NEW TASK MODAL ===')
    console.log('Column ID:', columnId)
    setNewTaskColumn(columnId)
    setShowNewTask(true)
    console.log('Modal should be open now')
  }

  const handleCreateTask = (taskData: Omit<Task, "id">) => {
    console.log('=== CREATING NEW TASK ===')
    console.log('Task data received:', taskData)
    
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
    }
    
    console.log('New task created:', newTask)
    console.log('Current tasks before adding:', tasks.length)
    
    setTasks([...tasks, newTask])
    setShowNewTask(false)
    
    console.log('Task creation completed')
  }

  const handleDeleteTask = (taskId: string) => {
    console.log('=== DELETING TASK ===')
    console.log('Task ID to delete:', taskId)
    console.log('Current tasks:', tasks.length)
    console.log('Tasks before deletion:', tasks.map(t => ({ id: t.id, title: t.title })))
    
    const newTasks = tasks.filter(task => task.id !== taskId)
    console.log('Tasks after filtering:', newTasks.length)
    
    setTasks(newTasks)
    setSelectedTask(null)
    
    console.log('Task deletion completed')
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card border-b border-white/10 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={onBack} className="text-white/70 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className={`w-8 h-8 bg-gradient-to-r ${project.color} rounded-lg flex items-center justify-center`}>
                <span className="text-white font-bold text-sm">{project.name.charAt(0)}</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{project.name}</h1>
                <p className="text-white/70 text-sm">{project.description}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-white/10 text-white/90 border-white/20">
                {project.members} members
              </Badge>
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {columns.map((column, columnIndex) => (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: columnIndex * 0.1 }}
              className="space-y-4"
            >
              {/* Column Header */}
              <Card className="glass-card border-white/10">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <div className={`w-3 h-3 bg-gradient-to-r ${column.color} rounded-full`} />
                      {column.title}
                      <Badge variant="secondary" className="bg-white/10 text-white/90 border-white/20 ml-2">
                        {getTasksByStatus(column.id).length}
                      </Badge>
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleNewTask(column.id)}
                      className="text-white/70 hover:text-white h-8 w-8"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              {/* Tasks */}
              <div className="space-y-3 min-h-[400px] custom-scrollbar overflow-y-auto">
                {getTasksByStatus(column.id).map((task, taskIndex) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: columnIndex * 0.1 + taskIndex * 0.05 }}
                    whileHover={{ y: -2 }}
                    className="cursor-pointer"
                    onClick={() => setSelectedTask(task)}
                  >
                    <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h3 className="font-medium text-white text-sm leading-tight">{task.title}</h3>
                            <div className="flex items-center gap-1">
                              <Badge variant="outline" className={`text-xs ${priorityColors[task.priority]} border`}>
                                <Flag className="w-3 h-3 mr-1" />
                                {task.priority}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  console.log('Quick delete button clicked for task:', task.title)
                                  const confirmed = confirm(`Delete "${task.title}"?`)
                                  console.log('User confirmed deletion:', confirmed)
                                  
                                  // TEMPORARY: Bypass confirmation for testing
                                  if (!confirmed) {
                                    console.log('Confirmation failed, but proceeding anyway for testing...')
                                  }
                                  
                                  // Always delete for now to test the deletion logic
                                  handleDeleteTask(task.id)
                                }}
                                className="h-6 w-6 text-white/40 hover:text-red-400 hover:bg-red-500/10"
                                title="Delete task"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <p className="text-white/70 text-xs line-clamp-2">{task.description}</p>

                          <div className="flex flex-wrap gap-1">
                            {task.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="bg-white/5 text-white/80 border-white/10 text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="bg-purple-500 text-white text-xs">
                                  {task.assignee.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-white/70 text-xs">{task.assignee.name}</span>
                            </div>

                            <div className="flex items-center space-x-2 text-white/60">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span className="text-xs">{new Date(task.dueDate).toLocaleDateString()}</span>
                              </div>
                              {task.comments.length > 0 && (
                                <div className="flex items-center space-x-1">
                                  <MessageSquare className="w-3 h-3" />
                                  <span className="text-xs">{task.comments.length}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Task Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          open={!!selectedTask}
          onOpenChange={(open) => !open && setSelectedTask(null)}
          onUpdateTask={(updatedTask) => {
            setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)))
            setSelectedTask(null)
          }}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {/* New Task Modal */}
      <NewTaskModal
        open={showNewTask}
        onOpenChange={setShowNewTask}
        initialStatus={newTaskColumn as "todo" | "in-progress" | "done"}
        onCreateTask={handleCreateTask}
      />
    </div>
  )
}

// this is a project borad to show TODO In Progress and Done!