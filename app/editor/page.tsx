"use client"

import { useEffect, Suspense, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useEditorStore } from "@/lib/store"
import { useAuth } from "@/contexts/AuthContext"
import { ElementRenderer } from "@/components/ElementRenderer"
import { Toolbar } from "@/components/Toolbar"
import { ElementsPanel } from "@/components/ElementsPanel"
import { SectionsPanel } from "@/components/SectionsPanel"
import { PropertyPanel } from "@/components/PropertyPanel"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, Eye } from "lucide-react"
import Link from "next/link"
import { Toaster } from "@/components/ui/toaster"
import { PreviewModal } from "@/components/PreviewModal"
import { EmailCollectionDialog } from "@/components/EmailCollectionDialog"
import { useToast } from "@/components/ui/use-toast"

function EditorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const templateId = searchParams.get("id") || "template1"
  const pageId = searchParams.get("pageId")
  const { 
    setCurrentTemplate, 
    loadProject, 
    loadPageFromSupabase,
    savePageToSupabase,
    elements, 
    currentPage,
    saving 
  } = useEditorStore()
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [pageCreated, setPageCreated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Authentication check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  // Load page data
  useEffect(() => {
    const loadPageData = async () => {
      if (!user) return
      
      setLoading(true)
      try {
        if (pageId) {
          // Load existing page from Supabase
          const success = await loadPageFromSupabase(pageId)
          if (!success) {
            toast({
              title: "Error",
              description: "Failed to load page. Redirecting to dashboard.",
              variant: "destructive",
            })
            router.push('/dashboard')
            return
          }
        } else {
          // Load template for new page
          setCurrentTemplate(templateId)
          loadProject(templateId)
        }
      } catch (error) {
        console.error('Error loading page:', error)
        toast({
          title: "Error",
          description: "Failed to load page data.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadPageData()
  }, [pageId, templateId, user, loadPageFromSupabase, setCurrentTemplate, loadProject, router, toast])

  // Monitor when elements are added to trigger the popup
  useEffect(() => {
    const elementCount = Object.keys(elements).length
    
    // If we have more than the default template elements, consider it "page created"
    if (elementCount > 10 && !pageCreated) { // Assuming default templates have ~10 elements
      setPageCreated(true)
      setShowEmailDialog(true)
    }
  }, [elements, pageCreated])

  const handleSave = async () => {
    if (pageId) {
      const success = await savePageToSupabase()
      if (success) {
        toast({
          title: "Saved!",
          description: "Your page has been saved successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to save page. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handlePreview = () => {
    if (currentPage?.slug) {
      window.open(`/page/${currentPage.slug}`, '_blank')
    }
  }

  if (authLoading || loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading editor...</p>
        </div>
      </div>
    )
  }

  if (!elements || Object.keys(elements).length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading template...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Fixed Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-lg font-semibold">
              {currentPage?.title || `Landing Page Builder - ${templateId === "template1" ? "Modern" : templateId === "template2" ? "SaaS" : "Agency"}`}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {pageId && (
              <Button onClick={handleSave} disabled={saving} size="sm">
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
            )}
            {currentPage?.is_published && (
              <Button onClick={handlePreview} variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            )}
            <PreviewModal />
          </div>
        </div>
      </header>
      {/* Fixed Toolbar */}
      <Toolbar />
      {/* Floating Panels */}
      <ElementsPanel />
      <SectionsPanel />
      {/* Main Content Area */}
      <div className="flex pt-20 min-h-screen">
        {/* Scrollable Canvas Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <ElementRenderer elementId="root" isEditing={true} />
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Property Panel */}
        <div className="w-80 bg-white border-l border-gray-200 fixed right-0 top-20 bottom-0 overflow-y-auto">
          <div className="p-6">
            <PropertyPanel />
          </div>
        </div>
      </div>
      <Toaster />
      <EmailCollectionDialog 
        shouldShow={showEmailDialog} 
        onClose={() => setShowEmailDialog(false)} 
      /> {/* Render the email collection dialog */}
    </div>
  )
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div>Loading editor...</div>}>
      <EditorContent />
    </Suspense>
  )
}
