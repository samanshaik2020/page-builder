"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useEditorStore } from "@/lib/store"
import { ElementRenderer } from "@/components/ElementRenderer"
import { Toolbar } from "@/components/Toolbar"
import { ElementsPanel } from "@/components/ElementsPanel"
import { SectionsPanel } from "@/components/SectionsPanel"
import { PropertyPanel } from "@/components/PropertyPanel"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Toaster } from "@/components/ui/toaster"
import { PreviewModal } from "@/components/PreviewModal"

function EditorContent() {
  const searchParams = useSearchParams()
  const templateId = searchParams.get("id") || "template1"
  const { setCurrentTemplate, loadProject, elements } = useEditorStore()

  useEffect(() => {
    setCurrentTemplate(templateId)
    loadProject(templateId)
  }, [templateId, setCurrentTemplate, loadProject])

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
            <Link href="/build">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-lg font-semibold">
              Landing Page Builder -{" "}
              {templateId === "template1" ? "Modern" : templateId === "template2" ? "SaaS" : "Agency"}
            </h1>
          </div>

          <PreviewModal />
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
