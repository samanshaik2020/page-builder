"use client"

import React from "react"

import { useEditorStore } from "@/lib/store"
import { useState } from "react"
import { AddSectionButton } from "./AddSectionButton" // Import the new component

interface ElementRendererProps {
  elementId: string
  isEditing?: boolean
}

export function ElementRenderer({ elementId, isEditing = true }: ElementRendererProps) {
  const { elements, selectedElementId, setSelectedElement, updateElement } = useEditorStore()
  const element = elements[elementId]
  const [isEditing_, setIsEditing] = useState(false)

  if (!element) return null

  const isSelected = selectedElementId === elementId
  const styles = element.styles || {}

  const handleClick = (e: any) => {
    if (isEditing) {
      e.stopPropagation()
      setSelectedElement(elementId)
    }
  }

  const handleDoubleClick = (e: any) => {
    if (isEditing && (element.type === "text" || element.type === "button" || element.type === "paragraph")) {
      e.stopPropagation()
      setIsEditing(true)
    }
  }

  const handleContentChange = (newContent: string) => {
    updateElement(elementId, { content: newContent })
    setIsEditing(false)
  }

  const baseClasses = isEditing
    ? `${isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""} cursor-pointer transition-all hover:ring-1 hover:ring-gray-300`
    : ""

  const elementStyle: any = {
    fontSize: styles.fontSize ? `${styles.fontSize}px` : undefined,
    fontWeight: styles.fontWeight,
    fontFamily: styles.fontFamily,
    color: styles.color,
    backgroundColor: styles.backgroundColor,
    padding: styles.padding
      ? `${styles.padding[0]}px ${styles.padding[1]}px ${styles.padding[2]}px ${styles.padding[3]}px`
      : undefined,
    margin: styles.margin
      ? `${styles.margin[0]}px ${styles.margin[1]}px ${styles.margin[2]}px ${styles.margin[3]}px`
      : undefined,
    borderRadius: styles.borderRadius ? `${styles.borderRadius}px` : undefined,
    width: styles.width ? `${styles.width}px` : undefined,
    height: styles.height ? `${styles.height}px` : undefined,
    textAlign: styles.textAlign,
    // Apply transform for x and y offsets, keeping elements in normal flow
    transform:
      styles.xPosition !== undefined || styles.yPosition !== undefined
        ? `translateX(${styles.xPosition || 0}px) translateY(${styles.yPosition || 0}px)`
        : undefined,
  }

  switch (element.type) {
    case "text":
      return (
        <div
          className={`${baseClasses} inline-block`}
          style={elementStyle}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
        >
          {isEditing_ ? (
            <input
              autoFocus
              value={element.content || ""}
              onChange={(e) => handleContentChange(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleContentChange((e.target as any).value)
                }
              }}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "inherit",
                fontSize: "inherit",
                fontWeight: "inherit",
                textAlign: "inherit",
                width: "100%",
              }}
            />
          ) : (
            element.content || "Click to edit text"
          )}
        </div>
      )

    case "button":
      return (
        <button
          className={`${baseClasses} inline-block border-none`}
          style={elementStyle}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
        >
          {isEditing_ ? (
            <input
              autoFocus
              value={element.content || ""}
              onChange={(e) => handleContentChange(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleContentChange((e.target as any).value)
                }
              }}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "inherit",
                fontSize: "inherit",
                fontWeight: "inherit",
                textAlign: "inherit",
                width: "100%",
              }}
            />
          ) : (
            element.content || "Click me"
          )}
        </button>
      )

    case "paragraph":
      return (
        <div
          className={`${baseClasses} block`}
          style={elementStyle}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
        >
          {isEditing_ ? (
            <textarea
              autoFocus
              value={element.content || ""}
              onChange={(e) => handleContentChange(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) {
                  handleContentChange((e.target as any).value)
                }
              }}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "inherit",
                fontSize: "inherit",
                fontWeight: "inherit",
                textAlign: "inherit",
                width: "100%",
                minHeight: "60px",
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />
          ) : (
            <div style={{ whiteSpace: "pre-wrap" }}>
              {element.content || "Click to edit paragraph"}
            </div>
          )}
        </div>
      )

    case "image":
      return (
        <img
          src={element.imageUrl || "/placeholder.svg?height=200&width=300"}
          alt="Editable image"
          className={`${baseClasses} block`}
          style={elementStyle}
          onClick={handleClick}
        />
      )

    case "container":
      return (
        <div
          className={`${baseClasses}`}
          style={{
            ...elementStyle,
            display: "block",
            minHeight: "50px",
            border: isSelected && isEditing ? "2px dashed #3b82f6" : "none",
            // Removed position: "relative" as it's not needed for flow layout
          }}
          onClick={handleClick}
        >
          {element.children && element.children.length > 0 ? (
            <>
              {/* Render AddSectionButton at the very top if this is the root container */}
              {elementId === "root" && isEditing && <AddSectionButton insertAfterElementId={null} />}
              {element.children.map((childId) => (
                <React.Fragment key={childId}>
                  <ElementRenderer elementId={childId} isEditing={isEditing} />
                  {/* Render AddSectionButton after each top-level child of the root container */}
                  {elementId === "root" && isEditing && <AddSectionButton insertAfterElementId={childId} />}
                </React.Fragment>
              ))}
            </>
          ) : isEditing && isSelected ? (
            <div className="text-gray-400 text-sm p-4 text-center border-2 border-dashed border-gray-300 rounded">
              Empty container - add elements or sections here
            </div>
          ) : null}
        </div>
      )

    default:
      return null
  }
}
