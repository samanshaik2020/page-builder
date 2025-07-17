"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Clock, PlusCircle, LogOut } from "lucide-react"
import Link from "next/link"
import Image from "next/image" // Ensure Image is imported
import { useEffect, useState } from "react"
import { createClientComponentClient } from "@/lib/supabase"
import { useEditorStore, type ProjectData } from "@/lib/store"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { getTemplateElements } from "@/lib/templateElements" // Declare the variable before using it

interface Template {
  id: string
  title: string
  description: string
  preview: string
  category: string
}

export default function BuildPage() {
  const [userProjects, setUserProjects] = useState<ProjectData[]>([])
  const [loading, setLoading] = useState(true)
  const { currentUserId, createNewProject, publishProject } = useEditorStore()
  const supabase = createClientComponentClient()
  const router = useRouter()

  // Define templates here or fetch them if they were in a separate source
  const templates: Template[] = [
    {
      id: "template1",
      title: "Modern Landing Page",
      description: "Clean and professional landing page with hero section, features, and call-to-action",
      preview: "/placeholder.svg?height=200&width=300",
      category: "Landing Page",
    },
    {
      id: "template2",
      title: "SaaS Product Page",
      description: "Complete SaaS landing page with stats, testimonials, pricing, and multiple CTAs",
      preview: "/placeholder.svg?height=200&width=300",
      category: "SaaS",
    },
    {
      id: "template3",
      title: "Creative Agency",
      description: "Elegant portfolio template for agencies with services, portfolio, and contact sections",
      preview: "/placeholder.svg?height=200&width=300",
      category: "Portfolio",
    },
    {
      id: "product-template",
      title: "Product Showcase",
      description: "Detailed product page with features, testimonials, pricing, and FAQs.",
      preview: "/placeholder.svg?height=200&width=300",
      category: "Product",
    },
    {
      id: "simple-landing-page",
      title: "Simple Lead-Gen Landing Page",
      description: "A concise landing page focused on lead generation with clear benefits and CTA.",
      preview: "/placeholder.svg?height=200&width=300",
      category: "Landing Page",
    },
    {
      id: "personal-portfolio",
      title: "Personal Portfolio",
      description: "Showcase your work and skills with a professional personal portfolio.",
      preview: "/placeholder.svg?height=200&width=300",
      category: "Portfolio",
    },
    {
      id: "professional-landing-page", // New template
      title: "Professional Landing Page",
      description: "Elevate your online presence with a sleek, high-converting professional landing page.",
      preview: "/placeholder.svg?height=200&width=300",
      category: "Business",
    },
  ]

  useEffect(() => {
    const fetchUserAndProjects = async () => {
      setLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        useEditorStore.setState({ currentUserId: user.id })
        const { data: projects, error } = await supabase
          .from("pages")
          .select("*")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false })

        if (error) {
          console.error("Error fetching projects:", error)
        } else {
          setUserProjects(projects || [])
        }
      } else {
        router.push("/auth") // Redirect to login if no user
      }
      setLoading(false)
    }

    fetchUserAndProjects()
  }, [currentUserId, router, supabase])

  const handleCreateNewProject = async (templateId?: string) => {
    if (!currentUserId) {
      alert("Please log in to create a new project.")
      router.push("/auth")
      return
    }

    const templateToUse = templates.find((t) => t.id === templateId)
    const initialElements = templateToUse
      ? getTemplateElements(templateToUse.id)
      : {
          root: {
            id: "root",
            type: "container",
            styles: {
              backgroundColor: "#ffffff",
              padding: [0, 0, 0, 0],
              margin: [0, 0, 0, 0],
              xPosition: 0,
              yPosition: 0,
            },
            children: [],
          },
        }

    const defaultTitle = templateToUse ? templateToUse.title : `New Page ${userProjects.length + 1}`

    const newProject = await createNewProject(defaultTitle, initialElements, currentUserId)
    if (newProject) {
      router.push(`/editor?id=${newProject.id}`)
    } else {
      alert("Failed to create new project.")
    }
  }

  const handlePublishToggle = async (projectId: string, isPublished: boolean) => {
    await publishProject(projectId, isPublished)
    // Optimistically update UI or re-fetch projects
    setUserProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, is_published: isPublished } : p)))
  }

  const handleLogout = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Error logging out:", error)
    } else {
      router.push("/auth")
      useEditorStore.setState({ currentUserId: null, currentProjectId: null, elements: {} })
    }
    setLoading(false)
  }

  const formatLastModified = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="max-w-6xl mx-auto flex justify-between items-center w-full">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">LiteBuilder</h1>
            <p className="text-gray-600 mt-2">Manage your projects or choose a template to start building.</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Your Projects Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Projects</h2>
          {userProjects.length === 0 ? (
            <div className="text-center py-10 border border-dashed rounded-lg text-gray-500">
              <p className="mb-4">You haven't created any projects yet.</p>
              <Button onClick={() => handleCreateNewProject()} className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                Create Your First Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatLastModified(project.updated_at)}
                      </Badge>
                    </div>
                    <CardDescription>Last modified {formatLastModified(project.updated_at)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      <Link href={`/editor?id=${project.id}`} className="flex-1">
                        <Button className="w-full flex items-center gap-2">
                          <Edit className="h-4 w-4" />
                          Continue Editing
                        </Button>
                      </Link>
                      <Link href={`/page/${project.slug}`} target="_blank" className="flex-1">
                        <Button variant="outline" className="w-full flex items-center gap-2 bg-transparent">
                          <Eye className="h-4 w-4" />
                          View Live Page
                        </Button>
                      </Link>
                      <div className="flex items-center justify-between space-x-2 py-2">
                        <Label htmlFor={`publish-toggle-${project.id}`}>Publish</Label>
                        <Switch
                          id={`publish-toggle-${project.id}`}
                          checked={project.is_published}
                          onCheckedChange={(checked) => handlePublishToggle(project.id, checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Templates Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            {userProjects.length > 0 ? "Start Fresh with a Template" : "Choose a Template"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <Image
                    src={template.preview || "/placeholder.svg"}
                    alt={template.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-md"
                  />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-lg">{template.title}</CardTitle>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                      <CardDescription>{template.description}</CardDescription>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleCreateNewProject(template.id)}
                        className="w-full flex items-center gap-2"
                      >
                        <PlusCircle className="h-4 w-4" />
                        Use Template
                      </Button>
                      {/* You might add a preview button here if you have a static preview for templates */}
                      {/* <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
