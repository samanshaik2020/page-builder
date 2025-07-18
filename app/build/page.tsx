"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"

interface SavedProject {
  templateId: string
  lastModified: number
  title: string
}

export default function BuildPage() {
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("litebuilder_saved_projects")
    if (saved) {
      try {
        setSavedProjects(JSON.parse(saved))
      } catch (error) {
        console.error("Failed to load saved projects:", error)
      }
    }
  }, [])

  const templates = [
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
  ]

  const formatLastModified = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">LiteBuilder</h1>
          <p className="text-gray-600 mt-2">Choose a template to start building your landing page</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Saved Projects Section */}
        {savedProjects.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProjects.map((project) => (
                <Card key={project.templateId} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatLastModified(project.lastModified)}
                      </Badge>
                    </div>
                    <CardDescription>Last modified {formatLastModified(project.lastModified)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Link href={`/editor?id=${project.templateId}`} className="flex-1">
                        <Button className="w-full flex items-center gap-2">
                          <Edit className="h-4 w-4" />
                          Continue Editing
                        </Button>
                      </Link>
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Templates Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            {savedProjects.length > 0 ? "Start Fresh" : "Choose a Template"}
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
                      <Link href={`/editor?id=${template.id}`} className="flex-1">
                        <Button className="w-full flex items-center gap-2">
                          <Edit className="h-4 w-4" />
                          Edit Template
                        </Button>
                      </Link>
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
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
