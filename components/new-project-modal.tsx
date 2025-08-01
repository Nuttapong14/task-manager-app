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
import { CalendarIcon, Palette } from "lucide-react"
import { format } from "date-fns"

interface NewProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateProject: (project: {
    name: string
    description: string
    color: string
    dueDate: string | null
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
  const [showCalendar, setShowCalendar] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !description) return

    onCreateProject({
      name,
      description,
      color: selectedColor,
      dueDate: dueDate ? dueDate.toISOString().split("T")[0] : null,
    })

    // Reset form
    setName("")
    setDescription("")
    setSelectedColor(colorOptions[0])
    setDueDate(undefined)
    setShowCalendar(false)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen)
      if (!isOpen) {
        setShowCalendar(false)
      }
    }}>
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


// this is a modal when i click "+ New Project!"