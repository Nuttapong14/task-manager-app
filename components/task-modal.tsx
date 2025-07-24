"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Flag, MessageSquare, Plus, X } from "lucide-react"
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

interface TaskModalProps {
  task: Task
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateTask: (task: Task) => void
}

const priorityColors = {
  low: "bg-green-500/20 text-green-400 border-green-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  high: "bg-red-500/20 text-red-400 border-red-500/30",
}

const statusOptions = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
]

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
]

export function TaskModal({ task, open, onOpenChange, onUpdateTask }: TaskModalProps) {
  const [editedTask, setEditedTask] = useState<Task>(task)
  const [newTag, setNewTag] = useState("")
  const [dueDate, setDueDate] = useState<Date>(new Date(task.dueDate))

  const handleSave = () => {
    onUpdateTask({
      ...editedTask,
      dueDate: dueDate.toISOString().split("T")[0],
    })
  }

  const addTag = () => {
    if (newTag.trim() && !editedTask.tags.includes(newTag.trim())) {
      setEditedTask({
        ...editedTask,
        tags: [...editedTask.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setEditedTask({
      ...editedTask,
      tags: editedTask.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Task Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white/90">
              Title
            </Label>
            <Input
              id="title"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              className="glass-card border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white/90">
              Description
            </Label>
            <Textarea
              id="description"
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              className="glass-card border-white/20 text-white placeholder:text-white/50 resize-none"
              rows={4}
            />
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white/90">Status</Label>
              <Select
                value={editedTask.status}
                onValueChange={(value: "todo" | "in-progress" | "done") =>
                  setEditedTask({ ...editedTask, status: value })
                }
              >
                <SelectTrigger className="glass-card border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/20">
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white/90">Priority</Label>
              <Select
                value={editedTask.priority}
                onValueChange={(value: "low" | "medium" | "high") => setEditedTask({ ...editedTask, priority: value })}
              >
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
          </div>

          {/* Assignee and Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white/90">Assignee</Label>
              <div className="flex items-center space-x-2 p-3 glass-card border-white/20 rounded-md">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={editedTask.assignee.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-purple-500 text-white text-xs">
                    {editedTask.assignee.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-white text-sm">{editedTask.assignee.name}</span>
              </div>
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
                    {format(dueDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 glass-card border-white/20">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={(date) => date && setDueDate(date)}
                    initialFocus
                    className="text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-white/90">Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {editedTask.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-white/10 text-white/90 border-white/20 flex items-center gap-1"
                >
                  {tag}
                  <button onClick={() => removeTag(tag)} className="ml-1 hover:bg-white/20 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className="glass-card border-white/20 text-white placeholder:text-white/50"
                onKeyPress={(e) => e.key === "Enter" && addTag()}
              />
              <Button type="button" onClick={addTag} size="icon" className="glass-button">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-2">
            <Label className="text-white/90 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Comments ({editedTask.comments})
            </Label>
            <div className="glass-card border-white/20 p-4 rounded-md">
              <p className="text-white/70 text-sm">Comments feature coming soon...</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 glass-card border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 glass-button text-white font-medium">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
