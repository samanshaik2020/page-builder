"use client"

import React from "react"

import { useEditor } from "@craftjs/core"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings } from "lucide-react"

export function SettingsPanel() {
  const { selected, actions, query } = useEditor((state, query) => {
    const currentNodeId = query.getEvent("selected").last()
    let selected

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        settings: state.nodes[currentNodeId].related && state.nodes[currentNodeId].related.toolbar,
        isDeletable: query.node(currentNodeId).isDeletable(),
      }
    }

    return {
      selected,
    }
  })

  return (
    <Card className="w-80 h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selected ? (
          <div>
            <h3 className="font-medium mb-4">{selected.name}</h3>
            {selected.settings && React.createElement(selected.settings)}
            {selected.isDeletable && (
              <button
                className="mt-4 px-3 py-1 bg-red-500 text-white rounded text-sm"
                onClick={() => {
                  actions.delete(selected.id)
                }}
              >
                Delete
              </button>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Click on an element to edit its properties</p>
        )}
      </CardContent>
    </Card>
  )
}
