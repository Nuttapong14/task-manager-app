"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Flag, Plus, User, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"

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

interface NewTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialStatus: "todo" | "in-progress" | "done"
  onCreateTask: (task: Omit<Task, "id">) => void
  onDeleteTask?: (taskId: string) => void
  task?: Task // For editing existing tasks
}

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
]

const mockUsers = [
  { id: "1", name: "John Doe", avatar: "/placeholder-user.jpg", initials: "JD" },
  { id: "2", name: "Sarah Johnson", avatar: "/placeholder-user.jpg", initials: "SJ" },
  { id: "3", name: "Mike Chen", avatar: "/placeholder-user.jpg", initials: "MC" },
  { id: "4", name: "Emily Davis", avatar: "/placeholder-user.jpg", initials: "ED" },
  { id: "5", name: "Alex Thompson", avatar: "/placeholder-user.jpg", initials: "AT" },
]

export function NewTaskModal({ open, onOpenChange, initialStatus, onCreateTask, onDeleteTask, task }: NewTaskModalProps) {
  const [title, setTitle] = useState(task?.title || "")
  const [description, setDescription] = useState(task?.description || "")
  const [priority, setPriority] = useState<"low" | "medium" | "high">(task?.priority || "medium")
  const [dueDate, setDueDate] = useState<Date>(task?.dueDate ? new Date(task.dueDate) : undefined)
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedAssignee, setSelectedAssignee] = useState(task?.assignee ? mockUsers.find(u => u.name === task.assignee?.name)?.id || mockUsers[0].id : mockUsers[0].id)
  const [tags, setTags] = useState<string[]>(task?.tags || [])
  const [newTag, setNewTag] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Only require title and description, make due date optional
    if (!title.trim() || !description.trim()) {
      alert('Please fill in both title and description')
      return
    }

    const assignedUser = mockUsers.find(u => u.id === selectedAssignee) || mockUsers[0]
    
    // Use current date as default if no due date selected
    const taskDueDate = dueDate || new Date()
    
    onCreateTask({
      title: title.trim(),
      description: description.trim(),
      status: initialStatus,
      priority,
      assignee: {
        name: assignedUser.name,
        avatar: assignedUser.avatar,
      },
      dueDate: taskDueDate.toISOString().split("T")[0],
      tags,
      comments: [],
    })

    // Reset form and close modal
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setPriority("medium")
    setDueDate(undefined)
    setShowCalendar(false)
    setSelectedAssignee(mockUsers[0].id)
    setTags([])
    setNewTag("")
  }

  const handleDelete = () => {
    if (task && onDeleteTask) {
      onDeleteTask(task.id)
      onOpenChange(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen)
      if (!isOpen) {
        setShowCalendar(false)
      }
    }}>
      <DialogContent className="glass-card border-white/20 text-white max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">
                {task ? "Edit Task" : "Create New Task"}
              </DialogTitle>
              <DialogDescription className="text-white/70">
                {task ? "Update task details and manage comments" : "Add a new task to your project board"}
              </DialogDescription>
            </div>
            {task && onDeleteTask && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-red-400 border-red-400/30 hover:bg-red-500/20"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white/90">
              Task Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="glass-card border-white/20 text-white placeholder:text-white/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white/90">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the task"
              className="glass-card border-white/20 text-white placeholder:text-white/50 resize-none"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white/90">Priority</Label>
            <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
              <SelectTrigger className="glass-card border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/20">
                {priorityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-white">
                    <div className="flex items-center gap-2">
                      <Flag className="w-3 h-3" />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white/90">Assignee</Label>
            <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
              <SelectTrigger className="glass-card border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/20">
                {mockUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id} className="text-white">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="text-xs bg-purple-500/20 text-purple-300">
                          {user.initials}
                        </AvatarFallback>
                      </Avatar>
                      {user.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white/90">Due Date (Optional)</Label>
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  console.log("Button clicked!")
                  setShowCalendar(!showCalendar)
                }}
                className="w-full justify-start glass-card border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : "Pick a date"}
              </Button>
              
              {showCalendar && (
                <div className="mt-2 p-3 bg-slate-900 border border-white/20 rounded-lg shadow-xl">
                  <Calendar 
                    mode="single" 
                    selected={dueDate} 
                    onSelect={(date) => {
                      console.log("Date selected:", date)
                      setDueDate(date)
                      setShowCalendar(false)
                    }}
                    initialFocus 
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    className="text-white w-full"
                    classNames={{
                      months: "flex flex-col space-y-4",
                      month: "space-y-4 w-full",
                      caption: "flex justify-center pt-1 relative items-center text-white mb-2",
                      caption_label: "text-sm font-medium text-white",
                      nav: "space-x-1 flex items-center",
                      nav_button: "h-7 w-7 bg-transparent p-0 text-white hover:bg-white/20 hover:text-white border border-white/20 rounded",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse",
                      head_row: "flex w-full",
                      head_cell: "text-white/60 rounded-md flex-1 font-normal text-[0.8rem] text-center p-1",
                      row: "flex w-full mt-1",
                      cell: "flex-1 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                      day: "h-8 w-full p-0 font-normal text-white hover:bg-purple-500/20 hover:text-white rounded cursor-pointer transition-colors text-sm",
                      day_range_end: "day-range-end",
                      day_selected: "bg-purple-500 text-white hover:bg-purple-600 hover:text-white focus:bg-purple-500 focus:text-white rounded",
                      day_today: "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30",
                      day_outside: "text-white/30 hover:bg-white/10 hover:text-white/60",
                      day_disabled: "text-white/20 cursor-not-allowed hover:bg-transparent",
                      day_range_middle: "aria-selected:bg-purple-500/20 aria-selected:text-white",
                      day_hidden: "invisible",
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white/90">Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-white/10 text-white/90 border border-white/20 px-2 py-1 rounded text-xs flex items-center gap-1"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:bg-white/20 rounded-full p-0.5">
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className="glass-card border-white/20 text-white placeholder:text-white/50"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="icon" className="glass-button">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 glass-card border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 glass-button text-white font-medium">
              {task ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
