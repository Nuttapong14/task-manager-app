"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TaskModal } from "@/components/task-modal"
import { NewTaskModal } from "@/components/new-task-modal"
import { ArrowLeft, Plus, MoreHorizontal, Calendar, Flag, MessageSquare } from "lucide-react"

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
  comments: number
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

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Design Homepage Layout",
    description: "Create wireframes and mockups for the new homepage design",
    status: "in-progress",
    priority: "high",
    assignee: {
      name: "Alice Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    dueDate: "2024-01-25",
    tags: ["design", "ui/ux"],
    comments: 3,
  },
  {
    id: "2",
    title: "Set up Authentication",
    description: "Implement user login and registration system",
    status: "todo",
    priority: "medium",
    assignee: {
      name: "Bob Smith",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    dueDate: "2024-01-28",
    tags: ["backend", "auth"],
    comments: 1,
  },
  {
    id: "3",
    title: "Database Schema",
    description: "Design and implement the database structure",
    status: "done",
    priority: "high",
    assignee: {
      name: "Carol Davis",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    dueDate: "2024-01-20",
    tags: ["database", "backend"],
    comments: 5,
  },
  {
    id: "4",
    title: "Mobile Responsive Design",
    description: "Ensure the website works perfectly on mobile devices",
    status: "todo",
    priority: "medium",
    assignee: {
      name: "David Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    dueDate: "2024-02-01",
    tags: ["frontend", "responsive"],
    comments: 0,
  },
]

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
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showNewTask, setShowNewTask] = useState(false)
  const [newTaskColumn, setNewTaskColumn] = useState<string>("todo")

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status)
  }

  const handleNewTask = (columnId: string) => {
    setNewTaskColumn(columnId)
    setShowNewTask(true)
  }

  const handleCreateTask = (taskData: Omit<Task, "id">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
    }
    setTasks([...tasks, newTask])
    setShowNewTask(false)
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
                            <Badge variant="outline" className={`text-xs ${priorityColors[task.priority]} border`}>
                              <Flag className="w-3 h-3 mr-1" />
                              {task.priority}
                            </Badge>
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
                              {task.comments > 0 && (
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
            setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)))
            setSelectedTask(null)
          }}
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
