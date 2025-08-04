"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./simple-auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import { Bell, Moon, Sun, Palette, Clock, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface UserPreferences {
  notifications: {
    email: boolean
    push: boolean
    taskReminders: boolean
    projectUpdates: boolean
  }
  theme: "light" | "dark" | "system"
  timezone: string
  language: string
  privacy: {
    profileVisible: boolean
    activityVisible: boolean
  }
}

const defaultPreferences: UserPreferences = {
  notifications: {
    email: true,
    push: true,
    taskReminders: true,
    projectUpdates: true
  },
  theme: "system",
  timezone: "UTC",
  language: "en",
  privacy: {
    profileVisible: true,
    activityVisible: true
  }
}

export function UserPreferences() {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Load preferences from localStorage or API
    const savedPreferences = localStorage.getItem(`user_preferences_${user?.id}`)
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences))
      } catch (error) {
        console.error('Error loading preferences:', error)
      }
    }
  }, [user])

  const savePreferences = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      // Save to localStorage (in a real app, this would go to the backend)
      localStorage.setItem(`user_preferences_${user.id}`, JSON.stringify(preferences))
      toast.success('Preferences saved successfully')
    } catch (error) {
      console.error('Error saving preferences:', error)
      toast.error('Failed to save preferences')
    } finally {
      setIsSaving(false)
    }
  }

  const updateNotification = (key: keyof UserPreferences['notifications'], value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }))
  }

  const updatePrivacy = (key: keyof UserPreferences['privacy'], value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }))
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Preferences
          </h1>
        </div>
        <Button onClick={savePreferences} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </CardTitle>
            <CardDescription>
              Manage how you receive notifications and updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <Switch
                id="email-notifications"
                checked={preferences.notifications.email}
                onCheckedChange={(checked) => updateNotification('email', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <Switch
                id="push-notifications"
                checked={preferences.notifications.push}
                onCheckedChange={(checked) => updateNotification('push', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="task-reminders">Task Reminders</Label>
              <Switch
                id="task-reminders"
                checked={preferences.notifications.taskReminders}
                onCheckedChange={(checked) => updateNotification('taskReminders', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="project-updates">Project Updates</Label>
              <Switch
                id="project-updates"
                checked={preferences.notifications.projectUpdates}
                onCheckedChange={(checked) => updateNotification('projectUpdates', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Appearance & Display
            </CardTitle>
            <CardDescription>
              Customize how the app looks and feels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select
                value={preferences.theme}
                onValueChange={(value: "light" | "dark" | "system") => 
                  setPreferences(prev => ({ ...prev, theme: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center">
                      <Sun className="h-4 w-4 mr-2" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center">
                      <Moon className="h-4 w-4 mr-2" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center">
                      <Palette className="h-4 w-4 mr-2" />
                      System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={preferences.language}
                onValueChange={(value) => 
                  setPreferences(prev => ({ ...prev, language: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Time & Region
            </CardTitle>
            <CardDescription>
              Set your timezone and regional preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={preferences.timezone}
                onValueChange={(value) => 
                  setPreferences(prev => ({ ...prev, timezone: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time (EST/EDT)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CST/CDT)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (MST/MDT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PST/PDT)</SelectItem>
                  <SelectItem value="Europe/London">London (GMT/BST)</SelectItem>
                  <SelectItem value="Europe/Paris">Paris (CET/CEST)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                  <SelectItem value="Asia/Shanghai">Shanghai (CST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Privacy & Security
            </CardTitle>
            <CardDescription>
              Control your privacy and data sharing settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="profile-visible">Profile Visibility</Label>
                <p className="text-sm text-muted-foreground">
                  Allow others to see your profile information
                </p>
              </div>
              <Switch
                id="profile-visible"
                checked={preferences.privacy.profileVisible}
                onCheckedChange={(checked) => updatePrivacy('profileVisible', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="activity-visible">Activity Visibility</Label>
                <p className="text-sm text-muted-foreground">
                  Show your activity status to team members
                </p>
              </div>
              <Switch
                id="activity-visible"
                checked={preferences.privacy.activityVisible}
                onCheckedChange={(checked) => updatePrivacy('activityVisible', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}