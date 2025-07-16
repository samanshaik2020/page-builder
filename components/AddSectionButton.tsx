"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useEditorStore } from "@/lib/store"

interface AddSectionButtonProps {
  insertAfterElementId: string | null // The ID of the element to insert after. Null means insert at the beginning.
}

export function AddSectionButton({ insertAfterElementId }: AddSectionButtonProps) {
  const { toggleSectionsPanel, setInsertionTarget } = useEditorStore()

  const handleClick = () => {
    setInsertionTarget(insertAfterElementId) // Set the target for insertion
    toggleSectionsPanel() // Open the sections panel
  }

  return (
    <div className="flex justify-center py-8">
      <Button
        variant="outline"
        className="flex items-center gap-2 border-dashed border-2 border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors bg-transparent"
        onClick={handleClick}
      >
        <Plus className="h-4 w-4" />
        Add Section Here
      </Button>
    </div>
  )
}
