"use client"

import { useEditorStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Type, MousePointer, ImageIcon, Box, Trash2 } from "lucide-react"

export function PropertyPanel() {
  const { selectedElementId, elements, updateElement, deleteElement, setSelectedElement } = useEditorStore()

  if (!selectedElementId) {
    return (
      <Card className="w-80 h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MousePointer className="h-4 w-4" />
            Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Click on an element to edit its properties</p>
        </CardContent>
      </Card>
    )
  }

  const element = elements[selectedElementId]
  if (!element) return null

  const handleStyleChange = (property: string, value: any) => {
    updateElement(selectedElementId, {
      styles: {
        ...element.styles,
        [property]: value,
      },
    })
  }

  const handleContentChange = (value: string) => {
    updateElement(selectedElementId, { content: value })
  }

  const handleImageUrlChange = (value: string) => {
    updateElement(selectedElementId, { imageUrl: value })
  }

  const handleHrefChange = (value: string) => {
    updateElement(selectedElementId, { href: value })
  }

  const handleDelete = () => {
    if (selectedElementId !== "root" && window.confirm("Are you sure you want to delete this element?")) {
      deleteElement(selectedElementId)
    }
  }

  const getIcon = () => {
    switch (element.type) {
      case "text":
        return <Type className="h-4 w-4" />
      case "button":
        return <MousePointer className="h-4 w-4" />
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "container":
        return <Box className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <Card className="w-80 h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getIcon()}
          Edit {element.type.charAt(0).toUpperCase() + element.type.slice(1)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Content editing */}
        {(element.type === "text" || element.type === "button") && (
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Input
              id="content"
              value={element.content || ""}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Enter text content"
            />
          </div>
        )}

        {/* Image URL editing */}
        {element.type === "image" && (
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={element.imageUrl || ""}
              onChange={(e) => handleImageUrlChange(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        )}

        {/* Button link editing */}
        {element.type === "button" && (
          <div className="space-y-2">
            <Label htmlFor="href">Link URL</Label>
            <Input
              id="href"
              value={element.href || ""}
              onChange={(e) => handleHrefChange(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
        )}

        <Separator />

        {/* Style editing */}
        <div className="space-y-3">
          <Label>Styling</Label>

          {/* Colors */}
          <div className="space-y-2">
            <Label htmlFor="color" className="text-sm">
              Text Color
            </Label>
            <div className="flex gap-2">
              <Input
                id="color"
                type="color"
                value={element.styles?.color || "#000000"}
                onChange={(e) => handleStyleChange("color", e.target.value)}
                className="w-12 h-8 p-1 border rounded"
              />
              <Input
                value={element.styles?.color || "#000000"}
                onChange={(e) => handleStyleChange("color", e.target.value)}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>

          {/* Background color */}
          {(element.type === "button" || element.type === "container") && (
            <div className="space-y-2">
              <Label htmlFor="backgroundColor" className="text-sm">
                Background Color
              </Label>
              <div className="flex gap-2">
                <Input
                  id="backgroundColor"
                  type="color"
                  value={element.styles?.backgroundColor || "#ffffff"}
                  onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                  className="w-12 h-8 p-1 border rounded"
                />
                <Input
                  value={element.styles?.backgroundColor || "#ffffff"}
                  onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                  placeholder="#ffffff"
                  className="flex-1"
                />
              </div>
            </div>
          )}

          {/* Font size */}
          {(element.type === "text" || element.type === "button") && (
            <div className="space-y-2">
              <Label htmlFor="fontSize" className="text-sm">
                Font Size
              </Label>
              <Input
                id="fontSize"
                type="number"
                value={element.styles?.fontSize || 16}
                onChange={(e) => handleStyleChange("fontSize", Number.parseInt(e.target.value) || 16)}
                min="8"
                max="72"
              />
            </div>
          )}

          {/* Font weight */}
          {(element.type === "text" || element.type === "button") && (
            <div className="space-y-2">
              <Label htmlFor="fontWeight" className="text-sm">
                Font Weight
              </Label>
              <select
                id="fontWeight"
                value={element.styles?.fontWeight || 400}
                onChange={(e) => handleStyleChange("fontWeight", Number.parseInt(e.target.value))}
                className="w-full p-2 border rounded"
              >
                <option value={300}>Light</option>
                <option value={400}>Normal</option>
                <option value={500}>Medium</option>
                <option value={600}>Semi Bold</option>
                <option value={700}>Bold</option>
              </select>
            </div>
          )}

          {/* Border radius */}
          {(element.type === "button" || element.type === "image" || element.type === "container") && (
            <div className="space-y-2">
              <Label htmlFor="borderRadius" className="text-sm">
                Border Radius
              </Label>
              <Input
                id="borderRadius"
                type="number"
                value={element.styles?.borderRadius || 0}
                onChange={(e) => handleStyleChange("borderRadius", Number.parseInt(e.target.value) || 0)}
                min="0"
                max="50"
              />
            </div>
          )}

          {/* Dimensions for images */}
          {element.type === "image" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="width" className="text-sm">
                  Width
                </Label>
                <Input
                  id="width"
                  type="number"
                  value={element.styles?.width || 300}
                  onChange={(e) => handleStyleChange("width", Number.parseInt(e.target.value) || 300)}
                  min="50"
                  max="800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height" className="text-sm">
                  Height
                </Label>
                <Input
                  id="height"
                  type="number"
                  value={element.styles?.height || 200}
                  onChange={(e) => handleStyleChange("height", Number.parseInt(e.target.value) || 200)}
                  min="50"
                  max="600"
                />
              </div>
            </>
          )}
        </div>

        <Separator />

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setSelectedElement(null)} className="flex-1">
            Deselect
          </Button>
          {selectedElementId !== "root" && (
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
