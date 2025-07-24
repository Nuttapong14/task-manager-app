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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Flag, Plus } from "lucide-react"
import { format } from "date-fns"

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

interface NewTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialStatus: "todo" | "in-progress" | "done"
  onCreateTask: (task: Omit<Task, "id">) => void
}

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
]

export function NewTaskModal({ open, onOpenChange, initialStatus, onCreateTask }: NewTaskModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [dueDate, setDueDate] = useState<Date>()
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !description || !dueDate) return

    onCreateTask({
      title,
      description,
      status: initialStatus,
      priority,
      assignee: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      dueDate: dueDate.toISOString().split("T")[0],
      tags,
      comments: 0,
    })

    // Reset form
    setTitle("")
    setDescription("")
    setPriority("medium")
    setDueDate(undefined)
    setTags([])
    setNewTag("")
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create New Task</DialogTitle>
          <DialogDescription className="text-white/70">Add a new task to your project board</DialogDescription>
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
            <Label className="text-white/90">Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start glass-card border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 glass-card border-white/20">
                <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus className="text-white" />
              </PopoverContent>
            </Popover>
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
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
