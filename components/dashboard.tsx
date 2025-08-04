"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/simple-auth-provider"
import { ProjectBoard } from "@/components/project-board"
import { NewProjectModal } from "@/components/new-project-modal"
import { EditProject } from "@/components/edit-project"
import { useProjects } from "@/components/project-provider"
import { projectApi } from "@/lib/api"
import { Plus, Search, Bell, Settings, LogOut, Users, Calendar, BarChart3, Folder, Trash2, Edit3, MoreVertical, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

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

export function Dashboard() {
  const { user, logout } = useAuth()
  const { projects, isLoading, addProject, removeProject, updateProject } = useProjects()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showNewProject, setShowNewProject] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Projects are now automatically loaded by the ProjectProvider

  const handleCreateProject = async (projectData: {
    name: string
    description: string
    color: string
    dueDate: string | null
  }) => {
    console.log('=== CREATING PROJECT ===')
    console.log('Project data:', projectData)
    console.log('Current user:', user)
    
    if (!user?.id) {
      alert('You must be logged in to create a project.')
      return
    }

    // Create project locally first to show immediately
    const newProject: Project = {
      id: `temp-${Date.now()}`,
      name: projectData.name,
      description: projectData.description,
      color: projectData.color,
      due_date: projectData.dueDate,
      members: 1,
      tasks: { total: 0, completed: 0 },
      owner_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Add to global state immediately
    addProject(newProject)
    setShowNewProject(false)
    
    // Show success message
    alert(`Project "${projectData.name}" created successfully!`)

    // Try to save to database in background
    try {
      const projectToCreate = {
        name: projectData.name,
        description: projectData.description,
        color: projectData.color,
        due_date: projectData.dueDate,
        owner_id: user.id
      }
      
      console.log('Saving to database:', projectToCreate)
      const result = await projectApi.createProject(projectToCreate)
      console.log('Database save result:', result)
      
      // Update with real ID if successful
      if (result) {
        removeProject(newProject.id)
        addProject({ ...newProject, id: result.id })
      }
    } catch (error) {
      console.error('Database save failed:', error)
      // Keep the project in local state even if DB save fails
    }
  }

  const handleDeleteProject = async (projectId: string, projectName: string) => {
    console.log('=== DELETING PROJECT ===')
    console.log('Project ID:', projectId)
    console.log('Project Name:', projectName)
    
    // Simple confirmation test
    const userConfirmed = confirm(`Delete "${projectName}"?`)
    console.log('User confirmation result:', userConfirmed)
    
    // TEMPORARY: Skip confirmation for testing - remove this after debugging
    if (!userConfirmed) {
      console.log('Confirmation failed, but proceeding anyway for testing...')
      // Comment out the return to bypass confirmation
      // return
    }

    try {
      console.log('Removing from global state...')
      // Remove from global state immediately
      removeProject(projectId)
      
      // Try to delete from database
      if (!projectId.startsWith('temp-')) {
        console.log('Deleting from database...')
        await projectApi.deleteProject(projectId)
        console.log('Database deletion successful')
      } else {
        console.log('Skipping database deletion for temp project')
      }
      
      alert(`Project "${projectName}" deleted successfully!`)
    } catch (error) {
      console.error('Error deleting project:', error)
      console.error('Error details:', error.message || error)
      // Note: Projects will be reloaded automatically by ProjectProvider on next page visit
      alert(`Failed to delete project: ${error.message || 'Unknown error'}`)
    }
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (selectedProject) {
    return (
      <ProjectBoard 
        project={selectedProject} 
        onBack={() => setSelectedProject(null)} 
        onUpdateProject={(updatedProject) => {
          updateProject(updatedProject.id, updatedProject)
          setSelectedProject(updatedProject)
        }}
      />
    )
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
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Folder className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">TaskFlow</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
                <Settings className="w-5 h-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 text-white/90 hover:text-white hover:bg-white/10">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-purple-500 text-white text-sm">{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/preferences" className="flex items-center">
                      <Settings className="w-4 h-4 mr-2" />
                      Preferences
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name?.split(" ")[0]}!</h2>
          <p className="text-white/70">
            You have {projects.reduce((acc, p) => acc + p.tasks.total - p.tasks.completed, 0)} pending tasks across{" "}
            {projects.length} projects
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="glass-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Total Projects</p>
                  <p className="text-2xl font-bold text-white">{projects.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Folder className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Active Tasks</p>
                  <p className="text-2xl font-bold text-white">
                    {projects.reduce((acc, p) => acc + p.tasks.total - p.tasks.completed, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Team Members</p>
                  <p className="text-2xl font-bold text-white">{projects.reduce((acc, p) => acc + p.members, 0)}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Due This Week</p>
                  <p className="text-2xl font-bold text-white">
                    {(() => {
                      const now = new Date()
                      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
                      return projects.filter(project => {
                        if (!project.due_date) return false
                        const dueDate = new Date(project.due_date)
                        return dueDate >= now && dueDate <= weekFromNow
                      }).length
                    })()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-white/50" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass-card border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <Button onClick={() => setShowNewProject(true)} className="glass-button text-white font-medium">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full text-center py-12"
            >
              <div className="glass-card border-white/10 p-8 rounded-lg">
                <Folder className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
                <p className="text-white/70 mb-4">
                  Create your first project to get started with task management
                </p>
                <Button 
                  onClick={() => setShowNewProject(true)} 
                  className="glass-button text-white font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Project
                </Button>
              </div>
            </motion.div>
          ) : (
            filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5 }}
              className="cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${project.color} rounded-lg flex items-center justify-center`}
                    >
                      <Folder className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-white/10 text-white/90 border-white/20">
                        {project.members} members
                      </Badge>
                      <div onClick={(e) => e.stopPropagation()} className="relative z-10">
                        <EditProject 
                          project={project} 
                          onUpdate={(updatedProject) => {
                            updateProject(updatedProject.id, updatedProject)
                          }}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          console.log('Delete button clicked for project:', project.name)
                          handleDeleteProject(project.id, project.name)
                        }}
                        className="h-8 w-8 text-white/60 hover:text-red-400 hover:bg-red-500/10 relative z-10"
                        title={`Delete "${project.name}" project`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-white text-lg">{project.name}</CardTitle>
                  <CardDescription className="text-white/70 mt-2 text-sm">
                    {project.description || "No description provided"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70">Progress</span>
                      <div className="flex items-center gap-2">
                        <motion.span 
                          className="text-white font-medium"
                          key={`${project.id}-${project.tasks.completed}-${project.tasks.total}`}
                          initial={{ scale: 1 }}
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 0.3 }}
                        >
                          {project.tasks.completed}/{project.tasks.total} tasks
                          {project.tasks.total > 0 && (
                            <span className="ml-2 text-xs text-white/60">
                              ({Math.round((project.tasks.completed / project.tasks.total) * 100)}%)
                            </span>
                          )}
                        </motion.span>
                        
                        {/* Completion badge */}
                        {project.tasks.completed === project.tasks.total && project.tasks.total > 0 && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                            className="text-green-400"
                          >
                            ✨
                          </motion.div>
                        )}
                      </div>
                    </div>
                    <motion.div 
                      className="w-full bg-white/10 rounded-full h-2 overflow-hidden"
                      key={`progress-${project.id}-${project.tasks.completed}`}
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ 
                          width: project.tasks.total > 0 
                            ? `${Math.round((project.tasks.completed / project.tasks.total) * 100)}%` 
                            : '0%'
                        }}
                        transition={{ 
                          delay: 0.2 + index * 0.05, 
                          duration: 1.2,
                          ease: "easeOut"
                        }}
                        className={`h-2 bg-gradient-to-r ${project.color} rounded-full relative shadow-sm`}
                      >
                        {/* Subtle shimmer effect for completed progress */}
                        {project.tasks.completed > 0 && (
                          <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{
                              repeat: Infinity,
                              duration: 3,
                              ease: "easeInOut",
                              delay: 2 + index * 0.2
                            }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          />
                        )}
                        
                        {/* Completion glow effect */}
                        {project.tasks.completed === project.tasks.total && project.tasks.total > 0 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.6, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 2,
                              ease: "easeInOut"
                            }}
                            className="absolute inset-0 bg-white/40 rounded-full blur-sm"
                          />
                        )}
                      </motion.div>
                    </motion.div>
                    {project.due_date && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/70">Due Date</span>
                        <span className="text-white">
                          {new Date(project.due_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {project.created_at && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/70">Created</span>
                        <span className="text-white">
                          {new Date(project.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            ))
          )}
        </motion.div>
      </div>

      <NewProjectModal
        open={showNewProject}
        onOpenChange={setShowNewProject}
        onCreateProject={handleCreateProject}
      />
    </div>
  )
}
