"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TaskModal } from "@/components/task-modal"
import { NewTaskModal } from "@/components/new-task-modal"
import { useTasks } from "@/components/task-provider"
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
  project_id: string
  assignee_id?: string
  created_by?: string
  due_date?: string
  completed_at?: string
  created_at?: string
  updated_at?: string
  tags?: string[]
  comments?: number
  assignee?: {
    id: string
    name: string
    avatar?: string
  } | null
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

export function ProjectBoard({ project, onBack }: ProjectBoardProps) {
  const { tasks: allTasks, isLoading, loadTasksForProject, addTask, removeTask, updateTask } = useTasks()
  const projectTasks = allTasks[project.id] || []
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showNewTask, setShowNewTask] = useState(false)
  const [newTaskColumn, setNewTaskColumn] = useState<string>("todo")

  // Load tasks when component mounts or project changes
  useEffect(() => {
    console.log('ProjectBoard: Loading tasks for project:', project.id)
    loadTasksForProject(project.id)
  }, [project.id, loadTasksForProject])

  const getTasksByStatus = (status: string) => {
    return projectTasks.filter((task) => task.status === status)
  }

  const handleNewTask = (columnId: string) => {
    console.log('=== OPENING NEW TASK MODAL ===')
    console.log('Column ID:', columnId)
    setNewTaskColumn(columnId)
    setShowNewTask(true)
    console.log('Modal should be open now')
  }

  const handleCreateTask = async (taskData: Omit<Task, "id">) => {
    console.log('=== CREATING NEW TASK ===')
    console.log('Task data received:', taskData)
    
    // Create task with project_id
    const newTask: Task = {
      ...taskData,
      id: `temp-${Date.now()}`,
      project_id: project.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    console.log('New task created:', newTask)
    
    // Add to global state immediately
    addTask(project.id, newTask)
    setShowNewTask(false)
    
    // Try to save to database in background
    try {
      const { taskApi } = await import('@/lib/api')
      const result = await taskApi.createTask({
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        project_id: project.id,
        assignee_id: taskData.assignee_id,
        created_by: taskData.created_by,
        due_date: taskData.due_date
      })
      
      console.log('Task saved to database:', result)
      
      // Update with real ID if successful
      if (result) {
        removeTask(project.id, newTask.id)
        addTask(project.id, { ...newTask, id: result.id })
      }
    } catch (error) {
      console.error('Database save failed:', error)
      // Keep the task in local state even if DB save fails
    }
    
    console.log('Task creation completed')
  }

  const handleDeleteTask = async (taskId: string) => {
    console.log('=== DELETING TASK ===')
    console.log('Task ID to delete:', taskId)
    
    // Remove from global state immediately
    removeTask(project.id, taskId)
    setSelectedTask(null)
    
    // Try to delete from database
    if (!taskId.startsWith('temp-')) {
      try {
        const { taskApi } = await import('@/lib/api')
        await taskApi.deleteTask(taskId)
        console.log('Task deleted from database:', taskId)
      } catch (error) {
        console.error('Database deletion failed:', error)
        // Note: Tasks will be reloaded automatically by TaskProvider on next refresh
      }
    } else {
      console.log('Skipping database deletion for temp task')
    }
    
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
                              {task.assignee ? (
                                <>
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} />
                                    <AvatarFallback className="bg-purple-500 text-white text-xs">
                                      {task.assignee.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-white/70 text-xs">{task.assignee.name}</span>
                                </>
                              ) : (
                                <span className="text-white/50 text-xs">Unassigned</span>
                              )}
                            </div>

                            <div className="flex items-center space-x-2 text-white/60">
                              {task.due_date && (
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-3 h-3" />
                                  <span className="text-xs">{new Date(task.due_date).toLocaleDateString()}</span>
                                </div>
                              )}
                              {task.comments && task.comments > 0 && (
                                <div className="flex items-center space-x-1">
                                  <MessageSquare className="w-3 h-3" />
                                  <span className="text-xs">{task.comments}</span>
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
            updateTask(project.id, updatedTask.id, updatedTask)
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