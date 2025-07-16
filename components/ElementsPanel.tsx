"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Type, MousePointer, ImageIcon, Box, X } from "lucide-react"
import { useEditorStore, type ElementData } from "@/lib/store"

export function ElementsPanel() {
  const { showElementsPanel, toggleElementsPanel, addElement, selectedElementId } = useEditorStore()

  if (!showElementsPanel) return null

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const handleAddElement = (type: ElementData["type"]) => {
    const targetId = selectedElementId || "root" // Use selectedElementId as the target

    let newElement: ElementData

    switch (type) {
      case "text":
        newElement = {
          id: generateId(),
          type: "text",
          content: "New text element",
          styles: {
            fontSize: 16,
            color: "#000000",
            margin: [8, 8, 8, 8],
            padding: [8, 8, 8, 8],
          },
        }
        break
      case "button":
        newElement = {
          id: generateId(),
          type: "button",
          content: "New Button",
          href: "#",
          styles: {
            backgroundColor: "#3b82f6",
            color: "#ffffff",
            padding: [12, 24, 12, 24],
            borderRadius: 6,
            fontSize: 16,
            margin: [8, 8, 8, 8],
          },
        }
        break
      case "image":
        newElement = {
          id: generateId(),
          type: "image",
          imageUrl: "/placeholder.svg?height=200&width=300",
          styles: {
            width: 300,
            height: 200,
            margin: [8, 8, 8, 8],
          },
        }
        break
      case "container":
        newElement = {
          id: generateId(),
          type: "container",
          styles: {
            backgroundColor: "#f3f4f6",
            padding: [20, 20, 20, 20],
            margin: [8, 8, 8, 8],
          },
          children: [],
        }
        break
      default:
        return
    }

    console.log("Creating element:", newElement, "for target:", targetId)
    addElement(newElement, targetId)
    toggleElementsPanel()
  }

  const elements = [
    { name: "Text", icon: Type, type: "text" as const, description: "Add text content" },
    { name: "Button", icon: MousePointer, type: "button" as const, description: "Add clickable button" },
    { name: "Image", icon: ImageIcon, type: "image" as const, description: "Add image" },
    { name: "Container", icon: Box, type: "container" as const, description: "Add container section" },
  ]

  return (
    <Card className="fixed top-20 left-0 w-64 z-50 shadow-lg bg-white h-[calc(100vh-80px)] overflow-y-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Add Elements</CardTitle>
        <Button variant="ghost" size="sm" onClick={toggleElementsPanel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs text-muted-foreground mb-3">
          {selectedElementId && useEditorStore.getState().elements[selectedElementId]?.type === "container"
            ? "Adding to selected container"
            : selectedElementId && selectedElementId !== "root"
              ? "Adding next to selected element"
              : "Adding to page root"}
        </p>
        {elements.map((element) => {
          const Icon = element.icon
          return (
            <Button
              key={element.name}
              variant="outline"
              className="w-full justify-start h-auto p-3 bg-transparent hover:bg-gray-50"
              onClick={() => handleAddElement(element.type)}
            >
              <Icon className="h-4 w-4 mr-2 text-blue-600" />
              <div className="text-left">
                <div className="font-medium text-sm">{element.name}</div>
                <div className="text-xs text-muted-foreground">{element.description}</div>
              </div>
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}
