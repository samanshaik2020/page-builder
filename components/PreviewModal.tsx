"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, Monitor, Tablet, Smartphone } from "lucide-react"
import { ElementRenderer } from "./ElementRenderer"

export function PreviewModal() {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")

  const getDeviceStyles = () => {
    switch (device) {
      case "desktop":
        return "w-full max-w-6xl mx-auto"
      case "tablet":
        return "w-full max-w-2xl mx-auto"
      case "mobile":
        return "w-full max-w-sm mx-auto"
      default:
        return "w-full max-w-6xl mx-auto"
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
          <Eye className="h-4 w-4" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-full h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Preview</span>
            <div className="flex items-center gap-2">
              <Button
                variant={device === "desktop" ? "default" : "outline"}
                size="sm"
                onClick={() => setDevice("desktop")}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={device === "tablet" ? "default" : "outline"}
                size="sm"
                onClick={() => setDevice("tablet")}
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={device === "mobile" ? "default" : "outline"}
                size="sm"
                onClick={() => setDevice("mobile")}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          <div className={getDeviceStyles()}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <ElementRenderer elementId="root" isEditing={false} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
