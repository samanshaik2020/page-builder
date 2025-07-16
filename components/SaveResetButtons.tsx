"use client"

import { Button } from "@/components/ui/button"
import { useEditorStore } from "@/lib/store"
import { Save, RotateCcw, CheckCircle } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function SaveResetButtons() {
  const { saveProject, resetToOriginal, hasUnsavedChanges } = useEditorStore()
  const [justSaved, setJustSaved] = useState(false)
  const { toast } = useToast()

  const hasChanges = hasUnsavedChanges()

  const handleSave = () => {
    saveProject()
    setJustSaved(true)
    toast({
      title: "Project Saved",
      description: "Your changes have been saved to local storage.",
    })

    // Reset the "just saved" state after 2 seconds
    setTimeout(() => setJustSaved(false), 2000)
  }

  const handleReset = () => {
    if (hasChanges) {
      const confirmed = window.confirm("Are you sure you want to reset? All unsaved changes will be lost.")
      if (!confirmed) return
    }

    resetToOriginal()
    toast({
      title: "Project Reset",
      description: "All changes have been reverted to the original template.",
      variant: "destructive",
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleSave}
        variant={justSaved ? "default" : hasChanges ? "default" : "secondary"}
        size="sm"
        className="flex items-center gap-2"
      >
        {justSaved ? (
          <>
            <CheckCircle className="h-4 w-4" />
            Saved
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Save
          </>
        )}
      </Button>

      <Button
        onClick={handleReset}
        variant="outline"
        size="sm"
        disabled={!hasChanges}
        className="flex items-center gap-2 bg-transparent"
      >
        <RotateCcw className="h-4 w-4" />
        Reset
      </Button>

      {hasChanges && <span className="text-xs text-muted-foreground">• Unsaved changes</span>}
    </div>
  )
}
