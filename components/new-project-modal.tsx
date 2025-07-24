"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Palette } from "lucide-react"
import { format } from "date-fns"

interface NewProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateProject: (project: {
    name: string
    description: string
    color: string
    members: number
    tasks: { total: number; completed: number }
    dueDate: string
  }) => void
}

const colorOptions = [
  "from-purple-500 to-pink-500",
  "from-blue-500 to-cyan-500",
  "from-green-500 to-emerald-500",
  "from-orange-500 to-red-500",
  "from-indigo-500 to-purple-500",
  "from-pink-500 to-rose-500",
]

export function NewProjectModal({ open, onOpenChange, onCreateProject }: NewProjectModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedColor, setSelectedColor] = useState(colorOptions[0])
  const [dueDate, setDueDate] = useState<Date>()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !description || !dueDate) return

    onCreateProject({
      name,
      description,
      color: selectedColor,
      members: 1,
      tasks: { total: 0, completed: 0 },
      dueDate: dueDate.toISOString().split("T")[0],
    })

    // Reset form
    setName("")
    setDescription("")
    setSelectedColor(colorOptions[0])
    setDueDate(undefined)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create New Project</DialogTitle>
          <DialogDescription className="text-white/70">
            Set up a new project to start collaborating with your team
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white/90">
              Project Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
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
              placeholder="Describe your project"
              className="glass-card border-white/20 text-white placeholder:text-white/50 resize-none"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white/90 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Project Color
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {colorOptions.map((color, index) => (
                <motion.button
                  key={index}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedColor(color)}
                  className={`w-full h-12 bg-gradient-to-r ${color} rounded-lg border-2 transition-all ${
                    selectedColor === color ? "border-white" : "border-white/20"
                  }`}
                />
              ))}
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
                  {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 glass-card border-white/20">
                <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus className="text-white" />
              </PopoverContent>
            </Popover>
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
              Create Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
