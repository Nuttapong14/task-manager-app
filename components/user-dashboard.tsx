"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./simple-auth-provider"
import { supabase } from "@/lib/supabase"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { User, Mail, Calendar, Shield, Edit2, Save, X, ArrowLeft, MapPin, Globe, Phone, FileText } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface UserProfile {
  id: string
  email: string
  name: string
  avatar_url?: string
  role: "admin" | "editor" | "viewer"
  created_at: string
  updated_at: string
  bio?: string
  location?: string
  website?: string
  phone?: string
}

export function UserDashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar_url: "",
    bio: "",
    location: "",
    website: "",
    phone: ""
  })

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error

      setProfile(data)
      setFormData({
        name: data.name,
        email: data.email,
        avatar_url: data.avatar_url || "",
        bio: data.bio || "",
        location: data.location || "",
        website: data.website || "",
        phone: data.phone || ""
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user || !profile) return

    setIsSaving(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          email: formData.email,
          avatar_url: formData.avatar_url || null,
          bio: formData.bio || null,
          location: formData.location || null,
          website: formData.website || null,
          phone: formData.phone || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error

      // Update local state with returned data
      if (data) {
        setProfile(data)
      }

      setIsEditing(false)
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (!profile) return
    
    setFormData({
      name: profile.name,
      email: profile.email,
      avatar_url: profile.avatar_url || "",
      bio: profile.bio || "",
      location: profile.location || "",
      website: profile.website || "",
      phone: profile.phone || ""
    })
    setIsEditing(false)
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive'
      case 'editor': return 'default'
      case 'viewer': return 'secondary'
      default: return 'outline'
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Unable to load profile</p>
          </CardContent>
        </Card>
      </div>
    )
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
            User Dashboard
          </h1>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar_url} alt={profile.name} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-lg">
                {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl">{profile.name}</CardTitle>
              <CardDescription className="text-base">{profile.email}</CardDescription>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant={getRoleBadgeVariant(profile.role)}>
                  <Shield className="h-3 w-3 mr-1" />
                  {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input
                  id="avatar"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                  placeholder="Enter avatar image URL (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself (optional)"
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City, Country (optional)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Phone number (optional)"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://yourwebsite.com (optional)"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Full Name</p>
                      <p className="text-sm text-muted-foreground">{profile.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email Address</p>
                      <p className="text-sm text-muted-foreground">{profile.email}</p>
                    </div>
                  </div>

                  {profile.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">{profile.phone}</p>
                      </div>
                    </div>
                  )}

                  {profile.website && (
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Website</p>
                        <a 
                          href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                          {profile.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Account Role</p>
                      <p className="text-sm text-muted-foreground capitalize">{profile.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Member Since</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(profile.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {profile.location && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">{profile.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {profile.bio && (
                <>
                  <Separator />
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">Bio</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
                    </div>
                  </div>
                </>
              )}
              
              <Separator />
              
              <div className="text-sm text-muted-foreground">
                <p>Last updated: {new Date(profile.updated_at).toLocaleString()}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Additional details about your account and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Role Permissions</h4>
              <div className="text-sm space-y-1">
                {profile.role === 'admin' && (
                  <>
                    <p>• Full access to all projects and settings</p>
                    <p>• Can manage users and permissions</p>
                    <p>• Can create, edit, and delete projects</p>
                  </>
                )}
                {profile.role === 'editor' && (
                  <>
                    <p>• Can create and edit projects</p>
                    <p>• Can manage tasks and collaborate</p>
                    <p>• Limited administrative access</p>
                  </>
                )}
                {profile.role === 'viewer' && (
                  <>
                    <p>• Can view projects and tasks</p>
                    <p>• Can comment on tasks</p>
                    <p>• Read-only access to most features</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}