"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Type, Layout, RotateCcw, Save } from "lucide-react"
import { useEditorStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

export function Toolbar() {
  const { toggleElementsPanel, toggleSectionsPanel, saveProject, resetToOriginal } = useEditorStore()
  const { toast } = useToast()

  const handleSave = () => {
    saveProject()
    toast({
      title: "Project Saved",
      description: "Your landing page has been saved successfully.",
    })
  }

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset? All changes will be lost.")) {
      resetToOriginal()
      toast({
        title: "Project Reset",
        description: "Your landing page has been reset.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 shadow-lg">
      <div className="flex items-center p-2 gap-1">
        <Button variant="ghost" size="sm" onClick={toggleElementsPanel} className="flex items-center gap-2">
          <Type className="h-4 w-4" />
          <span className="hidden sm:inline">Elements</span>
        </Button>

        <Button variant="ghost" size="sm" onClick={toggleSectionsPanel} className="flex items-center gap-2">
          <Layout className="h-4 w-4" />
          <span className="hidden sm:inline">Sections</span>
        </Button>

        <Separator orientation="vertical" className="h-6 mx-2" />

        <Button variant="ghost" size="sm" onClick={handleSave}>
          <Save className="h-4 w-4" />
          <span className="hidden sm:inline ml-2">Save</span>
        </Button>

        <Button variant="ghost" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" />
          <span className="hidden sm:inline ml-2">Reset</span>
        </Button>
      </div>
    </Card>
  )
}
