"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Edit3, Save, X } from "lucide-react"
import { projectApi } from "@/lib/api"

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
  due_date: string | null
  owner_id?: string
  created_at?: string
  updated_at?: string
}

interface EditProjectProps {
  project: Project
  onUpdate?: (updatedProject: Project) => void
}

export function EditProject({ project, onUpdate }: EditProjectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState(project.name || "")
  const [description, setDescription] = useState(project.description || "")
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    const trimmedName = name.trim()
    const trimmedDescription = description.trim()
    
    // Check if nothing changed
    if (trimmedName === project.name?.trim() && trimmedDescription === project.description?.trim()) {
      setIsOpen(false)
      return
    }

    // Validate name is not empty
    if (!trimmedName) {
      alert('Project name cannot be empty.')
      return
    }

    setIsLoading(true)
    try {
      const updates: { name?: string; description?: string } = {}
      
      if (trimmedName !== project.name?.trim()) {
        updates.name = trimmedName
      }
      
      if (trimmedDescription !== project.description?.trim()) {
        updates.description = trimmedDescription
      }

      const updatedProject = await projectApi.updateProject(project.id, updates)
      
      if (onUpdate) {
        onUpdate({ ...project, ...updates })
      }
      
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to update project:', error)
      alert('Failed to update project. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setName(project.name || "")
    setDescription(project.description || "")
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/10 p-1 h-auto"
          title="Edit project name and description"
        >
          <Edit3 className="w-3 h-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md glass-card border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-white/90 mb-2 block">
              Project Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name..."
              className="glass-card border-white/20 text-white placeholder:text-white/50"
              maxLength={100}
            />
            <p className="text-xs text-white/60 mt-1">
              {name.length}/100 characters
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-white/90 mb-2 block">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description..."
              className="glass-card border-white/20 text-white placeholder:text-white/50 min-h-[100px] resize-none"
              maxLength={500}
            />
            <p className="text-xs text-white/60 mt-1">
              {description.length}/500 characters
            </p>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={handleCancel}
            disabled={isLoading}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="glass-button text-white font-medium"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}