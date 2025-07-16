"use client"

import { useNode, type UserComponent } from "@craftjs/core"
import { useState } from "react"

export interface ButtonProps {
  text: string
  backgroundColor: string
  color: string
  fontSize: number
  padding: [number, number, number, number]
  margin: [number, number, number, number]
  borderRadius: number
  href: string
}

export const CraftButton: UserComponent<ButtonProps> = ({
  text = "Click me",
  backgroundColor = "#3b82f6",
  color = "#ffffff",
  fontSize = 16,
  padding = [12, 24, 12, 24],
  margin = [0, 0, 0, 0],
  borderRadius = 6,
  href = "#",
}) => {
  const {
    connectors: { connect, drag },
    selected,
    actions: { setProp },
  } = useNode((state) => ({
    selected: state.events.selected,
  }))

  const [editable, setEditable] = useState(false)

  return (
    <div
      ref={(ref) => connect(drag(ref!))}
      className={`inline-block ${selected ? "ring-2 ring-blue-500" : ""}`}
      style={{
        margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
      }}
    >
      <button
        onClick={(e) => {
          if (selected) {
            e.preventDefault()
            setEditable(true)
          }
        }}
        style={{
          backgroundColor,
          color,
          fontSize: `${fontSize}px`,
          padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
          borderRadius: `${borderRadius}px`,
          border: "none",
          cursor: selected ? "text" : "pointer",
          fontWeight: 500,
        }}
        className="transition-all hover:opacity-90"
      >
        {editable ? (
          <input
            autoFocus
            value={text}
            onChange={(e) => setProp((props: ButtonProps) => (props.text = e.target.value))}
            onBlur={() => setEditable(false)}
            onKeyDown={(e) => e.key === "Enter" && setEditable(false)}
            style={{
              background: "transparent",
              border: "none",
              color: "inherit",
              fontSize: "inherit",
              fontWeight: "inherit",
              outline: "none",
              width: "100%",
            }}
          />
        ) : (
          text
        )}
      </button>
    </div>
  )
}

CraftButton.craft = {
  displayName: "Button",
  props: {
    text: "Click me",
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    fontSize: 16,
    padding: [12, 24, 12, 24],
    margin: [0, 0, 0, 0],
    borderRadius: 6,
    href: "#",
  },
  related: {
    toolbar: () => import("./ButtonToolbar").then((mod) => mod.ButtonToolbar),
  },
}
