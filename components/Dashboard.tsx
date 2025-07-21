'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { databaseService } from '@/lib/database'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Edit, Eye, Trash2, ExternalLink, Users, Mail, LogOut, Palette } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { LandingPage } from '@/lib/supabase'
import { getTemplateElements, getAvailableTemplates, type TemplateInfo } from '@/lib/store'

export function Dashboard() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [landingPages, setLandingPages] = useState<LandingPage[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showTemplatesModal, setShowTemplatesModal] = useState(false)
  const [newPageTitle, setNewPageTitle] = useState('')
  const [newPageSlug, setNewPageSlug] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('template1')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (user) {
      loadLandingPages()
    }
  }, [user])

  const loadLandingPages = async () => {
    if (!user) return
    
    setLoading(true)
    const { landingPages: pages, error } = await databaseService.getUserLandingPages(user.id)
    
    if (error) {
      console.error('Error loading landing pages:', error)
    } else {
      setLandingPages(pages || [])
    }
    setLoading(false)
  }

  const handleCreatePage = async () => {
    if (!user || !newPageTitle.trim()) return

    setCreating(true)
    try {
      const slug = newPageSlug.trim() || await databaseService.generateUniqueSlug(newPageTitle)
      const templateElements = getTemplateElements(selectedTemplate)
      
      const { landingPage, error } = await databaseService.createLandingPage({
        title: newPageTitle.trim(),
        slug,
        elements_data: templateElements,
        template_id: selectedTemplate,
        user_id: user.id
      })

      if (error) {
        console.error('Error creating landing page:', error)
        alert('Error creating landing page: ' + error.message)
      } else if (landingPage) {
        setLandingPages([landingPage, ...landingPages])
        setShowCreateModal(false)
        setNewPageTitle('')
        setNewPageSlug('')
        setSelectedTemplate('template1')
        
        // Navigate to editor with the new page
        router.push(`/editor?pageId=${landingPage.id}`)
      }
    } catch (error) {
      console.error('Error creating landing page:', error)
      alert('An unexpected error occurred')
    } finally {
      setCreating(false)
    }
  }

  const handlePublishToggle = async (pageId: string, isPublished: boolean) => {
    const action = isPublished ? 'unpublish' : 'publish'
    const { error } = isPublished 
      ? await databaseService.unpublishLandingPage(pageId)
      : await databaseService.publishLandingPage(pageId)

    if (error) {
      console.error(`Error ${action}ing page:`, error)
      alert(`Error ${action}ing page: ` + error.message)
    } else {
      setLandingPages(pages => 
        pages.map(page => 
          page.id === pageId 
            ? { ...page, is_published: !isPublished }
            : page
        )
      )
    }
  }

  const handleDeletePage = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this landing page? This action cannot be undone.')) {
      return
    }

    const { error } = await databaseService.deleteLandingPage(pageId)
    
    if (error) {
      console.error('Error deleting page:', error)
      alert('Error deleting page: ' + error.message)
    } else {
      setLandingPages(pages => pages.filter(page => page.id !== pageId))
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Landing Page Builder</h1>
              <p className="text-sm text-gray-500">Welcome back, {user?.email}</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{landingPages.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {landingPages.filter(page => page.is_published).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {landingPages.filter(page => !page.is_published).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create New Page Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Landing Pages</h2>
          <div className="flex space-x-2">
            <Dialog open={showTemplatesModal} onOpenChange={setShowTemplatesModal}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Palette className="h-4 w-4 mr-2" />
                  Browse Templates
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Choose a Template</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {getAvailableTemplates().map((template: TemplateInfo) => (
                    <Card 
                      key={template.id} 
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => {
                        setSelectedTemplate(template.id)
                        setShowTemplatesModal(false)
                        setShowCreateModal(true)
                      }}
                    >
                      <CardHeader className="p-4">
                        <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                          <div className="text-gray-400 text-sm">Preview</div>
                        </div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <p className="text-sm text-gray-600">{template.description}</p>
                        <Badge variant="secondary" className="capitalize w-fit">
                          {template.category}
                        </Badge>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Page
                </Button>
              </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Landing Page</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Page Title</Label>
                  <Input
                    id="title"
                    value={newPageTitle}
                    onChange={(e) => setNewPageTitle(e.target.value)}
                    placeholder="Enter page title"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug (optional)</Label>
                  <Input
                    id="slug"
                    value={newPageSlug}
                    onChange={(e) => setNewPageSlug(e.target.value)}
                    placeholder="custom-url-slug"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to auto-generate from title
                  </p>
                </div>
                <div>
                  <Label htmlFor="template">Template</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableTemplates().map((template: TemplateInfo) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name} - {template.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    Or browse templates above for a visual selection
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePage} disabled={creating || !newPageTitle.trim()}>
                    {creating ? 'Creating...' : 'Create Page'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        {/* Landing Pages Grid */}
        {landingPages.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">No landing pages yet</h3>
                <p className="text-gray-500 mb-4">Create your first landing page to get started</p>
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Page
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {landingPages.map((page) => (
              <Card key={page.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{page.title}</CardTitle>
                    <Badge variant={page.is_published ? "default" : "secondary"}>
                      {page.is_published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">/{page.slug}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/editor?pageId=${page.id}`)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      {page.is_published && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`/page/${page.slug}`, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant={page.is_published ? "secondary" : "default"}
                        onClick={() => handlePublishToggle(page.id, page.is_published)}
                      >
                        {page.is_published ? "Unpublish" : "Publish"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeletePage(page.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    Created: {new Date(page.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
